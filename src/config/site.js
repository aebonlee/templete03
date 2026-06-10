// =========================================================================
// 사이트 설정 — 프로젝트마다 이 파일과 reference 콘텐츠만 교체하면 된다.
// 아트디렉션(색·서체·시그니처)은 styles/tokens.css 에서 관리.
// =========================================================================

export const site = {
  brand: '러닝노트',
  tagline: '여기 머무는 동안, 나는 한 뼘 자란다',
  description: '배움은 중요한 것에 밑줄을 긋는 일. 차분하게 몰입하는 온라인 학습 플랫폼.',
  url: import.meta.env.VITE_SITE_URL || 'https://templete03.dreamitbiz.com',
  contact: 'hello@dreamitbiz.com',
}

// 홈 히어로
export const hero = {
  eyeline: 'ONLINE LEARNING',
  title: ['오늘 그은 한 줄이,', '내일의 나를 만든다'],
  highlight: '한 줄',            // 형광펜이 그어질 단어
  body: '강의를 듣고 끝내지 않습니다. 핵심에 밑줄을 긋고, 메모를 남기고, 진도를 쌓아 갑니다.',
  ctaPrimary: { label: '무료로 시작하기', to: '/login' },
  ctaGhost: { label: '커리큘럼 보기', to: '/curriculum' },
}

// 사이트가 약속하는 가치 (3개 절제)
export const features = [
  { icon: '✎', title: '밑줄 학습', body: '중요한 문장에 형광펜을 긋듯, 핵심만 추려 기억에 남깁니다.' },
  { icon: '◷', title: '나만의 속도', body: '언제 어디서나. 멈춘 곳에서 다시, 진도는 자동으로 저장됩니다.' },
  { icon: '↗', title: '쌓이는 성장', body: '완료한 레슨이 노트에 쌓입니다. 어제보다 한 뼘 더.' },
]

// 커리큘럼 — 모듈 / 레슨 (Supabase 미연동 시 이 정적 데이터로 동작)
export const modules = [
  {
    id: 'm1', no: 1, title: '시작하기',
    summary: '학습 환경을 세팅하고 첫 걸음을 뗍니다.',
    lessons: [
      { id: 'l1-1', title: '오리엔테이션', minutes: 8, free: true },
      { id: 'l1-2', title: '학습 도구 살펴보기', minutes: 12, free: true },
      { id: 'l1-3', title: '나의 학습 목표 정하기', minutes: 10, free: false },
    ],
  },
  {
    id: 'm2', no: 2, title: '핵심 개념',
    summary: '주제의 근본 원리를 밑줄 그으며 익힙니다.',
    lessons: [
      { id: 'l2-1', title: '개념 1 — 큰 그림', minutes: 16, free: false },
      { id: 'l2-2', title: '개념 2 — 깊이 보기', minutes: 18, free: false },
      { id: 'l2-3', title: '개념 3 — 연결하기', minutes: 14, free: false },
    ],
  },
  {
    id: 'm3', no: 3, title: '실전 적용',
    summary: '배운 것을 직접 손으로 만들어 봅니다.',
    lessons: [
      { id: 'l3-1', title: '실습 프로젝트 준비', minutes: 20, free: false },
      { id: 'l3-2', title: '함께 만들기', minutes: 25, free: false },
      { id: 'l3-3', title: '회고와 다음 단계', minutes: 12, free: false },
    ],
  },
]

// 가격 (포트원/이니시스 결제 연동 자리)
export const plans = [
  { id: 'free',  name: '청강', price: 0,      period: '',     perks: ['무료 레슨 수강', '커리큘럼 미리보기'], cta: '바로 시작' },
  { id: 'pro',   name: '정규', price: 149000, period: '/ 평생', perks: ['전체 레슨 무제한', '진도·노트 저장', '수료증 발급'], cta: '수강 신청', featured: true },
]

export const footerLinks = [
  { label: '커리큘럼', to: '/curriculum' },
  { label: '로그인', to: '/login' },
]
