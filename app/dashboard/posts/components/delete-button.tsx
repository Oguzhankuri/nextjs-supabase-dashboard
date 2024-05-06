'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { toast } from 'sonner'
import { usePaging } from '@/components/paging/paging-provider'

import { useSWRConfig } from 'swr'
import { fetcher, setQueryString, getPostPath } from '@/lib/utils'
import { PostAPI } from '@/types/api'
import { Post } from '@/types/database'

interface DeleteButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  post: Post
}

const DeleteButton = (props: DeleteButtonProps) => {
  const { post, ...rest } = props
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const { t } = useTranslation()
  const { page, perPage, status } = usePaging()
  const { mutate } = useSWRConfig()

  const handleClick = async () => {
    try {
      setIsSubmitting(true)

      const uid = post?.user_id

      if (!uid) throw new Error('Require is not defined.')

      const fetchUrl = `/api/v1/post?id=${post?.id}`
      const result = await fetcher<PostAPI>(fetchUrl, {
        method: 'DELETE',
        body: JSON.stringify({
          formData: { user_id: uid },
          options: { revalidatePaths: getPostPath(post) },
        }),
      })

      if (result?.error) throw new Error(result?.error?.message)

      const query = setQueryString({ uid, page, perPage, status })

      mutate(fetchUrl)
      mutate(`/api/v1/post/list?${query}`)
      mutate(`/api/v1/post/count?uid=${uid}`)

      toast.success(t('FormMessage.deleted_successfully'))
    } catch (e: unknown) {
      toast.error((e as Error)?.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <button
      className="text-xs text-red-700 hover:underline"
      onClick={handleClick}
      disabled={isSubmitting}
      {...rest}
    >
      {t('PostList.DeleteButton')}
    </button>
  )
}

export { DeleteButton, type DeleteButtonProps }
