import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useAuth } from './AuthContext'
import { fetchProgress, setLessonComplete, fetchProfile } from '../lib/db'

const ProgressContext = createContext(null)

export function ProgressProvider({ children }) {
  const { user } = useAuth()
  const [progress, setProgress] = useState({})   // { lessonId: {completed, position} }
  const [profile, setProfile] = useState(null)   // { plan, ... }
  const [loaded, setLoaded] = useState(false)

  const reload = useCallback(async () => {
    if (!user) { setProgress({}); setProfile(null); setLoaded(true); return }
    const [p, prof] = await Promise.all([fetchProgress(user.id), fetchProfile(user.id)])
    setProgress(p)
    setProfile(prof)
    setLoaded(true)
  }, [user])

  useEffect(() => { setLoaded(false); reload() }, [reload])

  // 레슨 완료 토글 (낙관적 업데이트)
  const toggleComplete = useCallback(async (lessonId) => {
    if (!user) return
    const next = !progress[lessonId]?.completed
    setProgress((prev) => ({ ...prev, [lessonId]: { ...prev[lessonId], completed: next } }))
    await setLessonComplete(user.id, lessonId, next)
  }, [user, progress])

  const isPro = profile?.plan === 'pro'
  const completedCount = Object.values(progress).filter((v) => v.completed).length

  return (
    <ProgressContext.Provider value={{ progress, profile, isPro, completedCount, loaded, toggleComplete, reload, setProfile }}>
      {children}
    </ProgressContext.Provider>
  )
}

export const useProgress = () => useContext(ProgressContext)
