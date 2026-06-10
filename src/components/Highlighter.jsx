import { useEffect, useRef, useState } from 'react'

// 시그니처 요소: 화면에 들어오면 형광펜이 좌→우로 그어진다.
// <Highlighter>중요한 단어</Highlighter>  또는  text 속에 끼워 사용.
export default function Highlighter({ children, delay = 0, as: Tag = 'span' }) {
  const ref = useRef(null)
  const [lit, setLit] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTimeout(() => setLit(true), delay)
          io.unobserve(el)
        }
      },
      { threshold: 0.6 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [delay])

  return (
    <Tag ref={ref} className={`hl${lit ? ' lit' : ''}`}>
      {children}
    </Tag>
  )
}
