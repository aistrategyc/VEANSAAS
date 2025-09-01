import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
	Building2,
	Search,
	Filter,
	Plus,
	Eye,
	Edit,
	Trash2,
	MapPin,
	Phone,
	Users,
	Clock,
	DollarSign,
} from 'lucide-react'

export default function StudiosPage() {
	const studios = [
		{
			id: 1,
			name: 'Beauty Studio Центр',
			address: 'ул. Тверская, 15',
			phone: '+7 (495) 123-45-67',
			manager: 'Елена Петрова',
			staff: 12,
			rooms: 8,
			todayRevenue: '₽67,500',
			monthRevenue: '₽1,250,000',
			occupancy: 85,
			status: 'active',
			services: ['Парикмахерские', 'Маникюр', 'Косметология'],
		},
		{
			id: 2,
			name: 'Tattoo & Piercing Studio',
			address: 'ул. Арбат, 28',
			phone: '+7 (495) 234-56-78',
			manager: 'Дмитрий Волков',
			staff: 6,
			rooms: 4,
			todayRevenue: '₽45,000',
			monthRevenue: '₽890,000',
			occupancy: 92,
			status: 'active',
			services: ['Татуировки', 'Пирсинг'],
		},
		{
			id: 3,
			name: 'Laser Beauty Clinic',
			address: 'пр. Мира, 45',
			phone: '+7 (495) 345-67-89',
			manager: 'Анна Сидорова',
			staff: 8,
			rooms: 6,
			todayRevenue: '₽52,300',
			monthRevenue: '₽980,000',
			occupancy: 78,
			status: 'active',
			services: ['Лазерная эпиляция', 'Косметология'],
		},
		{
			id: 4,
			name: 'Barbershop Classic',
			address: 'ул. Покровка, 12',
			phone: '+7 (495) 456-78-90',
			manager: 'Михаил Козлов',
			staff: 5,
			rooms: 3,
			todayRevenue: '₽28,900',
			monthRevenue: '₽560,000',
			occupancy: 95,
			status: 'maintenance',
			services: ['Мужские стрижки', 'Бритье'],
		},
	]

	return (
		<div className='space-y-6 animate-in fade-in-0 duration-500'>
			{/* Header */}
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold text-foreground'>Студии</h1>
					<p className='text-muted-foreground'>
						Управление филиалами и студиями
					</p>
				</div>
				<Button className='bg-primary hover:bg-primary/90 transition-all duration-200 hover:scale-105'>
					<Plus className='h-4 w-4 mr-2' />
					Добавить студию
				</Button>
			</div>

			{/* Stats */}
			<div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
				<Card className='bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:scale-105'>
					<CardContent className='pt-6'>
						<div className='flex items-center gap-2'>
							<Building2 className='h-4 w-4 text-blue-500' />
							<div>
								<p className='text-2xl font-bold text-card-foreground'>4</p>
								<p className='text-sm text-muted-foreground'>Всего студий</p>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card className='bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20 hover:border-green-500/40 transition-all duration-300 hover:scale-105'>
					<CardContent className='pt-6'>
						<div className='flex items-center gap-2'>
							<Users className='h-4 w-4 text-green-500' />
							<div>
								<p className='text-2xl font-bold text-card-foreground'>31</p>
								<p className='text-sm text-muted-foreground'>
									Всего сотрудников
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card className='bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:scale-105'>
					<CardContent className='pt-6'>
						<div className='flex items-center gap-2'>
							<DollarSign className='h-4 w-4 text-purple-500' />
							<div>
								<p className='text-2xl font-bold text-card-foreground'>
									₽193,700
								</p>
								<p className='text-sm text-muted-foreground'>Выручка сегодня</p>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card className='bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:scale-105'>
					<CardContent className='pt-6'>
						<div className='flex items-center gap-2'>
							<Clock className='h-4 w-4 text-orange-500' />
							<div>
								<p className='text-2xl font-bold text-card-foreground'>87%</p>
								<p className='text-sm text-muted-foreground'>
									Средняя загрузка
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Filters */}
			<Card className='bg-card border-border'>
				<CardContent className='pt-6'>
					<div className='flex flex-col sm:flex-row gap-4'>
						<div className='relative flex-1'>
							<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
							<Input
								placeholder='Поиск по названию, адресу или менеджеру...'
								className='pl-10'
							/>
						</div>
						<Button variant='outline'>
							<Filter className='h-4 w-4 mr-2' />
							Фильтры
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Studios Grid */}
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				{studios.map(studio => (
					<Card
						key={studio.id}
						className='bg-card border-border hover:border-primary/20 transition-all duration-300 hover:scale-[1.02]'
					>
						<CardHeader>
							<div className='flex items-center justify-between'>
								<CardTitle className='text-card-foreground flex items-center gap-2'>
									<Building2 className='h-5 w-5 text-primary' />
									{studio.name}
								</CardTitle>
								<Badge
									variant={studio.status === 'active' ? 'default' : 'secondary'}
									className={
										studio.status === 'maintenance'
											? 'bg-yellow-500/20 text-yellow-500'
											: ''
									}
								>
									{studio.status === 'active' ? 'Активна' : 'Обслуживание'}
								</Badge>
							</div>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='grid grid-cols-2 gap-4'>
								<div className='space-y-2'>
									<div className='flex items-center gap-2 text-sm'>
										<MapPin className='h-4 w-4 text-muted-foreground' />
										<span className='text-muted-foreground'>
											{studio.address}
										</span>
									</div>
									<div className='flex items-center gap-2 text-sm'>
										<Phone className='h-4 w-4 text-muted-foreground' />
										<span className='text-muted-foreground'>
											{studio.phone}
										</span>
									</div>
									<div className='flex items-center gap-2 text-sm'>
										<Users className='h-4 w-4 text-muted-foreground' />
										<span className='text-muted-foreground'>
											Менеджер: {studio.manager}
										</span>
									</div>
								</div>
								<div className='space-y-2'>
									<div className='text-center p-2 rounded-lg bg-muted/20'>
										<p className='text-lg font-bold text-foreground'>
											{studio.staff}
										</p>
										<p className='text-xs text-muted-foreground'>Сотрудников</p>
									</div>
									<div className='text-center p-2 rounded-lg bg-muted/20'>
										<p className='text-lg font-bold text-foreground'>
											{studio.rooms}
										</p>
										<p className='text-xs text-muted-foreground'>Кабинетов</p>
									</div>
								</div>
							</div>

							<div className='grid grid-cols-3 gap-4'>
								<div className='text-center'>
									<p className='font-medium text-foreground'>
										{studio.todayRevenue}
									</p>
									<p className='text-xs text-muted-foreground'>Сегодня</p>
								</div>
								<div className='text-center'>
									<p className='font-medium text-foreground'>
										{studio.monthRevenue}
									</p>
									<p className='text-xs text-muted-foreground'>За месяц</p>
								</div>
								<div className='text-center'>
									<p className='font-medium text-foreground'>
										{studio.occupancy}%
									</p>
									<p className='text-xs text-muted-foreground'>Загрузка</p>
								</div>
							</div>

							<div className='space-y-2'>
								<p className='text-sm font-medium text-foreground'>Услуги:</p>
								<div className='flex flex-wrap gap-2'>
									{studio.services.map((service, index) => (
										<Badge key={index} variant='outline' className='text-xs'>
											{service}
										</Badge>
									))}
								</div>
							</div>

							<div className='flex items-center gap-2 pt-2'>
								<Button
									size='sm'
									variant='ghost'
									className='hover:bg-primary/10'
								>
									<Eye className='h-4 w-4' />
								</Button>
								<Button
									size='sm'
									variant='ghost'
									className='hover:bg-primary/10'
								>
									<Edit className='h-4 w-4' />
								</Button>
								<Button
									size='sm'
									variant='ghost'
									className='hover:bg-destructive/10'
								>
									<Trash2 className='h-4 w-4' />
								</Button>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	)
}
