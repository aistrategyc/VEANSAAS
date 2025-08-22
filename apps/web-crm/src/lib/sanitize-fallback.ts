/**
 * Fallback HTML Sanitization utilities when DOMPurify is not available
 * Basic XSS protection using native browser APIs
 */

/**
 * Basic XSS sanitization fallback
 */
function basicSanitize(html: string): string {
  if (!html) return ""
  
  // Remove dangerous tags
  const dangerousTags = /<\s*(script|iframe|object|embed|form|input|textarea|select|style|meta|link|base)[^>]*>/gi
  
  // Remove dangerous attributes
  const dangerousAttributes = /\s*(on\w+|javascript:|data:text\/html|vbscript:|mocha:|livescript:|about:)[^>\s]*/gi
  
  // Remove dangerous protocols in href/src
  const dangerousProtocols = /(href|src)\s*=\s*["']?\s*(javascript:|data:|vbscript:|about:)[^"'\s>]*/gi
  
  return html
    .replace(dangerousTags, '') // Remove dangerous tags
    .replace(dangerousAttributes, '') // Remove dangerous attributes
    .replace(dangerousProtocols, '') // Remove dangerous protocols
    .trim()
}

/**
 * Synchronous HTML sanitization using basic sanitization
 */
export function sanitizeHtml(html: string): string {
  return basicSanitize(html)
}

/**
 * Strip all HTML tags and return plain text
 */
export function stripHtmlTags(html: string): string {
  if (!html) return ""
  
  // Create a temporary DOM element in a secure way
  if (typeof window !== 'undefined' && window.DOMParser) {
    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, 'text/html')
      return doc.body.textContent || doc.body.innerText || ""
    } catch (error) {
      console.warn('DOMParser failed, using regex fallback:', error)
    }
  }
  
  // Fallback: remove HTML tags with regex
  return html.replace(/<[^>]*>/g, '').trim()
}

/**
 * Escape HTML entities to prevent XSS
 */
export function escapeHtml(text: string): string {
  if (!text) return ""
  
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;'
  }
  
  return text.replace(/[&<>"'/]/g, (match) => htmlEscapes[match] || match)
}

/**
 * Unescape HTML entities
 */
export function unescapeHtml(html: string): string {
  if (!html) return ""
  
  const htmlUnescapes: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&#x2F;': '/'
  }
  
  return html.replace(/&(?:amp|lt|gt|quot|#39|#x2F);/g, (match) => htmlUnescapes[match] || match)
}

/**
 * Validate if a URL is safe to use in href or src attributes
 */
export function isSafeUrl(url: string): boolean {
  if (!url) return false
  
  // Allow relative URLs
  if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
    return true
  }
  
  // Allow safe protocols
  const safeProtocols = ['http:', 'https:', 'mailto:', 'tel:']
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'about:']
  
  const lowerUrl = url.toLowerCase().trim()
  
  // Check for dangerous protocols
  for (const protocol of dangerousProtocols) {
    if (lowerUrl.startsWith(protocol)) {
      return false
    }
  }
  
  // Check for safe protocols or relative URLs
  for (const protocol of safeProtocols) {
    if (lowerUrl.startsWith(protocol)) {
      return true
    }
  }
  
  // If no protocol is specified, assume relative URL
  if (!lowerUrl.includes(':')) {
    return true
  }
  
  return false
}

export default {
  sanitizeHtml,
  stripHtmlTags,
  escapeHtml,
  unescapeHtml,
  isSafeUrl
}