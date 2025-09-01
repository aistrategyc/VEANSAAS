import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
	UserCheck,
	Search,
	Filter,
	Plus,
	Eye,
	Edit,
	Trash2,
	Phone,
	Mail,
	Star,
	Calendar,
} from 'lucide-react'
import { HeaderPages } from '@/features/headerPages/HeaderPages'
import { StatsList } from '@/features/stats/StatsList'
import { FiltersPages } from '@/features/filtersPages/FiltersPages'

export default function StaffPage() {
	const staff = [
		{
			id: 1,
			name: 'Елена Кузнецова',
			role: 'Парикмахер-стилист',
			phone: '+7 (999) 111-22-33',
			email: 'elena.kuznetsova@salon.ru',
			rating: 4.9,
			experience: '8 лет',
			specializations: ['Стрижки', 'Окрашивание', 'Укладки'],
			todayAppointments: 8,
			monthRevenue: '₽125,000',
			status: 'active',
		},
		{
			id: 2,
			name: 'Ольга Морозова',
			role: 'Мастер маникюра',
			phone: '+7 (999) 222-33-44',
			email: 'olga.morozova@salon.ru',
			rating: 4.8,
			experience: '5 лет',
			specializations: ['Маникюр', 'Педикюр', 'Наращивание'],
			todayAppointments: 6,
			monthRevenue: '₽89,000',
			status: 'active',
		},
		{
			id: 3,
			name: 'Дмитрий Волков',
			role: 'Тату-мастер',
			phone: '+7 (999) 333-44-55',
			email: 'dmitry.volkov@salon.ru',
			rating: 4.9,
			experience: '12 лет',
			specializations: ['Татуировки', 'Эскизы', 'Реализм'],
			todayAppointments: 3,
			monthRevenue: '₽180,000',
			status: 'active',
		},
		{
			id: 4,
			name: 'Анна Лебедева',
			role: 'Мастер пирсинга',
			phone: '+7 (999) 444-55-66',
			email: 'anna.lebedeva@salon.ru',
			rating: 4.7,
			experience: '6 лет',
			specializations: ['Пирсинг', 'Украшения', 'Консультации'],
			todayAppointments: 4,
			monthRevenue: '₽67,000',
			status: 'vacation',
		},
	]
	const statsEmployeeList = [
		{ id: 1, icon: UserCheck, count: '24', name: 'Всего сотрудников' },
		{ id: 2, icon: Badge, count: '21', name: 'Активные' },
		{ id: 3, icon: Calendar, count: '3', name: 'В отпуске' },
		{ id: 4, icon: Star, count: '4.8', name: 'Средний рейтинг' },
	]

	return (
		<div className='space-y-6'>
			<HeaderPages
				title='Сотрудники'
				description='Управление персоналом'
				nameButton='Добавить сотрудника'
			/>
			<StatsList stats={statsEmployeeList} />
			<FiltersPages />
			<Card className='bg-card border-border'>
				<CardHeader>
					<CardTitle className='text-card-foreground'>
						Список сотрудников
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='space-y-4'>
						{staff.map(member => (
							<div
								key={member.id}
								className='flex items-center justify-between p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors'
							>
								<div className='flex items-center gap-4'>
									<Avatar>
										<AvatarFallback>
											{member.name
												.split(' ')
												.map(n => n[0])
												.join('')}
										</AvatarFallback>
									</Avatar>
									<div>
										<p className='font-medium text-foreground'>{member.name}</p>
										<p className='text-sm text-muted-foreground'>
											{member.role}
										</p>
										<div className='flex items-center gap-4 text-xs text-muted-foreground mt-1'>
											<div className='flex items-center gap-1'>
												<Phone className='h-3 w-3' />
												{member.phone}
											</div>
											<div className='flex items-center gap-1'>
												<Mail className='h-3 w-3' />
												{member.email}
											</div>
										</div>
									</div>
								</div>
								<div className='flex items-center gap-6'>
									<div className='text-center'>
										<div className='flex items-center gap-1'>
											<Star className='h-3 w-3 text-yellow-500 fill-current' />
											<span className='font-medium text-foreground'>
												{member.rating}
											</span>
										</div>
										<p className='text-xs text-muted-foreground'>Рейтинг</p>
									</div>
									<div className='text-center'>
										<p className='font-medium text-foreground'>
											{member.experience}
										</p>
										<p className='text-xs text-muted-foreground'>Опыт</p>
									</div>
									<div className='text-center'>
										<p className='font-medium text-foreground'>
											{member.todayAppointments}
										</p>
										<p className='text-xs text-muted-foreground'>
											Записей сегодня
										</p>
									</div>
									<div className='text-center'>
										<p className='font-medium text-foreground'>
											{member.monthRevenue}
										</p>
										<p className='text-xs text-muted-foreground'>
											Выручка за месяц
										</p>
									</div>
									<Badge
										variant={
											member.status === 'active'
												? 'default'
												: member.status === 'vacation'
												? 'secondary'
												: 'outline'
										}
									>
										{member.status === 'active'
											? 'Активен'
											: member.status === 'vacation'
											? 'В отпуске'
											: 'Неактивен'}
									</Badge>
									<div className='flex items-center gap-1'>
										<Button size='sm' variant='ghost'>
											<Eye className='h-4 w-4' />
										</Button>
										<Button size='sm' variant='ghost'>
											<Edit className='h-4 w-4' />
										</Button>
										<Button size='sm' variant='ghost'>
											<Trash2 className='h-4 w-4' />
										</Button>
									</div>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
