// =========================================================================
// 웹 학습자료 렌더러 — 대면 강의 보조자료/읽기 콘텐츠용.
// site.js 레슨의 content 배열(블록)을 렌더링한다. 영상과 함께 쓸 수 있다.
//
// 블록 타입:
//   { type: 'h',       text }                  소제목
//   { type: 'p',       text }                  문단 (\n 으로 줄바꿈)
//   { type: 'callout', text }                  형광펜 강조 박스 (시그니처)
//   { type: 'list',    items: [] }             글머리 목록
//   { type: 'steps',   items: [] }             번호 목록(절차)
//   { type: 'code',    text, lang }            코드 블록
//   { type: 'image',   src, alt, caption }     이미지
//   { type: 'quote',   text, by }              인용
//   { type: 'divider' }                        구분선
// =========================================================================
export default function LessonContent({ blocks }) {
  if (!blocks || blocks.length === 0) return null
  return (
    <article className="material">
      {blocks.map((b, i) => <Block key={i} b={b} />)}
    </article>
  )
}

function Block({ b }) {
  switch (b.type) {
    case 'h':
      return <h3 className="material__h">{b.text}</h3>
    case 'p':
      return <p className="material__p">{b.text}</p>
    case 'callout':
      return (
        <div className="material__callout">
          <span className="material__callout-mark" aria-hidden>✎</span>
          <p>{b.text}</p>
        </div>
      )
    case 'list':
      return <ul className="material__list">{b.items.map((x, i) => <li key={i}>{x}</li>)}</ul>
    case 'steps':
      return <ol className="material__steps">{b.items.map((x, i) => <li key={i}>{x}</li>)}</ol>
    case 'code':
      return (
        <pre className="material__code"><code className="mono">{b.text}</code></pre>
      )
    case 'image':
      return (
        <figure className="material__figure">
          <img src={b.src} alt={b.alt || ''} loading="lazy" />
          {b.caption && <figcaption className="mono">{b.caption}</figcaption>}
        </figure>
      )
    case 'quote':
      return (
        <blockquote className="material__quote">
          <p>{b.text}</p>
          {b.by && <cite className="mono">— {b.by}</cite>}
        </blockquote>
      )
    case 'divider':
      return <hr className="material__divider" />
    default:
      return null
  }
}
