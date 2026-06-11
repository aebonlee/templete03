import { Link, useNavigate } from 'react-router-dom'
import { hero, features, modules, plans } from '../config/site'
import Section from '../components/Section'
import Reveal from '../components/Reveal'
import Highlighter from '../components/Highlighter'
import { useAuth } from '../context/AuthContext'
import { useProgress } from '../context/ProgressContext'
import { requestPay } from '../lib/payment'

export default function Home() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { isPro, reload } = useProgress()

  async function handlePlan(plan) {
    if (plan.price === 0) { navigate(user ? '/curriculum' : '/login'); return }
    if (!user) { navigate('/login'); return }
    if (isPro) { navigate('/curriculum'); return }
    try {
      await requestPay({ plan: plan.id, amount: plan.price, name: `${plan.name} 수강권`, user })
      await reload()
      alert('결제가 완료되었습니다. 모든 레슨이 열렸습니다!')
      navigate('/curriculum')
    } catch (err) {
      alert(err.message || '결제에 실패했습니다.')
    }
  }

  return (
    <>
      {/* --- 히어로 : 좌측 네거티브 스페이스에 헤드라인 --- */}
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__copy">
            <p className="eyeline mono">{hero.eyeline}</p>
            <h1 className="hero__title">
              {hero.title[0]}<br />
              {hero.title[1].split(hero.highlight).map((part, i, arr) => (
                <span key={i}>
                  {part}
                  {i < arr.length - 1 && <Highlighter delay={500}>{hero.highlight}</Highlighter>}
                </span>
              ))}
            </h1>
            <p className="hero__body">{hero.body}</p>
            <div className="hero__cta">
              <Link to={hero.ctaPrimary.to} className="btn btn-accent">{hero.ctaPrimary.label}</Link>
              <Link to={hero.ctaGhost.to} className="btn btn-ghost">{hero.ctaGhost.label}</Link>
            </div>
          </div>
          <div className="hero__art" aria-hidden>
            {/* 팔레트 색으로만 그린 SVG — 청사진 위 새순(성장) */}
            <svg viewBox="0 0 400 400" className="hero__svg">
              <defs>
                <linearGradient id="wash" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="var(--pigment)" stopOpacity="0.18" />
                  <stop offset="1" stopColor="var(--accent)" stopOpacity="0.12" />
                </linearGradient>
              </defs>
              <circle cx="200" cy="200" r="170" fill="url(#wash)" />
              {/* 모눈(blueprint grid) */}
              <g stroke="var(--pigment)" strokeOpacity="0.18" strokeWidth="1">
                {Array.from({ length: 9 }).map((_, i) => (
                  <line key={'h'+i} x1="40" y1={60 + i * 35} x2="360" y2={60 + i * 35} />
                ))}
                {Array.from({ length: 9 }).map((_, i) => (
                  <line key={'v'+i} x1={60 + i * 35} y1="40" x2={60 + i * 35} y2="360" />
                ))}
              </g>
              {/* 성장 곡선 */}
              <path d="M120 300 C 160 260, 180 180, 240 120" fill="none"
                    stroke="var(--pigment)" strokeWidth="3" strokeLinecap="round" />
              <path d="M240 120 c 10 -28, 38 -32, 52 -22 c -8 22, -34 30, -52 22 z"
                    fill="var(--accent)" fillOpacity="0.85" />
              <circle cx="120" cy="300" r="6" fill="var(--pigment)" />
            </svg>
          </div>
        </div>
      </section>

      {/* --- 가치 3개 --- */}
      <Section eyeline="WHY" title="배움이 쌓이는 방식">
        <div className="grid grid-3">
          {features.map((f, i) => (
            <Reveal key={f.title} className="card feature" style={{ transitionDelay: `${i * 80}ms` }}>
              <span className="feature__icon" aria-hidden>{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* --- 커리큘럼 미리보기 --- */}
      <Section eyeline="CURRICULUM" title="3개 모듈, 한 걸음씩" wash
               lead="멈춘 곳에서 다시 시작하세요. 진도는 자동으로 노트에 쌓입니다.">
        <div className="grid grid-3">
          {modules.map((m, i) => (
            <Reveal key={m.id} className="card module" style={{ transitionDelay: `${i * 80}ms` }}>
              <span className="module__no mono">MODULE {String(m.no).padStart(2, '0')}</span>
              <h3>{m.title}</h3>
              <p>{m.summary}</p>
              <span className="module__count mono">{m.lessons.length} lessons</span>
            </Reveal>
          ))}
        </div>
        <div className="section__more">
          <Link to="/curriculum" className="btn btn-primary">전체 커리큘럼 보기</Link>
        </div>
      </Section>

      {/* --- 가격 --- */}
      <Section id="pricing" eyeline="PRICING" title="필요한 만큼만">
        <div className="grid grid-2 plans">
          {plans.map((p) => (
            <Reveal key={p.id} className={`card plan${p.featured ? ' plan--featured' : ''}`}>
              {p.featured && <span className="plan__badge mono">추천</span>}
              <h3 className="plan__name">{p.name}</h3>
              <div className="plan__price">
                <span className="mono">{p.price === 0 ? '무료' : `₩${p.price.toLocaleString()}`}</span>
                <small>{p.period}</small>
              </div>
              <ul className="plan__perks">
                {p.perks.map((perk) => <li key={perk}>{perk}</li>)}
              </ul>
              <button onClick={() => handlePlan(p)} className={`btn ${p.featured ? 'btn-accent' : 'btn-ghost'}`}>
                {p.featured && isPro ? '수강 중 →' : p.cta}
              </button>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  )
}
