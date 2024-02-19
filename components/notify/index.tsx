import * as React from 'react'
import { Trans } from 'react-i18next'

import { LucideIcon } from '@/lib/lucide-icon'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { useNotify } from './use-notify'
import { NotifyItems } from './notify-items'

export function Notify() {
  const { data } = useNotify()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-8 w-8" size="icon" variant="ghost">
          <LucideIcon name="Bell" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Card className="w-[360px] border-0">
          <CardHeader>
            <CardTitle>
              <Trans>notifications</Trans>
            </CardTitle>
            <CardDescription>
              <Trans values={{ count: data?.length }}>
                you_have_unread_messages
              </Trans>
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Separator className="mb-2" />
            {data && <NotifyItems items={data} />}
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              <LucideIcon name="Check" className="mr-2 size-4 min-w-4" />
              <Trans>mark_all_as_read</Trans>
            </Button>
          </CardFooter>
        </Card>
      </PopoverContent>
    </Popover>
  )
}
