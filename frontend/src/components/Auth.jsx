import React, { useState } from 'react'
import { supabase } from '../supabase-client'

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLogin, setIsLogin] = useState(false)

  const handleAuth =  async (e) => {
    e.preventDefault();

    setLoading(true)
    
    let error
    
    if (isLogin) {
      const { error: signInError } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      })
      error = signInError
    } else {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
        },
      })
      error = signUpError
    }

    if (error) {
      alert(error.message)
    }
    setLoading(false)
  }

  return (
    <div className="auth-container" style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2>{isLogin ? 'Log In' : 'Register'}</h2>
      <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {!isLogin && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : isLogin ? 'Log In' : 'Sign Up'}
        </button>
      </form>
      <p style={{ marginTop: '10px', cursor: 'pointer', color: 'blue' }} onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Log In'}
      </p>
    </div>
  )
}