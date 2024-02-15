import * as React from 'react'

import { Separator } from '@/components/ui/separator'
import { AccountForm } from './account-form'

export default function AccountPage() {
  return (
    <main className="flex-1 overflow-auto p-10 pb-16">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Account</h2>
        <p className="text-muted-foreground">
          Update your account settings. Set your preferred language and
          timezone.
        </p>
      </div>
      <Separator className="my-6" />
      <AccountForm />
    </main>
  )
}