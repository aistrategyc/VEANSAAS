"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/app/(auth)/hooks/useAuth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  Phone,
  Mail,
  Calendar,
  Star,
  MoreHorizontal,
  Edit,
  Trash,
  Eye,
  UserPlus,
  Scissors,
  Heart,
  Crown,
  Shield,
  User
} from "lucide-react"
import Link from "next/link"

interface Employee {
  id: string
  firstName: string
  lastName: string
  phone: string
  email: string
  role: "owner" | "master_owner" | "manager" | "administrator" | "master"
  specialization: string[]
  avatar?: string
  totalClients: number
  monthlyRevenue: number
  rating: number
  totalReviews: number
  status: "active" | "inactive" | "on_vacation"
  hireDate: string
  workingHours: string
  salary: number
  commission: number
  createdAt: string
}

// Моковые данные
const mockEmployees: Employee[] = [
  {
    id: "1",
    firstName: "Иван",
    lastName: "Смирнов", 
    phone: "+7 (999) 111-11-11",
    email: "ivan.smirnov@studio.com",
    role: "master",
    specialization: ["Черно-белые татуировки", "Реализм", "Графика"],
    totalClients: 45,
    monthlyRevenue: 180000,
    rating: 4.9,
    totalReviews: 127,
    status: "active",
    hireDate: "2023-01-15",
    workingHours: "10:00-19:00",
    salary: 0,
    commission: 60,
    createdAt: "2023-01-15"
  },
  {
    id: "2",
    firstName: "Елена", 
    lastName: "Волкова",
    phone: "+7 (999) 222-22-22",
    email: "elena.volkova@studio.com",
    role: "master",
    specialization: ["Пирсинг", "Украшения"],
    totalClients: 32,
    monthlyRevenue: 95000,
    rating: 4.8,
    totalReviews: 89,
    status: "active",
    hireDate: "2023-03-20",
    workingHours: "11:00-20:00",
    salary: 0,
    commission: 55,
    createdAt: "2023-03-20"
  },
  {
    id: "3",
    firstName: "Андрей",
    lastName: "Новиков",
    phone: "+7 (999) 333-33-33", 
    email: "andrey.novikov@studio.com",
    role: "master",
    specialization: ["Мужские стрижки", "Борода", "Усы"],
    totalClients: 78,
    monthlyRevenue: 125000,
    rating: 4.7,
    totalReviews: 156,
    status: "active",
    hireDate: "2022-08-10",
    workingHours: "09:00-18:00",
    salary: 0,
    commission: 50,
    createdAt: "2022-08-10"
  },
  {
    id: "4",
    firstName: "Мария",
    lastName: "Петрова",
    phone: "+7 (999) 444-44-44",
    email: "maria.petrova@studio.com", 
    role: "administrator",
    specialization: ["Администрирование", "Консультации"],
    totalClients: 0,
    monthlyRevenue: 0,
    rating: 5.0,
    totalReviews: 23,
    status: "active",
    hireDate: "2023-05-01",
    workingHours: "09:00-18:00",
    salary: 45000,
    commission: 0,
    createdAt: "2023-05-01"
  },
  {
    id: "5",
    firstName: "Дмитрий",
    lastName: "Козлов",
    phone: "+7 (999) 555-55-55",
    email: "dmitry.kozlov@studio.com",
    role: "master",
    specialization: ["Цветные татуировки", "Традиционный стиль"],
    totalClients: 28,
    monthlyRevenue: 145000,
    rating: 4.6,
    totalReviews: 78,
    status: "on_vacation",
    hireDate: "2023-06-15",
    workingHours: "12:00-21:00",
    salary: 0,
    commission: 65,
    createdAt: "2023-06-15"
  }
]

const roleNames = {
  owner: "Владелец",
  master_owner: "Мастер-владелец", 
  manager: "Менеджер",
  administrator: "Администратор",
  master: "Мастер"
}

const roleIcons = {
  owner: Crown,
  master_owner: Crown,
  manager: Shield,
  administrator: User,
  master: Scissors
}

export default function EmployeesPage() {
  const { user } = useAuth()
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees)
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>(mockEmployees)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("revenue")

  // Фильтрация и поиск
  useEffect(() => {
    let filtered = [...employees]

    // Поиск по имени, телефону, email
    if (searchQuery) {
      filtered = filtered.filter(employee => 
        `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.phone.includes(searchQuery) ||
        employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.specialization.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Фильтр по роли
    if (roleFilter !== "all") {
      filtered = filtered.filter(employee => employee.role === roleFilter)
    }

    // Фильтр по статусу
    if (statusFilter !== "all") {
      filtered = filtered.filter(employee => employee.status === statusFilter)
    }

    // Сортировка
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
        case "revenue":
          return b.monthlyRevenue - a.monthlyRevenue
        case "clients":
          return b.totalClients - a.totalClients
        case "rating":
          return b.rating - a.rating
        case "hireDate":
          return new Date(b.hireDate).getTime() - new Date(a.hireDate).getTime()
        default:
          return 0
      }
    })

    setFilteredEmployees(filtered)
  }, [employees, searchQuery, roleFilter, statusFilter, sortBy])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 border-green-300">Активен</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-300">Неактивен</Badge>
      case "on_vacation":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">В отпуске</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getRoleBadge = (role: string) => {
    const RoleIcon = roleIcons[role as keyof typeof roleIcons] || User
    const colors = {
      owner: "bg-purple-100 text-purple-800 border-purple-300",
      master_owner: "bg-purple-100 text-purple-800 border-purple-300",
      manager: "bg-blue-100 text-blue-800 border-blue-300", 
      administrator: "bg-gray-100 text-gray-800 border-gray-300",
      master: "bg-pink-100 text-pink-800 border-pink-300"
    }
    
    return (
      <Badge className={colors[role as keyof typeof colors] || "bg-gray-100 text-gray-800"}>
        <RoleIcon className="h-3 w-3 mr-1" />
        {roleNames[role as keyof typeof roleNames]}
      </Badge>
    )
  }

  const formatCurrency = (amount: number) => {
    return `₽${amount.toLocaleString()}`
  }

  const getEmployeeStats = () => {
    const activeEmployees = employees.filter(e => e.status === "active")
    const totalRevenue = activeEmployees.reduce((sum, e) => sum + e.monthlyRevenue, 0)
    const totalClients = activeEmployees.reduce((sum, e) => sum + e.totalClients, 0)
    const avgRating = activeEmployees.reduce((sum, e) => sum + e.rating, 0) / activeEmployees.length || 0

    return {
      total: employees.length,
      active: activeEmployees.length,
      masters: employees.filter(e => e.role === "master").length,
      totalRevenue,
      totalClients,
      avgRating: Math.round(avgRating * 10) / 10
    }
  }

  const stats = getEmployeeStats()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="h-8 w-8 text-purple-600" />
            Сотрудники
          </h1>
          <p className="text-gray-600 mt-1">
            Управление командой студии и расчёт зарплат
          </p>
        </div>
        
        <Link href="/employees/new">
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
            <UserPlus className="h-4 w-4 mr-2" />
            Добавить сотрудника
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{stats.total}</p>
              <p className="text-sm text-gray-600">Всего</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              <p className="text-sm text-gray-600">Активных</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-pink-500">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-pink-600">{stats.masters}</p>
              <p className="text-sm text-gray-600">Мастеров</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.totalClients}</p>
              <p className="text-sm text-gray-600">Клиентов</p>
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

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{stats.avgRating}</p>
              <p className="text-sm text-gray-600">Рейтинг</p>
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
                placeholder="Поиск сотрудников по имени, телефону, email или специализации..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-4">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Роль" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все роли</SelectItem>
                  <SelectItem value="master">Мастера</SelectItem>
                  <SelectItem value="administrator">Администраторы</SelectItem>
                  <SelectItem value="manager">Менеджеры</SelectItem>
                  <SelectItem value="owner">Владельцы</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все статусы</SelectItem>
                  <SelectItem value="active">Активные</SelectItem>
                  <SelectItem value="on_vacation">В отпуске</SelectItem>
                  <SelectItem value="inactive">Неактивные</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Сортировка" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">По выручке</SelectItem>
                  <SelectItem value="clients">По клиентам</SelectItem>
                  <SelectItem value="rating">По рейтингу</SelectItem>
                  <SelectItem value="name">По имени</SelectItem>
                  <SelectItem value="hireDate">По дате найма</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employees List */}
      <Card>
        <CardHeader>
          <CardTitle>Сотрудники ({filteredEmployees.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredEmployees.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Сотрудники не найдены</h3>
              <p className="text-gray-600">Попробуйте изменить параметры поиска или фильтры</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEmployees.map((employee) => (
                <div key={employee.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-14 h-14">
                        <AvatarImage src={employee.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold">
                          {employee.firstName[0]}{employee.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                          {employee.firstName} {employee.lastName}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-1">
                          <div className="flex items-center space-x-1">
                            <Phone className="h-3 w-3" />
                            <span>{employee.phone}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Mail className="h-3 w-3" />
                            <span>{employee.email}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {getRoleBadge(employee.role)}
                          {employee.specialization.slice(0, 2).map((spec, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6 text-sm">
                      {employee.role === "master" && (
                        <>
                          <div className="text-center">
                            <div className="font-semibold">{employee.totalClients}</div>
                            <div className="text-gray-600">клиентов</div>
                          </div>
                          
                          <div className="text-center">
                            <div className="font-semibold">{formatCurrency(employee.monthlyRevenue)}</div>
                            <div className="text-gray-600">в месяц</div>
                          </div>
                          
                          <div className="text-center">
                            <div className="font-semibold flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                              {employee.rating}
                            </div>
                            <div className="text-gray-600">{employee.totalReviews} отзывов</div>
                          </div>
                        </>
                      )}

                      {employee.role === "administrator" && (
                        <div className="text-center">
                          <div className="font-semibold">{formatCurrency(employee.salary)}</div>
                          <div className="text-gray-600">зарплата</div>
                        </div>
                      )}

                      <div className="text-center">
                        {getStatusBadge(employee.status)}
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/employees/${employee.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/employees/${employee.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>

                  {employee.workingHours && (
                    <div className="mt-3 pl-18 text-sm text-gray-600">
                      <span className="font-medium">График работы:</span> {employee.workingHours}
                      {employee.role === "master" && employee.commission > 0 && (
                        <span className="ml-4"><span className="font-medium">Комиссия:</span> {employee.commission}%</span>
                      )}
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