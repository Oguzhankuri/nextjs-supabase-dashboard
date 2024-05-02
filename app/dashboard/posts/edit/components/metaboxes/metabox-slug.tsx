'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { kebabCase, debounce } from 'lodash'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { UseFormReturn } from 'react-hook-form'
import { FormValues } from '../../post-form'
import { Post } from '@/types/database'

export function MetaboxSlug({
  form,
  post,
}: {
  form: UseFormReturn<FormValues>
  post: Post | null
}) {
  const { t } = useTranslation()

  const title = form.watch('title')
  const slug = form.watch('slug')

  const debounceSetValue = React.useCallback(
    debounce((value: string) => form.setValue('slug', value), 1000),
    []
  )

  React.useEffect(() => {
    if (!slug && post?.slug) {
      debounceSetValue(kebabCase(post?.slug))
    } else if (!slug) {
      debounceSetValue(kebabCase(title))
    }
  }, [debounceSetValue, post?.slug, slug, title])

  React.useEffect(() => {
    if (slug) debounceSetValue(kebabCase(slug))
  }, [debounceSetValue, slug])

  return (
    <Accordion type="single" collapsible defaultValue="item-1">
      <AccordionItem value="item-1">
        <AccordionTrigger>{t('PostMetabox.slug')}</AccordionTrigger>
        <AccordionContent className="px-1 py-1 pb-4">
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder={t('Input.please_enter_your_text')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}