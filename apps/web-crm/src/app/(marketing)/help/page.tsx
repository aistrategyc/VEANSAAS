import { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  HelpCircle, 
  BookOpen, 
  MessageSquare, 
  Video, 
  Search,
  Users,
  Settings,
  BarChart3,
  Calendar,
  Target,
  FolderOpen
} from "lucide-react"

export const metadata: Metadata = {
  title: "Справочный центр | VEANCRM",
  description: "Найдите ответы на часто задаваемые вопросы по использованию CRM-системы VEANCRM для студий красоты.",
}

export default function HelpPage() {
  const categories = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Начало работы",
      description: "Онбординг и настройка студии",
      articles: [
        "Создание профиля студии",
        "Настройка типа студии (тату/пирсинг/барбер)",
        "Добавление мастеров в команду",
        "Настройка рабочих часов студии"
      ]
    },
    {
      icon: <FolderOpen className="h-6 w-6" />,
      title: "Управление клиентами",
      description: "Клиентская база и CRM-процессы",
      articles: [
        "Добавление новых клиентов",
        "Ведение истории посещений",
        "Система VIP-клиентов",
        "Отправка SMS и нотификаций",
        "Поиск и фильтрация клиентов"
      ]
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Услуги и запись",
      description: "Каталог услуг и онлайн-бронирование",
      articles: [
        "Создание каталога услуг",
        "Настройка цен и продолжительности",
        "Онлайн-запись через виджет",
        "Управление статусами записей"
      ]
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Аналитика и отчеты",
      description: "Финансовая аналитика студии",
      articles: [
        "Отчеты по доходам и расходам",
        "Анализ эффективности мастеров",
        "Экспорт данных в Excel",
        "Отчеты по клиентам и услугам"
      ]
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Расписание и смены",
      description: "Планирование работы мастеров",
      articles: [
        "Создание расписания мастеров",
        "Настройка рабочих смен",
        "Учет выходных и отпусков",
        "Синхронизация с Google Calendar"
      ]
    },
    {
      icon: <Settings className="h-6 w-6" />,
      title: "Настройки студии",
      description: "Конфигурация системы CRM",
      articles: [
        "Настройка профиля студии",
        "Управление ролями сотрудников",
        "Настройка SMS-нотификаций",
        "Лояльность и скидочная система"
      ]
    }
  ]

  const faqs = [
    {
      question: "Как добавить нового клиента?",
      answer: "Перейдите в раздел 'Клиенты' и нажмите 'Добавить клиента'. Укажите имя, телефон, email и другие контактные данные."
    },
    {
      question: "Как настроить онлайн-запись?",
      answer: "В разделе 'Настройки' → 'Онлайн-запись' вы можете настроить виджет записи на сайт вашей студии."
    },
    {
      question: "Как настроить SMS-уведомления?",
      answer: "В разделе 'Настройки' → 'Нотификации' вы можете настроить автоматические SMS-напоминания клиентам о предстоящих записях."
    },
    {
      question: "Как отслеживать комиссии мастеров?",
      answer: "В разделе 'Сотрудники' для каждого мастера вы можете установить размер комиссии в % с каждой услуги. Отчеты о выплатах доступны в разделе 'Аналитика'."
    },
    {
      question: "Как сохранить фото работ клиента?",
      answer: "При оформлении записи можно загрузить фото 'до' и 'после' работы. Фото сохраняются в профиле клиента в разделе 'Портфолио'."
    },
    {
      question: "Как экспортировать отчеты?",
      answer: "В разделе 'Аналитика' доступны функции экспорта финансовых отчетов, списков клиентов и других данных в форматах PDF и Excel."
    }
  ]

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Справочный центр
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Найдите ответы на ваши вопросы и изучите возможности платформы
        </p>
        
        {/* Search Bar */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Поиск по справке..."
            className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="text-center hover:shadow-md transition-shadow">
          <CardHeader>
            <BookOpen className="h-8 w-8 mx-auto text-primary mb-2" />
            <CardTitle className="text-lg">Руководства</CardTitle>
            <CardDescription>
              Пошаговые инструкции по использованию функций
            </CardDescription>
          </CardHeader>
        </Card>
        
        <Card className="text-center hover:shadow-md transition-shadow">
          <CardHeader>
            <Video className="h-8 w-8 mx-auto text-primary mb-2" />
            <CardTitle className="text-lg">Видеоуроки</CardTitle>
            <CardDescription>
              Обучающие видео для быстрого старта
            </CardDescription>
          </CardHeader>
        </Card>
        
        <Card className="text-center hover:shadow-md transition-shadow">
          <CardHeader>
            <MessageSquare className="h-8 w-8 mx-auto text-primary mb-2" />
            <CardTitle className="text-lg">Поддержка</CardTitle>
            <CardDescription>
              Свяжитесь с нашей командой поддержки
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Categories */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Категории</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    {category.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {category.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {category.articles.slice(0, 4).map((article, articleIndex) => (
                    <li key={articleIndex}>
                      <Link 
                        href="#" 
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        • {article}
                      </Link>
                    </li>
                  ))}
                  {category.articles.length > 4 && (
                    <li>
                      <Link href="#" className="text-sm text-primary hover:underline">
                        Показать все ({category.articles.length})
                      </Link>
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Часто задаваемые вопросы</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  {faq.question}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Contact Support */}
      <Card className="text-center bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl">Не нашли ответ?</CardTitle>
          <CardDescription className="text-base">
            Наша команда поддержки готова помочь с вопросами по CRM
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="mailto:support@veancrm.ru">
              <MessageSquare className="mr-2 h-4 w-4" />
              Написать в поддержку
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard">
              Вернуться в приложение
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Breadcrumbs */}
      <div className="mt-8 pt-8 border-t">
        <nav className="text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Главная</Link>
          <span className="mx-2">→</span>
          <span>Справочный центр</span>
        </nav>
      </div>
    </div>
  )
}