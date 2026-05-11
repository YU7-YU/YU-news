import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** 合并 className，支持 clsx 语法 + tailwind-merge 去重 */
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return twMerge(clsx(inputs))
}
