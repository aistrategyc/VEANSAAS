"use client"

import { useState } from "react"
import {
  Calendar,
  Clock,
  TrendingUp,
  BookOpen,
  Users,
  Euro,
  Star,
  CheckCircle2,
  Target,
  Activity,
  Award,
  Gift,
  AlertCircle,
  MessageSquare,
  Phone,
  Wallet,
  Percent,
  Package,
  CreditCard,
  Umbrella,
  HeartPulse,
  Settings,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

export default function MasterProfilePage() {
  const [selectedPeriod, setSelectedPeriod] = useState("week")

  const masterData = {
    name: "Анна Петрова",
    role: "Тату мастер",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anna",
    rating: 4.9,
    reviewsCount: 127,
    experience: "5 лет",
    specialization: ["Тату", "Пирсинг", "Перманентный макияж"],
    grade: "Senior Master",
    balance: 3450,
    todayEarnings: 285,
    monthEarnings: 4830,
    planCompletion: 87,
    clientsToday: 4,
    clientsMonth: 68,
    bonusBalance: 450,
    loyaltyLevel: "Platinum",
    certificatesCount: 8,
    repeatClientsPercent: 65,
    averageRating: 4.9,
    responsiveness: 98,
  }

  const walletData = {
    mainBalance: 3450,
    pendingPayments: 1250,
    lastWithdrawal: 2800,
    lastWithdrawalDate: "25.04.2024",
    availableForWithdrawal: 3450,
    frozenAmount: 0,
    expectedPayment: 1850,
    expectedDate: "10.05.2024",
  }

  const motivationStructure = {
    baseSalary: 1200,
    serviceCommissions: [
      { service: "Тату (простое)", basePrice: 120, commission: 45, percentage: 45 },
      { service: "Тату (среднее)", basePrice: 250, commission: 50, percentage: 50 },
      { service: "Тату (сложное)", basePrice: 450, commission: 55, percentage: 55 },
      { service: "Пирсинг", basePrice: 45, commission: 40, percentage: 40 },
      { service: "Перманентный макияж", basePrice: 180, commission: 48, percentage: 48 },
    ],
    bonusSystem: {
      qualityBonus: { threshold: 4.8, bonus: 200, current: 4.9 },
      clientRetention: { threshold: 60, bonus: 150, current: 65 },
      planCompletion: { threshold: 90, bonus: 300, current: 87 },
      upselling: { threshold: 15, bonus: 100, current: 18 },
    },
    additionalIncentives: {
      newClientBonus: 20,
      reviewBonus: 10,
      weekendBonus: 1.2,
      holidayBonus: 1.5,
    },
  }

  const vacationData = {
    totalVacationDays: 28,
    usedVacationDays: 10,
    remainingVacationDays: 18,
    plannedVacations: [{ startDate: "15.06.2024", endDate: "29.06.2024", days: 14, status: "approved" }],
    sickLeaveDays: 3,
    sickLeaveThisYear: 3,
    unpaidLeaveDays: 0,
  }

  const salesPlan = {
    monthlyTarget: 2500,
    currentSales: 1850,
    completion: 74,
    productsTarget: 800,
    productsActual: 620,
    subscriptionsTarget: 1700,
    subscriptionsActual: 1230,
    topProducts: [
      { name: "Крем для ухода за тату", sold: 15, revenue: 225, commission: 45 },
      { name: "Серьги для пирсинга", sold: 22, revenue: 330, commission: 66 },
      { name: "Уходовая косметика", sold: 8, revenue: 120, commission: 24 },
    ],
    topSubscriptions: [
      { name: "Абонемент 5 сеансов", sold: 12, revenue: 900, commission: 180 },
      { name: "Абонемент 10 сеансов", sold: 6, revenue: 1500, commission: 300 },
      { name: "VIP абонемент", sold: 3, revenue: 750, commission: 150 },
    ],
  }

  const installmentData = {
    hasInstallment: true,
    totalAmount: 1500,
    paidAmount: 600,
    remainingAmount: 900,
    monthlyPayment: 150,
    reason: "Обучение: Продвинутые техники реализма",
    startDate: "01.02.2024",
    endDate: "01.12.2024",
    paymentsLeft: 6,
  }

  const motivationData = {
    monthlyBonus: 450,
    achievementBonus: 150,
    qualityBonus: 200,
    clientRetentionBonus: 100,
    totalBonuses: 900,
    nextLevelProgress: 87,
    nextLevelName: "Master Elite",
  }

  // График заработка
  const earningsData = [
    { date: "Пн", earnings: 320, clients: 3, tips: 45 },
    { date: "Вт", earnings: 450, clients: 4, tips: 60 },
    { date: "Ср", earnings: 380, clients: 3, tips: 50 },
    { date: "Чт", earnings: 520, clients: 5, tips: 75 },
    { date: "Пт", earnings: 610, clients: 6, tips: 90 },
    { date: "Сб", earnings: 720, clients: 7, tips: 110 },
    { date: "Вс", earnings: 480, clients: 5, tips: 70 },
  ]

  // Распределение услуг
  const servicesData = [
    { name: "Тату", value: 45, color: "#6366f1" },
    { name: "Пирсинг", value: 30, color: "#8b5cf6" },
    { name: "Перманент", value: 25, color: "#a855f7" },
  ]

  const todayAppointments = [
    {
      time: "10:00",
      client: "Мария Иванова",
      service: "Тату рукав",
      duration: "3ч",
      price: 350,
      status: "completed",
      tip: 50,
      rating: 5,
      notes: "Первый сеанс из трех",
    },
    {
      time: "14:00",
      client: "Петр Сидоров",
      service: "Пирсинг",
      duration: "30мин",
      price: 45,
      status: "in-progress",
      tip: 0,
      rating: null,
      notes: "Клиент опоздал на 10 минут",
    },
    {
      time: "15:30",
      client: "Елена Смирнова",
      service: "Перманентный макияж",
      duration: "2ч",
      price: 180,
      status: "upcoming",
      tip: 0,
      rating: null,
      notes: "VIP клиент, особое внимание",
    },
    {
      time: "18:00",
      client: "Дмитрий Козлов",
      service: "Тату",
      duration: "2ч",
      price: 220,
      status: "upcoming",
      tip: 0,
      rating: null,
      notes: "Новый клиент, консультация",
    },
  ]

  // КПИ и цели
  const kpiData = [
    { name: "Выручка", current: 4830, target: 5500, completion: 87, icon: Euro },
    { name: "Клиенты", current: 68, target: 75, completion: 90, icon: Users },
    { name: "Рейтинг", current: 4.9, target: 5.0, completion: 98, icon: Star },
    { name: "Повторные", current: 42, target: 50, completion: 84, icon: Activity },
  ]

  // Обучения
  const trainings = [
    { name: "Современные техники татуировки", date: "2024-01-15", status: "completed", score: 95, certificate: true },
    { name: "Безопасность и стерильность", date: "2024-02-20", status: "completed", score: 98, certificate: true },
    { name: "Работа с цветом", date: "2024-03-10", status: "in-progress", score: null, certificate: false },
    { name: "Продвинутая техника реализма", date: "2024-04-01", status: "upcoming", score: null, certificate: false },
  ]

  const clientStats = [
    { type: "Новые", count: 18, percent: 26, color: "#6366f1" },
    { type: "Повторные", count: 44, percent: 65, color: "#10b981" },
    { type: "VIP", count: 6, percent: 9, color: "#f59e0b" },
  ]

  const achievements = [
    { name: "100 довольных клиентов", progress: 68, target: 100, icon: Users, reward: 150 },
    { name: "Выручка €5000", progress: 4830, target: 5000, icon: Euro, reward: 200 },
    { name: "Рейтинг 5.0", progress: 4.9, target: 5.0, icon: Star, reward: 100 },
    { name: "10 пятизвездочных отзывов", progress: 7, target: 10, icon: Award, reward: 80 },
  ]

  const paymentHistory = [
    { date: "01.05.2024", amount: 3200, type: "Зарплата", status: "completed" },
    { date: "25.04.2024", amount: 450, type: "Бонусы", status: "completed" },
    { date: "15.04.2024", amount: 3100, type: "Зарплата", status: "completed" },
    { date: "10.05.2024", amount: 285, type: "Аванс", status: "pending" },
  ]

  const notifications = [
    { type: "appointment", message: "Через 30 минут запись с Марией Ивановой", time: "14:30", priority: "high" },
    { type: "review", message: "Новый отзыв от Петра Сидорова: 5 звезд", time: "13:45", priority: "medium" },
    { type: "bonus", message: "Вы заработали бонус €50 за качество", time: "12:00", priority: "low" },
  ]

  const workingHours = {
    todayHours: 7.5,
    weekHours: 38,
    monthHours: 165,
    plannedHours: 160,
    overtimeHours: 5,
    breakHours: 3,
    efficiency: 94,
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "in-progress":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "upcoming":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "approved":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500"
      case "medium":
        return "border-l-yellow-500"
      case "low":
        return "border-l-blue-500"
      default:
        return "border-l-gray-500"
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
                  src={masterData.avatar || "/placeholder.svg"}
                  alt={masterData.name}
                  className="w-24 h-24 rounded-2xl border-2 border-indigo-500/50"
                />
                <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded-lg font-semibold">
                  {masterData.grade}
                </div>
                <div className="absolute -top-2 -left-2 bg-yellow-500 text-gray-900 text-xs px-2 py-1 rounded-lg font-semibold flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  {masterData.loyaltyLevel}
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">{masterData.name}</h1>
                <p className="text-gray-400 mb-2">
                  {masterData.role} • {masterData.experience}
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-white font-semibold">{masterData.rating}</span>
                    <span className="text-gray-400 text-sm">({masterData.reviewsCount} отзывов)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Activity className="w-4 h-4 text-green-400" />
                    <span className="text-white font-semibold">{masterData.repeatClientsPercent}%</span>
                    <span className="text-gray-400 text-sm">повторные</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {masterData.specialization.map((spec, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-lg text-sm border border-indigo-500/30"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>
        </Card>

        {notifications.length > 0 && (
          <div className="space-y-2">
            {notifications.map((notif, idx) => (
              <Card key={idx} className={`bg-gray-900/90 border-l-4 ${getPriorityColor(notif.priority)} p-4`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {notif.type === "appointment" && <Clock className="w-5 h-5 text-indigo-400" />}
                    {notif.type === "review" && <Star className="w-5 h-5 text-yellow-400" />}
                    {notif.type === "bonus" && <Gift className="w-5 h-5 text-green-400" />}
                    <span className="text-white">{notif.message}</span>
                  </div>
                  <span className="text-gray-400 text-sm">{notif.time}</span>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Быстрая статистика */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-indigo-600/20 to-indigo-900/20 border-indigo-500/30 p-6 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <Euro className="w-8 h-8 text-indigo-400" />
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">€{masterData.balance}</div>
            <div className="text-gray-400 text-sm">Баланс кошелька</div>
            <div className="text-green-400 text-xs mt-1">+€{masterData.todayEarnings} сегодня</div>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-600/20 to-yellow-900/20 border-yellow-500/30 p-6 hover:shadow-lg hover:shadow-yellow-500/10 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <Gift className="w-8 h-8 text-yellow-400" />
              <Award className="w-4 h-4 text-yellow-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">€{masterData.bonusBalance}</div>
            <div className="text-gray-400 text-sm">Бонусы и награды</div>
            <div className="text-yellow-400 text-xs mt-1">+€{motivationData.monthlyBonus} в этом месяце</div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600/20 to-purple-900/20 border-purple-500/30 p-6 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8 text-purple-400" />
              <Activity className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{masterData.planCompletion}%</div>
            <div className="text-gray-400 text-sm">Выполнение плана</div>
            <Progress value={masterData.planCompletion} className="mt-2 h-2" />
          </Card>

          <Card className="bg-gradient-to-br from-blue-600/20 to-blue-900/20 border-blue-500/30 p-6 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-blue-400" />
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{masterData.clientsMonth}</div>
            <div className="text-gray-400 text-sm">Клиентов в месяце</div>
            <div className="text-blue-400 text-xs mt-1">{masterData.clientsToday} сегодня</div>
          </Card>
        </div>

        {/* Основной контент */}
        <Tabs defaultValue="schedule" className="space-y-6">
          <TabsList className="bg-gray-800/50 border border-gray-700/50">
            <TabsTrigger value="schedule">Расписание</TabsTrigger>
            <TabsTrigger value="wallet">Кошелек</TabsTrigger>
            <TabsTrigger value="motivation">Мотивация</TabsTrigger>
            {/* Добавлен триггер рабочих часов */}
            <TabsTrigger value="hours">Рабочие часы</TabsTrigger>
            <TabsTrigger value="vacation">Отпуска</TabsTrigger>
            <TabsTrigger value="sales">Продажи</TabsTrigger>
            <TabsTrigger value="analytics">Аналитика</TabsTrigger>
            <TabsTrigger value="training">Обучение</TabsTrigger>
          </TabsList>

          {/* Вкладка: Расписание */}
          <TabsContent value="schedule" className="space-y-6">
            <Card className="bg-gray-900/90 border-gray-700/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-400" />
                  Записи на сегодня
                </h2>
                <span className="text-sm text-gray-400">{todayAppointments.length} записей</span>
              </div>

              <div className="space-y-3">
                {todayAppointments.map((appointment, idx) => (
                  <div
                    key={idx}
                    className="flex items-start justify-between p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl hover:border-indigo-500/50 transition-all duration-300"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className="text-center">
                        <Clock className="w-5 h-5 text-indigo-400 mx-auto mb-1" />
                        <span className="text-white font-semibold text-sm">{appointment.time}</span>
                      </div>
                      <div className="h-auto w-px bg-gray-700 self-stretch" />
                      <div className="flex-1">
                        <div className="text-white font-semibold mb-1">{appointment.client}</div>
                        <div className="text-gray-400 text-sm mb-2">
                          {appointment.service} • {appointment.duration}
                        </div>
                        {appointment.notes && (
                          <div className="flex items-start gap-2 mt-2 p-2 bg-gray-700/30 rounded-lg">
                            <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-300 text-xs">{appointment.notes}</span>
                          </div>
                        )}
                        {appointment.status === "completed" && (
                          <div className="flex items-center gap-3 mt-2">
                            {appointment.rating && (
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                <span className="text-white text-sm">{appointment.rating}</span>
                              </div>
                            )}
                            {appointment.tip > 0 && (
                              <div className="text-green-400 text-sm">+€{appointment.tip} чаевые</div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-white font-bold">€{appointment.price}</div>
                      <span className={`text-xs px-2 py-1 rounded-lg border ${getStatusColor(appointment.status)}`}>
                        {appointment.status === "completed" && "Завершен"}
                        {appointment.status === "in-progress" && "В процессе"}
                        {appointment.status === "upcoming" && "Ожидается"}
                      </span>
                      {appointment.status === "upcoming" && (
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" className="h-7 px-2 bg-transparent">
                            <Phone className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 px-2 bg-transparent">
                            <MessageSquare className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-gray-900/90 border-gray-700/50 p-6">
              <h3 className="text-lg font-bold text-white mb-4">Статистика клиентов</h3>
              <div className="grid grid-cols-3 gap-4">
                {clientStats.map((stat, idx) => (
                  <div key={idx} className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                    <div className="text-2xl font-bold text-white mb-1">{stat.count}</div>
                    <div className="text-gray-400 text-sm mb-2">{stat.type}</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full" style={{ width: `${stat.percent}%`, backgroundColor: stat.color }} />
                      </div>
                      <span className="text-xs text-gray-400">{stat.percent}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="wallet" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-green-900/50 to-green-800/30 border-green-500/30 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-500/20 rounded-xl">
                      <Wallet className="w-8 h-8 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Основной баланс</h3>
                      <p className="text-gray-400 text-sm">Доступно для вывода</p>
                    </div>
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <div className="text-4xl font-bold text-white mb-4">€{walletData.mainBalance}</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Ожидается</span>
                    <span className="text-yellow-400">€{walletData.pendingPayments}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Заморожено</span>
                    <span className="text-gray-400">€{walletData.frozenAmount}</span>
                  </div>
                </div>
                <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">Вывести средства</Button>
              </Card>

              <Card className="bg-gray-900/90 border-gray-700/50 p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-400" />
                  История транзакций
                </h3>
                <div className="space-y-3">
                  {paymentHistory.map((payment, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div>
                        <div className="text-white font-semibold text-sm">{payment.type}</div>
                        <div className="text-gray-400 text-xs">{payment.date}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-bold">€{payment.amount}</div>
                        <span className={`text-xs px-2 py-1 rounded ${getStatusColor(payment.status)}`}>
                          {payment.status === "completed" && "Выплачено"}
                          {payment.status === "pending" && "Ожидается"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {installmentData.hasInstallment && (
              <Card className="bg-gradient-to-br from-yellow-900/50 to-yellow-800/30 border-yellow-500/30 p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-yellow-400" />
                  Рассрочка от компании
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Назначение</div>
                    <div className="text-white font-semibold">{installmentData.reason}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Общая сумма</div>
                    <div className="text-white font-semibold text-xl">€{installmentData.totalAmount}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Ежемесячный платеж</div>
                    <div className="text-yellow-400 font-semibold text-xl">€{installmentData.monthlyPayment}</div>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Выплачено: €{installmentData.paidAmount}</span>
                    <span className="text-gray-400">Осталось: €{installmentData.remainingAmount}</span>
                  </div>
                  <Progress value={(installmentData.paidAmount / installmentData.totalAmount) * 100} className="h-3" />
                  <div className="text-center text-gray-400 text-sm">
                    Осталось платежей: {installmentData.paymentsLeft}
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Начало: {installmentData.startDate}</span>
                  <span>Окончание: {installmentData.endDate}</span>
                </div>
              </Card>
            )}

            <Card className="bg-gray-900/90 border-gray-700/50 p-6">
              <h3 className="text-lg font-bold text-white mb-4">Ожидаемые выплаты</h3>
              <div className="p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Следующая выплата</div>
                    <div className="text-white font-bold text-2xl">€{walletData.expectedPayment}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-400 text-sm mb-1">Дата выплаты</div>
                    <div className="text-indigo-400 font-semibold">{walletData.expectedDate}</div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="motivation" className="space-y-6">
            <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-500/30 p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Euro className="w-6 h-6 text-purple-400" />
                Структура мотивации
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-gray-800/50 rounded-xl">
                    <div className="text-gray-400 text-sm mb-1">Базовая ставка</div>
                    <div className="text-white font-bold text-2xl">€{motivationStructure.baseSalary}</div>
                    <div className="text-gray-400 text-xs mt-1">Фиксированная часть</div>
                  </div>
                  <div className="p-4 bg-gray-800/50 rounded-xl">
                    <div className="text-gray-400 text-sm mb-1">Процентная часть</div>
                    <div className="text-green-400 font-bold text-2xl">
                      €{masterData.monthEarnings - motivationStructure.baseSalary}
                    </div>
                    <div className="text-gray-400 text-xs mt-1">От услуг и бонусов</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl border border-indigo-500/30">
                    <div className="text-gray-400 text-sm mb-1">Общий заработок за месяц</div>
                    <div className="text-white font-bold text-3xl">€{masterData.monthEarnings}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 text-sm">+15% к прошлому месяцу</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-gray-900/90 border-gray-700/50 p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Percent className="w-6 h-6 text-indigo-400" />
                Проценты по услугам
              </h3>
              <div className="space-y-3">
                {motivationStructure.serviceCommissions.map((service, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl hover:border-indigo-500/50 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1">
                        <div className="text-white font-semibold mb-1">{service.service}</div>
                        <div className="text-gray-400 text-sm">Базовая цена: €{service.basePrice}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-indigo-400 font-bold text-xl">{service.percentage}%</div>
                        <div className="text-gray-400 text-sm">≈ €{service.commission}</div>
                      </div>
                    </div>
                    <Progress value={service.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900/90 border-gray-700/50 p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Award className="w-6 h-6 text-yellow-400" />
                  Система бонусов
                </h3>
                <div className="space-y-3">
                  {Object.entries(motivationStructure.bonusSystem).map(([key, bonus], idx) => {
                    const labels: Record<string, string> = {
                      qualityBonus: "Бонус за качество",
                      clientRetention: "Удержание клиентов",
                      planCompletion: "Выполнение плана",
                      upselling: "Доп. продажи",
                    }
                    const isAchieved = bonus.current >= bonus.threshold
                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border ${
                          isAchieved ? "bg-green-500/10 border-green-500/30" : "bg-gray-800/50 border-gray-700/50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <div className="text-white font-semibold text-sm">{labels[key]}</div>
                            <div className="text-gray-400 text-xs">
                              Текущее: {bonus.current} / Цель: {bonus.threshold}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-bold ${isAchieved ? "text-green-400" : "text-gray-400"}`}>
                              €{bonus.bonus}
                            </div>
                            {isAchieved && <CheckCircle2 className="w-4 h-4 text-green-400 ml-auto mt-1" />}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>

              <Card className="bg-gray-900/90 border-gray-700/50 p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Gift className="w-6 h-6 text-purple-400" />
                  Дополнительные бонусы
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                    <span className="text-gray-400">За нового клиента</span>
                    <span className="text-white font-bold">
                      €{motivationStructure.additionalIncentives.newClientBonus}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                    <span className="text-gray-400">За отзыв 5★</span>
                    <span className="text-white font-bold">
                      €{motivationStructure.additionalIncentives.reviewBonus}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                    <span className="text-gray-400">Множитель выходных</span>
                    <span className="text-yellow-400 font-bold">
                      ×{motivationStructure.additionalIncentives.weekendBonus}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                    <span className="text-gray-400">Множитель праздников</span>
                    <span className="text-yellow-400 font-bold">
                      ×{motivationStructure.additionalIncentives.holidayBonus}
                    </span>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="bg-gray-900/90 border-gray-700/50 p-6">
              <h3 className="text-xl font-bold text-white mb-6">Достижения и награды</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement, idx) => (
                  <div key={idx} className="p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/20 rounded-lg">
                          <achievement.icon className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                          <div className="text-white font-semibold">{achievement.name}</div>
                          <div className="text-gray-400 text-sm">
                            {achievement.progress} / {achievement.target}
                          </div>
                        </div>
                      </div>
                      <div className="text-yellow-400 font-bold">+€{achievement.reward}</div>
                    </div>
                    <Progress value={(achievement.progress / achievement.target) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="vacation" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-blue-600/20 to-blue-900/20 border-blue-500/30 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Umbrella className="w-8 h-8 text-blue-400" />
                  <div>
                    <div className="text-gray-400 text-sm">Дней отпуска</div>
                    <div className="text-white font-bold text-2xl">{vacationData.remainingVacationDays}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Всего в году</span>
                    <span className="text-white">{vacationData.totalVacationDays}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Использовано</span>
                    <span className="text-blue-400">{vacationData.usedVacationDays}</span>
                  </div>
                  <Progress
                    value={(vacationData.usedVacationDays / vacationData.totalVacationDays) * 100}
                    className="h-2"
                  />
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-red-600/20 to-red-900/20 border-red-500/30 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <HeartPulse className="w-8 h-8 text-red-400" />
                  <div>
                    <div className="text-gray-400 text-sm">Больничных</div>
                    <div className="text-white font-bold text-2xl">{vacationData.sickLeaveThisYear}</div>
                  </div>
                </div>
                <div className="text-gray-400 text-sm">Дней в этом году</div>
                <div className="mt-4 p-3 bg-red-500/10 rounded-lg">
                  <div className="text-red-400 text-xs">При болезни обратитесь к менеджеру</div>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-purple-600/20 to-purple-900/20 border-purple-500/30 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-8 h-8 text-purple-400" />
                  <div>
                    <div className="text-gray-400 text-sm">Неоплачиваемых</div>
                    <div className="text-white font-bold text-2xl">{vacationData.unpaidLeaveDays}</div>
                  </div>
                </div>
                <div className="text-gray-400 text-sm">Дней в этом году</div>
                <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700" size="sm">
                  Запросить отпуск
                </Button>
              </Card>
            </div>

            <Card className="bg-gray-900/90 border-gray-700/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-indigo-400" />
                  Запланированные отпуска
                </h3>
                <Button className="bg-indigo-600 hover:bg-indigo-700">Запланировать отпуск</Button>
              </div>

              {vacationData.plannedVacations.length > 0 ? (
                <div className="space-y-3">
                  {vacationData.plannedVacations.map((vacation, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl hover:border-indigo-500/50 transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-indigo-500/20 rounded-lg">
                            <Umbrella className="w-6 h-6 text-indigo-400" />
                          </div>
                          <div>
                            <div className="text-white font-semibold">
                              {vacation.startDate} - {vacation.endDate}
                            </div>
                            <div className="text-gray-400 text-sm">{vacation.days} дней</div>
                          </div>
                        </div>
                        <span className={`text-xs px-3 py-1 rounded-lg border ${getStatusColor(vacation.status)}`}>
                          {vacation.status === "approved" && "Одобрено"}
                          {vacation.status === "pending" && "На рассмотрении"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Umbrella className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <div>Нет запланированных отпусков</div>
                </div>
              )}
            </Card>

            <Card className="bg-gray-900/90 border-gray-700/50 p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-gray-400" />
                Правила и условия
              </h3>
              <div className="space-y-3 text-sm text-gray-400">
                <div className="p-3 bg-gray-800/50 rounded-lg">• Отпуск нужно планировать минимум за 2 недели</div>
                <div className="p-3 bg-gray-800/50 rounded-lg">• Больничный оплачивается с 3-го дня по справке</div>
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  • Неиспользованные дни отпуска переносятся на следующий год
                </div>
                <div className="p-3 bg-gray-800/50 rounded-lg">• Отпуск можно разделить на несколько периодов</div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="sales" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-green-600/20 to-green-900/20 border-green-500/30 p-6">
                <div className="flex items-center justify-between mb-2">
                  <Package className="w-8 h-8 text-green-400" />
                  <TrendingUp className="w-4 h-4 text-green-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">€{salesPlan.currentSales}</div>
                <div className="text-gray-400 text-sm mb-2">Общие продажи</div>
                <Progress value={(salesPlan.currentSales / salesPlan.monthlyTarget) * 100} className="h-2 mb-2" />
                <div className="text-green-400 text-xs">
                  {salesPlan.completion}% от плана €{salesPlan.monthlyTarget}
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-blue-600/20 to-blue-900/20 border-blue-500/30 p-6">
                <div className="flex items-center justify-between mb-2">
                  <Package className="w-8 h-8 text-blue-400" />
                  <Activity className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">€{salesPlan.productsActual}</div>
                <div className="text-gray-400 text-sm mb-2">Продажа товаров</div>
                <Progress value={(salesPlan.productsActual / salesPlan.productsTarget) * 100} className="h-2 mb-2" />
                <div className="text-blue-400 text-xs">План: €{salesPlan.productsTarget}</div>
              </Card>

              <Card className="bg-gradient-to-br from-purple-600/20 to-purple-900/20 border-purple-500/30 p-6">
                <div className="flex items-center justify-between mb-2">
                  <CreditCard className="w-8 h-8 text-purple-400" />
                  <Activity className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">€{salesPlan.subscriptionsActual}</div>
                <div className="text-gray-400 text-sm mb-2">Абонементы</div>
                <Progress
                  value={(salesPlan.subscriptionsActual / salesPlan.subscriptionsTarget) * 100}
                  className="h-2 mb-2"
                />
                <div className="text-purple-400 text-xs">План: €{salesPlan.subscriptionsTarget}</div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900/90 border-gray-700/50 p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Package className="w-6 h-6 text-blue-400" />
                  Топ товаров
                </h3>
                <div className="space-y-3">
                  {salesPlan.topProducts.map((product, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl hover:border-blue-500/50 transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex-1">
                          <div className="text-white font-semibold mb-1">{product.name}</div>
                          <div className="text-gray-400 text-sm">Продано: {product.sold} шт.</div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-bold">€{product.revenue}</div>
                          <div className="text-green-400 text-sm">Комиссия: €{product.commission}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="bg-gray-900/90 border-gray-700/50 p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-purple-400" />
                  Топ абонементов
                </h3>
                <div className="space-y-3">
                  {salesPlan.topSubscriptions.map((sub, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl hover:border-purple-500/50 transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex-1">
                          <div className="text-white font-semibold mb-1">{sub.name}</div>
                          <div className="text-gray-400 text-sm">Продано: {sub.sold} шт.</div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-bold">€{sub.revenue}</div>
                          <div className="text-green-400 text-sm">Комиссия: €{sub.commission}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <Card className="bg-gradient-to-br from-indigo-900/50 to-indigo-800/30 border-indigo-500/30 p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Target className="w-6 h-6 text-indigo-400" />
                Условия мотивации по продажам
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-800/50 rounded-xl">
                  <div className="text-gray-400 text-sm mb-2">Процент с товаров</div>
                  <div className="text-indigo-400 font-bold text-2xl">20%</div>
                  <div className="text-gray-400 text-xs mt-1">От розничной цены</div>
                </div>
                <div className="p-4 bg-gray-800/50 rounded-xl">
                  <div className="text-gray-400 text-sm mb-2">Процент с абонементов</div>
                  <div className="text-purple-400 font-bold text-2xl">15%</div>
                  <div className="text-gray-400 text-xs mt-1">От стоимости абонемента</div>
                </div>
                <div className="p-4 bg-gray-800/50 rounded-xl">
                  <div className="text-gray-400 text-sm mb-2">Бонус за выполнение плана</div>
                  <div className="text-green-400 font-bold text-2xl">€250</div>
                  <div className="text-gray-400 text-xs mt-1">При 100% выполнении</div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Вкладка: Аналитика */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900/90 border-gray-700/50 p-6">
                <h3 className="text-lg font-bold text-white mb-4">Динамика заработка</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={earningsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }} />
                    <Line type="monotone" dataKey="earnings" stroke="#6366f1" strokeWidth={3} name="Выручка" />
                    <Line type="monotone" dataKey="tips" stroke="#10b981" strokeWidth={2} name="Чаевые" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              <Card className="bg-gray-900/90 border-gray-700/50 p-6">
                <h3 className="text-lg font-bold text-white mb-4">Распределение услуг</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={servicesData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label>
                      {servicesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-4">
                  {servicesData.map((service, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: service.color }} />
                      <span className="text-gray-400 text-sm">
                        {service.name}: {service.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {kpiData.map((kpi, idx) => (
                <Card key={idx} className="bg-gray-900/90 border-gray-700/50 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-indigo-500/20 rounded-xl">
                        <kpi.icon className="w-6 h-6 text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{kpi.name}</h3>
                        <p className="text-gray-400 text-sm">Текущий / Целевой</p>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-white">{kpi.completion}%</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Текущий: {kpi.current}</span>
                      <span className="text-gray-400">Цель: {kpi.target}</span>
                    </div>
                    <Progress value={kpi.completion} className="h-3" />
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Вкладка: Обучение */}
          <TabsContent value="training" className="space-y-6">
            <Card className="bg-gray-900/90 border-gray-700/50 p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                История обучений
              </h2>
              <div className="space-y-4">
                {trainings.map((training, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div
                        className={`p-3 rounded-xl ${
                          training.status === "completed"
                            ? "bg-green-500/20"
                            : training.status === "in-progress"
                              ? "bg-blue-500/20"
                              : "bg-purple-500/20"
                        }`}
                      >
                        {training.status === "completed" ? (
                          <CheckCircle2 className="w-6 h-6 text-green-400" />
                        ) : training.status === "in-progress" ? (
                          <BookOpen className="w-6 h-6 text-blue-400" />
                        ) : (
                          <Clock className="w-6 h-6 text-purple-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-semibold mb-1">{training.name}</div>
                        <div className="text-gray-400 text-sm">{training.date}</div>
                        {training.certificate && (
                          <div className="flex items-center gap-1 mt-1">
                            <Award className="w-3 h-3 text-yellow-400" />
                            <span className="text-yellow-400 text-xs">Сертификат получен</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      {training.score ? (
                        <>
                          <div className="text-2xl font-bold text-white mb-1">{training.score}%</div>
                          <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-lg border border-green-500/30">
                            Завершено
                          </span>
                        </>
                      ) : training.status === "in-progress" ? (
                        <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/30">
                          В процессе
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded-lg border border-purple-500/30">
                          Скоро начнется
                        </span>
                      )}
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
                <div className="text-gray-400 text-sm">Отработано за неделю</div>
              </Card>

              <Card className="bg-gradient-to-br from-purple-600/20 to-purple-900/20 border-purple-500/30 p-6">
                <Target className="w-8 h-8 text-purple-400 mb-3" />
                <div className="text-3xl font-bold text-white mb-1">{workingHours.monthHours}ч</div>
                <div className="text-gray-400 text-sm">Отработано за месяц</div>
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
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Clock className="w-6 h-6 text-indigo-400" />
                  Детализация рабочего времени
                </h3>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  <Settings className="w-4 h-4 mr-2" />
                  Настроить график
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-gray-800/50 border border-gray-700/50 rounded-xl">
                  <h4 className="text-white font-semibold mb-4">Прогресс по месяцу</h4>
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
                  <h4 className="text-white font-semibold mb-4">Разбивка времени</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-lg">
                      <span className="text-gray-400">Работа с клиентами</span>
                      <span className="text-white font-semibold">
                        {workingHours.monthHours - workingHours.breakHours - 20}ч
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                      <span className="text-gray-400">Подготовка/уборка</span>
                      <span className="text-white font-semibold">20ч</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                      <span className="text-gray-400">Перерывы</span>
                      <span className="text-white font-semibold">{workingHours.breakHours}ч</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-gray-900/90 border-gray-700/50 p-6">
              <h3 className="text-lg font-bold text-white mb-4">Настройки рабочего графика</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="bg-transparent justify-start h-auto p-4">
                  <div className="flex items-start gap-3 w-full">
                    <Settings className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                    <div className="text-left">
                      <div className="text-white font-semibold mb-1">Изменить рабочие часы</div>
                      <div className="text-gray-400 text-sm">Настройка графика работы</div>
                    </div>
                  </div>
                </Button>

                <Button variant="outline" className="bg-transparent justify-start h-auto p-4">
                  <div className="flex items-start gap-3 w-full">
                    <Calendar className="w-5 h-5 text-purple-400 flex-shrink-0 mt-1" />
                    <div className="text-left">
                      <div className="text-white font-semibold mb-1">Запросить выходной</div>
                      <div className="text-gray-400 text-sm">Подать заявку на отгул</div>
                    </div>
                  </div>
                </Button>

                <Button variant="outline" className="bg-transparent justify-start h-auto p-4">
                  <div className="flex items-start gap-3 w-full">
                    <Clock className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                    <div className="text-left">
                      <div className="text-white font-semibold mb-1">Учет переработок</div>
                      <div className="text-gray-400 text-sm">Просмотр и компенсация</div>
                    </div>
                  </div>
                </Button>

                <Button variant="outline" className="bg-transparent justify-start h-auto p-4">
                  <div className="flex items-start gap-3 w-full">
                    <Target className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-1" />
                    <div className="text-left">
                      <div className="text-white font-semibold mb-1">Установить цели</div>
                      <div className="text-gray-400 text-sm">Персональные KPI</div>
                    </div>
                  </div>
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
