import { useTrans } from '@/hooks/i18next'
export const defaultLng: string = 'en'

export const fallbackLng: string = 'ko'

// If passing the ns option, the defaultNS will, by default, be set to the first ns passed.
export const defaultNS: string | string[] = [
  'translation',
  'components',
  'zod',
  'zod-custom',
  'httpstatuscode',
]

export interface Language {
  value: string
  code: string
  name: string
  native: string
}

export const languages: Language[] = [
  { value: 'en', code: 'US', name: 'English', native: 'English' },
  { value: 'ko', code: 'KR', name: 'Korean', native: '한국어' },
]

export interface Country {
  value: string
  name: string
  native: string
  phone: number[]
  continent: string
  capital: string
  currency: string[]
  languages: string[]
}

export const countries: Country[] = [
  {
    value: 'US',
    name: 'United States',
    native: 'United States',
    phone: [1],
    continent: 'NA',
    capital: 'Washington D.C.',
    currency: ['USD', 'USN', 'USS'],
    languages: ['en'],
  },
  {
    value: 'KR',
    name: 'South Korea',
    native: '대한민국',
    phone: [82],
    continent: 'AS',
    capital: 'Seoul',
    currency: ['KRW'],
    languages: ['ko'],
  },
]
const { trans } = useTrans()

export default function App() {
  return (
    <div>
    {trans('key', { 
      components: {
        i: <i />,
        link1: <Link href="#"/>,
      },
      values: { what: 'world' }
    })}
    </div>
  )
}

