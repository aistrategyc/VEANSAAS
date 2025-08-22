"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/app/(auth)/hooks/useAuth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Search, 
  Filter,
  Clock,
  User,
  Scissors,
  DollarSign,
  Phone,
  MoreHorizontal,
  Edit,
  Trash,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { ru } from "date-fns/locale"

interface Appointment {
  id: string
  clientName: string
  clientPhone: string
  masterName: string
  serviceName: string
  servicePrice: number
  date: string
  startTime: string
  endTime: string
  duration: number
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled" | "no_show"
  notes: string
  deposit: number
  createdAt: string
}

// Моковые данные
const mockAppointments: Appointment[] = [
  {
    id: "1",
    clientName: "Анна Петрова",
    clientPhone: "+7 (999) 123-45-67",
    masterName: "Иван Смирнов",
    serviceName: "Черно-белая татуировка",
    servicePrice: 15000,
    date: "2024-08-25",
    startTime: "14:00",
    endTime: "17:00",
    duration: 180,
    status: "confirmed",
    notes: "Татуировка на предплечье, эскиз готов",
    deposit: 5000,
    createdAt: "2024-08-20"
  },
  {
    id: "2",
    clientName: "Дмитрий Соколов", 
    clientPhone: "+7 (999) 234-56-78",
    masterName: "Андрей Новиков",
    serviceName: "Мужская стрижка",
    servicePrice: 1500,
    date: "2024-08-23",
    startTime: "16:00",
    endTime: "16:30",
    duration: 30,
    status: "in_progress",
    notes: "",
    deposit: 0,
    createdAt: "2024-08-23"
  },
  {
    id: "3",
    clientName: "Мария Козлова",
    clientPhone: "+7 (999) 345-67-89", 
    masterName: "Елена Волкова",
    serviceName: "Пирсинг уха",
    servicePrice: 2500,
    date: "2024-08-22",
    startTime: "15:30",
    endTime: "16:00",
    duration: 30,
    status: "completed",
    notes: "Второй пирсинг",
    deposit: 1000,
    createdAt: "2024-08-18"
  },
  {
    id: "4",
    clientName: "Алексей Морозов",
    clientPhone: "+7 (999) 456-78-90",
    masterName: "Иван Смирнов",
    serviceName: "Цветная татуировка",
    servicePrice: 25000,
    date: "2024-08-26",
    startTime: "10:00", 
    endTime: "14:00",
    duration: 240,
    status: "pending",
    notes: "Нужно подтвердить эскиз",
    deposit: 8000,
    createdAt: "2024-08-21"
  }
]

export default function AppointmentsPage() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments)
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>(mockAppointments)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [masterFilter, setMasterFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined)
  const [sortBy, setSortBy] = useState<string>("date")
  
  const masters = Array.from(new Set(appointments.map(a => a.masterName)))

  // Фильтрация и поиск
  useEffect(() => {
    let filtered = [...appointments]

    // Поиск по имени клиента или мастера
    if (searchQuery) {
      filtered = filtered.filter(appointment => 
        appointment.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.masterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.clientPhone.includes(searchQuery)
      )
    }

    // Фильтр по статусу
    if (statusFilter !== "all") {
      filtered = filtered.filter(appointment => appointment.status === statusFilter)
    }

    // Фильтр по мастеру
    if (masterFilter !== "all") {
      filtered = filtered.filter(appointment => appointment.masterName === masterFilter)
    }

    // Фильтр по дате
    if (dateFilter) {
      const filterDate = format(dateFilter, "yyyy-MM-dd")
      filtered = filtered.filter(appointment => appointment.date === filterDate)
    }

    // Сортировка
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(`${a.date} ${a.startTime}`).getTime() - new Date(`${b.date} ${b.startTime}`).getTime()
        case "client":
          return a.clientName.localeCompare(b.clientName)
        case "master":
          return a.masterName.localeCompare(b.masterName)
        case "price":
          return b.servicePrice - a.servicePrice
        default:
          return 0
      }
    })

    setFilteredAppointments(filtered)
  }, [appointments, searchQuery, statusFilter, masterFilter, dateFilter, sortBy])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Ожидает</Badge>
      case "confirmed":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Подтверждена</Badge>
      case "in_progress":
        return <Badge className="bg-purple-100 text-purple-800 border-purple-300">В процессе</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800 border-green-300">Завершена</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 border-red-300">Отменена</Badge>
      case "no_show":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-300">Не явился</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      weekday: 'short'
    })
  }

  const formatCurrency = (amount: number) => {
    return `₽${amount.toLocaleString()}`
  }

  const getStatusStats = () => {
    const stats = {
      total: appointments.length,
      pending: appointments.filter(a => a.status === "pending").length,
      confirmed: appointments.filter(a => a.status === "confirmed").length,
      inProgress: appointments.filter(a => a.status === "in_progress").length,
      completed: appointments.filter(a => a.status === "completed").length,
      totalRevenue: appointments.filter(a => a.status === "completed").reduce((sum, a) => sum + a.servicePrice, 0)
    }
    return stats
  }

  const stats = getStatusStats()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <CalendarIcon className="h-8 w-8 text-purple-600" />
            Записи
          </h1>
          <p className="text-gray-600 mt-1">
            Управление записями и расписанием мастеров
          </p>
        </div>
        
        <Link href="/appointments/new">
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
            <Plus className="h-4 w-4 mr-2" />
            Новая запись
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
              <p className="text-sm text-gray-600">Всего записей</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              <p className="text-sm text-gray-600">Ожидают</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{stats.confirmed}</p>
              <p className="text-sm text-gray-600">Подтверждены</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              <p className="text-sm text-gray-600">Завершены</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-indigo-500">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-indigo-600">{formatCurrency(stats.totalRevenue)}</p>
              <p className="text-sm text-gray-600">Выручка</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Поиск по клиенту, мастеру, услуге или телефону..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все статусы</SelectItem>
                  <SelectItem value="pending">Ожидают</SelectItem>
                  <SelectItem value="confirmed">Подтверждены</SelectItem>
                  <SelectItem value="in_progress">В процессе</SelectItem>
                  <SelectItem value="completed">Завершены</SelectItem>
                  <SelectItem value="cancelled">Отменены</SelectItem>
                </SelectContent>
              </Select>

              <Select value={masterFilter} onValueChange={setMasterFilter}>
                <SelectTrigger className="w-[150px]">
                  <User className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Мастер" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все мастера</SelectItem>
                  {masters.map((master) => (
                    <SelectItem key={master} value={master}>{master}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[150px]">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {dateFilter ? format(dateFilter, "dd.MM.yyyy") : "Дата"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateFilter}
                    onSelect={setDateFilter}
                    disabled={(date) => date < new Date("1900-01-01")}
                    initialFocus
                  />
                  <div className="p-3 border-t">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setDateFilter(undefined)}
                      className="w-full"
                    >
                      Сбросить
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Сортировка" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">По дате</SelectItem>
                  <SelectItem value="client">По клиенту</SelectItem>
                  <SelectItem value="master">По мастеру</SelectItem>
                  <SelectItem value="price">По цене</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointments List */}
      <Card>
        <CardHeader>
          <CardTitle>Записи ({filteredAppointments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-8">
              <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Записи не найдены</h3>
              <p className="text-gray-600">Попробуйте изменить параметры поиска или фильтры</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <div key={appointment.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                        <CalendarIcon className="h-6 w-6 text-purple-600" />
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-lg">
                          {appointment.clientName}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Phone className="h-3 w-3" />
                            <span>{appointment.clientPhone}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <User className="h-3 w-3" />
                            <span>{appointment.masterName}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Scissors className="h-3 w-3" />
                            <span>{appointment.serviceName}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6 text-sm">
                      <div className="text-center">
                        <div className="font-semibold">{formatDate(appointment.date)}</div>
                        <div className="text-gray-600">
                          {appointment.startTime} - {appointment.endTime}
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="font-semibold">{formatCurrency(appointment.servicePrice)}</div>
                        {appointment.deposit > 0 && (
                          <div className="text-gray-600 text-xs">
                            Депозит: {formatCurrency(appointment.deposit)}
                          </div>
                        )}
                      </div>

                      <div className="text-center">
                        {getStatusBadge(appointment.status)}
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/appointments/${appointment.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/appointments/${appointment.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>

                  {appointment.notes && (
                    <div className="mt-3 pl-16">
                      <p className="text-sm text-gray-600 italic">{appointment.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}