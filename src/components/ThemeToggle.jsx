import { useEffect, useState } from 'react'

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

function getInitialTheme() {
  const stored = localStorage.getItem('theme')
  return stored === 'light' || stored === 'dark' ? stored : getSystemTheme()
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Follow the OS preference live until the user makes an explicit choice.
  useEffect(() => {
    if (localStorage.getItem('theme')) return
    const mql = window.matchMedia('(prefers-color-scheme: light)')
    const onChange = () => setTheme(mql.matches ? 'light' : 'dark')
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  function toggle() {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    localStorage.setItem('theme', next)
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      aria-pressed={theme === 'light'}
    >
      <span className={`theme-toggle-track${theme === 'light' ? ' theme-toggle-track-light' : ''}`}>
        <span className="theme-toggle-thumb">{theme === 'light' ? '☀' : '☾'}</span>
      </span>
    </button>
  )
}
