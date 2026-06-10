import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY

// env 미설정 시에도 사이트가 정적 데이터로 동작하도록 graceful fallback
export const isSupabaseReady = Boolean(url && anon)

export const supabase = isSupabaseReady ? createClient(url, anon) : null

// =========================================================================
// 테이블 접두사 — 한 Supabase 프로젝트를 여러 사이트가 공유할 때 충돌 방지.
// 프로젝트별로 VITE_TABLE_PREFIX 만 바꾸면 된다. (기본: tpl_)
// =========================================================================
export const TABLE_PREFIX = import.meta.env.VITE_TABLE_PREFIX || 'tpl_'

// 접두사를 붙인 테이블명을 반환: t('profiles') -> 'tpl_profiles'
export const t = (name) => `${TABLE_PREFIX}${name}`
