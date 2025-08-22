"use client";

import React, { useState } from 'react';
import { ChevronDown, Play, Star, Check, Menu, ArrowRight, Phone, Mail, MapPin, Heart, Scissors, Users, Calendar, DollarSign, BarChart3, Sparkles, Crown } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const testimonials = [
    {
      name: "Анна Кузнецова",
      position: "Владелица тату-студии «Ink Master»",
      image: "/api/placeholder/60/60",
      text: "VEANCRM полностью изменил подход к управлению нашей студией. Теперь все записи, клиенты и финансы в одном месте. Выручка выросла на 40% за первые 3 месяца.",
      rating: 5
    },
    {
      name: "Дмитрий Волков",
      position: "Владелец барбершопа «Men's Style»",
      image: "/api/placeholder/60/60",
      text: "Система записи через VEANCRM работает идеально. Клиенты могут записаться онлайн, а мы видим полную картину загрузки мастеров. Рекомендую всем салонам красоты!",
      rating: 5
    },
    {
      name: "Елена Морозова",
      position: "Администратор пирсинг-студии",
      image: "/api/placeholder/60/60",
      text: "Внедрение VEANCRM позволило нам автоматизировать все процессы - от записи клиентов до расчета зарплат мастеров. Теперь мы экономим 10+ часов в неделю.",
      rating: 5
    }
  ];

  const faqItems = [
    {
      question: 'Подходит ли VEANCRM для моего типа студии?',
      answer: 'Да! VEANCRM разработана специально для студий красоты всех типов: тату-салонов, пирсинг-студий, барбершопов, салонов красоты и nail-студий. Система адаптируется под специфику каждого бизнеса.'
    },
    {
      question: 'Можно ли попробовать VEANCRM бесплатно?',
      answer: 'Конечно! Мы предлагаем 14-дневный бесплатный период, в течение которого вы можете протестировать все функции системы без ограничений.'
    },
    {
      question: 'Как быстро можно запустить систему?',
      answer: 'Настройка VEANCRM занимает всего 15 минут. Наш интуитивный мастер настройки поможет создать профиль студии, добавить мастеров и услуги. Вы сможете принимать записи уже в первый день!'
    },
    {
      question: 'Есть ли мобильное приложение?',
      answer: 'Да, VEANCRM полностью адаптирован для мобильных устройств. Вы можете управлять студией с телефона или планшета из любой точки мира.'
    },
    {
      question: 'Безопасны ли данные клиентов?',
      answer: 'Абсолютно! Мы используем современные технологии шифрования и храним данные на защищенных серверах. Вся информация о клиентах полностью конфиденциальна.'
    }
  ];

  const features = [
    {
      icon: Calendar,
      title: "Система записи",
      description: "Онлайн запись клиентов с автоматическим распределением по мастерам и контролем загрузки"
    },
    {
      icon: Users,
      title: "База клиентов",
      description: "Полная CRM с историей визитов, предпочтениями и автоматическими напоминаниями"
    },
    {
      icon: DollarSign,
      title: "Финансовый учет",
      description: "Автоматический расчет выручки, комиссий мастеров и детальная аналитика по прибыли"
    },
    {
      icon: BarChart3,
      title: "Аналитика",
      description: "Подробные отчеты по доходам, популярности услуг и эффективности мастеров"
    },
    {
      icon: Crown,
      title: "Программа лояльности",
      description: "VIP-клиенты, накопительная система скидок и персональные предложения"
    },
    {
      icon: Sparkles,
      title: "Автоматизация",
      description: "SMS-уведомления, напоминания о записи и автоматическое управление расписанием"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">VEANCRM</span>
              </div>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#features" className="text-gray-700 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors">Функции</a>
                <a href="#testimonials" className="text-gray-700 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors">Отзывы</a>
                <a href="#pricing" className="text-gray-700 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors">Цены</a>
                <Link href="/login">
                  <button className="text-purple-600 hover:text-purple-800 px-3 py-2 text-sm font-medium transition-colors">
                    Войти
                  </button>
                </Link>
                <Link href="/register">
                  <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105">
                    Начать бесплатно
                  </button>
                </Link>
              </div>
            </div>
            
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700 hover:text-purple-600 p-2"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a href="#features" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600">Функции</a>
            <a href="#testimonials" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600">Отзывы</a>
            <a href="#pricing" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600">Цены</a>
            <Link href="/login" className="block px-3 py-2 text-base font-medium text-purple-600 hover:text-purple-800">Войти</Link>
            <Link href="/register" className="block px-3 py-2">
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-base font-medium">
                Начать бесплатно
              </span>
            </Link>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              CRM для студий красоты
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                нового поколения
              </span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              VEANCRM объединяет систему записи, управление клиентами, финансовый учет и аналитику в одной платформе. 
              Специально разработана для тату-студий, пирсинг-салонов, барбершопов и салонов красоты.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg">
                  Попробовать бесплатно
                  <ArrowRight className="ml-2 h-5 w-5 inline" />
                </button>
              </Link>
              <button className="border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-50 transition-all flex items-center justify-center">
                <Play className="mr-2 h-5 w-5" />
                Посмотреть демо
              </button>
            </div>
            <div className="mt-12 text-sm text-gray-500">
              ✨ Бесплатный период 14 дней • 🚀 Запуск за 15 минут • 💳 Не требуется банковская карта
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Все что нужно для управления студией
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Полный набор инструментов для автоматизации вашего beauty-бизнеса
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-purple-200 transition-all group">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Истории успеха наших клиентов
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Более 1000+ студий красоты уже используют VEANCRM
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">{testimonial.name[0]}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-600 text-sm">{testimonial.position}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Часто задаваемые вопросы
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Ответы на популярные вопросы о VEANCRM
            </p>
          </div>
          
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg">
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="font-semibold text-gray-900">{item.question}</span>
                  <ChevronDown className={`h-5 w-5 text-gray-500 transform transition-transform ${
                    openFaq === index ? 'rotate-180' : ''
                  }`} />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Готовы автоматизировать свою студию?
          </h2>
          <p className="text-xl text-purple-100 mb-8 leading-relaxed">
            Присоединяйтесь к тысячам студий красоты, которые уже управляют бизнесом эффективнее с VEANCRM
          </p>
          <Link href="/register">
            <button className="bg-white text-purple-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg">
              Начать бесплатно на 14 дней
              <ArrowRight className="ml-2 h-5 w-5 inline" />
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">VEANCRM</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Современная CRM-система для студий красоты. Автоматизируйте записи, управляйте клиентами и увеличивайте прибыль.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">Продукт</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-300 hover:text-white transition-colors">Функции</a></li>
                <li><a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Цены</a></li>
                <li><Link href="/register" className="text-gray-300 hover:text-white transition-colors">Попробовать</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">Поддержка</h3>
              <ul className="space-y-2">
                <li><a href="mailto:support@veancrm.ru" className="text-gray-300 hover:text-white transition-colors">Связаться с нами</a></li>
                <li><Link href="/(marketing)/help" className="text-gray-300 hover:text-white transition-colors">Справка</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400">
              © 2025 VEANCRM. Все права защищены.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}