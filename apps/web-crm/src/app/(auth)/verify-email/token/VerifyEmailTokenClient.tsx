'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle2, AlertCircle, Mail } from "lucide-react"
import { verifyEmailByToken, resendVerification } from "@/lib/api/auth"

type Props = {
  token: string
  email?: string
}

export default function VerifyEmailTokenClient({ token, email }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      if (!token) {
        setError("Токен подтверждения не передан.")
        setLoading(false)
        return
      }
      try {
        // используем верный клиент из lib/api/auth.ts
        await verifyEmailByToken(token)
        setSuccess(true)
      } catch (e: any) {
        setError(e?.message || "Не удалось подтвердить email.")
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [token])

  const handleResend = async () => {
    if (!email) return
    setLoading(true)
    setError(null)
    try {
      await resendVerification(email)
    } catch (e: any) {
      setError(e?.message || "Не удалось отправить письмо повторно.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full bg-card border border-border p-8 rounded-lg shadow-sm space-y-6 text-center">
        {loading ? (
          <>
            <Loader2 className="w-10 h-10 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Подтверждаем вашу почту…</p>
          </>
        ) : success ? (
          <>
            <CheckCircle2 className="w-10 h-10 mx-auto text-green-600" />
            <h1 className="text-2xl font-bold">Email подтверждён</h1>
            <p className="text-muted-foreground">Теперь вы можете войти в систему.</p>
            <Button className="w-full" onClick={() => router.push("/login")}>
              Перейти ко входу
            </Button>
          </>
        ) : (
          <>
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>{error || "Ошибка подтверждения."}</AlertDescription>
            </Alert>
            {email ? (
              <Button variant="secondary" className="w-full" onClick={handleResend}>
                <Mail className="w-4 h-4 mr-2" />
                Отправить письмо ещё раз
              </Button>
            ) : null}
            <Button variant="outline" className="w-full" onClick={() => router.push("/login")}>
              На страницу входа
            </Button>
          </>
        )}
      </div>
    </div>
  )
}