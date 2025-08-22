'use client';
import React, { useState } from 'react';
import {
  ChevronDown,
  Star,
  Check,
  X,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Globe,
  MessageCircle,
  Users2,
  PlayCircle,
  Target,
  Brain,
  Users,
  BarChart3,
  Briefcase,
  TrendingUp,
  Shield,
  Award,
  Building2,
  GraduationCap,
  ShoppingCart,
  Code2,
  Megaphone,
} from 'lucide-react';
import ContactForm from '@/components/ContactForm';

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const stats = [
    { value: '1М+', label: 'Активных пользователей' },
    { value: '50К+', label: 'Бизнес-клиентов' },
    { value: '99.9%', label: 'Время безотказной работы' },
    { value: '4.9/5', label: 'Средний рейтинг' },
  ];

  const features = [
    { icon: Target, title: 'OKR и Стратегия', description: 'Ставьте амбициозные цели и отслеживайте прогресс. Каскадируйте OKR на всех уровнях компании.', color: 'from-purple-500 to-violet-600', bgColor: 'from-purple-100 to-violet-100', items: ['Каскадирование целей', 'Визуализация прогресса', 'Квартальные циклы'] },
    { icon: Briefcase, title: 'Проекты и Задачи', description: 'Управляйте проектами любой сложности. Kanban, Gantt, спринты — все в одном месте.', color: 'from-emerald-500 to-teal-600', bgColor: 'from-emerald-100 to-teal-100', items: ['Гибкие методологии', 'Автоматизация процессов', 'Шаблоны проектов'] },
    { icon: Brain, title: 'ИИ Аналитика', description: 'ИИ анализирует ваши данные и предлагает действия для роста бизнеса.', color: 'from-orange-500 to-red-600', bgColor: 'from-orange-100 to-red-100', items: ['Прогнозирование трендов', 'Умные рекомендации', 'Анализ рисков'] },
    { icon: Users, title: 'CRM и Продажи', description: 'Полный жизненный цикл клиента — от первого касания до повторных продаж.', color: 'from-blue-500 to-indigo-600', bgColor: 'from-blue-100 to-indigo-100', items: ['Воронки продаж', 'История взаимодействий', 'Автоматизация'] },
    { icon: Award, title: 'HR и Команда', description: 'Управление талантами, развитие сотрудников и сильная корпоративная культура.', color: 'from-rose-500 to-pink-600', bgColor: 'from-rose-100 to-pink-100', items: ['Встречи 1-на-1', 'Оценка навыков', 'Карьерные треки'] },
    { icon: BarChart3, title: 'Финансы и Бюджеты', description: 'Контролируйте денежные потоки, планируйте бюджеты и отслеживайте показатели.', color: 'from-amber-500 to-yellow-600', bgColor: 'from-amber-100 to-yellow-100', items: ['P&L в реальном времени', 'Бюджетирование', 'Финансовые отчеты'] },
  ];

  const pricing = [
    { name: 'Стартовый', price: '0', description: 'Для небольших команд и стартапов', features: [
      { name: 'До 5 пользователей', included: true }, { name: 'Основные модули (OKR, задачи)', included: true },
      { name: '1 ГБ хранилище', included: true }, { name: 'Поддержка по почте', included: true },
      { name: 'ИИ аналитика', included: false }, { name: 'API доступ', included: false },
    ], cta: 'Начать бесплатно', popular: false },
    { name: 'Командный', price: '1,900', description: 'Для растущих компаний', features: [
      { name: 'До 50 пользователей', included: true }, { name: 'Все основные модули', included: true },
      { name: '100 ГБ хранилище', included: true }, { name: 'Приоритетная поддержка', included: true },
      { name: 'Базовая ИИ аналитика', included: true }, { name: 'API доступ', included: true },
    ], cta: 'Попробовать 14 дней', popular: true },
    { name: 'Премиум', price: '4,900', description: 'Для крупных организаций', features: [
      { name: 'Неограниченно пользователей', included: true }, { name: 'Все модули + настройка', included: true },
      { name: 'Неограниченное хранилище', included: true }, { name: 'Выделенный менеджер', included: true },
      { name: 'Продвинутая ИИ аналитика', included: true }, { name: 'Белый лейбл', included: true },
    ], cta: 'Связаться с отделом продаж', popular: false },
  ];

  const testimonials = [
    { text: 'Liderix completely transformed how we run projects. Processes are transparent and the team works as one.', author: 'Anna Petrova', position: 'CEO, TechStart', rating: 5 },
    { text: 'AI recommendations helped us boost conversion by 40%. This is more than a CRM — it’s a real growth partner.', author: 'Mikhail Kozlov', position: 'CMO, E-Commerce Pro', rating: 5 },
    { text: 'Rolling out OKRs with Liderix let us scale 3x in a year while staying focused on what matters.', author: 'Elena Sidorova', position: 'COO, FinTech Solutions', rating: 5 },
  ];

  const faqs = [
    { question: 'Можно ли попробовать Liderix бесплатно?', answer: 'Да. Стартовый план бесплатен навсегда. Также доступна 14-дневная пробная версия для командного тарифа без указания карты.' },
    { question: 'Как перенести данные из других инструментов?', answer: 'Мы поддерживаем импорт из популярных CRM и систем управления проектами. Наша команда поможет с переносом данных и интеграциями.' },
    { question: 'Насколько безопасны мои данные?', answer: 'Мы используем банковское шифрование, регулярные резервные копии и соблюдаем GDPR. Данные хранятся в сертифицированных по ISO 27001 дата-центрах.' },
    { question: 'Есть ли мобильное приложение?', answer: 'Да — доступны приложения для iOS и Android. Они синхронизируются с веб-версией и поддерживают все основные функции.' },
  ];

  const industries = [
    { icon: ShoppingCart, name: 'Ритейл и E-commerce', description: 'Управление ассортиментом, аналитика продаж' },
    { icon: Code2, name: 'IT и Разработка', description: 'Agile процессы, управление инженерией' },
    { icon: Megaphone, name: 'Маркетинг и PR', description: 'Кампании, контент-календари, метрики' },
    { icon: GraduationCap, name: 'Образование и Обучение', description: 'Курсы, траектории обучения, прогресс' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-10 pb-20 px-6 bg-lime-50 overflow-hidden">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center px-4 py-2 bg-lime-100 rounded-full">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-500"></span>
                </span>
                <span className="text-lime-800 text-sm font-medium">Новое: ИИ Аналитика доступна</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Готовы ускорить
                <span className="bg-gradient-to-r from-lime-600 to-green-600 bg-clip-text text-transparent"> рост вашего бизнеса?</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">Присоединитесь к сотням компаний, которые уже используют Liderix для достижения стратегических целей.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="group relative px-8 py-4 bg-gray-900 text-white rounded-lg font-medium overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                  <span className="relative z-10">Записаться на демо</span>
                  <ArrowRight className="w-5 h-5 ml-2 inline" />
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                </button>
                <button className="flex items-center justify-center px-8 py-4 bg-white border-2 border-gray-300 rounded-lg font-medium hover:border-gray-400 transition-colors text-gray-900">
                  Запустить песочницу
                </button>
              </div>
            </div>
            <div className="relative lg:pl-12">
              <div className="relative z-10 animate-float">
                <div className="bg-gradient-to-br from-lime-600 to-green-700 rounded-2xl shadow-2xl p-8 text-white">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2">Предпросмотр дашборда</h3>
                    <p className="text-lime-200">Ваш центр управления</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {['Выручка: +34%', 'Проекты: 24', 'Команда: 48', 'ROI: 156%'].map((stat, i) => (
                      <div key={i} className="bg-white/10 backdrop-blur rounded-lg p-4">
                        <p className="text-white/80 text-sm">{stat}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute -top-6 -left-6 bg-white p-4 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-lime-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Рост выручки</p>
                      <p className="text-lg font-bold">+34%</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-lime-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Active teams</p>
                      <p className="text-lg font-bold">248</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-lime-100 to-green-100 rounded-full blur-3xl opacity-50"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <p className="text-center text-gray-500 mb-8">Trusted by industry leaders</p>
          <div className="flex flex-wrap justify-center items-center gap-12">
            {['Google', 'Microsoft', 'Amazon', 'Apple', 'Meta', 'Spotify'].map((company) => (
              <div key={company} className="text-gray-400 hover:text-gray-600 transition-colors">
                <Building2 className="w-12 h-12" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">All the tools to scale</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">From goal setting to analytics — manage every process in one place</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.bgColor} rounded-full blur-3xl opacity-0 group-hover:opacity-50 transition-opacity`}></div>
                  <div className="relative z-10">
                    <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-gray-600 mb-4">{feature.description}</p>
                    <ul className="space-y-2 text-sm text-gray-600">
                      {feature.items.map((item, i) => (
                        <li key={i} className="flex items-center">
                          <Check className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-50 to-blue-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How it works</h2>
            <p className="text-xl text-gray-600">Get started with Liderix in 4 simple steps</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: 1, title: 'Sign up', desc: 'Create an account in 30 seconds. No credit card needed.' },
              { step: 2, title: 'Setup', desc: 'Pick modules and tailor the system to your workflows.' },
              { step: 3, title: 'Team', desc: 'Invite teammates and assign roles and permissions.' },
              { step: 4, title: 'Scale', desc: 'Use powerful features to grow and streamline.' },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{item.step}</span>
                  </div>
                  {index < 3 && <div className="hidden md:block absolute top-1/2 left-full w-full h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 -translate-y-1/2"></div>}
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section id="solutions" className="py-20 px-6 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Solutions for your industry</h2>
            <p className="text-xl text-gray-600">Liderix adapts to your business specifics</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {industries.map((industry, index) => {
              const Icon = industry.icon;
              return (
                <div key={index} className="text-center p-6 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="w-16 h-6 bg-gradient-to-br from-blue-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-bold mb-2">{industry.name}</h3>
                  <p className="text-sm text-gray-600">{industry.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-5xl font-bold mb-2">{stat.value}</div>
                <p className="text-blue-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Transparent pricing</h2>
            <p className="text-xl text-gray-600">Choose a plan that fits your business</p>
            <div className="inline-flex items-center mt-6 bg-white rounded-lg p-1 shadow-md">
              <button className="px-6 py-2 rounded-md bg-lime-600 text-white font-medium">Месячно</button>
              <button className="px-6 py-2 rounded-md text-gray-600 font-medium">Годовой (-20%)</button>
            </div>
          </div>
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricing.map((plan, index) => (
              <div key={index} className={`bg-white rounded-2xl shadow-lg p-8 relative transform hover:scale-105 transition-transform ${plan.popular ? 'border-2 border-blue-500' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-lime-500 to-green-600 text-white px-4 py-1 rounded-full text-sm font-medium">Самый популярный</div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-5xl font-bold">€{plan.price}</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <button className={`w-full py-3 rounded-lg font-medium transition-all duration-300 ${plan.popular ? 'bg-gradient-to-r from-lime-500 to-green-600 text-white hover:shadow-lg transform hover:scale-105' : 'border-2 border-gray-300 hover:border-gray-400 text-gray-900'} mb-8`}>
                  {plan.cta}
                </button>
                <ul className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      {feature.included ? <Check className="w-5 h-5 text-lime-500 mt-0.5 mr-3 flex-shrink-0" /> : <X className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />}
                      <span className={feature.included ? '' : 'text-gray-400'}>{feature.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">All plans include SSL encryption, daily backups, and updates</p>
            <a href="#" className="text-lime-600 font-medium hover:text-lime-700 inline-flex items-center">Сравнить все функции <ArrowRight className="w-4 h-4 ml-1" /></a>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What customers say</h2>
            <p className="text-xl text-gray-600">Success stories from teams that chose Liderix</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((t, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-2xl">
                <div className="flex mb-4">
                  {[...Array(t.rating)].map((_, i) => (<Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{t.text}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-lime-400 to-green-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {t.author.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-bold">{t.author}</p>
                    <p className="text-sm text-gray-600">{t.position}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing inquiry (moved from top) */}
      <section className="py-16 px-6 bg-white">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-4 justify-center">
            <select className="w-full md:w-auto px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors">
              <option>Training & Implementation</option>
            </select>
            <input type="text" className="w-full md:w-1/3 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-200 transition-colors" placeholder="Получить котировку проекта" />
            <button className="w-full md:w-auto px-8 py-3 bg-lime-200 text-gray-900 rounded-lg font-medium hover:bg-lime-300 transition-colors">Получить котировку проекта</button>
          </div>
          <p className="text-center text-gray-600 mt-6 text-lg">Tailored setup for your business. No hidden fees.</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Frequently asked questions</h2>
            <p className="text-xl text-gray-600">Answers to common questions about Liderix</p>
          </div>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <button className="w-full p-6 text-left font-bold flex justify-between items-center hover:bg-gray-50 transition-colors" onClick={() => setOpenFaq(openFaq === index ? null : index)}>
                  {faq.question}
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === index && <div className="px-6 pb-6"><p className="text-gray-600">{faq.answer}</p></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Готовы выйти на новый уровень?</h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">Join thousands of teams managing their business more effectively with Liderix</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-blue-600 rounded-lg font-bold hover:shadow-xl transition-all duration-300 transform hover:scale-105">Get started free</button>
            <button className="px-8 py-4 border-2 border-white text-white rounded-lg font-bold hover:bg-white hover:text-blue-600 transition-all duration-300">Request a demo</button>
          </div>
          <p className="mt-6 text-blue-200 flex items-center justify-center">
            <Shield className="w-5 h-5 mr-2" />
            No credit card • 14 days free
          </p>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Questions?</h2>
            <p className="text-xl text-gray-600">Our team will help you get started with Liderix</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6">Contact details</h3>
              <div className="space-y-4">
                <div className="flex items-center"><div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4"><Mail className="w-6 h-6 text-blue-600" /></div><div><p className="font-medium">Email</p><p className="text-gray-600">hello@planerix.com</p></div></div>
                <div className="flex items-center"><div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4"><Phone className="w-6 h-6 text-blue-600" /></div><div><p className="font-medium">Phone</p><p className="text-gray-600">+48 12 345 67 89</p></div></div>
                <div className="flex items-center"><div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4"><MapPin className="w-6 h-6 text-blue-600" /></div><div><p className="font-medium">Office</p><p className="text-gray-600">ul. Przykładowa 123, Kraków, Poland</p></div></div>
              </div>
              <div className="mt-8">
                <p className="font-medium mb-4">Follow us</p>
                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-colors"><Globe className="w-5 h-5 text-gray-600" /></a>
                  <a href="#" className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-colors"><MessageCircle className="w-5 h-5 text-gray-600" /></a>
                  <a href="#" className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-colors"><Users2 className="w-5 h-5 text-gray-600" /></a>
                  <a href="#" className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-colors"><PlayCircle className="w-5 h-5 text-gray-600" /></a>
                </div>
              </div>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
      `}</style>
    </div>
  );
}