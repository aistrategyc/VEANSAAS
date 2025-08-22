"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/app/(auth)/hooks/useAuth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Calendar, 
  Clock, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Plus,
  UserPlus,
  CalendarPlus,
  Scissors,
  Heart,
  Star
} from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState<"today" | "week" | "month">("today")
  const [currentTime, setCurrentTime] = useState(new Date())

  // Обновление времени каждую минуту
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="text-gray-500">Загрузка...</div>
        </div>
      </div>
    )
  }

  // Примерные данные для демонстрации (в реальном приложении будут из API)
  const todayStats = {
    appointmentsToday: 12,
    weeklyRevenue: 45000,
    activeClients: 89,
    completedToday: 8,
    pendingToday: 4
  }

  const recentAppointments = [
    { id: 1, client: "Анна Петрова", service: "Татуировка", time: "14:00", master: "Иван Смирнов", status: "confirmed" },
    { id: 2, client: "Мария Козлова", service: "Пирсинг", time: "15:30", master: "Елена Волкова", status: "in_progress" },
    { id: 3, client: "Дмитрий Соколов", service: "Стрижка", time: "16:00", master: "Андрей Новиков", status: "pending" }
  ]

  const quickActions = [
    { title: "Новая запись", icon: CalendarPlus, action: "/appointments/new", color: "bg-purple-500" },
    { title: "Добавить клиента", icon: UserPlus, action: "/clients/new", color: "bg-pink-500" },
    { title: "Услуги", icon: Scissors, action: "/services", color: "bg-blue-500" },
    { title: "Расписание", icon: Calendar, action: "/schedule", color: "bg-green-500" }
  ]

  const getTimeGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return "Доброе утро"
    if (hour < 17) return "Добрый день"
    return "Добрый вечер"
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          {getTimeGreeting()}, {user?.email}! ✨
        </h1>
        <p className="text-gray-600">
          Панель управления VEANCRM для студии красоты
        </p>
      </div>

      {/* Period Filter */}
      <div className="flex space-x-2">
        <Button 
          variant={selectedPeriod === "today" ? "default" : "outline"}
          onClick={() => setSelectedPeriod("today")}
          className={selectedPeriod === "today" ? "bg-gradient-to-r from-purple-500 to-pink-500" : ""}
        >
          Сегодня
        </Button>
        <Button 
          variant={selectedPeriod === "week" ? "default" : "outline"}
          onClick={() => setSelectedPeriod("week")}
          className={selectedPeriod === "week" ? "bg-gradient-to-r from-purple-500 to-pink-500" : ""}
        >
          Неделя
        </Button>
        <Button 
          variant={selectedPeriod === "month" ? "default" : "outline"}
          onClick={() => setSelectedPeriod("month")}
          className={selectedPeriod === "month" ? "bg-gradient-to-r from-purple-500 to-pink-500" : ""}
        >
          Месяц
        </Button>
      </div>

      {/* Main Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Записи на сегодня</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{todayStats.appointmentsToday}</div>
            <p className="text-xs text-gray-500">
              {todayStats.completedToday} выполнено, {todayStats.pendingToday} ожидают
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-pink-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Выручка за неделю</CardTitle>
            <DollarSign className="h-4 w-4 text-pink-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-600">₽{todayStats.weeklyRevenue.toLocaleString()}</div>
            <p className="text-xs text-gray-500">
              +15% по сравнению с прошлой неделей
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Активные клиенты</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{todayStats.activeClients}</div>
            <p className="text-xs text-gray-500">
              +5 новых за неделю
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Средний чек</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₽3,250</div>
            <p className="text-xs text-gray-500">
              +8% рост за месяц
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Grid Layout for main content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-600" />
                Записи на сегодня
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                        <Heart className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{appointment.client}</p>
                        <p className="text-sm text-gray-500">{appointment.service} • {appointment.master}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-700">{appointment.time}</span>
                      <Badge 
                        variant={appointment.status === "confirmed" ? "default" : 
                                appointment.status === "in_progress" ? "destructive" : "secondary"}
                        className={appointment.status === "confirmed" ? "bg-green-100 text-green-800" : 
                                  appointment.status === "in_progress" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}
                      >
                        {appointment.status === "confirmed" ? "Подтверждена" : 
                         appointment.status === "in_progress" ? "В процессе" : "Ожидает"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <Button variant="outline" className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Посмотреть все записи
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Performance Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-pink-600" />
                Статистика по мастерам
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      ИС
                    </div>
                    <div>
                      <p className="font-medium">Иван Смирнов</p>
                      <p className="text-sm text-gray-600">Тату-мастер</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-purple-600">₽28,500</p>
                    <p className="text-sm text-gray-500">за неделю</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                      ЕВ
                    </div>
                    <div>
                      <p className="font-medium">Елена Волкова</p>
                      <p className="text-sm text-gray-600">Пирсинг-мастер</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-pink-600">₽15,200</p>
                    <p className="text-sm text-gray-500">за неделю</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      АН
                    </div>
                    <div>
                      <p className="font-medium">Андрей Новиков</p>
                      <p className="text-sm text-gray-600">Барбер</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">₽12,800</p>
                    <p className="text-sm text-gray-500">за неделю</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-purple-600" />
                Быстрые действия
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <Button 
                    key={index}
                    className={`w-full justify-start text-white hover:opacity-90 transition-opacity ${action.color}`}
                    onClick={() => {/* Navigate to action.action */}}
                  >
                    <action.icon className="h-4 w-4 mr-2" />
                    {action.title}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Studio Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Цели студии
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Месячная выручка</span>
                    <span className="text-sm text-muted-foreground">78%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full" style={{ width: "78%" }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">₽195,000 из ₽250,000</p>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Новые клиенты</span>
                    <span className="text-sm text-muted-foreground">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full" style={{ width: "85%" }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">17 из 20 новых клиентов</p>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Рейтинг студии</span>
                    <span className="text-sm text-muted-foreground">4.8/5</span>
                  </div>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">На основе 45 отзывов</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Studio Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-purple-600" />
                Достижения студии
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Star className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Топ рейтинг</p>
                    <p className="text-xs text-gray-500">#1 тату-студия в городе</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Heart className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Довольные клиенты</p>
                    <p className="text-xs text-gray-500">95% клиентов возвращаются</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Рост продаж</p>
                    <p className="text-xs text-gray-500">+25% за последние 3 месяца</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Popular Services */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scissors className="h-5 w-5 text-purple-600" />
              Популярные услуги
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                <div>
                  <p className="font-medium">Татуировка средняя</p>
                  <p className="text-sm text-gray-500">15 записей в месяц</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-purple-600">₽8,500</p>
                  <Badge className="bg-purple-100 text-purple-800">Топ</Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
                <div>
                  <p className="font-medium">Пирсинг уха</p>
                  <p className="text-sm text-gray-500">12 записей в месяц</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-pink-600">₽2,800</p>
                  <Badge className="bg-pink-100 text-pink-800">Популярно</Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <div>
                  <p className="font-medium">Мужская стрижка</p>
                  <p className="text-sm text-gray-500">25 записей в месяц</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600">₽1,200</p>
                  <Badge className="bg-blue-100 text-blue-800">Частое</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-600" />
              Ближайшие события
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg">
                <div className="text-center min-w-[48px]">
                  <p className="text-xs text-gray-500">ДЕК</p>
                  <p className="text-lg font-bold text-green-600">25</p>
                </div>
                <div>
                  <p className="font-medium">Новогодняя акция</p>
                  <p className="text-sm text-gray-500">Скидка 20% на все услуги</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
                <div className="text-center min-w-[48px]">
                  <p className="text-xs text-gray-500">ЯНВ</p>
                  <p className="text-lg font-bold text-blue-600">8</p>
                </div>
                <div>
                  <p className="font-medium">Обучение команды</p>
                  <p className="text-sm text-gray-500">Новые техники татуировки</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-3 bg-purple-50 rounded-lg">
                <div className="text-center min-w-[48px]">
                  <p className="text-xs text-gray-500">ЯНВ</p>
                  <p className="text-lg font-bold text-purple-600">15</p>
                </div>
                <div>
                  <p className="font-medium">Конкурс работ</p>
                  <p className="text-sm text-gray-500">Лучшая татуировка месяца</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}