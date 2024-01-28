'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { useTranslation } from 'react-i18next'

export function DarkModeStatus() {
  const [status, setStatus] = React.useState<string>('')
  const { t } = useTranslation()
  const { theme } = useTheme()

  React.useEffect(() => {
    const mode = theme === 'light' ? 'Dark mode: off' : 'Dark mode: on'
    setStatus(mode)
  }, [theme])

  return <span>{t(status)}</span>
}