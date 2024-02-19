'use client'

import * as React from 'react'
import { Trans } from 'react-i18next'
import { createClient } from '@/lib/supabase/client'

import { toast } from 'sonner'
import { FaGithub } from 'react-icons/fa'
import { Button } from '@/components/ui/button'

export function SignInWithGithub() {
  async function onSubmit() {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithOAuth({
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

    // if (data?.user) {}
  }

  return (
    <Button variant="outline" onClick={onSubmit}>
      <FaGithub className="mr-2 h-4 w-4" />
      <Trans>sign_in_with_github</Trans>
    </Button>
  )
}
