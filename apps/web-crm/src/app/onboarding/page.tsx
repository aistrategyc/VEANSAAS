"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/(auth)/hooks/useAuth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Scissors, 
  Heart, 
  Users, 
  MapPin, 
  Clock, 
  DollarSign,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  Building,
  Calendar,
  Star
} from "lucide-react"

interface StudioData {
  name: string
  type: "TATTOO" | "PIERCING" | "BARBERSHOP" | "BEAUTY" | "NAIL" | ""
  address: string
  phone: string
  description: string
  workingHours: {
    monday: { start: string, end: string, closed: boolean }
    tuesday: { start: string, end: string, closed: boolean }
    wednesday: { start: string, end: string, closed: boolean }
    thursday: { start: string, end: string, closed: boolean }
    friday: { start: string, end: string, closed: boolean }
    saturday: { start: string, end: string, closed: boolean }
    sunday: { start: string, end: string, closed: boolean }
  }
}

const studioTypes = [
  {
    type: "TATTOO" as const,
    name: "Тату-студия",
    description: "Художественные татуировки, эскизы, перекрытие",
    icon: Heart,
    color: "from-purple-500 to-pink-500",
    services: ["Черно-белые татуировки", "Цветные татуировки", "Перекрытие", "Коррекция"]
  },
  {
    type: "PIERCING" as const,
    name: "Пирсинг-студия", 
    description: "Профессиональный пирсинг всех видов",
    icon: Sparkles,
    color: "from-pink-500 to-purple-500",
    services: ["Пирсинг ушей", "Пирсинг носа", "Пирсинг губ", "Боди-пирсинг"]
  },
  {
    type: "BARBERSHOP" as const,
    name: "Барбершоп",
    description: "Мужские стрижки, борода, усы",
    icon: Scissors,
    color: "from-blue-500 to-indigo-500", 
    services: ["Мужская стрижка", "Стрижка бороды", "Стрижка усов", "Уход за волосами"]
  },
  {
    type: "BEAUTY" as const,
    name: "Салон красоты",
    description: "Комплексные услуги красоты",
    icon: Star,
    color: "from-pink-500 to-rose-500",
    services: ["Стрижки", "Окрашивание", "Укладки", "Уход за лицом"]
  },
  {
    type: "NAIL" as const,
    name: "Nail-студия",
    description: "Маникюр, педикюр, nail-дизайн",
    icon: Heart,
    color: "from-rose-500 to-pink-500",
    services: ["Маникюр", "Педикюр", "Гель-лак", "Nail-дизайн"]
  }
]

const defaultWorkingHours = {
  monday: { start: "09:00", end: "18:00", closed: false },
  tuesday: { start: "09:00", end: "18:00", closed: false },
  wednesday: { start: "09:00", end: "18:00", closed: false },
  thursday: { start: "09:00", end: "18:00", closed: false },
  friday: { start: "09:00", end: "18:00", closed: false },
  saturday: { start: "10:00", end: "16:00", closed: false },
  sunday: { start: "10:00", end: "16:00", closed: true }
}

export default function OnboardingPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [studioData, setStudioData] = useState<StudioData>({
    name: "",
    type: "",
    address: "",
    phone: "",
    description: "",
    workingHours: defaultWorkingHours
  })

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      // Здесь будет API вызов для создания студии
      const response = await fetch('/api/v1/studios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(studioData)
      })

      if (response.ok) {
        router.push('/dashboard?onboarding=completed')
      }
    } catch (error) {
      console.error('Ошибка создания студии:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const selectedStudioType = studioTypes.find(type => type.type === studioData.type)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Добро пожаловать в VEANCRM! ✨
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Настроим вашу студию за несколько простых шагов
          </p>
          
          {/* Progress */}
          <div className="max-w-md mx-auto mb-8">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Шаг {currentStep} из {totalSteps}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Step 1: Выбор типа студии */}
          {currentStep === 1 && (
            <Card className="border-2">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl flex items-center justify-center gap-2">
                  <Building className="h-6 w-6" />
                  Какой тип студии у вас?
                </CardTitle>
                <p className="text-gray-600">Выберите основное направление деятельности</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {studioTypes.map((type) => {
                    const Icon = type.icon
                    const isSelected = studioData.type === type.type
                    
                    return (
                      <Card 
                        key={type.type}
                        className={`cursor-pointer transition-all hover:scale-105 ${
                          isSelected 
                            ? 'border-2 border-purple-500 shadow-lg' 
                            : 'border hover:border-purple-300'
                        }`}
                        onClick={() => setStudioData({...studioData, type: type.type})}
                      >
                        <CardContent className="p-6 text-center">
                          <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${type.color} flex items-center justify-center`}>
                            <Icon className="h-8 w-8 text-white" />
                          </div>
                          <h3 className="font-semibold text-lg mb-2">{type.name}</h3>
                          <p className="text-gray-600 text-sm mb-3">{type.description}</p>
                          <div className="space-y-1">
                            {type.services.slice(0, 2).map((service, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                          </div>
                          {isSelected && (
                            <div className="mt-3 flex justify-center">
                              <Check className="h-6 w-6 text-purple-600" />
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
                
                <div className="flex justify-center mt-8">
                  <Button 
                    onClick={nextStep}
                    disabled={!studioData.type}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-8"
                  >
                    Продолжить
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Основная информация */}
          {currentStep === 2 && (
            <Card className="border-2">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl flex items-center justify-center gap-2">
                  {selectedStudioType && <selectedStudioType.icon className="h-6 w-6" />}
                  Расскажите о вашей студии
                </CardTitle>
                <p className="text-gray-600">Основная информация для клиентов</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Название студии *</Label>
                    <Input
                      id="name"
                      placeholder="Например: Ink Master Studio"
                      value={studioData.name}
                      onChange={(e) => setStudioData({...studioData, name: e.target.value})}
                      className="border-2 focus:border-purple-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Телефон *</Label>
                    <Input
                      id="phone"
                      placeholder="+7 (999) 123-45-67"
                      value={studioData.phone}
                      onChange={(e) => setStudioData({...studioData, phone: e.target.value})}
                      className="border-2 focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Адрес *</Label>
                  <Input
                    id="address"
                    placeholder="г. Москва, ул. Арбат, д. 10"
                    value={studioData.address}
                    onChange={(e) => setStudioData({...studioData, address: e.target.value})}
                    className="border-2 focus:border-purple-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Описание студии</Label>
                  <Textarea
                    id="description"
                    placeholder="Расскажите о особенностях вашей студии, стиле работы..."
                    value={studioData.description}
                    onChange={(e) => setStudioData({...studioData, description: e.target.value})}
                    className="border-2 focus:border-purple-500 min-h-[100px]"
                  />
                </div>

                <div className="flex justify-between mt-8">
                  <Button variant="outline" onClick={prevStep}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Назад
                  </Button>
                  <Button 
                    onClick={nextStep}
                    disabled={!studioData.name || !studioData.phone || !studioData.address}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    Продолжить
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Расписание работы */}
          {currentStep === 3 && (
            <Card className="border-2">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl flex items-center justify-center gap-2">
                  <Clock className="h-6 w-6" />
                  Расписание работы
                </CardTitle>
                <p className="text-gray-600">Укажите часы работы студии</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(studioData.workingHours).map(([day, hours]) => {
                    const dayNames = {
                      monday: "Понедельник",
                      tuesday: "Вторник", 
                      wednesday: "Среда",
                      thursday: "Четверг",
                      friday: "Пятница",
                      saturday: "Суббота",
                      sunday: "Воскресенье"
                    }

                    return (
                      <div key={day} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <span className="w-24 font-medium">{dayNames[day as keyof typeof dayNames]}</span>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={!hours.closed}
                              onChange={(e) => {
                                setStudioData({
                                  ...studioData,
                                  workingHours: {
                                    ...studioData.workingHours,
                                    [day]: { ...hours, closed: !e.target.checked }
                                  }
                                })
                              }}
                              className="rounded border-gray-300"
                            />
                            <span className="text-sm">Работаем</span>
                          </div>
                        </div>
                        
                        {!hours.closed && (
                          <div className="flex items-center space-x-2">
                            <input
                              type="time"
                              value={hours.start}
                              onChange={(e) => {
                                setStudioData({
                                  ...studioData,
                                  workingHours: {
                                    ...studioData.workingHours,
                                    [day]: { ...hours, start: e.target.value }
                                  }
                                })
                              }}
                              className="border rounded px-2 py-1"
                            />
                            <span>—</span>
                            <input
                              type="time"
                              value={hours.end}
                              onChange={(e) => {
                                setStudioData({
                                  ...studioData,
                                  workingHours: {
                                    ...studioData.workingHours,
                                    [day]: { ...hours, end: e.target.value }
                                  }
                                })
                              }}
                              className="border rounded px-2 py-1"
                            />
                          </div>
                        )}
                        
                        {hours.closed && (
                          <Badge variant="secondary">Выходной</Badge>
                        )}
                      </div>
                    )
                  })}
                </div>

                <div className="flex justify-between mt-8">
                  <Button variant="outline" onClick={prevStep}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Назад
                  </Button>
                  <Button 
                    onClick={nextStep}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    Продолжить
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Завершение */}
          {currentStep === 4 && (
            <Card className="border-2">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl flex items-center justify-center gap-2">
                  <Check className="h-6 w-6" />
                  Отлично! Проверим настройки
                </CardTitle>
                <p className="text-gray-600">Убедитесь что всё указано верно</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Сводка */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                          {selectedStudioType && <selectedStudioType.icon className="h-5 w-5" />}
                          {selectedStudioType?.name}
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div><strong>Название:</strong> {studioData.name}</div>
                          <div><strong>Телефон:</strong> {studioData.phone}</div>
                          <div><strong>Адрес:</strong> {studioData.address}</div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-lg mb-4">Расписание</h3>
                        <div className="space-y-1 text-sm">
                          {Object.entries(studioData.workingHours)
                            .filter(([_, hours]) => !hours.closed)
                            .slice(0, 3)
                            .map(([day, hours]) => (
                              <div key={day}>
                                <strong>
                                  {day === 'monday' ? 'Пн' : 
                                   day === 'tuesday' ? 'Вт' :
                                   day === 'wednesday' ? 'Ср' :
                                   day === 'thursday' ? 'Чт' :
                                   day === 'friday' ? 'Пт' :
                                   day === 'saturday' ? 'Сб' : 'Вс'}:
                                </strong> {hours.start} — {hours.end}
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-gray-600 mb-6">
                      Всё готово! После создания студии вы сможете добавить сотрудников, 
                      настроить услуги и начать принимать записи.
                    </p>
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <Button variant="outline" onClick={prevStep}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Назад
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-8"
                  >
                    {isLoading ? (
                      <>Создаём студию...</>
                    ) : (
                      <>
                        Создать студию
                        <Sparkles className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}