"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/app/(auth)/hooks/useAuth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Users,
  ChevronLeft,
  ChevronRight,
  Plus,
  Eye,
  Edit,
  User,
  Phone,
  Scissors
} from "lucide-react"
import Link from "next/link"
import { format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay, parseISO } from "date-fns"
import { ru } from "date-fns/locale"

interface ScheduleAppointment {
  id: string
  clientName: string
  clientPhone: string
  serviceName: string
  servicePrice: number
  startTime: string
  endTime: string
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled"
  notes: string
  masterId: string
  masterName: string
}

interface Master {
  id: string
  name: string
  specialization: string[]
  color: string
  workingHours: {
    start: string
    end: string
  }
}

// Моковые данные
const mockMasters: Master[] = [
  {
    id: "1",
    name: "Иван Смирнов",
    specialization: ["Черно-белые татуировки", "Реализм"],
    color: "#8B5CF6", // purple-500
    workingHours: { start: "10:00", end: "19:00" }
  },
  {
    id: "2", 
    name: "Елена Волкова",
    specialization: ["Пирсинг"],
    color: "#EC4899", // pink-500  
    workingHours: { start: "11:00", end: "20:00" }
  },
  {
    id: "3",
    name: "Андрей Новиков", 
    specialization: ["Мужские стрижки"],
    color: "#3B82F6", // blue-500
    workingHours: { start: "09:00", end: "18:00" }
  }
]

const mockAppointments: ScheduleAppointment[] = [
  {
    id: "1",
    clientName: "Анна Петрова",
    clientPhone: "+7 (999) 123-45-67",
    serviceName: "Черно-белая татуировка",
    servicePrice: 15000,
    startTime: "2024-08-25T14:00:00",
    endTime: "2024-08-25T17:00:00",
    status: "confirmed",
    notes: "Татуировка на предплечье",
    masterId: "1",
    masterName: "Иван Смирнов"
  },
  {
    id: "2",
    clientName: "Дмитрий Соколов",
    clientPhone: "+7 (999) 234-56-78",
    serviceName: "Мужская стрижка",
    servicePrice: 1500,
    startTime: "2024-08-23T16:00:00",
    endTime: "2024-08-23T16:30:00",
    status: "in_progress",
    notes: "",
    masterId: "3",
    masterName: "Андрей Новиков"
  },
  {
    id: "3",
    clientName: "Мария Козлова",
    clientPhone: "+7 (999) 345-67-89",
    serviceName: "Пирсинг уха",
    servicePrice: 2500,
    startTime: "2024-08-23T15:30:00", 
    endTime: "2024-08-23T16:00:00",
    status: "completed",
    notes: "",
    masterId: "2",
    masterName: "Елена Волкова"
  },
  {
    id: "4",
    clientName: "Алексей Морозов",
    clientPhone: "+7 (999) 456-78-90",
    serviceName: "Цветная татуировка",
    servicePrice: 25000,
    startTime: "2024-08-26T10:00:00",
    endTime: "2024-08-26T14:00:00",
    status: "pending",
    notes: "Нужно подтвердить эскиз",
    masterId: "1", 
    masterName: "Иван Смирнов"
  },
  {
    id: "5",
    clientName: "Светлана Иванова",
    clientPhone: "+7 (999) 567-89-01",
    serviceName: "Мужская стрижка + борода",
    servicePrice: 2200,
    startTime: "2024-08-24T11:00:00",
    endTime: "2024-08-24T12:00:00",
    status: "confirmed",
    notes: "",
    masterId: "3",
    masterName: "Андрей Новиков"
  }
]

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30", "20:00", "20:30"
]

export default function SchedulePage() {
  const { user } = useAuth()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedMaster, setSelectedMaster] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"day" | "week">("week")
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }))

  const getWeekDays = () => {
    const days = []
    for (let i = 0; i < 7; i++) {
      days.push(addDays(currentWeek, i))
    }
    return days
  }

  const weekDays = getWeekDays()

  const getAppointmentsForDateAndMaster = (date: Date, masterId?: string) => {
    return mockAppointments.filter(appointment => {
      const appointmentDate = parseISO(appointment.startTime)
      const dateMatch = isSameDay(appointmentDate, date)
      const masterMatch = !masterId || masterId === "all" || appointment.masterId === masterId
      return dateMatch && masterMatch
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500"
      case "confirmed": return "bg-blue-500"  
      case "in_progress": return "bg-purple-500"
      case "completed": return "bg-green-500"
      case "cancelled": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 text-xs">Ожидает</Badge>
      case "confirmed":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300 text-xs">Подтверждена</Badge>
      case "in_progress":
        return <Badge className="bg-purple-100 text-purple-800 border-purple-300 text-xs">В процессе</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800 border-green-300 text-xs">Завершена</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 border-red-300 text-xs">Отменена</Badge>
      default:
        return <Badge variant="secondary" className="text-xs">{status}</Badge>
    }
  }

  const formatTime = (dateTime: string) => {
    return format(parseISO(dateTime), "HH:mm")
  }

  const formatCurrency = (amount: number) => {
    return `₽${amount.toLocaleString()}`
  }

  const nextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1))
  }

  const prevWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1))
  }

  const todayAppointments = getAppointmentsForDateAndMaster(new Date())
  const selectedMasterData = mockMasters.find(m => m.id === selectedMaster)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <CalendarIcon className="h-8 w-8 text-purple-600" />
            Расписание
          </h1>
          <p className="text-gray-600 mt-1">
            Календарь записей и управление расписанием мастеров
          </p>
        </div>
        
        <Link href="/appointments/new">
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
            <Plus className="h-4 w-4 mr-2" />
            Новая запись
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Записей сегодня</p>
                <p className="text-2xl font-bold text-blue-600">{todayAppointments.length}</p>
              </div>
              <CalendarIcon className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Завершено</p>
                <p className="text-2xl font-bold text-green-600">
                  {todayAppointments.filter(a => a.status === "completed").length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Активных мастеров</p>
                <p className="text-2xl font-bold text-purple-600">{mockMasters.length}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-indigo-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Выручка сегодня</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {formatCurrency(todayAppointments.reduce((sum, a) => sum + a.servicePrice, 0))}
                </p>
              </div>
              <CalendarIcon className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={prevWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-semibold text-lg min-w-[200px] text-center">
              {format(currentWeek, "d MMMM", { locale: ru })} - {format(addDays(currentWeek, 6), "d MMMM yyyy", { locale: ru })}
            </span>
            <Button variant="outline" size="sm" onClick={nextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setCurrentWeek(startOfWeek(new Date(), { weekStartsOn: 1 }))}
          >
            Сегодня
          </Button>
        </div>

        <div className="flex gap-4">
          <Select value={selectedMaster} onValueChange={setSelectedMaster}>
            <SelectTrigger className="w-[200px]">
              <User className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Все мастера" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все мастера</SelectItem>
              {mockMasters.map((master) => (
                <SelectItem key={master.id} value={master.id}>
                  {master.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex rounded-md overflow-hidden border">
            <Button
              variant={viewMode === "day" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("day")}
              className="rounded-none"
            >
              День
            </Button>
            <Button
              variant={viewMode === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("week")}
              className="rounded-none"
            >
              Неделя
            </Button>
          </div>
        </div>
      </div>

      {/* Masters Legend */}
      {selectedMaster === "all" && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              {mockMasters.map((master) => (
                <div key={master.id} className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: master.color }}
                  />
                  <span className="text-sm font-medium">{master.name}</span>
                  <span className="text-xs text-gray-500">({master.specialization.join(", ")})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Schedule Grid */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header with days */}
              <div className="grid grid-cols-8 border-b bg-gray-50">
                <div className="p-4 font-medium text-gray-600">Время</div>
                {weekDays.map((day, index) => (
                  <div key={index} className="p-4 text-center">
                    <div className="font-medium text-gray-900">
                      {format(day, "EEE", { locale: ru })}
                    </div>
                    <div className="text-sm text-gray-500">
                      {format(day, "d MMM", { locale: ru })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Time slots */}
              <div className="divide-y">
                {timeSlots.map((timeSlot) => (
                  <div key={timeSlot} className="grid grid-cols-8 min-h-[80px]">
                    <div className="p-4 border-r bg-gray-50 font-mono text-sm text-gray-600">
                      {timeSlot}
                    </div>
                    {weekDays.map((day, dayIndex) => {
                      const dayAppointments = getAppointmentsForDateAndMaster(day, selectedMaster === "all" ? undefined : selectedMaster)
                        .filter(appointment => {
                          const startTime = format(parseISO(appointment.startTime), "HH:mm")
                          return startTime === timeSlot
                        })

                      return (
                        <div key={dayIndex} className="p-2 border-r border-l min-h-[80px] relative">
                          {dayAppointments.map((appointment) => {
                            const master = mockMasters.find(m => m.id === appointment.masterId)
                            const duration = (parseISO(appointment.endTime).getTime() - parseISO(appointment.startTime).getTime()) / (1000 * 60)
                            const heightPerMinute = 80 / 30 // 80px height per 30-minute slot
                            const height = Math.max(duration * heightPerMinute / 30, 60)

                            return (
                              <div
                                key={appointment.id}
                                className="absolute inset-x-2 rounded-md p-2 text-white text-xs cursor-pointer hover:opacity-90 transition-opacity"
                                style={{ 
                                  backgroundColor: master?.color || "#6B7280",
                                  height: `${height}px`,
                                  zIndex: 10
                                }}
                                onClick={() => window.open(`/appointments/${appointment.id}`, '_blank')}
                              >
                                <div className="font-semibold truncate">
                                  {appointment.clientName}
                                </div>
                                <div className="truncate opacity-90">
                                  {appointment.serviceName}
                                </div>
                                <div className="flex items-center justify-between mt-1">
                                  <span>{formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}</span>
                                  <div className={`w-2 h-2 rounded-full ${getStatusColor(appointment.status)}`} />
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today's Appointments (Sidebar-like) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-purple-600" />
            Записи на сегодня ({todayAppointments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {todayAppointments.length === 0 ? (
            <div className="text-center py-8">
              <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Записей на сегодня нет</h3>
              <p className="text-gray-600">Отличный день для отдыха!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayAppointments
                .sort((a, b) => parseISO(a.startTime).getTime() - parseISO(b.startTime).getTime())
                .map((appointment) => {
                  const master = mockMasters.find(m => m.id === appointment.masterId)
                  
                  return (
                    <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: master?.color || "#6B7280" }}
                        />
                        <div>
                          <h4 className="font-medium text-sm">{appointment.clientName}</h4>
                          <div className="text-xs text-gray-600 flex items-center gap-2">
                            <span>{appointment.serviceName}</span>
                            <span>•</span>
                            <span>{master?.name}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 text-sm">
                        <span className="font-mono">
                          {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                        </span>
                        {getStatusBadge(appointment.status)}
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/appointments/${appointment.id}`}>
                            <Eye className="h-3 w-3" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  )
                })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}