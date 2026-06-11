# Supabase Edge Functions

## verify-payment — 포트원 결제 서버검증

결제 성공 후 `imp_uid` 를 포트원 REST API로 재조회해 **금액·상태·주문번호**를
서버측 가격표와 대조한 뒤 `tpl_orders` 확정 + `tpl_profiles.plan='pro'` 승급.
클라이언트는 금액/승급을 직접 쓰지 않는다(위변조 차단).

### 1) 필요한 시크릿
포트원 콘솔 > 결제연동 > **REST API Key / Secret**. 이 프로젝트(공유 Supabase)에는
이미 `PORTONE_API_KEY` / `PORTONE_API_SECRET` 로 등록되어 있어 **재사용**한다.
함수는 `PORTONE_API_KEY/SECRET` → (없으면) `IMP_REST_API_KEY/SECRET` 순으로 읽는다.

새로 등록해야 한다면:
```bash
export SUPABASE_ACCESS_TOKEN=sbp_xxx   # 유효한 토큰(예: 1시간 만료)

supabase secrets set \
  PORTONE_API_KEY=발급받은_REST_API_KEY \
  PORTONE_API_SECRET=발급받은_REST_API_SECRET \
  --project-ref hcmgdztsgjvzcyxyayaj
```
> `SUPABASE_URL` / `SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` 는
> 플랫폼이 자동 주입하므로 등록 불필요. `TABLE_PREFIX` 미설정 시 기본값 `tpl_`.
> ⚠ 이 Supabase는 여러 프로젝트가 공유한다 — `verify-payment` 가 templete03 전용인지
> 확인할 것(다른 프로젝트가 같은 함수명을 쓰면 전용 함수명으로 분리).

### 2) 함수 배포
```bash
supabase functions deploy verify-payment --project-ref hcmgdztsgjvzcyxyayaj
```
(JWT 검증 기본 활성 — 로그인 사용자의 세션 토큰으로만 호출 가능)

### 3) 가격표 동기화
`index.ts` 의 `PLAN_PRICES` 를 `src/config/site.js` 의 `plans` 와 일치시킬 것.
플랜/가격을 바꾸면 함수도 재배포한다.

### 로컬 테스트(선택, Docker 필요)
```bash
supabase functions serve verify-payment --env-file ./supabase/.env.local
```
