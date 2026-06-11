import { Link } from 'react-router-dom'
import { modules } from '../config/site'
import { useProgress } from '../context/ProgressContext'
import Section from '../components/Section'
import Reveal from '../components/Reveal'

export default function Curriculum() {
  const { progress, completedCount } = useProgress()
  const totalMin = modules.reduce(
    (s, m) => s + m.lessons.reduce((a, l) => a + l.minutes, 0), 0
  )
  const totalLessons = modules.reduce((s, m) => s + m.lessons.length, 0)
  const pct = totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0

  return (
    <Section eyeline="CURRICULUM" title="전체 커리큘럼"
             lead={`${modules.length}개 모듈 · ${totalLessons}개 레슨 · 약 ${Math.round(totalMin / 60 * 10) / 10}시간`}>
      {completedCount > 0 && (
        <div className="progress-bar">
          <div className="progress-bar__track"><div className="progress-bar__fill" style={{ width: `${pct}%` }} /></div>
          <span className="progress-bar__label mono">{completedCount}/{totalLessons} 완료 · {pct}%</span>
        </div>
      )}
      <div className="curriculum">
        {modules.map((m) => (
          <Reveal key={m.id} className="module-block">
            <div className="module-block__head">
              <span className="module__no mono">MODULE {String(m.no).padStart(2, '0')}</span>
              <h3>{m.title}</h3>
              <p>{m.summary}</p>
            </div>
            <ul className="lesson-list">
              {m.lessons.map((l) => (
                <li key={l.id} className="lesson-row">
                  <Link to={`/lesson/${l.id}`} className="lesson-row__link">
                    <span className="lesson-row__title">
                      <span className={`lesson-row__check${progress[l.id]?.completed ? ' done' : ''}`} aria-hidden>
                        {progress[l.id]?.completed ? '✓' : '○'}
                      </span>
                      {l.title}
                    </span>
                    <span className="lesson-row__meta mono">
                      {l.free && <em className="tag-free">무료</em>}
                      {l.minutes}분
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
