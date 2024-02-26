'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { toast } from 'sonner'
import { FaGithub } from 'react-icons/fa'
import { Button, ButtonProps } from '@/components/ui/button'

import { createClient } from '@/lib/supabase/client'

interface SignInWithGithubProps
  extends ButtonProps,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {}

export function SignInWithGithub({
  variant = 'outline',
  ...props
}: SignInWithGithubProps) {
  const { t } = useTranslation()

  async function onSubmit() {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        // A URL to send the user to after they are confirmed.
        redirectTo:
          process.env.NEXT_PUBLIC_SITE_URL +
          '/api/v1/auth/callback?next=/dashboard/dashboard',
      },
    })

    if (error) {
      toast.error(error?.message)
      return false
    }

    toast.success(t('FormMessage.you_have_successfully_logged_in'))
  }

  return (
    <Button variant={variant} onClick={onSubmit} {...props}>
      <FaGithub className="mr-2 h-4 w-4" />
      {t('SignInWithGithub.label')}
    </Button>
  )
}
