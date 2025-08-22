"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/app/(auth)/hooks/useAuth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DataTable } from "@/components/ui/data-table"
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
  Eye
} from "lucide-react"
import Link from "next/link"

interface Client {
  id: string
  firstName: string
  lastName: string
  phone: string
  email: string
  totalVisits: number
  totalSpent: number
  lastVisit: string | null
  status: "active" | "inactive" | "vip"
  notes: string
  createdAt: string
}

// Моковые данные для демонстрации
const mockClients: Client[] = [
  {
    id: "1",
    firstName: "Анна",
    lastName: "Петрова",
    phone: "+7 (999) 123-45-67",
    email: "anna.petrova@example.com",
    totalVisits: 12,
    totalSpent: 85000,
    lastVisit: "2024-08-15",
    status: "vip",
    notes: "Предпочитает татуировки в стиле минимализм",
    createdAt: "2024-01-15"
  },
  {
    id: "2", 
    firstName: "Дмитрий",
    lastName: "Соколов",
    phone: "+7 (999) 234-56-78",
    email: "dmitry.sokolov@example.com",
    totalVisits: 5,
    totalSpent: 15000,
    lastVisit: "2024-08-20",
    status: "active",
    notes: "Регулярно делает стрижку",
    createdAt: "2024-05-10"
  },
  {
    id: "3",
    firstName: "Мария",
    lastName: "Козлова", 
    phone: "+7 (999) 345-67-89",
    email: "maria.kozlova@example.com",
    totalVisits: 8,
    totalSpent: 24000,
    lastVisit: "2024-07-28",
    status: "active",
    notes: "Любит цветные татуировки",
    createdAt: "2024-03-22"
  },
  {
    id: "4",
    firstName: "Алексей",
    lastName: "Морозов",
    phone: "+7 (999) 456-78-90",
    email: "",
    totalVisits: 2,
    totalSpent: 8500,
    lastVisit: null,
    status: "inactive",
    notes: "",
    createdAt: "2024-07-01"
  }
]

export default function ClientsPage() {
  const { user } = useAuth()
  const [clients, setClients] = useState<Client[]>(mockClients)
  const [filteredClients, setFilteredClients] = useState<Client[]>(mockClients)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("lastVisit")
  const [isLoading, setIsLoading] = useState(false)

  // Фильтрация и поиск
  useEffect(() => {
    let filtered = [...clients]

    // Поиск по имени, телефону, email
    if (searchQuery) {
      filtered = filtered.filter(client => 
        `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.phone.includes(searchQuery) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Фильтр по статусу
    if (statusFilter !== "all") {
      filtered = filtered.filter(client => client.status === statusFilter)
    }

    // Сортировка
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
        case "totalSpent":
          return b.totalSpent - a.totalSpent
        case "totalVisits":
          return b.totalVisits - a.totalVisits
        case "lastVisit":
          if (!a.lastVisit && !b.lastVisit) return 0
          if (!a.lastVisit) return 1
          if (!b.lastVisit) return -1
          return new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime()
        default:
          return 0
      }
    })

    setFilteredClients(filtered)
  }, [clients, searchQuery, statusFilter, sortBy])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "vip":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">VIP</Badge>
      case "active":
        return <Badge className="bg-green-100 text-green-800 border-green-300">Активный</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-300">Неактивный</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Никогда"
    return new Date(dateString).toLocaleDateString('ru-RU')
  }

  const formatCurrency = (amount: number) => {
    return `₽${amount.toLocaleString()}`
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="animate-slide-in-left">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Users className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Клиенты
            </h1>
          </div>
          <p className="text-gray-600 ml-15">
            Управление базой клиентов вашей студии
          </p>
        </div>
        
        <div className="animate-slide-in-right">
          <Link href="/clients/new">
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <Plus className="h-4 w-4 mr-2" />
              Добавить клиента
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-card hover:shadow-gradient-glow transition-all duration-300 hover:scale-105 animate-scale-in border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Всего клиентов</p>
                <p className="text-2xl font-bold text-purple-600">{clients.length}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Активных клиентов</p>
                <p className="text-2xl font-bold text-green-600">
                  {clients.filter(c => c.status === "active" || c.status === "vip").length}
                </p>
              </div>
              <Star className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">VIP клиентов</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {clients.filter(c => c.status === "vip").length}
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Средний чек</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(
                    Math.round(clients.reduce((sum, c) => sum + c.totalSpent, 0) / clients.length)
                  )}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
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
                placeholder="Поиск клиентов по имени, телефону или email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все статусы</SelectItem>
                  <SelectItem value="active">Активные</SelectItem>
                  <SelectItem value="vip">VIP</SelectItem>
                  <SelectItem value="inactive">Неактивные</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Сортировка" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lastVisit">По последнему визиту</SelectItem>
                  <SelectItem value="name">По имени</SelectItem>
                  <SelectItem value="totalSpent">По сумме трат</SelectItem>
                  <SelectItem value="totalVisits">По количеству визитов</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Клиенты ({filteredClients.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredClients.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Клиенты не найдены</h3>
              <p className="text-gray-600">Попробуйте изменить параметры поиска или фильтры</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredClients.map((client) => (
                <div key={client.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-semibold">
                          {client.firstName[0]}{client.lastName[0]}
                        </span>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-lg">
                          {client.firstName} {client.lastName}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          {client.phone && (
                            <div className="flex items-center space-x-1">
                              <Phone className="h-3 w-3" />
                              <span>{client.phone}</span>
                            </div>
                          )}
                          {client.email && (
                            <div className="flex items-center space-x-1">
                              <Mail className="h-3 w-3" />
                              <span>{client.email}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6 text-sm">
                      <div className="text-center">
                        <div className="font-semibold">{client.totalVisits}</div>
                        <div className="text-gray-600">визитов</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="font-semibold">{formatCurrency(client.totalSpent)}</div>
                        <div className="text-gray-600">потрачено</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="font-semibold">{formatDate(client.lastVisit)}</div>
                        <div className="text-gray-600">последний визит</div>
                      </div>

                      <div className="text-center">
                        {getStatusBadge(client.status)}
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/clients/${client.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/clients/${client.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>

                  {client.notes && (
                    <div className="mt-3 pl-16">
                      <p className="text-sm text-gray-600 italic">{client.notes}</p>
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