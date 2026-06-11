// =========================================================================
// 데이터 액세스 — tpl_ 접두사 테이블 (Supabase)
// 모든 함수는 isSupabaseReady 가 false면 안전하게 no-op 반환.
// =========================================================================
import { supabase, isSupabaseReady, t } from './supabase'

/* ---------- 진도 (tpl_progress) ---------- */

// 사용자의 전체 진도를 { lessonId: {completed, last_position} } 맵으로
export async function fetchProgress(userId) {
  if (!isSupabaseReady || !userId) return {}
  const { data, error } = await supabase
    .from(t('progress'))
    .select('lesson_id, completed, last_position')
    .eq('user_id', userId)
  if (error) { console.warn('fetchProgress', error.message); return {} }
  return Object.fromEntries(
    (data ?? []).map((r) => [r.lesson_id, { completed: r.completed, position: r.last_position }])
  )
}

// 레슨 완료/해제 토글 (upsert)
export async function setLessonComplete(userId, lessonId, completed) {
  if (!isSupabaseReady || !userId) return null
  const { error } = await supabase
    .from(t('progress'))
    .upsert(
      { user_id: userId, lesson_id: lessonId, completed, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,lesson_id' }
    )
  if (error) { console.warn('setLessonComplete', error.message); return null }
  return true
}

// 영상 재생 위치 저장
export async function saveLastPosition(userId, lessonId, seconds) {
  if (!isSupabaseReady || !userId) return
  await supabase
    .from(t('progress'))
    .upsert(
      { user_id: userId, lesson_id: lessonId, last_position: Math.floor(seconds), updated_at: new Date().toISOString() },
      { onConflict: 'user_id,lesson_id' }
    )
}

/* ---------- 노트 / 밑줄 (tpl_notes) ---------- */

export async function fetchNotes(userId, lessonId) {
  if (!isSupabaseReady || !userId) return []
  const { data, error } = await supabase
    .from(t('notes'))
    .select('id, body, created_at')
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)
    .order('created_at', { ascending: false })
  if (error) { console.warn('fetchNotes', error.message); return [] }
  return data ?? []
}

export async function addNote(userId, lessonId, body) {
  if (!isSupabaseReady || !userId) return null
  const { data, error } = await supabase
    .from(t('notes'))
    .insert({ user_id: userId, lesson_id: lessonId, body })
    .select('id, body, created_at')
    .single()
  if (error) { console.warn('addNote', error.message); return null }
  return data
}

export async function deleteNote(noteId) {
  if (!isSupabaseReady) return
  await supabase.from(t('notes')).delete().eq('id', noteId)
}

/* ---------- 프로필 / 수강권 (tpl_profiles) ---------- */

export async function fetchProfile(userId) {
  if (!isSupabaseReady || !userId) return null
  const { data } = await supabase
    .from(t('profiles'))
    .select('id, email, display_name, plan')
    .eq('id', userId)
    .single()
  return data ?? null
}

/* ---------- 주문 (tpl_orders) ---------- */

export async function recordOrder(order) {
  if (!isSupabaseReady) return null
  const { data, error } = await supabase
    .from(t('orders'))
    .insert(order)
    .select()
    .single()
  if (error) { console.warn('recordOrder', error.message); return null }
  return data
}

// 결제 성공 후 수강권을 pro 로 승급 (※ 프로덕션은 Edge Function 서버검증 권장)
export async function upgradeToPro(userId) {
  if (!isSupabaseReady || !userId) return
  await supabase.from(t('profiles')).update({ plan: 'pro' }).eq('id', userId)
}
