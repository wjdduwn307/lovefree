import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function LoginModal({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = async () => {
    setError('')
    const { error } =
      mode === 'login'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password })
    if (error) setError(error.message)
    else onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="w-80 rounded-2xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="mb-4 text-lg font-bold">{mode === 'login' ? '로그인' : '회원가입'}</h2>
        <input className="mb-2 w-full rounded border p-2" placeholder="이메일"
          value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="mb-2 w-full rounded border p-2" type="password" placeholder="비밀번호 (6자 이상)"
          value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="mb-2 text-sm text-red-500">{error}</p>}
        <button className="w-full rounded bg-pink-500 p-2 text-white" onClick={submit}>
          {mode === 'login' ? '로그인' : '가입하기'}
        </button>
        <button className="mt-3 w-full text-sm text-gray-500"
          onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
          {mode === 'login' ? '계정이 없어요 → 회원가입' : '이미 계정이 있어요 → 로그인'}
        </button>
      </div>
    </div>
  )
}