"use client"
import { useState } from "react"
import {
  Clock,
  CheckCircle2,
  Phone,
  MessageSquare,
  Settings,
  TrendingUp,
  Activity,
  ClipboardCheck,
  UserCheck,
  CalendarIcon,
  AlertCircle,
  Award,
  Target,
  Wallet,
  CreditCard,
  Calendar,
  PiggyBank,
  TrendingDown,
  Euro,
  FileText,
  User,
  Building,
  Briefcase,
  ShoppingBag,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"

export default function AdminProfilePage() {
  const [selectedFilter, setSelectedFilter] = useState("all")

  const walletData = {
    balance: 3850,
    pending: 420,
    monthlyEarnings: 2800,
    companyLoan: {
      amount: 5000,
      paid: 2500,
      remaining: 2500,
      monthlyPayment: 500,
      nextPayment: "2024-05-01",
    },
    withdrawHistory: [
      { date: "2024-04-15", amount: 1200, status: "completed" },
      { date: "2024-04-01", amount: 1100, status: "completed" },
      { date: "2024-03-15", amount: 1000, status: "completed" },
    ],
  }

  const motivationPlan = {
    baseSalary: 2000,
    bonusStructure: [
      { criteria: "Конверсия звонков > 75%", bonus: 300, achieved: true },
      { criteria: "Записей в месяц > 100", bonus: 250, achieved: true },
      { criteria: "Средний чек > 140€", bonus: 200, achieved: true },
      { criteria: "Отмены < 5%", bonus: 150, achieved: true },
      { criteria: "Удовлетворенность > 4.5", bonus: 100, achieved: true },
    ],
    totalBonus: 1000,
    achievements: [
      { title: "Лучший администратор месяца", bonus: 500, date: "2024-03" },
      { title: "100% конверсия за неделю", bonus: 200, date: "2024-04" },
    ],
  }

  const vacationData = {
    totalDays: 28,
    usedDays: 10,
    plannedDays: 5,
    availableDays: 13,
    sickDays: {
      total: 15,
      used: 3,
      remaining: 12,
    },
    upcomingVacations: [{ startDate: "2024-06-15", endDate: "2024-06-20", days: 5, status: "approved" }],
    history: [
      { startDate: "2024-02-10", endDate: "2024-02-20", days: 10, type: "vacation", status: "completed" },
      { startDate: "2024-03-15", endDate: "2024-03-17", days: 3, type: "sick", status: "completed" },
    ],
  }

  const personalData = {
    fullName: "Ольга Андреевна Сергеева",
    position: "Администратор",
    department: "Клиентский сервис",
    hireDate: "2021-05-15",
    contractType: "Бессрочный",
    workSchedule: "5/2, 09:00-18:00",
    studio: "Центральная студия",
    manager: "Дмитрий Волков",
    salary: 2000,
    taxId: "7712345678",
    socialInsurance: "123-456-789 00",
  }

  const salesPlan = {
    products: [
      { name: "Косметика для ухода", plan: 50, current: 42, commission: 10 },
      { name: "Подарочные сертификаты", plan: 30, current: 28, commission: 15 },
      { name: "Абонементы", plan: 20, current: 15, commission: 20 },
    ],
    totalPlan: 15000,
    totalCurrent: 12500,
    totalCommission: 1250,
  }

  const performanceMetrics = [
    { metric: "Обработано обращений", value: 450, plan: 400, growth: 12.5 },
    { metric: "Записей оформлено", value: 124, plan: 100, growth: 24 },
    { metric: "Средний чек", value: 145, plan: 140, growth: 3.6 },
    { metric: "Конверсия", value: 78, plan: 75, growth: 4 },
  ]

  const adminData = {
    name: "Ольга Сергеева",
    role: "Администратор",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olga",
    experience: "3 года",
    efficiency: 94,
    tasksCompleted: 156,
    tasksMonth: 42,
    callsToday: 18,
    messagesProcessed: 67,
    avgResponseTime: "2 мин",
    customerSatisfaction: 4.8,
    appointmentsBooked: 124,
    cancellationRate: 3.2,
  }

  const hourlyPerformance = [
    { hour: "9:00", calls: 3, appointments: 5, messages: 8 },
    { hour: "10:00", calls: 5, appointments: 7, messages: 12 },
    { hour: "11:00", calls: 4, appointments: 6, messages: 10 },
    { hour: "12:00", calls: 2, appointments: 3, messages: 5 },
    { hour: "13:00", calls: 3, appointments: 4, messages: 7 },
    { hour: "14:00", calls: 6, appointments: 8, messages: 15 },
    { hour: "15:00", calls: 5, appointments: 6, messages: 11 },
    { hour: "16:00", calls: 4, appointments: 5, messages: 9 },
  ]

  const todayTasks = [
    {
      time: "09:00",
      task: "Подтверждение записей на сегодня",
      priority: "high",
      status: "completed",
      calls: 8,
      duration: "45 мин",
      assignedBy: "Менеджер",
    },
    {
      time: "10:30",
      task: "Обработка новых заявок",
      priority: "high",
      status: "completed",
      calls: 5,
      duration: "30 мин",
      assignedBy: "Система",
    },
    {
      time: "12:00",
      task: "Напоминания клиентам о завтрашних записях",
      priority: "medium",
      status: "in-progress",
      calls: 12,
      duration: "60 мин",
      assignedBy: "Автоматически",
    },
    {
      time: "14:00",
      task: "Обновление расписания мастеров",
      priority: "medium",
      status: "pending",
      calls: 0,
      duration: "20 мин",
      assignedBy: "Менеджер",
    },
    {
      time: "16:00",
      task: "Инвентаризация материалов",
      priority: "low",
      status: "pending",
      calls: 0,
      duration: "40 мин",
      assignedBy: "Менеджер",
    },
  ]

  const communicationData = [
    { day: "Пн", calls: 15, messages: 23, emails: 8 },
    { day: "Вт", calls: 18, messages: 29, emails: 12 },
    { day: "Ср", calls: 22, messages: 31, emails: 10 },
    { day: "Чт", calls: 19, messages: 27, emails: 9 },
    { day: "Пт", calls: 24, messages: 35, emails: 15 },
    { day: "Сб", calls: 28, messages: 42, emails: 18 },
    { day: "Вс", calls: 20, messages: 30, emails: 11 },
  ]

  const studioActivity = [
    { studio: "Центральная студия", appointments: 28, newClients: 12, calls: 45, satisfaction: 4.9, occupancy: 92 },
    { studio: "Студия на Невском", appointments: 22, newClients: 8, calls: 38, satisfaction: 4.7, occupancy: 85 },
    { studio: "Студия у метро", appointments: 18, newClients: 6, calls: 29, satisfaction: 4.6, occupancy: 78 },
  ]

  const recentInquiries = [
    {
      time: "14:35",
      client: "Екатерина Волкова",
      type: "Звонок",
      topic: "Запись на маникюр",
      status: "resolved",
      duration: "3 мин",
      notes: "Записана на завтра 15:00",
    },
    {
      time: "14:20",
      client: "Алексей Морозов",
      type: "WhatsApp",
      topic: "Изменение времени записи",
      status: "resolved",
      duration: "5 мин",
      notes: "Перенесено с 14:00 на 16:00",
    },
    {
      time: "14:05",
      client: "Мария Новикова",
      type: "Email",
      topic: "Вопрос о ценах",
      status: "in-progress",
      duration: "-",
      notes: "Отправлен прайс-лист",
    },
    {
      time: "13:50",
      client: "Игорь Павлов",
      type: "Звонок",
      topic: "Отмена записи",
      status: "resolved",
      duration: "2 мин",
      notes: "Отменена запись на 18:00",
    },
  ]

  const adminKPI = [
    { metric: "Конверсия звонков", current: 78, target: 80, unit: "%" },
    { metric: "Средний чек записи", current: 145, target: 150, unit: "€" },
    { metric: "Время ответа", current: 2, target: 3, unit: "мин" },
    { metric: "Отмены", current: 3.2, target: 5, unit: "%" },
  ]

  const workingHours = {
    todayHours: 8,
    weekHours: 40,
    monthHours: 168,
    plannedHours: 160,
    overtimeHours: 8,
    breakHours: 4,
    efficiency: 96,
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "in-progress":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "pending":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "resolved":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Шапка профиля */}
        <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 border-gray-700/50 backdrop-blur-sm p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={adminData.avatar || "/placeholder.svg"}
                  alt={adminData.name}
                  className="w-24 h-24 rounded-2xl border-2 border-blue-500/50"
                />
                <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-lg font-semibold">
                  Admin
                </div>
                <div className="absolute -top-2 -left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-lg font-semibold flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  {adminData.customerSatisfaction}
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">{adminData.name}</h1>
                <p className="text-gray-400 mb-2">
                  {adminData.role} • {adminData.experience}
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Activity className="w-4 h-4 text-blue-400" />
                    <span className="text-white font-semibold">{adminData.efficiency}%</span>
                    <span className="text-gray-400 text-sm">эффективность</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-green-400" />
                    <span className="text-white font-semibold">{adminData.avgResponseTime}</span>
                    <span className="text-gray-400 text-sm">ср. ответ</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Phone className="w-4 h-4 mr-2" />
                Позвонить клиенту
              </Button>
              <Button variant="outline" className="border-gray-700 bg-transparent">
                <Settings className="w-4 h-4 mr-2" />
                Настройки
              </Button>
            </div>
          </div>
        </Card>

        {/* Быстрая статистика */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-600/20 to-blue-900/20 border-blue-500/30 p-6 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <ClipboardCheck className="w-8 h-8 text-blue-400" />
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{adminData.tasksMonth}</div>
            <div className="text-gray-400 text-sm">Задач выполнено</div>
            <div className="text-blue-400 text-xs mt-1">За текущий месяц</div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600/20 to-purple-900/20 border-purple-500/30 p-6 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <Phone className="w-8 h-8 text-purple-400" />
              <Activity className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{adminData.callsToday}</div>
            <div className="text-gray-400 text-sm">Звонков сегодня</div>
            <div className="text-purple-400 text-xs mt-1">Средний ответ: {adminData.avgResponseTime}</div>
          </Card>

          <Card className="bg-gradient-to-br from-green-600/20 to-green-900/20 border-green-500/30 p-6 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <MessageSquare className="w-8 h-8 text-green-400" />
              <CheckCircle2 className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{adminData.messagesProcessed}</div>
            <div className="text-gray-400 text-sm">Сообщений обработано</div>
            <div className="text-green-400 text-xs mt-1">За сегодня</div>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-600/20 to-indigo-900/20 border-indigo-500/30 p-6 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <CalendarIcon className="w-8 h-8 text-indigo-400" />
              <UserCheck className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{adminData.appointmentsBooked}</div>
            <div className="text-gray-400 text-sm">Записей оформлено</div>
            <div className="text-indigo-400 text-xs mt-1">Отмены: {adminData.cancellationRate}%</div>
          </Card>
        </div>

        {/* Основной контент */}
        <Tabs defaultValue="tasks" className="space-y-6">
          <TabsList className="bg-gray-800/50 border border-gray-700/50">
            <TabsTrigger value="tasks">Задачи</TabsTrigger>
            <TabsTrigger value="inquiries">Обращения</TabsTrigger>
            <TabsTrigger value="analytics">Аналитика</TabsTrigger>
            <TabsTrigger value="kpi">КПИ</TabsTrigger>
            <TabsTrigger value="studios">Студии</TabsTrigger>
            <TabsTrigger value="wallet">Кошелек</TabsTrigger>
            <TabsTrigger value="motivation">Мотивация</TabsTrigger>
            {/* Добавлен таб рабочих часов */}
            <TabsTrigger value="hours">Рабочие часы</TabsTrigger>
            <TabsTrigger value="vacation">Отпуска</TabsTrigger>
            <TabsTrigger value="personal">Личные данные</TabsTrigger>
            <TabsTrigger value="sales">План продаж</TabsTrigger>
          </TabsList>

          {/* Вкладка: Задачи */}
          <TabsContent value="tasks" className="space-y-6">
            <Card className="bg-gray-900/90 border-gray-700/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <ClipboardCheck className="w-5 h-5 text-blue-400" />
                  Задачи на сегодня
                </h2>
                <Button className="bg-blue-600 hover:bg-blue-700">Добавить задачу</Button>
              </div>

              <div className="space-y-3">
                {todayTasks.map((task, idx) => (
                  <div
                    key={idx}
                    className="flex items-start justify-between p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl hover:border-blue-500/50 transition-all duration-300"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className="text-center">
                        <Clock className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                        <span className="text-white font-semibold text-sm">{task.time}</span>
                      </div>
                      <div className="h-auto w-px bg-gray-700 self-stretch" />
                      <div className="flex-1">
                        <div className="text-white font-semibold mb-1">{task.task}</div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs px-2 py-1 rounded-lg border ${getPriorityColor(task.priority)}`}>
                            {task.priority === "high" && "Высокий"}
                            {task.priority === "medium" && "Средний"}
                            {task.priority === "low" && "Низкий"}
                          </span>
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {task.duration}
                          </span>
                          <span className="text-xs text-gray-400">• {task.assignedBy}</span>
                          {task.calls > 0 && (
                            <span className="text-xs text-gray-400">
                              <Phone className="w-3 h-3 inline mr-1" />
                              {task.calls} звонков
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`text-xs px-3 py-1 rounded-lg border ${getStatusColor(task.status)}`}>
                        {task.status === "completed" && "Выполнено"}
                        {task.status === "in-progress" && "В процессе"}
                        {task.status === "pending" && "Ожидает"}
                      </span>
                      {task.status === "pending" && (
                        <Button size="sm" variant="outline" className="h-7 bg-transparent">
                          Начать
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-gray-900/90 border-gray-700/50 p-6">
              <h3 className="text-lg font-bold text-white mb-4">Продуктивность по часам</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={hourlyPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="hour" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }} />
                  <Line type="monotone" dataKey="calls" stroke="#6366f1" strokeWidth={2} name="Звонки" />
                  <Line type="monotone" dataKey="appointments" stroke="#10b981" strokeWidth={2} name="Записи" />
                  <Line type="monotone" dataKey="messages" stroke="#8b5cf6" strokeWidth={2} name="Сообщения" />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>

          {/* Вкладка: Обращения */}
          <TabsContent value="inquiries" className="space-y-6">
            <Card className="bg-gray-900/90 border-gray-700/50 p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-400" />
                Недавние обращения
              </h2>

              <div className="space-y-3">
                {recentInquiries.map((inquiry, idx) => (
                  <div
                    key={idx}
                    className="flex items-start justify-between p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl hover:border-blue-500/50 transition-all duration-300"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className="text-center">
                        <span className="text-white font-semibold text-sm block mb-1">{inquiry.time}</span>
                        <span className="text-gray-400 text-xs">{inquiry.duration}</span>
                      </div>
                      <div className="h-auto w-px bg-gray-700 self-stretch" />
                      <div className="flex-1">
                        <div className="text-white font-semibold mb-1">{inquiry.client}</div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/30">
                            {inquiry.type}
                          </span>
                          <span className="text-gray-400 text-sm">{inquiry.topic}</span>
                        </div>
                        {inquiry.notes && (
                          <div className="flex items-start gap-2 mt-2 p-2 bg-gray-700/30 rounded-lg">
                            <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-300 text-xs">{inquiry.notes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`text-xs px-3 py-1 rounded-lg border ${getStatusColor(inquiry.status)}`}>
                        {inquiry.status === "resolved" && "Решено"}
                        {inquiry.status === "in-progress" && "В работе"}
                      </span>
                      {inquiry.status === "in-progress" && (
                        <Button size="sm" variant="outline" className="h-7 bg-transparent">
                          Завершить
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Вкладка: Аналитика */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-gray-900/90 border-gray-700/50 p-6">
              <h3 className="text-lg font-bold text-white mb-4">Статистика обработки обращений</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={communicationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="day" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }} />
                  <Bar dataKey="calls" fill="#6366f1" name="Звонки" />
                  <Bar dataKey="messages" fill="#8b5cf6" name="Сообщения" />
                  <Bar dataKey="emails" fill="#a855f7" name="Email" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>

          <TabsContent value="kpi" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {adminKPI.map((kpi, idx) => (
                <Card key={idx} className="bg-gray-900/90 border-gray-700/50 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-500/20 rounded-xl">
                        <Target className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{kpi.metric}</h3>
                        <p className="text-gray-400 text-sm">Текущее / Целевое</p>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {kpi.current}
                      {kpi.unit}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Текущее значение</span>
                      <span className="text-gray-400">
                        Цель: {kpi.target}
                        {kpi.unit}
                      </span>
                    </div>
                    <Progress
                      value={
                        kpi.unit === "%"
                          ? (kpi.current / kpi.target) * 100
                          : kpi.target < kpi.current
                            ? 100
                            : (kpi.current / kpi.target) * 100
                      }
                      className="h-3"
                    />
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Вкладка: Студии */}
          <TabsContent value="studios" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {studioActivity.map((studio, idx) => (
                <Card
                  key={idx}
                  className="bg-gray-900/90 border-gray-700/50 p-6 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
                >
                  <h3 className="text-white font-bold mb-4">{studio.studio}</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Записей</span>
                      <span className="text-white font-semibold">{studio.appointments}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Новых клиентов</span>
                      <span className="text-white font-semibold">{studio.newClients}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Звонков</span>
                      <span className="text-white font-semibold">{studio.calls}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Удовлетворенность</span>
                      <span className="text-yellow-400 font-semibold flex items-center gap-1">
                        <Award className="w-4 h-4" />
                        {studio.satisfaction}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Загрузка</span>
                      <span className="text-green-400 font-semibold">{studio.occupancy}%</span>
                    </div>
                    <Progress value={studio.occupancy} className="h-2 mt-2" />
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="wallet" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-green-600/20 to-green-900/20 border-green-500/30 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Wallet className="w-6 h-6 text-green-400" />
                    Баланс кошелька
                  </h3>
                  <Button className="bg-green-600 hover:bg-green-700">Вывести средства</Button>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl">
                    <div className="text-gray-400 text-sm mb-1">Доступно для вывода</div>
                    <div className="text-4xl font-bold text-white">€{walletData.balance.toLocaleString()}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-800/50 border border-yellow-500/30 rounded-xl">
                      <div className="text-gray-400 text-sm mb-1">В ожидании</div>
                      <div className="text-2xl font-bold text-yellow-400">€{walletData.pending}</div>
                    </div>
                    <div className="p-4 bg-gray-800/50 border border-blue-500/30 rounded-xl">
                      <div className="text-gray-400 text-sm mb-1">За месяц</div>
                      <div className="text-2xl font-bold text-blue-400">€{walletData.monthlyEarnings}</div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-red-600/20 to-red-900/20 border-red-500/30 p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-red-400" />
                  Рассрочка от компании
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl">
                    <div>
                      <div className="text-gray-400 text-sm">Выдано</div>
                      <div className="text-2xl font-bold text-white">€{walletData.companyLoan.amount}</div>
                    </div>
                    <TrendingDown className="w-8 h-8 text-red-400" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Погашено</span>
                      <span className="text-green-400 font-semibold">€{walletData.companyLoan.paid}</span>
                    </div>
                    <Progress
                      value={(walletData.companyLoan.paid / walletData.companyLoan.amount) * 100}
                      className="h-3"
                    />
                  </div>
                  <div className="flex justify-between p-3 bg-gray-800/50 rounded-xl">
                    <span className="text-gray-400 text-sm">Осталось</span>
                    <span className="text-white font-bold">€{walletData.companyLoan.remaining}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-800/50 rounded-xl">
                    <span className="text-gray-400 text-sm">Ежемесячный платеж</span>
                    <span className="text-red-400 font-bold">€{walletData.companyLoan.monthlyPayment}</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                    <CalendarIcon className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-400">Следующий платеж:</span>
                    <span className="text-white font-semibold">{walletData.companyLoan.nextPayment}</span>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="bg-gray-900/90 border-gray-700/50 p-6">
              <h3 className="text-lg font-bold text-white mb-4">История выводов</h3>
              <div className="space-y-3">
                {walletData.withdrawHistory.map((withdrawal, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl hover:border-green-500/50 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-green-500/20 rounded-xl">
                        <Euro className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <div className="text-white font-semibold">€{withdrawal.amount}</div>
                        <div className="text-gray-400 text-sm">{withdrawal.date}</div>
                      </div>
                    </div>
                    <span className="text-xs px-3 py-1 bg-green-500/20 text-green-400 rounded-lg border border-green-500/30">
                      {withdrawal.status === "completed" ? "Выполнено" : "В обработке"}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="motivation" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-blue-600/20 to-blue-900/20 border-blue-500/30 p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <PiggyBank className="w-6 h-6 text-blue-400" />
                  Структура дохода
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Оклад</span>
                      <span className="text-white font-bold text-xl">€{motivationPlan.baseSalary}</span>
                    </div>
                  </div>
                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Бонусы за КПИ</span>
                      <span className="text-green-400 font-bold text-xl">€{motivationPlan.totalBonus}</span>
                    </div>
                  </div>
                  <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Итого за месяц</span>
                      <span className="text-white font-bold text-2xl">
                        €{motivationPlan.baseSalary + motivationPlan.totalBonus}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-gray-900/90 border-gray-700/50 p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-400" />
                  Условия бонусов
                </h3>
                <div className="space-y-3">
                  {motivationPlan.bonusStructure.map((bonus, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border transition-all ${
                        bonus.achieved ? "bg-green-500/10 border-green-500/30" : "bg-gray-800/50 border-gray-700/50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white text-sm">{bonus.criteria}</span>
                        {bonus.achieved && <CheckCircle2 className="w-5 h-5 text-green-400" />}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-xs">Бонус</span>
                        <span className={`font-bold ${bonus.achieved ? "text-green-400" : "text-gray-400"}`}>
                          €{bonus.bonus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <Card className="bg-gray-900/90 border-gray-700/50 p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-400" />
                Достижения
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {motivationPlan.achievements.map((achievement, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-gradient-to-br from-yellow-600/20 to-yellow-900/20 border border-yellow-500/30 rounded-xl"
                  >
                    <div className="flex items-start gap-3">
                      <Award className="w-8 h-8 text-yellow-400 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-white font-semibold mb-1">{achievement.title}</div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">{achievement.date}</span>
                          <span className="text-yellow-400 font-bold">+€{achievement.bonus}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="hours" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-600/20 to-blue-900/20 border-blue-500/30 p-6">
                <Clock className="w-8 h-8 text-blue-400 mb-3" />
                <div className="text-3xl font-bold text-white mb-1">{workingHours.todayHours}ч</div>
                <div className="text-gray-400 text-sm">Отработано сегодня</div>
              </Card>

              <Card className="bg-gradient-to-br from-green-600/20 to-green-900/20 border-green-500/30 p-6">
                <Activity className="w-8 h-8 text-green-400 mb-3" />
                <div className="text-3xl font-bold text-white mb-1">{workingHours.weekHours}ч</div>
                <div className="text-gray-400 text-sm">За неделю</div>
              </Card>

              <Card className="bg-gradient-to-br from-purple-600/20 to-purple-900/20 border-purple-500/30 p-6">
                <Target className="w-8 h-8 text-purple-400 mb-3" />
                <div className="text-3xl font-bold text-white mb-1">{workingHours.monthHours}ч</div>
                <div className="text-gray-400 text-sm">За месяц</div>
                <div className="text-purple-400 text-xs mt-1">План: {workingHours.plannedHours}ч</div>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-600/20 to-yellow-900/20 border-yellow-500/30 p-6">
                <TrendingUp className="w-8 h-8 text-yellow-400 mb-3" />
                <div className="text-3xl font-bold text-white mb-1">{workingHours.overtimeHours}ч</div>
                <div className="text-gray-400 text-sm">Переработка</div>
              </Card>
            </div>

            <Card className="bg-gray-900/90 border-gray-700/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Управление рабочим временем</h3>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Settings className="w-4 h-4 mr-2" />
                  Настроить
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-gray-800/50 border border-gray-700/50 rounded-xl">
                  <h4 className="text-white font-semibold mb-4">Прогресс выполнения</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Отработано</span>
                        <span className="text-white font-semibold">
                          {workingHours.monthHours} / {workingHours.plannedHours}ч
                        </span>
                      </div>
                      <Progress value={(workingHours.monthHours / workingHours.plannedHours) * 100} className="h-3" />
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                      <span className="text-gray-400 text-sm">Эффективность</span>
                      <span className="text-green-400 font-bold text-xl">{workingHours.efficiency}%</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gray-800/50 border border-gray-700/50 rounded-xl">
                  <h4 className="text-white font-semibold mb-4">Действия</h4>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full bg-transparent justify-start">
                      <Calendar className="w-4 h-4 mr-2 text-blue-400" />
                      Изменить график
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent justify-start">
                      <Clock className="w-4 h-4 mr-2 text-purple-400" />
                      Учет переработок
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent justify-start">
                      <Target className="w-4 h-4 mr-2 text-green-400" />
                      Установить цели
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="vacation" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-blue-600/20 to-blue-900/20 border-blue-500/30 p-6">
                <Calendar className="w-8 h-8 text-blue-400 mb-3" />
                <div className="text-3xl font-bold text-white mb-1">{vacationData.availableDays}</div>
                <div className="text-gray-400 text-sm">Доступно дней</div>
              </Card>
              <Card className="bg-gradient-to-br from-green-600/20 to-green-900/20 border-green-500/30 p-6">
                <CheckCircle2 className="w-8 h-8 text-green-400 mb-3" />
                <div className="text-3xl font-bold text-white mb-1">{vacationData.usedDays}</div>
                <div className="text-gray-400 text-sm">Использовано</div>
              </Card>
              <Card className="bg-gradient-to-br from-purple-600/20 to-purple-900/20 border-purple-500/30 p-6">
                <Clock className="w-8 h-8 text-purple-400 mb-3" />
                <div className="text-3xl font-bold text-white mb-1">{vacationData.plannedDays}</div>
                <div className="text-gray-400 text-sm">Запланировано</div>
              </Card>
              <Card className="bg-gradient-to-br from-red-600/20 to-red-900/20 border-red-500/30 p-6">
                <AlertCircle className="w-8 h-8 text-red-400 mb-3" />
                <div className="text-3xl font-bold text-white mb-1">{vacationData.sickDays.remaining}</div>
                <div className="text-gray-400 text-sm">Больничных осталось</div>
              </Card>
            </div>

            <Card className="bg-gray-900/90 border-gray-700/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">Запланированные отпуска</h3>
                <Button className="bg-blue-600 hover:bg-blue-700">Запланировать отпуск</Button>
              </div>
              {vacationData.upcomingVacations.map((vacation, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <CalendarIcon className="w-8 h-8 text-blue-400" />
                    <div>
                      <div className="text-white font-semibold">
                        {vacation.startDate} - {vacation.endDate}
                      </div>
                      <div className="text-gray-400 text-sm">{vacation.days} дней</div>
                    </div>
                  </div>
                  <span className="text-xs px-3 py-1 bg-green-500/20 text-green-400 rounded-lg border border-green-500/30">
                    Утверждено
                  </span>
                </div>
              ))}
            </Card>

            <Card className="bg-gray-900/90 border-gray-700/50 p-6">
              <h3 className="text-lg font-bold text-white mb-4">История отпусков</h3>
              <div className="space-y-3">
                {vacationData.history.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-3 rounded-xl ${item.type === "vacation" ? "bg-blue-500/20" : "bg-red-500/20"}`}
                      >
                        <CalendarIcon
                          className={`w-5 h-5 ${item.type === "vacation" ? "text-blue-400" : "text-red-400"}`}
                        />
                      </div>
                      <div>
                        <div className="text-white font-semibold">
                          {item.startDate} - {item.endDate}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {item.days} дней • {item.type === "vacation" ? "Отпуск" : "Больничный"}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs px-3 py-1 bg-gray-500/20 text-gray-400 rounded-lg border border-gray-500/30">
                      Завершено
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="personal" className="space-y-6">
            <Card className="bg-gray-900/90 border-gray-700/50 p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <User className="w-6 h-6 text-blue-400" />
                Личная информация
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl">
                    <div className="text-gray-400 text-sm mb-1">ФИО</div>
                    <div className="text-white font-semibold">{personalData.fullName}</div>
                  </div>
                  <div className="p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl">
                    <div className="text-gray-400 text-sm mb-1">Должность</div>
                    <div className="text-white font-semibold">{personalData.position}</div>
                  </div>
                  <div className="p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl">
                    <div className="text-gray-400 text-sm mb-1">Отдел</div>
                    <div className="text-white font-semibold">{personalData.department}</div>
                  </div>
                  <div className="p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl">
                    <div className="text-gray-400 text-sm mb-1">График работы</div>
                    <div className="text-white font-semibold">{personalData.workSchedule}</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl">
                    <div className="text-gray-400 text-sm mb-1">Дата приема на работу</div>
                    <div className="text-white font-semibold">{personalData.hireDate}</div>
                  </div>
                  <div className="p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl">
                    <div className="text-gray-400 text-sm mb-1">Тип договора</div>
                    <div className="text-white font-semibold">{personalData.contractType}</div>
                  </div>
                  <div className="p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl">
                    <div className="text-gray-400 text-sm mb-1">Студия</div>
                    <div className="text-white font-semibold flex items-center gap-2">
                      <Building className="w-4 h-4 text-blue-400" />
                      {personalData.studio}
                    </div>
                  </div>
                  <div className="p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl">
                    <div className="text-gray-400 text-sm mb-1">Руководитель</div>
                    <div className="text-white font-semibold flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-purple-400" />
                      {personalData.manager}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-gray-900/90 border-gray-700/50 p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-400" />
                Финансовая информация
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl">
                  <div className="text-gray-400 text-sm mb-1">Оклад</div>
                  <div className="text-white font-bold text-xl">€{personalData.salary}</div>
                </div>
                <div className="p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl">
                  <div className="text-gray-400 text-sm mb-1">ИНН</div>
                  <div className="text-white font-semibold">{personalData.taxId}</div>
                </div>
                <div className="p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl">
                  <div className="text-gray-400 text-sm mb-1">СНИЛС</div>
                  <div className="text-white font-semibold">{personalData.socialInsurance}</div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="sales" className="space-y-6">
            <Card className="bg-gray-900/90 border-gray-700/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <ShoppingBag className="w-6 h-6 text-blue-400" />
                  План продаж дополнительных товаров
                </h3>
                <div className="text-right">
                  <div className="text-gray-400 text-sm">Выполнено на</div>
                  <div className="text-2xl font-bold text-white">
                    {((salesPlan.totalCurrent / salesPlan.totalPlan) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {salesPlan.products.map((product, idx) => (
                  <div key={idx} className="p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="text-white font-semibold">{product.name}</div>
                        <div className="text-gray-400 text-sm">Комиссия: {product.commission}%</div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-bold">
                          {product.current} / {product.plan}
                        </div>
                        <div className="text-gray-400 text-sm">продаж</div>
                      </div>
                    </div>
                    <Progress value={(product.current / product.plan) * 100} className="h-3" />
                  </div>
                ))}
              </div>

              <div className="mt-6 p-6 bg-gradient-to-br from-green-600/20 to-green-900/20 border border-green-500/30 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Общий план</div>
                    <div className="text-white font-bold text-2xl">€{salesPlan.totalPlan.toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-400 text-sm mb-1">Текущая выручка</div>
                    <div className="text-green-400 font-bold text-2xl">€{salesPlan.totalCurrent.toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-400 text-sm mb-1">Комиссия заработана</div>
                    <div className="text-yellow-400 font-bold text-2xl">€{salesPlan.totalCommission}</div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-gray-900/90 border-gray-700/50 p-6">
              <h3 className="text-lg font-bold text-white mb-4">Метрики производительности</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {performanceMetrics.map((metric, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl hover:border-blue-500/50 transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-white font-semibold">{metric.metric}</div>
                      <div className="flex items-center gap-1 text-green-400 text-sm">
                        <TrendingUp className="w-4 h-4" />+{metric.growth}%
                      </div>
                    </div>
                    <div className="flex items-end justify-between mb-2">
                      <div>
                        <div className="text-3xl font-bold text-white">{metric.value}</div>
                        <div className="text-gray-400 text-sm">План: {metric.plan}</div>
                      </div>
                      <Progress value={(metric.value / metric.plan) * 100} className="h-2 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
