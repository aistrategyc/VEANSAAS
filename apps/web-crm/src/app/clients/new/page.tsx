"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  UserPlus, 
  ArrowLeft, 
  Save,
  Phone,
  Mail,
  User,
  CalendarDays,
  Star
} from "lucide-react"
import Link from "next/link"

const clientSchema = z.object({
  firstName: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  lastName: z.string().min(2, "Фамилия должна содержать минимум 2 символа"),
  phone: z.string().min(10, "Некорректный номер телефона"),
  email: z.string().email("Некорректный email").optional().or(z.literal("")),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["male", "female", "other", ""]).optional(),
  source: z.enum(["walk_in", "referral", "social_media", "website", "advertisement", "other", ""]).optional(),
  notes: z.string().optional(),
  status: z.enum(["active", "inactive", "vip"]).default("active")
})

type ClientFormData = z.infer<typeof clientSchema>

const sourceOptions = [
  { value: "walk_in", label: "Пришёл сам" },
  { value: "referral", label: "По рекомендации" },
  { value: "social_media", label: "Социальные сети" },
  { value: "website", label: "Сайт" },
  { value: "advertisement", label: "Реклама" },
  { value: "other", label: "Другое" }
]

export default function NewClientPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      status: "active"
    }
  })

  const watchedStatus = watch("status")
  const watchedGender = watch("gender") 
  const watchedSource = watch("source")

  const onSubmit = async (data: ClientFormData) => {
    setIsLoading(true)
    try {
      // Здесь будет API вызов для создания клиента
      const response = await fetch('/api/v1/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        router.push('/clients?created=success')
      }
    } catch (error) {
      console.error('Ошибка создания клиента:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/clients">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад к клиентам
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <UserPlus className="h-8 w-8 text-purple-600" />
              Добавить клиента
            </h1>
            <p className="text-gray-600 mt-1">
              Создание карточки нового клиента
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Основная информация */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Основная информация
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">Имя *</Label>
                <Input
                  id="firstName"
                  {...register("firstName")}
                  placeholder="Анна"
                  className={errors.firstName ? "border-red-500" : ""}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Фамилия *</Label>
                <Input
                  id="lastName"
                  {...register("lastName")}
                  placeholder="Петрова"
                  className={errors.lastName ? "border-red-500" : ""}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="phone">Телефон *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    {...register("phone")}
                    placeholder="+7 (999) 123-45-67"
                    className={`pl-10 ${errors.phone ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="anna@example.com"
                    className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Дополнительная информация */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Дополнительная информация
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Дата рождения</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  {...register("dateOfBirth")}
                />
              </div>

              <div className="space-y-2">
                <Label>Пол</Label>
                <Select value={watchedGender} onValueChange={(value) => setValue("gender", value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите пол" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Мужской</SelectItem>
                    <SelectItem value="female">Женский</SelectItem>
                    <SelectItem value="other">Другой</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Статус клиента</Label>
                <Select value={watchedStatus} onValueChange={(value) => setValue("status", value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите статус" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Активный</SelectItem>
                    <SelectItem value="inactive">Неактивный</SelectItem>
                    <SelectItem value="vip">VIP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Откуда узнал о нас</Label>
              <Select value={watchedSource} onValueChange={(value) => setValue("source", value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите источник" />
                </SelectTrigger>
                <SelectContent>
                  {sourceOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Заметки</Label>
              <Textarea
                id="notes"
                {...register("notes")}
                placeholder="Дополнительная информация о клиенте..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Preview card */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-purple-600" />
              Предварительный просмотр
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {watch("firstName")?.[0] || "?"}{watch("lastName")?.[0] || "?"}
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  {watch("firstName") || "Имя"} {watch("lastName") || "Фамилия"}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  {watch("phone") && (
                    <div className="flex items-center space-x-1">
                      <Phone className="h-3 w-3" />
                      <span>{watch("phone")}</span>
                    </div>
                  )}
                  {watch("email") && (
                    <div className="flex items-center space-x-1">
                      <Mail className="h-3 w-3" />
                      <span>{watch("email")}</span>
                    </div>
                  )}
                </div>
                <div className="mt-2">
                  <Badge 
                    className={
                      watchedStatus === "vip" ? "bg-yellow-100 text-yellow-800 border-yellow-300" :
                      watchedStatus === "active" ? "bg-green-100 text-green-800 border-green-300" :
                      "bg-gray-100 text-gray-800 border-gray-300"
                    }
                  >
                    {watchedStatus === "vip" ? "VIP" : 
                     watchedStatus === "active" ? "Активный" : "Неактивный"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <Link href="/clients">
            <Button type="button" variant="outline">
              Отменить
            </Button>
          </Link>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 min-w-[140px]"
          >
            {isLoading ? (
              <>Сохраняем...</>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Создать клиента
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}