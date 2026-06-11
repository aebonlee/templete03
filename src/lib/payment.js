// =========================================================================
// 포트원(아임포트) 결제 — KG이니시스 PG
// index.html 에서 https://cdn.iamport.kr/v1/iamport.js 로드.
// ⚠ 프로덕션: 결제 후 imp_uid 를 서버(Supabase Edge Function)에서 포트원 API로
//   재검증해 위변조를 막아야 한다. 아래는 템플릿용 클라이언트 흐름.
// =========================================================================
import { recordOrder, upgradeToPro } from './db'

const IMP_CODE = import.meta.env.VITE_IMP_CODE
const PG_PROVIDER = import.meta.env.VITE_PG_PROVIDER || 'html5_inicis'

export const isPaymentReady = Boolean(IMP_CODE && window.IMP)

function makeMerchantUid(plan) {
  // 주문 고유번호: tpl_{plan}_{timestamp}_{rand}
  const rand = Math.random().toString(36).slice(2, 8)
  return `tpl_${plan}_${Date.now()}_${rand}`
}

// 결제 요청 → 성공 시 주문 기록 + 수강권 승급
export function requestPay({ plan, amount, name, user }) {
  return new Promise((resolve, reject) => {
    if (!window.IMP || !IMP_CODE) {
      reject(new Error('결제 모듈이 로드되지 않았습니다. VITE_IMP_CODE 와 SDK 를 확인하세요.'))
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
        // rsp.success: 결제 성공 여부
        const status = rsp.success ? 'paid' : 'failed'
        await recordOrder({
          user_id: user?.id ?? null,
          merchant_uid,
          imp_uid: rsp.imp_uid ?? null,
          plan,
          amount,
          status,
        })
        if (rsp.success) {
          await upgradeToPro(user?.id)
          resolve(rsp)
        } else {
          reject(new Error(rsp.error_msg || '결제가 취소되었습니다.'))
        }
      }
    )
  })
}
