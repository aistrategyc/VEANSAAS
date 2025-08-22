'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect, useMemo } from 'react'
import { resendVerification, verifyEmailByToken } from '@/lib/api/auth'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Mail, Loader2, AlertCircle, CheckCircle2, ExternalLink } from 'lucide-react'

function getMailboxUrl(email?: string | null) {
  if (!email) return 'https://mail.google.com/'
  const domain = email.split('@')[1]?.toLowerCase() || ''
  if (domain.includes('gmail.com')) return 'https://mail.google.com/'
  if (domain.includes('yandex.')) return 'https://mail.yandex.ru/'
  if (domain.includes('outlook.') || domain.includes('hotmail.') || domain.includes('live.')) return 'https://outlook.live.com/mail/'
  if (domain.includes('icloud.')) return 'https://www.icloud.com/mail/'
  return `https://${domain}`
}

type VerifyEmailClientProps = { email: string; token?: string }

export default function VerifyEmailClient({ email, token }: VerifyEmailClientProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [verified, setVerified] = useState(false)
  const [verifying, setVerifying] = useState(false)

  const mailboxUrl = useMemo(() => getMailboxUrl(email), [email])

  useEffect(() => {
    if (!email) setError('Не указан email для подтверждения.')
  }, [email])

  // Автоматическая верификация если есть token
  useEffect(() => {
    if (token && email && !verified && !verifying) {
      const handleAutoVerify = async () => {
        setVerifying(true)
        setError(null)
        try {
          await verifyEmailByToken(token)
          setVerified(true)
          setTimeout(() => {
            router.push('/login?verified=1')
          }, 2000)
        } catch (err: any) {
          setError(err?.message || 'Не удалось подтвердить email')
        } finally {
          setVerifying(false)
        }
      }
      handleAutoVerify()
    }
  }, [token, email, verified, verifying, router])

  useEffect(() => {
    if (secondsLeft <= 0) return
    const t = setInterval(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearInterval(t)
  }, [secondsLeft])

  const handleResend = async () => {
    if (!email || secondsLeft > 0) return
    setLoading(true)
    setError(null)
    try {
      await resendVerification(email)
      setSent(true)
      setSecondsLeft(60)
    } catch (err: any) {
      setError(err?.message || 'Не удалось отправить письмо повторно')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full bg-card border border-border p-8 rounded-lg shadow-sm space-y-6 text-center">
        <div className="flex justify-center">
          <Mail className="w-10 h-10 text-primary mb-2" />
        </div>

        <h1 className="text-2xl font-bold">
          {verifying ? 'Проверяем email...' : verified ? 'Email подтвержден!' : 'Проверьте вашу почту'}
        </h1>
        <p className="text-muted-foreground">
          {verified ? 
            'Ваш email успешно подтвержден. Перенаправляем на страницу входа...' :
            verifying ?
              'Подтверждаем ваш email адрес...' :
              <>Мы отправили письмо с подтверждением на{' '}
              <span className="font-semibold">{email || 'указанный email'}</span>.</>
          }
        </p>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {verified && !error && (
          <Alert variant="default">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <AlertDescription>Email успешно подтвержден! Перенаправляем...</AlertDescription>
          </Alert>
        )}

        {sent && !error && !verified && (
          <Alert variant="default">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <AlertDescription>Письмо отправлено повторно!</AlertDescription>
          </Alert>
        )}

        {verifying && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            Подтверждаем email...
          </div>
        )}

        <div className="space-y-3">
          <Button onClick={handleResend} disabled={loading || !email || secondsLeft > 0} className="w-full" aria-label="Resend email">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Отправка...
              </>
            ) : secondsLeft > 0 ? (
              `Отправить повторно (${secondsLeft}s)`
            ) : (
              'Отправить повторно'
            )}
          </Button>

          <a href={mailboxUrl} target="_blank" rel="noopener noreferrer" className="block">
            <Button variant="secondary" className="w-full" aria-label="Open mailbox">
              Открыть почту
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </a>

          <Button variant="outline" className="w-full" onClick={() => router.push('/login')} aria-label="Go to login">
            Перейти ко входу
          </Button>
        </div>

        {!email && (
          <p className="text-xs text-muted-foreground">
            Адрес не передан. Вернитесь на страницу регистрации и укажите email корректно.
          </p>
        )}
      </div>
    </div>
  )
}