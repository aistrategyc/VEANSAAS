'use client'

import { useEffect, useMemo, useState } from 'react'
import { api } from '@/lib/api/config'
import { useRouter } from 'next/navigation'
import { OnboardingAPI } from '@/lib/api/onboarding'
import type { OrganizationCreatePayload, InviteItem } from '@/types/onboarding'
import { getOrganizations } from '@/lib/api/profile'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'

type StepKey = 'company' | 'prefs' | 'team' | 'departments' | 'review'

const steps: { key: StepKey; title: string }[] = [
  { key: 'company', title: 'Компания' },
  { key: 'prefs', title: 'Предпочтения' },
  { key: 'team', title: 'Команда' },
  { key: 'departments', title: 'Отделы' },
  { key: 'review', title: 'Обзор' },
]

// Функция генерации slug (как на бэкенде)
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 80)
}

// Валидация email
const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export default function OnboardingPage() {
  const router = useRouter()
  const { toast } = useToast()

  // Проверяем, есть ли уже организации
  useEffect(() => {
    ;(async () => {
      try {
        const orgs = await getOrganizations()
        if (Array.isArray(orgs) && orgs.length > 0) {
          router.replace('/dashboard')
        }
      } catch {}
    })()
  }, [router])

  const [active, setActive] = useState<StepKey>('company')
  const [saving, setSaving] = useState(false)
  const [orgId, setOrgId] = useState<string | null>(null)
  const [finishing, setFinishing] = useState(false)

  const [company, setCompany] = useState<OrganizationCreatePayload>({
    name: '',
    description: '',
    industry: undefined,
    size: 'small',
    address: { 
      country: 'PL',
      city: '',
      line1: '',
      line2: '',
      region: '',
      postal_code: ''
    },
    preferences: { 
      currency: 'PLN', 
      locale: 'ru-RU', 
      week_start: 'monday',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Warsaw'
    },
    custom_fields: {}
  })

  const [invites, setInvites] = useState<InviteItem[]>([])
  const [departments, setDepartments] = useState<{ name: string; description?: string }[]>([])

  const currentIndex = useMemo(() => steps.findIndex(s => s.key === active), [active])
  const progress = Math.round(((currentIndex + 1) / steps.length) * 100)

  // Генерация slug для предпросмотра
  const previewSlug = useMemo(() => 
    company.name ? generateSlug(company.name) : '', 
    [company.name]
  )

  const canNext = useMemo(() => {
    if (active === 'company') {
      return company.name.trim().length >= 2 && company.name.trim().length <= 150 && !saving
    }
    if (active === 'team') {
      // Проверяем, что все введённые email валидны
      const hasInvalidEmails = invites.some(invite => 
        invite.email.trim() && !validateEmail(invite.email.trim())
      )
      return !hasInvalidEmails && !saving
    }
    return !saving
  }, [active, company.name, invites, saving])

  const next = () => setActive(steps[Math.min(currentIndex + 1, steps.length - 1)].key)
  const back = () => setActive(steps[Math.max(currentIndex - 1, 0)].key)

  const handleCreateOrgIfNeeded = async () => {
    if (orgId) return orgId
    setSaving(true)
    try {
      // ✅ Не нужно получать пользователя - бэкенд сам установит owner_id
      
      // Создаем payload согласно расширенной схеме organization.py
      const cleanPayload = {
        name: company.name.trim(),
        slug: generateSlug(company.name.trim()),
        description: company.description?.trim() || undefined,
        industry: company.industry || undefined,
        size: company.size || 'small',
        address: company.address && Object.values(company.address).some(v => v?.trim()) 
          ? company.address 
          : undefined,
        preferences: company.preferences || undefined,
        custom_fields: company.custom_fields || undefined
      }
      
      console.log('Sending organization payload:', JSON.stringify(cleanPayload, null, 2))
      const created = await OnboardingAPI.createOrganization(cleanPayload)
      setOrgId(created.id)
      return created.id
    } catch (e: any) {
      console.error('Organization creation error:', e)
      
      let errorMessage = 'Не удалось создать организацию'
      
      if (e?.response?.data) {
        const errorData = e.response.data
        
        if (Array.isArray(errorData.detail)) {
          const validationErrors = errorData.detail
            .map((err: any) => `${err.loc?.join('.')}: ${err.msg}`)
            .join(', ')
          errorMessage = `Ошибки валидации: ${validationErrors}`
        }
        else if (errorData.detail) {
          errorMessage = typeof errorData.detail === 'string' 
            ? errorData.detail 
            : errorData.detail.title || errorData.detail.detail || errorMessage
        }
        else if (e.response.status === 409) {
          errorMessage = 'Организация с таким названием уже существует'
        }
        else if (e.response.status === 403) {
          errorMessage = 'Недостаточно прав для создания организации'
        }
      }
      else if (e?.message) {
        errorMessage = e.message
      }
      
      toast({ title: 'Ошибка', description: errorMessage, variant: 'destructive' })
      throw e
    } finally {
      setSaving(false)
    }
  }

  const handleFinish = async () => {
    if (finishing) return
    
    // Дополнительная валидация перед отправкой
    if (company.name.trim().length < 2 || company.name.trim().length > 150) {
      toast({ 
        title: 'Ошибка', 
        description: 'Название компании должно быть от 2 до 150 символов',
        variant: 'destructive' 
      })
      return
    }

    setFinishing(true)
    try {
      // Подготовка данных для атомарного onboarding
      const cleanCompanyData = {
        name: company.name.trim(),
        slug: generateSlug(company.name.trim()),
        description: company.description?.trim() || undefined,
        industry: company.industry || undefined,
        size: company.size || 'small',
        address: company.address && Object.values(company.address).some(v => v?.trim()) 
          ? company.address 
          : undefined,
        preferences: company.preferences || undefined,
        custom_fields: company.custom_fields || undefined
      }

      // департаменты — только валидные
      const validDepartments = departments.filter(d => 
        d.name.trim().length >= 2 && d.name.trim().length <= 120
      )

      // инвайты — только валидные email
      const validInvites = invites.filter(i => 
        i.email.trim() && validateEmail(i.email.trim())
      )

      // Выполняем весь onboarding в одной транзакции
      const result = await OnboardingAPI.completeOnboarding(
        cleanCompanyData,
        validDepartments,
        validInvites
      )

      console.log('Onboarding completed:', result)

      if (result.errors && result.errors.length > 0) {
        console.warn('Onboarding completed with some errors:', result.errors)
        toast({ 
          title: 'Готово с предупреждениями', 
          description: `Профиль создан, но ${result.errors.length} операций не удались`,
          variant: 'default'
        })
      } else {
        toast({ title: 'Готово', description: 'Профиль компании создан успешно' })
      }

      router.replace('/dashboard')
    } catch (error: any) {
      console.error('Onboarding completion error:', error)
      
      let errorMessage = 'Не удалось завершить настройку'
      
      if (error?.response?.data) {
        const errorData = error.response.data
        
        if (Array.isArray(errorData.detail)) {
          const validationErrors = errorData.detail
            .map((err: any) => `${err.loc?.join('.')}: ${err.msg}`)
            .join(', ')
          errorMessage = `Ошибки валидации: ${validationErrors}`
        }
        else if (errorData.detail) {
          errorMessage = typeof errorData.detail === 'string' 
            ? errorData.detail 
            : errorData.detail.title || errorData.detail.detail || errorMessage
        }
      }
      else if (error?.message) {
        errorMessage = error.message
      }
      
      toast({ title: 'Ошибка', description: errorMessage, variant: 'destructive' })
    } finally {
      setFinishing(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl py-10 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Добро пожаловать 👋</h1>
        <p className="text-muted-foreground">Пару шагов — и всё готово к работе.</p>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="h-2 w-full rounded bg-muted">
          <div className="h-2 rounded bg-primary transition-all" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
          {steps.map((s, i) => (
            <button
              key={s.key}
              className={cn(
                'hover:text-foreground transition-colors', 
                s.key === active ? 'text-foreground font-medium' : ''
              )}
              onClick={() => { if (!saving && !finishing) setActive(s.key) }}
            >
              {i + 1}. {s.title}
            </button>
          ))}
        </div>
      </div>

      <Card className="p-6">
        {active === 'company' && (
          <div className="space-y-5">
            <div>
              <Label>Название компании *</Label>
              <Input
                placeholder="Например, Liderix Sp. z o.o."
                value={company.name}
                onChange={(e) => setCompany((v) => ({ ...v, name: e.target.value }))}
              />
              {company.name.trim().length > 150 && (
                <p className="mt-1 text-xs text-destructive">Максимум 150 символов</p>
              )}
            </div>

            {/* Предпросмотр slug */}
            {company.name && (
              <div className="rounded-md bg-muted p-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">URL:</span>
                  <code className="font-mono text-xs bg-background px-2 py-1 rounded">
                    your-domain.com/org/{previewSlug}
                  </code>
                </div>
                {previewSlug !== company.name.toLowerCase() && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Название будет преобразовано в URL-дружественный формат
                  </p>
                )}
              </div>
            )}

            <div>
              <Label>Описание</Label>
              <Input
                placeholder="Коротко о компании"
                value={company.description ?? ''}
                onChange={(e) => setCompany((v) => ({ ...v, description: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Индустрия</Label>
                <Select
                  value={company.industry ?? undefined}
                  onValueChange={(val) =>
                    setCompany((v) => ({ ...v, industry: (val || undefined) as any }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="it">IT</SelectItem>
                    <SelectItem value="marketing">Маркетинг</SelectItem>
                    <SelectItem value="retail">Ритейл</SelectItem>
                    <SelectItem value="education">Образование</SelectItem>
                    <SelectItem value="other">Другое</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Размер</Label>
                <Select
                  value={company.size ?? 'small'}
                  onValueChange={(val) => setCompany((v) => ({ ...v, size: (val || 'small') as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Маленькая (до 50)</SelectItem>
                    <SelectItem value="medium">Средняя (50+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Дополнительные поля */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Веб-сайт</Label>
                <Input
                  type="url"
                  placeholder="https://company.com"
                  value={company.custom_fields?.website ?? ''}
                  onChange={(e) => setCompany((v) => ({ 
                    ...v, 
                    custom_fields: { ...v.custom_fields, website: e.target.value }
                  }))}
                />
              </div>
              <div>
                <Label>Телефон</Label>
                <Input
                  type="tel"
                  placeholder="+48 123 456 789"
                  value={company.custom_fields?.phone ?? ''}
                  onChange={(e) => setCompany((v) => ({ 
                    ...v, 
                    custom_fields: { ...v.custom_fields, phone: e.target.value }
                  }))}
                />
              </div>
            </div>

            {/* ✅ Улучшенный индикатор загрузки */}
            {saving && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                <span>Создаём организацию...</span>
              </div>
            )}

            <Separator />
            <div className="flex justify-between">
              <div />
              <Button
                disabled={!canNext}
                onClick={async () => {
                  await handleCreateOrgIfNeeded()
                  next()
                }}
              >
                {saving ? 'Создаём...' : 'Далее'}
              </Button>
            </div>
          </div>
        )}

        {active === 'prefs' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Валюта</Label>
                <Select
                  value={company.preferences?.currency ?? 'PLN'}
                  onValueChange={(val) =>
                    setCompany((v) => ({ ...v, preferences: { ...(v.preferences || {}), currency: val as any } }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PLN">PLN</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Язык</Label>
                <Select
                  value={company.preferences?.locale ?? 'ru-RU'}
                  onValueChange={(val) =>
                    setCompany((v) => ({ ...v, preferences: { ...(v.preferences || {}), locale: val as any } }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ru-RU">Русский</SelectItem>
                    <SelectItem value="en-US">English</SelectItem>
                    <SelectItem value="pl-PL">Polski</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Часовой пояс</Label>
                <Input
                  placeholder="Europe/Warsaw"
                  value={company.preferences?.timezone ?? ''}
                  onChange={(e) =>
                    setCompany((v) => ({ ...v, preferences: { ...(v.preferences || {}), timezone: e.target.value } }))
                  }
                />
              </div>
              <div>
                <Label>Начало недели</Label>
                <Select
                  value={company.preferences?.week_start ?? 'monday'}
                  onValueChange={(val) =>
                    setCompany((v) => ({ ...v, preferences: { ...(v.preferences || {}), week_start: val as any } }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monday">Понедельник</SelectItem>
                    <SelectItem value="sunday">Воскресенье</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />
            <div className="flex justify-between">
              <Button variant="ghost" onClick={back}>Назад</Button>
              <Button onClick={next}>Далее</Button>
            </div>
          </div>
        )}

        {active === 'team' && (
          <div className="space-y-5">
            <p className="text-sm text-muted-foreground">
              Опционально: пригласите коллег (можно пропустить).
            </p>
            <div className="space-y-3">
              {invites.map((i, idx) => (
                <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <Input
                      placeholder="email@company.com"
                      value={i.email}
                      onChange={(e) => {
                        const v = [...invites]
                        v[idx] = { ...v[idx], email: e.target.value }
                        setInvites(v)
                      }}
                      className={cn(
                        i.email.trim() && !validateEmail(i.email.trim()) 
                          ? 'border-destructive' 
                          : ''
                      )}
                    />
                    {i.email.trim() && !validateEmail(i.email.trim()) && (
                      <p className="mt-1 text-xs text-destructive">Неверный формат email</p>
                    )}
                  </div>
                  <Select
                    value={i.role}
                    onValueChange={(val) => {
                      const v = [...invites]
                      v[idx] = { ...v[idx], role: val as any }
                      setInvites(v)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="viewer">Зритель</SelectItem>
                      <SelectItem value="member">Участник</SelectItem>
                      <SelectItem value="admin">Админ</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="destructive" 
                    onClick={() => setInvites(invites.filter((_, j) => j !== idx))}
                  >
                    Удалить
                  </Button>
                </div>
              ))}
              <Button 
                variant="secondary" 
                onClick={() => setInvites([...invites, { email: '', role: 'member' }])}
              >
                + Добавить приглашение
              </Button>
            </div>

            <Separator />
            <div className="flex justify-between">
              <Button variant="ghost" onClick={back}>Назад</Button>
              <Button onClick={next}>Далее</Button>
            </div>
          </div>
        )}

        {active === 'departments' && (
          <div className="space-y-5">
            <p className="text-sm text-muted-foreground">
              Опционально: заготовьте отделы (можно пропустить).
            </p>
            <div className="space-y-3">
              {departments.map((d, idx) => (
                <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Input
                    placeholder="Название отдела"
                    value={d.name}
                    onChange={(e) => {
                      const v = [...departments]
                      v[idx] = { ...v[idx], name: e.target.value }
                      setDepartments(v)
                    }}
                  />
                  <Input
                    placeholder="Описание (необязательно)"
                    value={d.description ?? ''}
                    onChange={(e) => {
                      const v = [...departments]
                      v[idx] = { ...v[idx], description: e.target.value }
                      setDepartments(v)
                    }}
                  />
                  <Button 
                    variant="destructive" 
                    onClick={() => setDepartments(departments.filter((_, j) => j !== idx))}
                  >
                    Удалить
                  </Button>
                </div>
              ))}
              <Button 
                variant="secondary" 
                onClick={() => setDepartments([...departments, { name: '' }])}
              >
                + Добавить отдел
              </Button>
            </div>

            <Separator />
            <div className="flex justify-between">
              <Button variant="ghost" onClick={back}>Назад</Button>
              <Button onClick={next}>Далее</Button>
            </div>
          </div>
        )}

        {active === 'review' && (
          <div className="space-y-5">
            <h3 className="text-lg font-medium">Проверьте данные</h3>
            <div className="rounded-md border p-4 text-sm space-y-2">
              <div><b>Компания:</b> {company.name}</div>
              <div><b>URL:</b> <code>your-domain.com/org/{previewSlug}</code></div>
              {company.description && <div><b>Описание:</b> {company.description}</div>}
              {company.industry && <div><b>Индустрия:</b> {company.industry}</div>}
              {company.size && <div><b>Размер:</b> {company.size}</div>}
              {company.custom_fields?.website && (
                <div><b>Веб-сайт:</b> {company.custom_fields.website}</div>
              )}
              {invites.filter(i => i.email.trim()).length > 0 && (
                <div><b>Приглашения:</b> {invites.filter(i => i.email.trim()).length}</div>
              )}
              {departments.filter(d => d.name.trim()).length > 0 && (
                <div>
                  <b>Отделы:</b> {departments.filter(d => d.name.trim()).map(d => d.name.trim()).join(', ')}
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <Button variant="ghost" onClick={back}>Назад</Button>
              <Button 
                disabled={saving || finishing || company.name.trim().length < 2} 
                onClick={handleFinish}
              >
                {finishing ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Завершаем…
                  </>
                ) : (
                  'Завершить'
                )}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}