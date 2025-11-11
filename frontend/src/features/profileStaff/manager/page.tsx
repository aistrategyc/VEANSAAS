"use client"
import {
  Users,
  Target,
  TrendingUp,
  DollarSign,
  Briefcase,
  BarChart3,
  CheckCircle2,
  Activity,
  CalendarIcon,
  Euro,
  Wallet,
  CreditCard,
  Calendar,
  PiggyBank,
  TrendingDown,
  FileText,
  User,
  Building,
  ShoppingBag,
  Award,
  AlertCircle,
  Clock,
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

export default function ManagerProfilePage() {
  const walletData = {
    balance: 8500,
    pending: 1200,
    monthlyEarnings: 5200,
    companyLoan: {
      amount: 10000,
      paid: 4000,
      remaining: 6000,
      monthlyPayment: 1000,
      nextPayment: "2024-05-01",
    },
    withdrawHistory: [
      { date: "2024-04-15", amount: 2500, status: "completed" },
      { date: "2024-04-01", amount: 2400, status: "completed" },
      { date: "2024-03-15", amount: 2200, status: "completed" },
    ],
  }

  const motivationPlan = {
    baseSalary: 3000,
    bonusStructure: [
      { criteria: "Выполнение плана выручки > 95%", bonus: 800, achieved: true },
      { criteria: "Эффективность команды > 90%", bonus: 600, achieved: true },
      { criteria: "Завершение проектов вовремя", bonus: 500, achieved: true },
      { criteria: "Рост выручки > 10%", bonus: 400, achieved: true },
      { criteria: "Удовлетворенность команды > 4.5", bonus: 300, achieved: false },
    ],
    totalBonus: 2300,
    teamBonus: 800,
    achievements: [
      { title: "Менеджер года", bonus: 1000, date: "2023-12" },
      { title: "Лучший рост команды", bonus: 500, date: "2024-03" },
    ],
  }

  const vacationData = {
    totalDays: 30,
    usedDays: 8,
    plannedDays: 7,
    availableDays: 15,
    sickDays: {
      total: 15,
      used: 2,
      remaining: 13,
    },
    upcomingVacations: [{ startDate: "2024-07-01", endDate: "2024-07-07", days: 7, status: "approved" }],
    history: [
      { startDate: "2024-01-15", endDate: "2024-01-22", days: 8, type: "vacation", status: "completed" },
      { startDate: "2024-03-10", endDate: "2024-03-11", days: 2, type: "sick", status: "completed" },
    ],
  }

  const personalData = {
    fullName: "Дмитрий Андреевич Волков",
    position: "Менеджер",
    department: "Управление",
    hireDate: "2020-03-01",
    contractType: "Бессрочный",
    workSchedule: "5/2, 09:00-19:00",
    studio: "Все студии",
    manager: "Генеральный директор",
    salary: 3000,
    taxId: "7712345679",
    socialInsurance: "123-456-790 00",
  }

  const salesPlan = {
    products: [
      { name: "Абонементы Premium", plan: 80, current: 72, commission: 25 },
      { name: "Корпоративные пакеты", plan: 50, current: 48, commission: 30 },
      { name: "Косметика премиум", plan: 100, current: 85, commission: 15 },
      { name: "Подарочные сертификаты", plan: 60, current: 55, commission: 20 },
    ],
    totalPlan: 35000,
    totalCurrent: 31500,
    totalCommission: 3150,
  }

  const performanceMetrics = [
    { metric: "Выручка команды", value: 48500, plan: 45000, growth: 15, unit: "€" },
    { metric: "Проекты завершены", value: 18, plan: 15, growth: 20, unit: "" },
    { metric: "Эффективность команды", value: 91, plan: 90, growth: 5, unit: "%" },
    { metric: "NPS команды", value: 82, plan: 75, growth: 9, unit: "" },
  ]

  const extendedPlans = [
    {
      category: "Выручка",
      plan: 50000,
      current: 48500,
      status: "on-track",
      deadline: "2024-05-31",
      growth: 15,
    },
    {
      category: "Новые клиенты",
      plan: 150,
      current: 142,
      status: "on-track",
      deadline: "2024-05-31",
      growth: 22,
    },
    {
      category: "Повторные визиты",
      plan: 400,
      current: 385,
      status: "at-risk",
      deadline: "2024-05-31",
      growth: 8,
    },
    {
      category: "Средний чек",
      plan: 150,
      current: 145,
      status: "on-track",
      deadline: "2024-05-31",
      growth: 5,
    },
  ]

  // Моковые данные менеджера
  const managerData = {
    name: "Дмитрий Волков",
    role: "Менеджер",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dmitry",
    experience: "4 года",
    teamSize: 12,
    projectsActive: 5,
    teamEfficiency: 91,
    monthlyRevenue: 48500,
    revenueGrowth: 15,
  }

  // Проекты
  const projects = [
    { name: "Расширение студии на Невском", progress: 75, deadline: "2024-05-15", budget: 15000, status: "on-track" },
    { name: "Запуск новой линейки услуг", progress: 60, deadline: "2024-06-01", budget: 8000, status: "on-track" },
    { name: "Обучение новых мастеров", progress: 40, deadline: "2024-05-30", budget: 5000, status: "at-risk" },
    { name: "Маркетинговая кампания", progress: 85, deadline: "2024-05-10", budget: 12000, status: "ahead" },
    { name: "Оптимизация процессов", progress: 30, deadline: "2024-07-01", budget: 6000, status: "on-track" },
  ]

  // Команда
  const teamMembers = [
    { name: "Анна Петрова", role: "Тату мастер", performance: 95, revenue: 4830, efficiency: 92 },
    { name: "Ольга Сергеева", role: "Администратор", performance: 94, revenue: 0, efficiency: 94 },
    { name: "Мария Иванова", role: "Мастер маникюра", performance: 89, revenue: 3650, efficiency: 88 },
    { name: "Елена Смирнова", role: "Косметолог", performance: 92, revenue: 4120, efficiency: 90 },
  ]

  // Финансовая динамика
  const revenueData = [
    { month: "Янв", revenue: 38000, expenses: 28000, profit: 10000 },
    { month: "Фев", revenue: 42000, expenses: 29000, profit: 13000 },
    { month: "Мар", revenue: 45000, expenses: 30000, profit: 15000 },
    { month: "Апр", revenue: 48500, expenses: 31000, profit: 17500 },
  ]

  // Распределение бюджета
  const budgetDistribution = [
    { category: "Зарплаты", amount: 25000, color: "#6366f1" },
    { category: "Материалы", amount: 8000, color: "#8b5cf6" },
    { category: "Маркетинг", amount: 6000, color: "#a855f7" },
    { category: "Аренда", amount: 5000, color: "#c084fc" },
    { category: "Прочее", amount: 4500, color: "#e0a0ff" },
  ]

  // КПИ команды
  const teamKPI = [
    { metric: "Средний чек", value: 145, target: 150, unit: "€" },
    { metric: "Конверсия", value: 68, target: 70, unit: "%" },
    { metric: "Повторные клиенты", value: 42, target: 50, unit: "%" },
    { metric: "Удовлетворенность", value: 4.7, target: 4.8, unit: "/5" },
  ]

  const workingHours = {
    todayHours: 9,
    weekHours: 45,
    monthHours: 192,
    plannedHours: 176,
    overtimeHours: 16,
    breakHours: 5,
    efficiency: 98,
  }

  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case "ahead":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "on-track":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "at-risk":
        return "bg-red-500/20 text-red-400 border-red-500/30"
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
                  src={managerData.avatar || "/placeholder.svg"}
                  alt={managerData.name}
                  className="w-24 h-24 rounded-2xl border-2 border-purple-500/50"
                />
                <div className="absolute -bottom-2 -right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-lg font-semibold">
                  Manager
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">{managerData.name}</h1>
                <p className="text-gray-400 mb-2">
                  {managerData.role} • {managerData.experience}
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-purple-400" />
                    <span className="text-white font-semibold">{managerData.teamSize}</span>
                    <span className="text-gray-400 text-sm">человек в команде</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Briefcase className="w-4 h-4 mr-2" />
                Создать проект
              </Button>
              <Button variant="outline" className="border-gray-700 bg-transparent">
                <BarChart3 className="w-4 h-4 mr-2" />
                Отчеты
              </Button>
            </div>
          </div>
        </Card>

        {/* Быстрая статистика */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-purple-600/20 to-purple-900/20 border-purple-500/30 p-6 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 text-purple-400" />
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">€{managerData.monthlyRevenue.toLocaleString()}</div>
            <div className="text-gray-400 text-sm">Выручка за месяц</div>
            <div className="text-green-400 text-xs mt-1">+{managerData.revenueGrowth}% к прошлому месяцу</div>
          </Card>

          <Card className="bg-gradient-to-br from-blue-600/20 to-blue-900/20 border-blue-500/30 p-6 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <Briefcase className="w-8 h-8 text-blue-400" />
              <Activity className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{managerData.projectsActive}</div>
            <div className="text-gray-400 text-sm">Активных проектов</div>
            <div className="text-blue-400 text-xs mt-1">2 завершаются в мае</div>
          </Card>

          <Card className="bg-gradient-to-br from-green-600/20 to-green-900/20 border-green-500/30 p-6 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-green-400" />
              <CheckCircle2 className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{managerData.teamSize}</div>
            <div className="text-gray-400 text-sm">Размер команды</div>
            <div className="text-green-400 text-xs mt-1">{managerData.teamEfficiency}% эффективность</div>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-600/20 to-indigo-900/20 border-indigo-500/30 p-6 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8 text-indigo-400" />
              <Activity className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{managerData.teamEfficiency}%</div>
            <div className="text-gray-400 text-sm">Эффективность команды</div>
            <Progress value={managerData.teamEfficiency} className="mt-2 h-2" />
          </Card>
        </div>

        {/* Основной контент */}
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="bg-gray-800/50 border border-gray-700/50">
            <TabsTrigger value="projects">Проекты</TabsTrigger>
            <TabsTrigger value="team">Команда</TabsTrigger>
            <TabsTrigger value="finance">Финансы</TabsTrigger>
            <TabsTrigger value="kpi">КПИ</TabsTrigger>
            <TabsTrigger value="wallet">Кошелек</TabsTrigger>
            <TabsTrigger value="motivation">Мотивация</TabsTrigger>
            <TabsTrigger value="hours">Рабочие часы</TabsTrigger>
            <TabsTrigger value="vacation">Отпуска</TabsTrigger>
            <TabsTrigger value="personal">Личные данные</TabsTrigger>
            <TabsTrigger value="sales">Планы продаж</TabsTrigger>
            <TabsTrigger value="metrics">Метрики</TabsTrigger>
          </TabsList>

          {/* Вкладка: Проекты */}
          <TabsContent value="projects" className="space-y-6">
            <Card className="bg-gray-900/90 border-gray-700/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-purple-400" />
                  Активные проекты
                </h2>
              </div>

              <div className="space-y-4">
                {projects.map((project, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl hover:border-purple-500/50 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="text-white font-semibold mb-1">{project.name}</div>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <CalendarIcon className="w-3 h-3" />
                            {project.deadline}
                          </span>
                          <span className="flex items-center gap-1">
                            <Euro className="w-3 h-3" />€{project.budget.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-lg border ${getProjectStatusColor(project.status)}`}>
                        {project.status === "ahead" && "Опережает график"}
                        {project.status === "on-track" && "По плану"}
                        {project.status === "at-risk" && "Есть риски"}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Прогресс</span>
                        <span className="text-white font-semibold">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Вкладка: Команда */}
          <TabsContent value="team" className="space-y-6">
            <Card className="bg-gray-900/90 border-gray-700/50 p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                Производительность команды
              </h2>

              <div className="space-y-4">
                {teamMembers.map((member, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl hover:border-purple-500/50 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="text-white font-semibold">{member.name}</div>
                        <div className="text-gray-400 text-sm">{member.role}</div>
                      </div>
                      <div className="text-right">
                        {member.revenue > 0 && <div className="text-white font-bold">€{member.revenue}</div>}
                        <div className="text-gray-400 text-sm">Производительность: {member.performance}%</div>
                      </div>
                    </div>
                    <Progress value={member.efficiency} className="h-2" />
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Вкладка: Финансы */}
          <TabsContent value="finance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900/90 border-gray-700/50 p-6">
                <h3 className="text-lg font-bold text-white mb-4">Финансовая динамика</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }} />
                    <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} name="Выручка" />
                    <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} name="Прибыль" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              <Card className="bg-gray-900/90 border-gray-700/50 p-6">
                <h3 className="text-lg font-bold text-white mb-4">Распределение бюджета</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={budgetDistribution} cx="50%" cy="50%" outerRadius={100} dataKey="amount" label>
                      {budgetDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-4">
                  {budgetDistribution.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-gray-400 text-sm">{item.category}</span>
                      </div>
                      <span className="text-white font-semibold">€{item.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Вкладка: КПИ */}
          <TabsContent value="kpi" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {teamKPI.map((kpi, idx) => (
                <Card key={idx} className="bg-gray-900/90 border-gray-700/50 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold">{kpi.metric}</h3>
                    <div className="text-2xl font-bold text-white">
                      {kpi.value}
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
                    <Progress value={(kpi.value / kpi.target) * 100} className="h-3" />
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
              <Card className="bg-gradient-to-br from-purple-600/20 to-purple-900/20 border-purple-500/30 p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <PiggyBank className="w-6 h-6 text-purple-400" />
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
                      <span className="text-gray-400">Личные бонусы</span>
                      <span className="text-green-400 font-bold text-xl">€{motivationPlan.totalBonus}</span>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Бонус от команды</span>
                      <span className="text-blue-400 font-bold text-xl">€{motivationPlan.teamBonus}</span>
                    </div>
                  </div>
                  <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Итого за месяц</span>
                      <span className="text-white font-bold text-2xl">
                        €{motivationPlan.baseSalary + motivationPlan.totalBonus + motivationPlan.teamBonus}
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
              <Card className="bg-gradient-to-br from-purple-600/20 to-purple-900/20 border-purple-500/30 p-6">
                <Clock className="w-8 h-8 text-purple-400 mb-3" />
                <div className="text-3xl font-bold text-white mb-1">{workingHours.todayHours}ч</div>
                <div className="text-gray-400 text-sm">Сегодня</div>
              </Card>

              <Card className="bg-gradient-to-br from-blue-600/20 to-blue-900/20 border-blue-500/30 p-6">
                <Activity className="w-8 h-8 text-blue-400 mb-3" />
                <div className="text-3xl font-bold text-white mb-1">{workingHours.weekHours}ч</div>
                <div className="text-gray-400 text-sm">За неделю</div>
              </Card>

              <Card className="bg-gradient-to-br from-green-600/20 to-green-900/20 border-green-500/30 p-6">
                <Target className="w-8 h-8 text-green-400 mb-3" />
                <div className="text-3xl font-bold text-white mb-1">{workingHours.monthHours}ч</div>
                <div className="text-gray-400 text-sm">За месяц</div>
                <div className="text-green-400 text-xs mt-1">План: {workingHours.plannedHours}ч</div>
              </Card>

              <Card className="bg-gradient-to-br from-indigo-600/20 to-indigo-900/20 border-indigo-500/30 p-6">
                <TrendingUp className="w-8 h-8 text-indigo-400 mb-3" />
                <div className="text-3xl font-bold text-white mb-1">{workingHours.overtimeHours}ч</div>
                <div className="text-gray-400 text-sm">Переработка</div>
              </Card>
            </div>

            <Card className="bg-gray-900/90 border-gray-700/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Управление рабочим временем</h3>
                <div className="flex gap-2">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Settings className="w-4 h-4 mr-2" />
                    Настроить график
                  </Button>
                  <Button variant="outline" className="bg-transparent">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Отчет
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-gray-800/50 border border-gray-700/50 rounded-xl">
                  <h4 className="text-white font-semibold mb-4">Прогресс</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Выполнено</span>
                        <span className="text-white font-semibold">
                          {workingHours.monthHours}ч / {workingHours.plannedHours}ч
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

                <div className="p-6 bg-gray-800/50 border border-gray-700/50 rounded-xl col-span-2">
                  <h4 className="text-white font-semibold mb-4">Быстрые действия</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="bg-transparent justify-start h-auto p-3">
                      <div className="flex items-center gap-2 w-full">
                        <Calendar className="w-4 h-4 text-purple-400" />
                        <span className="text-sm">График работы</span>
                      </div>
                    </Button>
                    <Button variant="outline" className="bg-transparent justify-start h-auto p-3">
                      <div className="flex items-center gap-2 w-full">
                        <Clock className="w-4 h-4 text-blue-400" />
                        <span className="text-sm">Переработки</span>
                      </div>
                    </Button>
                    <Button variant="outline" className="bg-transparent justify-start h-auto p-3">
                      <div className="flex items-center gap-2 w-full">
                        <Target className="w-4 h-4 text-green-400" />
                        <span className="text-sm">Цели и KPI</span>
                      </div>
                    </Button>
                    <Button variant="outline" className="bg-transparent justify-start h-auto p-3">
                      <div className="flex items-center gap-2 w-full">
                        <Users className="w-4 h-4 text-indigo-400" />
                        <span className="text-sm">График команды</span>
                      </div>
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
                <User className="w-6 h-6 text-purple-400" />
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
                      <Building className="w-4 h-4 text-purple-400" />
                      {personalData.studio}
                    </div>
                  </div>
                  <div className="p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl">
                    <div className="text-gray-400 text-sm mb-1">Руководитель</div>
                    <div className="text-white font-semibold flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-blue-400" />
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
                  <ShoppingBag className="w-6 h-6 text-purple-400" />
                  План продаж премиум-услуг
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
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6">
            <Card className="bg-gray-900/90 border-gray-700/50 p-6">
              <h3 className="text-xl font-bold text-white mb-6">Расширенные планы и статус выполнения</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {extendedPlans.map((plan, idx) => (
                  <Card key={idx} className="bg-gray-800/50 border-gray-700/50 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-white font-semibold">{plan.category}</h4>
                      <span
                        className={`text-xs px-3 py-1 rounded-lg border ${
                          plan.status === "on-track"
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : "bg-red-500/20 text-red-400 border-red-500/30"
                        }`}
                      >
                        {plan.status === "on-track" ? "По плану" : "Есть риски"}
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-end">
                        <div>
                          <div className="text-gray-400 text-sm">Текущее</div>
                          <div className="text-2xl font-bold text-white">{plan.current}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-gray-400 text-sm">План</div>
                          <div className="text-xl font-bold text-gray-300">{plan.plan}</div>
                        </div>
                        <div className="flex items-center gap-1 text-green-400">
                          <TrendingUp className="w-4 h-4" />
                          <span className="text-sm font-semibold">+{plan.growth}%</span>
                        </div>
                      </div>
                      <Progress value={(plan.current / plan.plan) * 100} className="h-3" />
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <CalendarIcon className="w-4 h-4" />
                        <span>Дедлайн: {plan.deadline}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>

            <Card className="bg-gray-900/90 border-gray-700/50 p-6">
              <h3 className="text-lg font-bold text-white mb-4">Ключевые метрики производительности</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {performanceMetrics.map((metric, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl hover:border-purple-500/50 transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-white font-semibold">{metric.metric}</div>
                      <div className="flex items-center gap-1 text-green-400 text-sm">
                        <TrendingUp className="w-4 h-4" />+{metric.growth}%
                      </div>
                    </div>
                    <div className="flex items-end justify-between mb-2">
                      <div>
                        <div className="text-3xl font-bold text-white">
                          {metric.value}
                          {metric.unit}
                        </div>
                        <div className="text-gray-400 text-sm">
                          План: {metric.plan}
                          {metric.unit}
                        </div>
                      </div>
                      <Progress
                        value={
                          metric.unit === "€" ? (metric.value / metric.plan) * 100 : (metric.value / metric.plan) * 100
                        }
                        className="h-2 w-24"
                      />
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
