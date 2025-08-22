"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/app/(auth)/hooks/useAuth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Scissors, 
  Plus, 
  Search, 
  Filter,
  Clock,
  DollarSign,
  MoreHorizontal,
  Edit,
  Trash,
  Eye,
  Heart,
  Star,
  Sparkles,
  TrendingUp,
  Users
} from "lucide-react"
import Link from "next/link"

interface Service {
  id: string
  name: string
  category: "TATTOO" | "PIERCING" | "BARBERSHOP" | "BEAUTY" | "NAIL"
  description: string
  price: number
  duration: number // в минутах
  masterIds: string[]
  isActive: boolean
  bookingsCount: number
  totalRevenue: number
  averageRating: number
  reviewsCount: number
  tags: string[]
  createdAt: string
}

// Моковые данные
const mockServices: Service[] = [
  {
    id: "1",
    name: "Черно-белая татуировка (маленькая)",
    category: "TATTOO",
    description: "Небольшая татуировка в черно-белом исполнении до 5x5 см",
    price: 8000,
    duration: 120,
    masterIds: ["1", "5"],
    isActive: true,
    bookingsCount: 45,
    totalRevenue: 360000,
    averageRating: 4.8,
    reviewsCount: 32,
    tags: ["популярное", "для новичков"],
    createdAt: "2024-01-15"
  },
  {
    id: "2", 
    name: "Черно-белая татуировка (средняя)",
    category: "TATTOO",
    description: "Татуировка среднего размера в черно-белом исполнении до 10x10 см",
    price: 15000,
    duration: 180,
    masterIds: ["1", "5"],
    isActive: true,
    bookingsCount: 28,
    totalRevenue: 420000,
    averageRating: 4.9,
    reviewsCount: 24,
    tags: ["популярное"],
    createdAt: "2024-01-15"
  },
  {
    id: "3",
    name: "Цветная татуировка (средняя)",
    category: "TATTOO",
    description: "Цветная татуировка среднего размера до 10x10 см",
    price: 25000,
    duration: 240,
    masterIds: ["5"],
    isActive: true,
    bookingsCount: 18,
    totalRevenue: 450000,
    averageRating: 4.7,
    reviewsCount: 15,
    tags: ["премиум"],
    createdAt: "2024-01-15"
  },
  {
    id: "4",
    name: "Пирсинг уха",
    category: "PIERCING", 
    description: "Прокол мочки или хряща уха с установкой украшения",
    price: 2500,
    duration: 30,
    masterIds: ["2"],
    isActive: true,
    bookingsCount: 67,
    totalRevenue: 167500,
    averageRating: 4.9,
    reviewsCount: 58,
    tags: ["популярное", "быстро"],
    createdAt: "2024-01-15"
  },
  {
    id: "5",
    name: "Пирсинг носа",
    category: "PIERCING",
    description: "Прокол крыла носа или перегородки с установкой украшения",
    price: 3500,
    duration: 45,
    masterIds: ["2"],
    isActive: true,
    bookingsCount: 34,
    totalRevenue: 119000,
    averageRating: 4.8,
    reviewsCount: 29,
    tags: ["популярное"],
    createdAt: "2024-01-15"
  },
  {
    id: "6",
    name: "Мужская стрижка",
    category: "BARBERSHOP",
    description: "Классическая мужская стрижка с укладкой",
    price: 1500,
    duration: 45,
    masterIds: ["3"],
    isActive: true,
    bookingsCount: 125,
    totalRevenue: 187500,
    averageRating: 4.6,
    reviewsCount: 98,
    tags: ["популярное", "быстро"],
    createdAt: "2024-01-15"
  },
  {
    id: "7",
    name: "Стрижка бороды",
    category: "BARBERSHOP",
    description: "Моделирование и стрижка бороды",
    price: 1000,
    duration: 30,
    masterIds: ["3"],
    isActive: true,
    bookingsCount: 89,
    totalRevenue: 89000,
    averageRating: 4.7,
    reviewsCount: 72,
    tags: ["быстро"],
    createdAt: "2024-01-15"
  },
  {
    id: "8",
    name: "Комплекс стрижка + борода",
    category: "BARBERSHOP",
    description: "Мужская стрижка + моделирование бороды",
    price: 2200,
    duration: 60,
    masterIds: ["3"],
    isActive: true,
    bookingsCount: 56,
    totalRevenue: 123200,
    averageRating: 4.8,
    reviewsCount: 43,
    tags: ["популярное", "выгодно"],
    createdAt: "2024-01-15"
  },
  {
    id: "9",
    name: "Перекрытие старой татуировки",
    category: "TATTOO",
    description: "Перекрытие старой татуировки новым дизайном",
    price: 20000,
    duration: 300,
    masterIds: ["1"],
    isActive: true,
    bookingsCount: 12,
    totalRevenue: 240000,
    averageRating: 5.0,
    reviewsCount: 8,
    tags: ["сложная работа", "консультация"],
    createdAt: "2024-02-01"
  },
  {
    id: "10",
    name: "Временная татуировка хной",
    category: "TATTOO",
    description: "Временная татуировка натуральной хной на 2-3 недели",
    price: 3000,
    duration: 90,
    masterIds: ["1", "5"],
    isActive: false,
    bookingsCount: 8,
    totalRevenue: 24000,
    averageRating: 4.3,
    reviewsCount: 6,
    tags: ["временная", "безопасная"],
    createdAt: "2024-03-01"
  }
]

const categoryNames = {
  TATTOO: "Татуировки",
  PIERCING: "Пирсинг",
  BARBERSHOP: "Барбершоп",
  BEAUTY: "Красота",
  NAIL: "Ногти"
}

const categoryIcons = {
  TATTOO: Heart,
  PIERCING: Sparkles,
  BARBERSHOP: Scissors,
  BEAUTY: Star,
  NAIL: Heart
}

export default function ServicesPage() {
  const { user } = useAuth()
  const [services, setServices] = useState<Service[]>(mockServices)
  const [filteredServices, setFilteredServices] = useState<Service[]>(mockServices)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("popularity")

  // Фильтрация и поиск
  useEffect(() => {
    let filtered = [...services]

    // Поиск по названию, описанию, тегам
    if (searchQuery) {
      filtered = filtered.filter(service => 
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Фильтр по категории
    if (categoryFilter !== "all") {
      filtered = filtered.filter(service => service.category === categoryFilter)
    }

    // Фильтр по статусу
    if (statusFilter !== "all") {
      if (statusFilter === "active") {
        filtered = filtered.filter(service => service.isActive)
      } else {
        filtered = filtered.filter(service => !service.isActive)
      }
    }

    // Сортировка
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "popularity":
          return b.bookingsCount - a.bookingsCount
        case "revenue":
          return b.totalRevenue - a.totalRevenue
        case "rating":
          return b.averageRating - a.averageRating
        case "price":
          return b.price - a.price
        case "name":
          return a.name.localeCompare(b.name)
        case "duration":
          return a.duration - b.duration
        default:
          return 0
      }
    })

    setFilteredServices(filtered)
  }, [services, searchQuery, categoryFilter, statusFilter, sortBy])

  const formatCurrency = (amount: number) => {
    return `₽${amount.toLocaleString()}`
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}ч ${mins > 0 ? mins + 'м' : ''}`
    }
    return `${mins}м`
  }

  const getCategoryBadge = (category: string) => {
    const CategoryIcon = categoryIcons[category as keyof typeof categoryIcons]
    const colors = {
      TATTOO: "bg-purple-100 text-purple-800 border-purple-300",
      PIERCING: "bg-pink-100 text-pink-800 border-pink-300",
      BARBERSHOP: "bg-blue-100 text-blue-800 border-blue-300",
      BEAUTY: "bg-rose-100 text-rose-800 border-rose-300",
      NAIL: "bg-green-100 text-green-800 border-green-300"
    }
    
    return (
      <Badge className={colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"}>
        {CategoryIcon && <CategoryIcon className="h-3 w-3 mr-1" />}
        {categoryNames[category as keyof typeof categoryNames]}
      </Badge>
    )
  }

  const getServiceStats = () => {
    const activeServices = services.filter(s => s.isActive)
    const totalRevenue = services.reduce((sum, s) => sum + s.totalRevenue, 0)
    const totalBookings = services.reduce((sum, s) => sum + s.bookingsCount, 0)
    const avgRating = services.reduce((sum, s) => sum + s.averageRating, 0) / services.length || 0

    return {
      total: services.length,
      active: activeServices.length,
      totalRevenue,
      totalBookings,
      avgRating: Math.round(avgRating * 10) / 10,
      avgPrice: Math.round(services.reduce((sum, s) => sum + s.price, 0) / services.length || 0)
    }
  }

  const stats = getServiceStats()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Scissors className="h-8 w-8 text-purple-600" />
            Услуги
          </h1>
          <p className="text-gray-600 mt-1">
            Управление услугами студии и ценообразованием
          </p>
        </div>
        
        <Link href="/services/new">
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
            <Plus className="h-4 w-4 mr-2" />
            Добавить услугу
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{stats.total}</p>
              <p className="text-sm text-gray-600">Всего услуг</p>
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

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.totalBookings}</p>
              <p className="text-sm text-gray-600">Записей</p>
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

        <Card className="border-l-4 border-l-pink-500">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-pink-600">{formatCurrency(stats.avgPrice)}</p>
              <p className="text-sm text-gray-600">Средняя цена</p>
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
                placeholder="Поиск услуг по названию, описанию или тегам..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-4">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Категория" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все категории</SelectItem>
                  <SelectItem value="TATTOO">Татуировки</SelectItem>
                  <SelectItem value="PIERCING">Пирсинг</SelectItem>
                  <SelectItem value="BARBERSHOP">Барбершоп</SelectItem>
                  <SelectItem value="BEAUTY">Красота</SelectItem>
                  <SelectItem value="NAIL">Ногти</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все</SelectItem>
                  <SelectItem value="active">Активные</SelectItem>
                  <SelectItem value="inactive">Неактивные</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Сортировка" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">По популярности</SelectItem>
                  <SelectItem value="revenue">По выручке</SelectItem>
                  <SelectItem value="rating">По рейтингу</SelectItem>
                  <SelectItem value="price">По цене</SelectItem>
                  <SelectItem value="name">По названию</SelectItem>
                  <SelectItem value="duration">По времени</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => {
          const CategoryIcon = categoryIcons[service.category]
          
          return (
            <Card key={service.id} className={`hover:shadow-lg transition-all ${!service.isActive ? 'opacity-60' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg leading-tight mb-2">{service.name}</CardTitle>
                    <div className="flex items-center gap-2 mb-2">
                      {getCategoryBadge(service.category)}
                      {!service.isActive && (
                        <Badge variant="secondary">Неактивна</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/services/${service.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/services/${service.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 line-clamp-2">{service.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-3 w-3 text-green-600" />
                      <span className="font-semibold text-green-600">{formatCurrency(service.price)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3 text-blue-600" />
                      <span className="text-blue-600">{formatDuration(service.duration)}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-3 border-t">
                  <div className="text-center">
                    <div className="font-semibold text-purple-600">{service.bookingsCount}</div>
                    <div className="text-xs text-gray-500">записей</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-green-600">{formatCurrency(service.totalRevenue)}</div>
                    <div className="text-xs text-gray-500">выручка</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-yellow-600 flex items-center justify-center gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      {service.averageRating}
                    </div>
                    <div className="text-xs text-gray-500">{service.reviewsCount} отзывов</div>
                  </div>
                </div>

                {service.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-2">
                    {service.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredServices.length === 0 && (
        <Card>
          <CardContent className="p-12">
            <div className="text-center">
              <Scissors className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Услуги не найдены</h3>
              <p className="text-gray-600 mb-6">Попробуйте изменить параметры поиска или фильтры</p>
              <Link href="/services/new">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить первую услугу
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}