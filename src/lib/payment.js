// =========================================================================
// 포트원(아임포트) 결제 — KG이니시스 PG
// index.html 에서 https://cdn.iamport.kr/v1/iamport.js 로드.
//
// ✅ 서버검증: 결제 성공 후 imp_uid 를 Supabase Edge Function(verify-payment)이
//    포트원 API로 재조회해 금액·상태를 검증한 뒤에야 tpl_orders 확정 + pro 승급.
//    클라이언트는 금액/승급을 직접 쓰지 않는다(위변조 차단).
// =========================================================================
import { supabase, isSupabaseReady } from './supabase'

const IMP_CODE = import.meta.env.VITE_IMP_CODE
const PG_PROVIDER = import.meta.env.VITE_PG_PROVIDER || 'html5_inicis'

function makeMerchantUid(plan) {
  const rand = Math.random().toString(36).slice(2, 8)
  return `tpl_${plan}_${Date.now()}_${rand}`
}

// 결제 요청 → 성공 시 Edge Function 서버검증 → 검증 통과해야 resolve
export function requestPay({ plan, amount, name, user }) {
  return new Promise((resolve, reject) => {
    if (!window.IMP || !IMP_CODE) {
      reject(new Error('결제 모듈이 로드되지 않았습니다. VITE_IMP_CODE 와 SDK 를 확인하세요.'))
      return
    }
    if (!isSupabaseReady) {
      reject(new Error('Supabase 가 설정되지 않아 결제 검증을 할 수 없습니다.'))
      return
    }

    const { IMP } = window
    IMP.init(IMP_CODE)
    const merchant_uid = makeMerchantUid(plan)

    IMP.request_pay(
      {
        pg: PG_PROVIDER,
        pay_method: 'card',
        merchant_uid,
        name,
        amount,
        buyer_email: user?.email || '',
        buyer_name: user?.user_metadata?.name || user?.email?.split('@')[0] || '수강생',
      },
      async (rsp) => {
        if (!rsp.success) {
          reject(new Error(rsp.error_msg || '결제가 취소되었습니다.'))
          return
        }
        // 서버검증 — 금액/상태/주문번호 대조
        const { data, error } = await supabase.functions.invoke('verify-payment', {
          body: { imp_uid: rsp.imp_uid, merchant_uid: rsp.merchant_uid || merchant_uid, plan },
        })
        if (error) { reject(new Error('결제 검증 요청 실패: ' + error.message)); return }
        if (data?.verified) { resolve(data) }
        else { reject(new Error('결제 검증 실패: ' + (data?.reason || data?.error || '금액 불일치'))) }
      },
    )
  })
}
