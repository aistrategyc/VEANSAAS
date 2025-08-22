import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { stripHtmlTags, sanitizeHtml as sanitize, escapeHtml as escape } from './sanitize-fallback'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date, locale: string = "ru-RU"): string {
  return new Date(date).toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

// ===== Additional utility functions for new UI components =====

/**
 * Format file size in bytes to human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Format number with locale-specific formatting
 */
export function formatNumber(num: number, locale: string = "uk-UA"): string {
  return new Intl.NumberFormat(locale).format(num)
}

/**
 * Format currency with locale-specific formatting
 */
export function formatCurrency(
  amount: number,
  currency: "UAH" | "EUR" = "EUR",
  locale: "uk-UA" | "de-DE" = "uk-UA"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    currencyDisplay: "symbol",
  }).format(amount)
}

/**
 * Format percentage with specified decimal places
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`
}

/**
 * Debounce function for search inputs and API calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Generate unique ID for components
 */
export function generateId(prefix: string = "id"): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + "..."
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2)
}

/**
 * Check if file is image by extension
 */
export function isImageFile(filename: string): boolean {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg']
  const extension = getFileExtension(filename).toLowerCase()
  return imageExtensions.includes(extension)
}

/**
 * Validate file type against accept string
 */
export function validateFileType(file: File, accept: string): boolean {
  if (accept === "*/*") return true
  
  const acceptedTypes = accept.split(",").map(type => type.trim())
  
  for (const acceptedType of acceptedTypes) {
    if (acceptedType.startsWith(".")) {
      // File extension
      const extension = acceptedType.slice(1)
      if (file.name.toLowerCase().endsWith(extension.toLowerCase())) {
        return true
      }
    } else if (acceptedType.includes("*")) {
      // MIME type with wildcard (e.g., "image/*")
      const [mainType] = acceptedType.split("/")
      if (file.type.startsWith(mainType)) {
        return true
      }
    } else if (file.type === acceptedType) {
      // Exact MIME type match
      return true
    }
  }
  
  return false
}

/**
 * Format relative time (e.g., "2 minutes ago")
 */
export function formatRelativeTime(date: Date | string, locale: string = "uk-UA"): string {
  const now = new Date()
  const target = typeof date === "string" ? new Date(date) : date
  const diff = Math.floor((now.getTime() - target.getTime()) / 1000)

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" })

  if (diff < 60) return rtf.format(-diff, "seconds")
  if (diff < 3600) return rtf.format(-Math.floor(diff / 60), "minutes")
  if (diff < 86400) return rtf.format(-Math.floor(diff / 3600), "hours")
  if (diff < 604800) return rtf.format(-Math.floor(diff / 86400), "days")

  return formatDate(target, locale)
}
/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement("textarea")
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    
    try {
      document.execCommand("copy")
      document.body.removeChild(textArea)
      return true
    } catch (fallbackErr) {
      document.body.removeChild(textArea)
      return false
    }
  }
}

/**
 * Create download link for file
 */
export function downloadFile(data: Blob | string, filename: string, type?: string): void {
  const blob = typeof data === "string" 
    ? new Blob([data], { type: type || "text/plain" })
    : data
    
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

/**
 * Scroll element into view smoothly
 */
export function scrollIntoView(element: HTMLElement, behavior: ScrollBehavior = "smooth"): void {
  element.scrollIntoView({ behavior, block: "nearest" })
}

/**
 * Check if element is in viewport
 */
export function isInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

/**
 * Get contrast color (black or white) for background color
 */
export function getContrastColor(backgroundColor: string): string {
  // Remove # if present
  const color = backgroundColor.replace("#", "")
  
  // Convert to RGB
  const r = parseInt(color.substr(0, 2), 16)
  const g = parseInt(color.substr(2, 2), 16)
  const b = parseInt(color.substr(4, 2), 16)
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  
  return luminance > 0.5 ? "#000000" : "#ffffff"
}

/**
 * Sleep function for async operations
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Capitalize first letter of string
 */
export function capitalize(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

/**
 * Convert string to kebab-case
 */
export function toKebabCase(string: string): string {
  return string
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase()
}

/**
 * Convert string to camelCase
 */
export function toCamelCase(string: string): string {
  return string
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase()
    })
    .replace(/\s+/g, "")
}

/**
 * Remove HTML tags from string safely (XSS protection)
 * Uses fallback sanitization for reliability
 */
export function stripHtml(html: string): string {
  return stripHtmlTags(html)
}

/**
 * Sanitize HTML content to prevent XSS attacks
 * Uses fallback sanitization for reliability
 */
export function sanitizeHtml(html: string): string {
  return sanitize(html)
}

/**
 * Escape HTML entities to prevent XSS
 */
export function escapeHtml(text: string): string {
  return escape(text)
}

/**
 * Generate random color
 */
export function randomColor(): string {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`
}

/**
 * Check if user prefers dark mode
 */
export function prefersDarkMode(): boolean {
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
}

/**
 * Format search query for highlighting
 */
export function highlightSearchTerm(text: string, searchTerm: string): string {
  if (!searchTerm.trim()) return text
  
  const regex = new RegExp(`(${searchTerm})`, "gi")
  return text.replace(regex, "<mark>$1</mark>")
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}