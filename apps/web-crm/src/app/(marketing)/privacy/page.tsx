import { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Lock, Eye, UserCheck, Database, Globe } from "lucide-react"

export const metadata: Metadata = {
  title: "Политика конфиденциальности | VEANCRM",
  description: "Узнайте, как мы собираем, используем и защищаем ваши персональные данные в платформе VEANCRM.",
}

export default function PrivacyPage() {
  const dataTypes = [
    {
      icon: <UserCheck className="h-5 w-5" />,
      title: "Информация профиля",
      description: "Имя, email, должность, фотография профиля"
    },
    {
      icon: <Database className="h-5 w-5" />,
      title: "Рабочие данные",
      description: "Задачи, проекты, комментарии, файлы"
    },
    {
      icon: <Globe className="h-5 w-5" />,
      title: "Технические данные",
      description: "IP-адрес, браузер, устройство, логи использования"
    }
  ]

  const securityMeasures = [
    "Шифрование данных в транзите и в покое (AES-256)",
    "Двухфакторная аутентификация (2FA)",
    "Регулярные аудиты безопасности",
    "Контроль доступа на основе ролей",
    "Резервное копирование и восстановление данных",
    "Мониторинг подозрительной активности"
  ]

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h1 className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          Политика конфиденциальности
        </h1>
        
        <p className="text-lg text-muted-foreground">
          Последнее обновление: {new Date().toLocaleDateString('ru-RU')}
        </p>

        <div className="bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-8">
          <p className="text-sm mb-0">
            <strong>Конфиденциальность превыше всего:</strong> Мы стремимся обеспечить максимальную защиту ваших персональных данных и соблюдаем требования GDPR, ФЗ-152 и других применимых законов о защите данных.
          </p>
        </div>

        <h2>1. Введение</h2>
        <p>
          Настоящая Политика конфиденциальности ("Политика") описывает, как ООО "VEANCRM" ("мы", "наш", "Компания") собирает, использует, хранит и защищает персональные данные пользователей платформы VEANCRM ("Сервис").
        </p>
        <p>
          Мы серьезно относимся к защите вашей конфиденциальности и обязуемся обрабатывать ваши персональные данные в соответствии с применимым законодательством о защите данных.
        </p>

        <h2>2. Какие данные мы собираем</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
          {dataTypes.map((type, index) => (
            <Card key={index} className="text-center">
              <CardHeader className="pb-3">
                <div className="mx-auto mb-2 p-2 bg-primary/10 rounded-lg w-fit">
                  {type.icon}
                </div>
                <CardTitle className="text-sm font-medium">{type.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-xs">{type.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <h3>2.1 Информация, которую вы предоставляете</h3>
        <ul>
          <li><strong>Регистрационные данные:</strong> имя, фамилия, адрес электронной почты, пароль</li>
          <li><strong>Профиль:</strong> фотография, должность, биография, часовой пояс, языковые предпочтения</li>
          <li><strong>Контент:</strong> задачи, проекты, комментарии, файлы, которые вы создаете в Сервисе</li>
          <li><strong>Организационные данные:</strong> информация о компании, департаментах, коллегах</li>
        </ul>

        <h3>2.2 Автоматически собираемые данные</h3>
        <ul>
          <li><strong>Технические данные:</strong> IP-адрес, тип браузера, операционная система, устройство</li>
          <li><strong>Данные использования:</strong> страницы, которые вы посещаете, время, проведенное в Сервисе, действия</li>
          <li><strong>Файлы cookie:</strong> идентификаторы сессий, настройки предпочтений</li>
        </ul>

        <h2>3. Как мы используем ваши данные</h2>
        <p>
          Мы используем собранные данные для следующих целей:
        </p>

        <h3>3.1 Предоставление Сервиса</h3>
        <ul>
          <li>Создание и управление вашим аккаунтом</li>
          <li>Обеспечение функциональности платформы</li>
          <li>Синхронизация данных между устройствами</li>
          <li>Поддержка командной работы и коллаборации</li>
        </ul>

        <h3>3.2 Улучшение Сервиса</h3>
        <ul>
          <li>Анализ использования для оптимизации функций</li>
          <li>Разработка новых возможностей</li>
          <li>Исправление ошибок и повышение производительности</li>
          <li>A/B тестирование интерфейса (анонимно)</li>
        </ul>

        <h3>3.3 Коммуникация</h3>
        <ul>
          <li>Отправка важных уведомлений о Сервисе</li>
          <li>Информирование об обновлениях и новых функциях</li>
          <li>Техническая поддержка и ответы на запросы</li>
          <li>Маркетинговые сообщения (с вашего согласия)</li>
        </ul>

        <h2>4. Правовые основания обработки</h2>
        <p>
          Мы обрабатываем ваши персональные данные на основании:
        </p>
        <ul>
          <li><strong>Договор:</strong> для предоставления услуг согласно пользовательскому соглашению</li>
          <li><strong>Согласие:</strong> для маркетинговых коммуникаций и дополнительных функций</li>
          <li><strong>Законные интересы:</strong> для улучшения Сервиса и обеспечения безопасности</li>
          <li><strong>Правовые обязательства:</strong> для соблюдения применимых законов</li>
        </ul>

        <h2>5. Защита данных</h2>
        <p>
          Мы применяем современные меры технической и организационной защиты для обеспечения безопасности ваших данных:
        </p>

        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 my-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Меры безопасности
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 list-none pl-0">
            {securityMeasures.map((measure, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 bg-primary rounded-full"></div>
                {measure}
              </li>
            ))}
          </ul>
        </div>

        <h2>6. Передача данных третьим лицам</h2>
        <p>
          Мы не продаем и не сдаем в аренду ваши персональные данные. Данные могут передаваться третьим лицам только в следующих случаях:
        </p>

        <h3>6.1 Поставщики услуг</h3>
        <p>
          Мы можем передавать данные доверенным поставщикам услуг для:
        </p>
        <ul>
          <li>Хостинга и облачной инфраструктуры</li>
          <li>Сервисов электронной почты</li>
          <li>Аналитики и мониторинга</li>
          <li>Платежных операций</li>
        </ul>

        <h3>6.2 Правовые требования</h3>
        <p>
          Мы можем раскрывать данные, если это требуется законом, судебным решением или для защиты наших законных интересов.
        </p>

        <h2>7. Международные передачи</h2>
        <p>
          Ваши данные обрабатываются на серверах, расположенных в Российской Федерации. При использовании международных сервисов мы обеспечиваем адекватный уровень защиты данных.
        </p>

        <h2>8. Ваши права</h2>
        <p>
          В соответствии с применимым законодательством о защите данных, вы имеете следующие права:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Доступ к данным
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-xs">
                Получение копии ваших персональных данных
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                Исправление
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-xs">
                Обновление неточных или неполных данных
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Database className="h-4 w-4" />
                Удаление
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-xs">
                Удаление ваших персональных данных ("право на забвение")
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Ограничение
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-xs">
                Ограничение обработки ваших данных
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <p>
          Для реализации ваших прав обращайтесь к нам по адресу: <a href="mailto:privacy@veancrm.ru" className="text-primary hover:underline">privacy@veancrm.ru</a>
        </p>

        <h2>9. Хранение данных</h2>
        <p>
          Мы храним ваши персональные данные только в течение периода, необходимого для достижения целей, для которых они были собраны, или в соответствии с требованиями законодательства.
        </p>

        <h3>9.1 Сроки хранения</h3>
        <ul>
          <li><strong>Активные аккаунты:</strong> данные хранятся до закрытия аккаунта</li>
          <li><strong>Удаленные аккаунты:</strong> данные удаляются в течение 90 дней</li>
          <li><strong>Логи безопасности:</strong> до 12 месяцев</li>
          <li><strong>Финансовые записи:</strong> в соответствии с требованиями налогового законодательства</li>
        </ul>

        <h2>10. Файлы cookie и трекинг</h2>
        <p>
          Мы используем файлы cookie и аналогичные технологии для:
        </p>
        <ul>
          <li>Обеспечения функциональности Сервиса</li>
          <li>Запоминания ваших предпочтений</li>
          <li>Анализа использования (только агрегированные данные)</li>
          <li>Повышения безопасности</li>
        </ul>
        <p>
          Вы можете управлять файлами cookie через настройки браузера.
        </p>

        <h2>11. Изменения в политике</h2>
        <p>
          Мы можем обновлять эту Политику время от времени. О существенных изменениях мы уведомим вас по электронной почте или через уведомления в Сервисе за 30 дней до вступления изменений в силу.
        </p>

        <h2>12. Контактная информация</h2>
        <p>
          Если у вас есть вопросы о данной Политике конфиденциальности или обработке ваших данных, обращайтесь к нам:
        </p>

        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 my-6">
          <h3 className="font-semibold mb-4">Контакты по вопросам конфиденциальности</h3>
          <ul className="space-y-2 list-none pl-0">
            <li><strong>Email:</strong> <a href="mailto:privacy@veancrm.ru" className="text-primary hover:underline">privacy@veancrm.ru</a></li>
            <li><strong>DPO (Ответственный за защиту данных):</strong> <a href="mailto:dpo@veancrm.ru" className="text-primary hover:underline">dpo@veancrm.ru</a></li>
            <li><strong>Почтовый адрес:</strong> г. Москва, ул. Примерная, д. 1, офис 123, 123456</li>
            <li><strong>Телефон:</strong> +7 (495) 123-45-67</li>
          </ul>
        </div>

        <div className="border-t pt-8 mt-12">
          <div className="bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Наши обязательства по защите данных
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Badge variant="secondary" className="w-fit">GDPR Compliant</Badge>
                <p className="text-sm text-muted-foreground">Соответствие европейскому регламенту</p>
              </div>
              <div className="space-y-2">
                <Badge variant="secondary" className="w-fit">ФЗ-152</Badge>
                <p className="text-sm text-muted-foreground">Соблюдение российского законодательства</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link 
                href="/dashboard" 
                className="inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Перейти в приложение
              </Link>
              <Link 
                href="/terms" 
                className="inline-flex items-center justify-center px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
              >
                Условия использования
              </Link>
            </div>
          </div>
        </div>

        {/* Breadcrumbs */}
        <div className="border-t pt-6 mt-8">
          <nav className="text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Главная</Link>
            <span className="mx-2">→</span>
            <span>Политика конфиденциальности</span>
          </nav>
        </div>
      </div>
    </div>
  )
}