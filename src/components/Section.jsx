import Reveal from './Reveal'

// 섹션 래퍼 — 제목/리드 + 본문 슬롯
export default function Section({ id, eyeline, title, lead, wash = false, children }) {
  return (
    <section id={id} className={`section${wash ? ' section--wash' : ''}`}>
      <div className="container">
        {(eyeline || title || lead) && (
          <Reveal className="section__head">
            {eyeline && <p className="eyeline mono">{eyeline}</p>}
            {title && <h2 className="section__title">{title}</h2>}
            {lead && <p className="section__lead">{lead}</p>}
          </Reveal>
        )}
        {children}
      </div>
    </section>
  )
}
