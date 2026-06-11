import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { modules } from '../config/site'
import { useAuth } from '../context/AuthContext'
import { useProgress } from '../context/ProgressContext'
import { fetchNotes, addNote, deleteNote } from '../lib/db'
import YouTube from '../components/YouTube'

// 모든 레슨을 펼쳐 이전/다음 탐색
const flat = modules.flatMap((m) =>
  m.lessons.map((l) => ({ ...l, moduleTitle: m.title, moduleNo: m.no }))
)

export default function Lesson() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { progress, isPro, toggleComplete } = useProgress()

  const [notes, setNotes] = useState([])
  const [draft, setDraft] = useState('')
  const [saving, setSaving] = useState(false)

  const idx = flat.findIndex((l) => l.id === id)
  const lesson = flat[idx]
  const locked = lesson && !lesson.free && (!user || !isPro)
  const completed = !!progress[id]?.completed

  useEffect(() => {
    if (user && lesson && !locked) {
      fetchNotes(user.id, id).then(setNotes)
    } else {
      setNotes([])
    }
  }, [user, id, locked, lesson])

  if (!lesson) {
    return (
      <div className="container lesson-missing">
        <h2>레슨을 찾을 수 없습니다.</h2>
        <Link to="/curriculum" className="btn btn-ghost">커리큘럼으로</Link>
      </div>
    )
  }

  const prev = flat[idx - 1]
  const next = flat[idx + 1]

  async function handleAddNote(e) {
    e.preventDefault()
    const body = draft.trim()
    if (!body) return
    setSaving(true)
    const saved = await addNote(user.id, id, body)
    if (saved) { setNotes((n) => [saved, ...n]); setDraft('') }
    setSaving(false)
  }

  async function handleDeleteNote(noteId) {
    setNotes((n) => n.filter((x) => x.id !== noteId))
    await deleteNote(noteId)
  }

  return (
    <div className="container lesson">
      <p className="eyeline mono">
        <Link to="/curriculum">커리큘럼</Link> · MODULE {String(lesson.moduleNo).padStart(2, '0')} {lesson.moduleTitle}
      </p>
      <h1 className="lesson__title">{lesson.title}</h1>
      <p className="lesson__meta mono">
        {lesson.minutes}분{lesson.free ? ' · 무료' : ''}
        {completed && <span className="lesson__done-tag"> ✓ 완료</span>}
      </p>

      <div className="lesson__player">
        {locked ? (
          <div className="lesson__lock">
            <span aria-hidden style={{ fontSize: '2rem' }}>🔒</span>
            <p>{user ? '이 레슨은 정규 수강생 전용입니다.' : '이 레슨은 수강생 전용입니다.'}</p>
            <button className="btn btn-accent" onClick={() => navigate(user ? '/#pricing' : '/login')}>
              {user ? '수강 신청하기' : '로그인하고 이어보기'}
            </button>
          </div>
        ) : (
          <YouTube videoId={lesson.videoId} title={lesson.title} />
        )}
      </div>

      {/* 완료 토글 — 로그인 + 시청 가능할 때만 */}
      {user && !locked && (
        <button
          className={`btn lesson__complete ${completed ? 'btn-ghost' : 'btn-primary'}`}
          onClick={() => toggleComplete(id)}
        >
          {completed ? '✓ 완료함 (해제)' : '이 레슨 완료 표시'}
        </button>
      )}

      {/* 밑줄 노트 — 시그니처 컨셉의 데이터화 */}
      {user && !locked && (
        <section className="notes">
          <h3 className="notes__title">✎ 내 밑줄 노트</h3>
          <form className="notes__form" onSubmit={handleAddNote}>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="기억하고 싶은 핵심 한 줄을 남겨보세요."
              rows={2}
            />
            <button className="btn btn-primary btn-sm" disabled={saving || !draft.trim()}>
              {saving ? '저장 중…' : '밑줄 긋기'}
            </button>
          </form>
          <ul className="notes__list">
            {notes.length === 0 && <li className="notes__empty mono">아직 그은 밑줄이 없습니다.</li>}
            {notes.map((n) => (
              <li key={n.id} className="notes__item">
                <span className="notes__body"><mark className="notes__mark">{n.body}</mark></span>
                <button className="notes__del" onClick={() => handleDeleteNote(n.id)} aria-label="삭제">×</button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="lesson__nav">
        {prev ? <Link to={`/lesson/${prev.id}`} className="btn btn-ghost">← {prev.title}</Link> : <span />}
        {next ? <Link to={`/lesson/${next.id}`} className="btn btn-primary">{next.title} →</Link> : <span />}
      </div>
    </div>
  )
}
