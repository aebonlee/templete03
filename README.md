# templete03 · 학습사이트 아트디렉션 템플릿

> "여기 머무는 동안, 나는 한 뼘 자란다."
> 배움 = 중요한 것에 밑줄을 긋는 일. — 다크 블루 아트디렉션의 온라인 학습 플랫폼 템플릿.

React 19 + Vite 7 + Supabase 기반. 새 학습사이트를 시작할 때 복제해서
`src/config/site.js`(콘텐츠) 와 `src/styles/tokens.css`(아트디렉션) 만 갈아끼운다.

🔗 https://templete03.dreamitbiz.com

## 빠른 시작
```bash
npm install
cp .env.example .env.local   # 값 채우기
npm run dev
```

## 주요 기능
- **시그니처**: 형광펜이 좌→우로 그어지는 밑줄 연출 (`Highlighter`)
- **페이지**: 홈(랜딩) · 커리큘럼 · 레슨(잠금/이전·다음) · 로그인
- **인증**: Supabase Auth — Google + Kakao OAuth
- **결제**: 포트원(아임포트) + KG이니시스 자리 (`tpl_orders`)
- **DB**: `tpl_` 접두사 테이블 + RLS (`supabase/schema.sql`)
- **OG 이미지**: `npm i --no-save sharp && node scripts/generate-og.mjs`

## 배포
`main` 푸시 → GitHub Actions 자동 빌드·배포 (GitHub Pages).
Repository Secrets 에 `VITE_*` 키 등록 필요.

## 구조
```
src/
  config/site.js      # ← 프로젝트마다 교체 (콘텐츠)
  styles/tokens.css   # ← 프로젝트마다 교체 (아트디렉션 5색)
  components/Highlighter.jsx   # 시그니처
  pages/              # Home · Curriculum · Lesson · Login
supabase/schema.sql   # tpl_ 접두사 테이블 + RLS
scripts/generate-og.mjs
```

아트디렉션 전체 스펙은 [`CLAUDE.md`](./CLAUDE.md) 의 `## Art Direction` 참고.
