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
//
// 이 사이트는 "대면 강의 + 웹 학습자료"가 기본이고, 영상은 선택 보조 수단이다.
//   kind:    'reading'(웹 자료) | 'video'(영상). 둘 다 있으면 영상+자료로 표시.
//   content: LessonContent 블록 배열 (읽기 자료). components/LessonContent.jsx 참고.
//   videoId: 유튜브 ID (선택). 데모는 공개도메인 Big Buck Bunny(aqz-KE-bpKQ).
//   minutes: 예상 소요(읽기/시청) 시간.
const DEMO_VID = 'aqz-KE-bpKQ'

export const modules = [
  {
    id: 'm1', no: 1, title: '시작하기',
    summary: '강의 진행 방식과 학습 자료 활용법을 안내합니다.',
    lessons: [
      {
        id: 'l1-1', title: '오리엔테이션 — 이 과정의 지도', kind: 'reading', minutes: 6, free: true,
        content: [
          { type: 'p', text: '이 과정은 대면 강의를 중심으로 진행하고, 각 회차의 핵심을 이 웹 자료로 정리해 제공합니다. 강의 전에 한 번, 강의 후 복습으로 한 번 읽으면 가장 효과적입니다.' },
          { type: 'callout', text: '학습의 절반은 "무엇이 중요한지 아는 것"입니다. 자료를 읽으며 핵심 문장에 직접 밑줄(노트)을 남겨 보세요.' },
          { type: 'h', text: '이렇게 학습하세요' },
          { type: 'steps', items: [
            '강의 전: 해당 회차 자료를 훑어 큰 그림을 잡습니다.',
            '강의 중: 설명을 들으며 자료 여백에 메모합니다.',
            '강의 후: 자료를 다시 읽고 레슨을 "완료"로 표시합니다.',
          ] },
        ],
      },
      {
        id: 'l1-2', title: '학습 도구·환경 안내', kind: 'reading', minutes: 8, free: true,
        content: [
          { type: 'p', text: '실습에 필요한 도구와 계정을 미리 준비합니다. 준비가 끝나면 체크리스트의 모든 항목에 표시가 되어 있어야 합니다.' },
          { type: 'list', items: [
            '실습용 노트북 (웹 브라우저 최신 버전)',
            '구글 또는 카카오 계정 (로그인·진도 저장)',
            '필기 도구 — 디지털/아날로그 무엇이든',
          ] },
          { type: 'callout', text: '환경 설정에서 막히면 다음 회차로 미루지 말고 바로 질문하세요. 시작의 마찰을 줄이는 것이 완주의 핵심입니다.' },
        ],
      },
      {
        id: 'l1-3', title: '나의 학습 목표 정하기', kind: 'reading', minutes: 10, free: false,
        content: [
          { type: 'p', text: '막연한 "열심히"보다 구체적인 목표가 끝까지 가게 합니다. 아래 문장을 채워 자신만의 목표를 적어 보세요.' },
          { type: 'quote', text: '나는 이 과정을 마치면 ______ 을(를) 직접 만들 수 있다.', by: '학습 목표 문장' },
          { type: 'h', text: '좋은 목표의 조건' },
          { type: 'list', items: ['결과물이 눈에 보인다', '8주 안에 도달할 수 있다', '왜 하는지 한 문장으로 말할 수 있다'] },
        ],
      },
    ],
  },
  {
    id: 'm2', no: 2, title: '핵심 개념',
    summary: '주제의 근본 원리를 자료로 깊이 있게 익힙니다.',
    lessons: [
      {
        id: 'l2-1', title: '개념 1 — 큰 그림 그리기', kind: 'reading', minutes: 14, free: false,
        content: [
          { type: 'p', text: '세부에 들어가기 전에 전체 구조를 먼저 봅니다. 큰 그림이 있어야 새로운 정보가 "어디에 들어갈지" 알 수 있습니다.' },
          { type: 'callout', text: '새 개념을 만나면 항상 물어보세요: "이건 전체 그림에서 어디에 속하는가?"' },
          { type: 'image', src: 'https://placehold.co/960x420/1D4E89/F4F6FB?text=Concept+Map', alt: '개념 지도 예시', caption: '예시 — 실제 강의 자료의 개념 지도로 교체' },
        ],
      },
      {
        id: 'l2-2', title: '개념 2 — 깊이 보기 (영상 보충)', kind: 'video', minutes: 18, free: false, videoId: DEMO_VID,
        content: [
          { type: 'p', text: '아래 영상은 대면 강의에서 다룬 시연을 복습용으로 담은 보충 자료입니다. 영상을 본 뒤 핵심을 한 줄로 정리해 노트에 남겨 보세요.' },
          { type: 'list', items: ['시연의 핵심 단계 3가지', '자주 하는 실수와 회피법', '직접 해 볼 때의 점검 포인트'] },
        ],
      },
      {
        id: 'l2-3', title: '개념 3 — 연결해서 이해하기', kind: 'reading', minutes: 12, free: false,
        content: [
          { type: 'p', text: '개념은 따로 외우는 것이 아니라 서로 연결될 때 비로소 "이해"가 됩니다. 앞의 두 개념을 한 문장으로 이어 보세요.' },
          { type: 'code', lang: 'text', text: '개념1 (큰 그림)\n   └─ 이 안에서 개념2가 ___ 역할을 하고,\n        └─ 개념3이 ___ 를 연결한다.' },
        ],
      },
    ],
  },
  {
    id: 'm3', no: 3, title: '실전 적용',
    summary: '배운 것을 직접 손으로 만들어 봅니다.',
    lessons: [
      {
        id: 'l3-1', title: '실습 프로젝트 준비', kind: 'reading', minutes: 16, free: false,
        content: [
          { type: 'p', text: '이번 모듈에서 만들 결과물의 요구사항과 준비물을 정리합니다. 대면 실습 전에 반드시 읽고 오세요.' },
          { type: 'steps', items: ['주제 정하기', '필요한 자료·도구 수집', '1차 초안 스케치'] },
          { type: 'callout', text: '완벽한 계획보다 빠른 1차 시도가 낫습니다. 일단 만들고, 강의에서 함께 다듬습니다.' },
        ],
      },
      {
        id: 'l3-2', title: '함께 만들기 (실습 영상)', kind: 'video', minutes: 25, free: false, videoId: DEMO_VID,
        content: [
          { type: 'p', text: '실습 과정을 단계별로 따라 할 수 있도록 영상으로 제공합니다. 멈춰 가며 같은 결과를 직접 만들어 보세요.' },
        ],
      },
      {
        id: 'l3-3', title: '회고와 다음 단계', kind: 'reading', minutes: 10, free: false,
        content: [
          { type: 'p', text: '만든 결과물을 돌아보고, 다음에 무엇을 배울지 정합니다. 회고는 학습을 "내 것"으로 만드는 마지막 단계입니다.' },
          { type: 'list', items: ['가장 잘된 점 한 가지', '아쉬웠던 점 한 가지', '다음에 시도할 것 한 가지'] },
          { type: 'divider' },
          { type: 'p', text: '수고하셨습니다. 모든 레슨을 완료하면 학습 노트에 진도가 가득 쌓입니다.' },
        ],
      },
    ],
  },
]

// 레슨의 형태 라벨/아이콘 (영상·자료·영상+자료)
export function lessonFormat(l) {
  const hasVideo = !!l.videoId
  const hasReading = Array.isArray(l.content) && l.content.length > 0
  if (hasVideo && hasReading) return { label: '영상+자료', icon: '▶' }
  if (hasVideo) return { label: '영상', icon: '▶' }
  return { label: '자료', icon: '✎' }
}

// 가격 (포트원/이니시스 결제 연동 자리)
export const plans = [
  { id: 'free',  name: '청강', price: 0,      period: '',     perks: ['무료 레슨 수강', '커리큘럼 미리보기'], cta: '바로 시작' },
  { id: 'pro',   name: '정규', price: 149000, period: '/ 평생', perks: ['전체 레슨 무제한', '진도·노트 저장', '수료증 발급'], cta: '수강 신청', featured: true },
]

export const footerLinks = [
  { label: '커리큘럼', to: '/curriculum' },
  { label: '로그인', to: '/login' },
]
