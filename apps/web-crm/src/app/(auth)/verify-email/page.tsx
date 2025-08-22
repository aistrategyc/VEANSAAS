import VerifyEmailClient from './VerifyEmailClient'

export default async function VerifyEmailPage(props: any) {
  // Next 15 может передать searchParams как объект ИЛИ как Promise
  const sp = props?.searchParams
  const resolved: Record<string, any> =
    sp && typeof sp.then === 'function' ? await sp : (sp ?? {})

  const rawEmail = resolved?.email
  const email = Array.isArray(rawEmail) ? (rawEmail[0] ?? '') : (rawEmail ?? '')
  
  const rawToken = resolved?.token
  const token = Array.isArray(rawToken) ? (rawToken[0] ?? '') : (rawToken ?? '')

  return <VerifyEmailClient email={email} token={token} />
}