import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { site } from '../config/site'
import Highlighter from '../components/Highlighter'

export default function Login() {
  const { user, signInWith, isSupabaseReady } = useAuth()
  const navigate = useNavigate()

  useEffect(() => { if (user) navigate('/curriculum') }, [user, navigate])

  return (
    <div className="container auth">
      <div className="auth__card card">
        <p className="eyeline mono">{site.brand.toUpperCase()}</p>
        <h1 className="auth__title">
          <Highlighter delay={300}>한 줄</Highlighter>씩, 다시 시작하세요
        </h1>
        <p className="auth__lead">구글 또는 카카오 계정으로 30초 만에 시작합니다.</p>

        {!isSupabaseReady && (
          <p className="auth__warn mono">⚠ Supabase 미설정 — .env.local 을 확인하세요.</p>
        )}

        <div className="auth__providers">
          <button className="btn auth__btn auth__btn--google" onClick={() => signInWith('google')}>
            <span className="auth__logo" aria-hidden>G</span> Google로 계속하기
          </button>
          <button className="btn auth__btn auth__btn--kakao" onClick={() => signInWith('kakao')}>
            <span className="auth__logo" aria-hidden>K</span> 카카오로 계속하기
          </button>
        </div>

        <p className="auth__terms mono">계속하면 이용약관 및 개인정보처리방침에 동의합니다.</p>
      </div>
    </div>
  )
}
