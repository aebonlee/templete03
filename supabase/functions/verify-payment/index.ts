// =========================================================================
// 결제 서버검증 Edge Function — 포트원(아임포트) + KG이니시스
//
// 흐름: 클라이언트 결제 완료 → imp_uid/merchant_uid/plan 전송 →
//   ① 호출자 JWT 검증(누가 결제했는지)
//   ② 포트원 REST API로 imp_uid 실결제 조회
//   ③ 서버측 가격표와 금액·상태·merchant_uid 대조(위변조 차단)
//   ④ service role 로 tpl_orders 확정 + tpl_profiles plan='pro' 승급
//
// 필요한 시크릿(supabase secrets set):
//   IMP_REST_API_KEY, IMP_REST_API_SECRET, (선택) TABLE_PREFIX
//   SUPABASE_URL / SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY 는 플랫폼 자동 주입.
// =========================================================================
import { createClient } from 'jsr:@supabase/supabase-js@2'

// 서버측 가격표 — 클라이언트가 보낸 금액을 절대 신뢰하지 않는다.
// site.js 의 plans 와 일치시킬 것.
const PLAN_PRICES: Record<string, number> = {
  pro: 149000,
}

const PREFIX = Deno.env.get('TABLE_PREFIX') ?? 'tpl_'
const T = (n: string) => `${PREFIX}${n}`

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } })

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  if (req.method !== 'POST') return json({ error: 'method not allowed' }, 405)

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
    const ANON = Deno.env.get('SUPABASE_ANON_KEY')!
    const SERVICE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const IMP_KEY = Deno.env.get('IMP_REST_API_KEY')
    const IMP_SECRET = Deno.env.get('IMP_REST_API_SECRET')

    if (!IMP_KEY || !IMP_SECRET) return json({ error: '결제 시크릿 미설정(IMP_REST_API_KEY/SECRET)' }, 500)

    // ① 호출자 인증
    const authHeader = req.headers.get('Authorization') ?? ''
    const userClient = createClient(SUPABASE_URL, ANON, { global: { headers: { Authorization: authHeader } } })
    const { data: { user }, error: uErr } = await userClient.auth.getUser()
    if (uErr || !user) return json({ error: '인증 필요' }, 401)

    const { imp_uid, merchant_uid, plan } = await req.json()
    if (!imp_uid || !merchant_uid || !plan) return json({ error: '필수 파라미터 누락' }, 400)

    const expected = PLAN_PRICES[plan]
    if (!expected) return json({ error: '알 수 없는 플랜' }, 400)

    // ② 포트원 토큰 발급
    const tokenRes = await fetch('https://api.iamport.kr/users/getToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imp_key: IMP_KEY, imp_secret: IMP_SECRET }),
    })
    const tokenJson = await tokenRes.json()
    const accessToken = tokenJson?.response?.access_token
    if (!accessToken) return json({ error: '포트원 토큰 발급 실패' }, 502)

    // ② 결제 단건 조회
    const payRes = await fetch(`https://api.iamport.kr/payments/${encodeURIComponent(imp_uid)}`, {
      headers: { Authorization: accessToken },
    })
    const payJson = await payRes.json()
    const pay = payJson?.response
    if (!pay) return json({ error: '결제 정보를 찾을 수 없음' }, 404)

    // ③ 위변조 검증: 상태 paid + 금액 일치 + merchant_uid 일치
    const verified = pay.status === 'paid' && pay.amount === expected && pay.merchant_uid === merchant_uid

    // ④ service role 로 확정 기록 (RLS 우회)
    const admin = createClient(SUPABASE_URL, SERVICE)
    await admin.from(T('orders')).upsert(
      {
        user_id: user.id,
        merchant_uid,
        imp_uid,
        plan,
        amount: pay.amount,
        status: verified ? 'paid' : 'failed',
      },
      { onConflict: 'merchant_uid' },
    )

    if (verified) {
      await admin.from(T('profiles')).update({ plan: 'pro' }).eq('id', user.id)
      return json({ verified: true, amount: pay.amount })
    }

    return json({
      verified: false,
      reason: pay.status !== 'paid' ? `상태 ${pay.status}` : '금액/주문번호 불일치',
    }, 200)
  } catch (e) {
    return json({ error: String(e?.message ?? e) }, 500)
  }
})
