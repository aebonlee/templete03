# templete03 — 학습사이트 아트디렉션 템플릿

React 19 + Vite 7 + Supabase 기반의 재사용 가능한 온라인 학습 플랫폼 템플릿.
새 학습사이트를 시작할 때 이 저장소를 복제하고 `src/config/site.js` 와
`src/styles/tokens.css` 만 교체한다.

## 스택 / 배포
- React 19 · Vite 7 · React Router 7 · Supabase JS
- GitHub Actions(`.github/workflows/deploy.yml`) → GitHub Pages (`main` push 자동배포)
- 커스텀 도메인: `templete03.dreamitbiz.com` (CNAME), `base: '/'`
- 인증: Supabase Auth — **Google + Kakao OAuth**
- 결제: 포트원(아임포트) + KG이니시스 (`tpl_orders`). **서버검증**은
  Edge Function `verify-payment` 가 담당(포트원 API 재조회 → 금액 대조 → pro 승급).
  배포·시크릿은 `supabase/functions/README.md` 참고.

## Supabase 테이블 접두사
모든 테이블은 **`tpl_` 접두사**를 사용한다 (한 Supabase 프로젝트를 여러 사이트가
공유할 때 충돌 방지). 프로젝트별로 `VITE_TABLE_PREFIX` 와 `supabase/schema.sql`
의 접두사를 일괄 치환한다. JS에서는 `lib/supabase.js` 의 `t('progress')` 헬퍼 사용.

## 환경변수 (.env.local — git 제외)
`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_SITE_URL`,
`VITE_TABLE_PREFIX`, `VITE_IMP_CODE`, `VITE_PG_PROVIDER`.
`SUPABASE_ACCESS_TOKEN`(sbp_)은 CLI 전용 — **VITE_ 접두사 금지**(클라이언트 비노출).
`.env.example` 참고. Actions 배포 시 동일 키를 Repository Secrets 에 등록.

## 디렉터리
- `src/config/site.js` — 콘텐츠(브랜드/히어로/모듈/가격). **프로젝트마다 교체**
- `src/styles/tokens.css` — 아트디렉션 5색 팔레트 + 토큰. **프로젝트마다 교체**
- `src/components/Highlighter.jsx` — 시그니처(형광펜) 컴포넌트
- `supabase/schema.sql` — 테이블 + RLS + 가입 트리거
- `scripts/generate-og.mjs` — OG 이미지 생성 (`npm i --no-save sharp` 후 실행)

---

## Art Direction

> 학습 = **중요한 것에 밑줄을 긋는 일**. 이 스펙을 디자인 기준선으로 삼는다.

### A. 무드
- **한 줄 선언**: "여기 머무는 동안, 나는 한 뼘 자란다."
- **키워드**: 깊은 / 집중되는 / 신뢰가는
- **피할 것**: 알록달록 에듀테크 캐릭터 / 보라색 SaaS 그라데이션 / 과장된 뱃지·카운터
- **레퍼런스**: 만년필 남색 잉크, 자정의 책상 스탠드, 청사진(blueprint), 모눈 노트

### B. 팔레트 (다크 블루 베이스 — 물 먼저, 안료 나중)
| 역할 | 이름 | HEX | 비율 |
|---|---|---|---|
| Paper | 푸른 종이 | `#F4F6FB` | 60% |
| Ink | 자정의 남색 | `#14213D` | 30% |
| Pigment | 학술 블루 | `#1D4E89` | 8% |
| Accent | 형광 호박 | `#E8A33D` | 2% |
| Wash | 블루 워시 | `#DCE6F2` | — |

### C. 타이포
- 디스플레이: **Noto Serif KR** (700, 절제해서 크게)
- 본문: **Pretendard** (행간 1.72, 자간 -0.02em)
- 유틸리티: **JetBrains Mono** (진도·수치·캡션)

### D. 이미지 스타일
수채 wet-on-wet / 여백 60%+ 좌측 네거티브 스페이스 / 부드러운 측광 /
모눈 종이결 / 색 지시 `#1D4E89 #DCE6F2 #F4F6FB` / 금지: 인물 얼굴·글자·네온·3D 광택

### E. 미드저니 프롬프트 (히어로)
```
abstract watercolor of a young sprout rising over a blueprint grid notebook,
translucent prussian-blue ink, wet-on-wet soft edges, late-night desk-lamp
side light, visible cold-press paper texture, color palette of #1D4E89
#DCE6F2 #F4F6FB, generous negative space on the left for headline, deep and
contemplative study mood --ar 21:9 --no people, text, neon, 3d render, characters
```

### F~G. 트리트먼트 / 모션
`--radius: 6px`, soft-light 팔레트 오버레이, 종이 그레인 0.05,
스크롤 리빌 1종(`Reveal`). 과감함은 시그니처 한 곳에만.

### H. 시그니처
> 제목·핵심 문장에 **형광펜(amber)이 좌→우로 그어지며 번지는** 단 하나의 장치
> (`.hl` / `Highlighter`). 배움 = 중요한 것에 밑줄 긋기. 섹션을 지날수록
> 형광 자국이 페이지에 쌓인다. 학습이라는 주제가 아니면 존재할 수 없는 장치.

### I. 감성 QA (배포 전, 사람의 눈)
- [ ] 3초 안에 "차분히 몰입하는 배움"이 느껴지는가
- [ ] 형광펜은 페이지에서 결정적인 순간에만 등장하는가 (남발 금지)
- [ ] 이미지와 UI가 한 팔레트(다크 블루)로 호흡하는가
- [ ] 모바일(380px)에서도 같은 감정이 유지되는가
