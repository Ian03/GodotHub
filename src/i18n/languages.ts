export const SUPPORTED_LANGUAGES = [
  { value: 'en-US', label: 'English' },
  { value: 'pt-BR', label: 'Português (Brasil)' },
  { value: 'zh-CN', label: '简体中文' },
] as const

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]['value']

export function isSupportedLanguage(value: string): value is SupportedLanguage {
  return SUPPORTED_LANGUAGES.some((language) => language.value === value)
}
