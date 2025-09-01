import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
	Scissors,
	Search,
	Filter,
	Plus,
	Eye,
	Edit,
	Trash2,
	Clock,
	DollarSign,
} from 'lucide-react'

export default function ServicesPage() {
	const services = [
		{
			id: 1,
			name: 'Женская стрижка',
			category: 'Парикмахерские услуги',
			duration: '60 мин',
			price: '₽2,500',
			description: 'Стрижка любой сложности с укладкой',
			masters: ['Елена Кузнецова', 'Мария Петрова'],
			bookingsThisMonth: 45,
			revenue: '₽112,500',
			status: 'active',
		},
		{
			id: 2,
			name: 'Окрашивание волос',
			category: 'Парикмахерские услуги',
			duration: '180 мин',
			price: '₽4,500',
			description: 'Окрашивание в один тон или сложные техники',
			masters: ['Елена Кузнецова'],
			bookingsThisMonth: 32,
			revenue: '₽144,000',
			status: 'active',
		},
		{
			id: 3,
			name: 'Маникюр классический',
			category: 'Ногтевой сервис',
			duration: '90 мин',
			price: '₽1,800',
			description: 'Классический маникюр с покрытием гель-лак',
			masters: ['Ольга Морозова', 'Анна Смирнова'],
			bookingsThisMonth: 67,
			revenue: '₽120,600',
			status: 'active',
		},
		{
			id: 4,
			name: 'Татуировка малая',
			category: 'Татуировки',
			duration: '120 мин',
			price: '₽8,000',
			description: 'Татуировка размером до 10x10 см',
			masters: ['Дмитрий Волков'],
			bookingsThisMonth: 15,
			revenue: '₽120,000',
			status: 'active',
		},
		{
			id: 5,
			name: 'Пирсинг уха',
			category: 'Пирсинг',
			duration: '30 мин',
			price: '₽2,000',
			description: 'Прокол мочки или хряща уха с украшением',
			masters: ['Анна Лебедева'],
			bookingsThisMonth: 28,
			revenue: '₽56,000',
			status: 'active',
		},
		{
			id: 6,
			name: 'Лазерная эпиляция ног',
			category: 'Лазерные процедуры',
			duration: '60 мин',
			price: '₽3,500',
			description: 'Лазерная эпиляция ног полностью',
			masters: ['Светлана Козлова'],
			bookingsThisMonth: 22,
			revenue: '₽77,000',
			status: 'active',
		},
	]

	const categories = [
		{ name: 'Парикмахерские услуги', count: 12, color: 'bg-blue-500' },
		{ name: 'Ногтевой сервис', count: 8, color: 'bg-pink-500' },
		{ name: 'Татуировки', count: 6, color: 'bg-purple-500' },
		{ name: 'Пирсинг', count: 4, color: 'bg-green-500' },
		{ name: 'Лазерные процедуры', count: 5, color: 'bg-orange-500' },
		{ name: 'Косметология', count: 7, color: 'bg-teal-500' },
	]

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold text-foreground'>Услуги</h1>
					<p className='text-muted-foreground'>Каталог услуг салона</p>
				</div>
				<Button className='bg-primary hover:bg-primary/90'>
					<Plus className='h-4 w-4 mr-2' />
					Добавить услугу
				</Button>
			</div>

			{/* Categories */}
			<Card className='bg-card border-border'>
				<CardHeader>
					<CardTitle className='text-card-foreground'>
						Категории услуг
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
						{categories.map((category, index) => (
							<div
								key={index}
								className='flex items-center gap-3 p-3 rounded-lg bg-muted/20'
							>
								<div className={`w-3 h-3 rounded-full ${category.color}`} />
								<div>
									<p className='font-medium text-foreground text-sm'>
										{category.name}
									</p>
									<p className='text-xs text-muted-foreground'>
										{category.count} услуг
									</p>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Stats */}
			<div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
				<Card className='bg-card border-border'>
					<CardContent className='pt-6'>
						<div className='flex items-center gap-2'>
							<Scissors className='h-4 w-4 text-primary' />
							<div>
								<p className='text-2xl font-bold text-card-foreground'>42</p>
								<p className='text-sm text-muted-foreground'>Всего услуг</p>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card className='bg-card border-border'>
					<CardContent className='pt-6'>
						<div className='flex items-center gap-2'>
							<Clock className='h-4 w-4 text-primary' />
							<div>
								<p className='text-2xl font-bold text-card-foreground'>90</p>
								<p className='text-sm text-muted-foreground'>
									Средняя длительность
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card className='bg-card border-border'>
					<CardContent className='pt-6'>
						<div className='flex items-center gap-2'>
							<DollarSign className='h-4 w-4 text-primary' />
							<div>
								<p className='text-2xl font-bold text-card-foreground'>
									₽3,200
								</p>
								<p className='text-sm text-muted-foreground'>
									Средняя стоимость
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card className='bg-card border-border'>
					<CardContent className='pt-6'>
						<div className='flex items-center gap-2'>
							<Badge variant='secondary' className='w-4 h-4 p-0' />
							<div>
								<p className='text-2xl font-bold text-card-foreground'>209</p>
								<p className='text-sm text-muted-foreground'>
									Записей за месяц
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
							<Input placeholder='Поиск услуг...' className='pl-10' />
						</div>
						<Button variant='outline'>
							<Filter className='h-4 w-4 mr-2' />
							Категория
						</Button>
						<Button variant='outline'>Цена</Button>
					</div>
				</CardContent>
			</Card>

			{/* Services Table */}
			<Card className='bg-card border-border'>
				<CardHeader>
					<CardTitle className='text-card-foreground'>Список услуг</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='space-y-4'>
						{services.map(service => (
							<div
								key={service.id}
								className='flex items-center justify-between p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors'
							>
								<div className='flex items-center gap-4'>
									<div className='w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center'>
										<Scissors className='h-5 w-5 text-primary' />
									</div>
									<div>
										<p className='font-medium text-foreground'>
											{service.name}
										</p>
										<p className='text-sm text-muted-foreground'>
											{service.category}
										</p>
										<p className='text-xs text-muted-foreground mt-1'>
											{service.description}
										</p>
									</div>
								</div>
								<div className='flex items-center gap-6'>
									<div className='text-center'>
										<p className='font-medium text-foreground'>
											{service.duration}
										</p>
										<p className='text-xs text-muted-foreground'>
											Длительность
										</p>
									</div>
									<div className='text-center'>
										<p className='font-medium text-foreground'>
											{service.price}
										</p>
										<p className='text-xs text-muted-foreground'>Стоимость</p>
									</div>
									<div className='text-center'>
										<p className='font-medium text-foreground'>
											{service.bookingsThisMonth}
										</p>
										<p className='text-xs text-muted-foreground'>
											Записей за месяц
										</p>
									</div>
									<div className='text-center'>
										<p className='font-medium text-foreground'>
											{service.revenue}
										</p>
										<p className='text-xs text-muted-foreground'>Выручка</p>
									</div>
									<Badge variant='default'>Активна</Badge>
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
