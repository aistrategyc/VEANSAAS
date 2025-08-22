import VerifyEmailTokenClient from './VerifyEmailTokenClient'

export default async function VerifyEmailTokenPage(props: any) {
  // searchParams: объект или Promise — решаем на рантайме
  const sp = props?.searchParams
  const resolved: Record<string, any> =
    sp && typeof sp.then === 'function' ? await sp : (sp ?? {})

  const raw = resolved?.token
  const token = Array.isArray(raw) ? (raw[0] ?? '') : (raw ?? '')

  return <VerifyEmailTokenClient token={token} />
}