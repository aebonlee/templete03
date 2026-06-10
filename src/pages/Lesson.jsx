import { useParams, Link, useNavigate } from 'react-router-dom'
import { modules } from '../config/site'
import { useAuth } from '../context/AuthContext'

// 모든 레슨을 펼쳐 이전/다음 탐색
const flat = modules.flatMap((m) =>
  m.lessons.map((l) => ({ ...l, moduleTitle: m.title, moduleNo: m.no }))
)

export default function Lesson() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const idx = flat.findIndex((l) => l.id === id)
  const lesson = flat[idx]

  if (!lesson) {
    return (
      <div className="container lesson-missing">
        <h2>레슨을 찾을 수 없습니다.</h2>
        <Link to="/curriculum" className="btn btn-ghost">커리큘럼으로</Link>
      </div>
    )
  }

  const locked = !lesson.free && !user
  const prev = flat[idx - 1]
  const next = flat[idx + 1]

  return (
    <div className="container lesson">
      <p className="eyeline mono">
        <Link to="/curriculum">커리큘럼</Link> · MODULE {String(lesson.moduleNo).padStart(2, '0')} {lesson.moduleTitle}
      </p>
      <h1 className="lesson__title">{lesson.title}</h1>
      <p className="lesson__meta mono">{lesson.minutes}분{lesson.free ? ' · 무료' : ''}</p>

      <div className="lesson__player">
        {locked ? (
          <div className="lesson__lock">
            <span aria-hidden style={{ fontSize: '2rem' }}>🔒</span>
            <p>이 레슨은 수강생 전용입니다.</p>
            <button className="btn btn-accent" onClick={() => navigate('/login')}>로그인하고 이어보기</button>
          </div>
        ) : (
          <div className="lesson__video">
            {/* 실제 프로젝트에서 유튜브/영상 임베드로 교체 */}
            <span className="mono">▶ 영상 자리 (video embed)</span>
          </div>
        )}
      </div>

      <div className="lesson__nav">
        {prev ? <Link to={`/lesson/${prev.id}`} className="btn btn-ghost">← {prev.title}</Link> : <span />}
        {next ? <Link to={`/lesson/${next.id}`} className="btn btn-primary">{next.title} →</Link> : <span />}
      </div>
    </div>
  )
}
