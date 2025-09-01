import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
	DollarSign,
	Search,
	Filter,
	Plus,
	TrendingUp,
	TrendingDown,
	CreditCard,
	Wallet,
	ArrowUpRight,
	ArrowDownRight,
} from 'lucide-react'

export default function FinancesPage() {
	const transactions = [
		{
			id: 1,
			type: 'income',
			description: 'Оплата услуг - Анна Петрова',
			amount: '$4,500',
			method: 'Карта',
			date: '2024-01-15 14:30',
			category: 'Парикмахерские услуги',
			status: 'completed',
		},
		{
			id: 2,
			type: 'income',
			description: 'Оплата услуг - Мария Сидорова',
			amount: '$2,000',
			method: 'Наличные',
			date: '2024-01-15 12:15',
			category: 'Маникюр',
			status: 'completed',
		},
		{
			id: 3,
			type: 'expense',
			description: 'Закупка материалов - Beauty Supply',
			amount: '$15,000',
			method: 'Перевод',
			date: '2024-01-15 10:00',
			category: 'Расходные материалы',
			status: 'completed',
		},
		{
			id: 4,
			type: 'income',
			description: 'Оплата услуг - Екатерина Иванова',
			amount: '$15,000',
			method: 'Карта',
			date: '2024-01-15 09:45',
			category: 'Татуировка',
			status: 'completed',
		},
		{
			id: 5,
			type: 'expense',
			description: 'Аренда помещения',
			amount: '$85,000',
			method: 'Перевод',
			date: '2024-01-15 09:00',
			category: 'Аренда',
			status: 'pending',
		},
	]

	const monthlyStats = [
		{ month: 'Янв', income: 450000, expenses: 280000 },
		{ month: 'Фев', income: 520000, expenses: 310000 },
		{ month: 'Мар', income: 480000, expenses: 295000 },
		{ month: 'Апр', income: 610000, expenses: 340000 },
		{ month: 'Май', income: 580000, expenses: 320000 },
		{ month: 'Июн', income: 650000, expenses: 380000 },
	]

	return (
		<div className='space-y-6 animate-in fade-in-0 duration-500'>
			{/* Header */}
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold text-foreground'>Финансы</h1>
					<p className='text-muted-foreground'>
						Управление доходами и расходами
					</p>
				</div>
				<Button className='bg-primary hover:bg-primary/90 transition-all duration-200 hover:scale-105'>
					<Plus className='h-4 w-4 mr-2' />
					Добавить операцию
				</Button>
			</div>

			{/* Stats */}
			<div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
				<Card className='bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20 hover:border-green-500/40 transition-all duration-300 hover:scale-105'>
					<CardContent className='pt-6'>
						<div className='flex items-center justify-between'>
							<div className='flex items-center gap-2'>
								<TrendingUp className='h-4 w-4 text-green-500' />
								<div>
									<p className='text-2xl font-bold text-card-foreground'>
										$650,000
									</p>
									<p className='text-sm text-muted-foreground'>
										Доходы за месяц
									</p>
								</div>
							</div>
							<ArrowUpRight className='h-4 w-4 text-green-500' />
						</div>
						<div className='flex items-center text-xs mt-2'>
							<span className='text-green-500'>+12%</span>
							<span className='text-muted-foreground ml-1'>
								от прошлого месяца
							</span>
						</div>
					</CardContent>
				</Card>
				<Card className='bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20 hover:border-red-500/40 transition-all duration-300 hover:scale-105'>
					<CardContent className='pt-6'>
						<div className='flex items-center justify-between'>
							<div className='flex items-center gap-2'>
								<TrendingDown className='h-4 w-4 text-red-500' />
								<div>
									<p className='text-2xl font-bold text-card-foreground'>
										$380,000
									</p>
									<p className='text-sm text-muted-foreground'>
										Расходы за месяц
									</p>
								</div>
							</div>
							<ArrowUpRight className='h-4 w-4 text-red-500' />
						</div>
						<div className='flex items-center text-xs mt-2'>
							<span className='text-red-500'>+8%</span>
							<span className='text-muted-foreground ml-1'>
								от прошлого месяца
							</span>
						</div>
					</CardContent>
				</Card>
				<Card className='bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:scale-105'>
					<CardContent className='pt-6'>
						<div className='flex items-center gap-2'>
							<DollarSign className='h-4 w-4 text-blue-500' />
							<div>
								<p className='text-2xl font-bold text-card-foreground'>
									$270,000
								</p>
								<p className='text-sm text-muted-foreground'>
									Прибыль за месяц
								</p>
							</div>
						</div>
						<div className='flex items-center text-xs mt-2'>
							<ArrowUpRight className='h-3 w-3 text-green-500 mr-1' />
							<span className='text-green-500'>+18%</span>
							<span className='text-muted-foreground ml-1'>
								от прошлого месяца
							</span>
						</div>
					</CardContent>
				</Card>
				<Card className='bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:scale-105'>
					<CardContent className='pt-6'>
						<div className='flex items-center gap-2'>
							<Wallet className='h-4 w-4 text-purple-500' />
							<div>
								<p className='text-2xl font-bold text-card-foreground'>
									$45,230
								</p>
								<p className='text-sm text-muted-foreground'>Выручка сегодня</p>
							</div>
						</div>
						<div className='flex items-center text-xs mt-2'>
							<ArrowUpRight className='h-3 w-3 text-green-500 mr-1' />
							<span className='text-green-500'>+15%</span>
							<span className='text-muted-foreground ml-1'>от вчера</span>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Monthly Chart */}
			<Card className='bg-card border-border'>
				<CardHeader>
					<CardTitle className='text-card-foreground flex items-center gap-2'>
						<TrendingUp className='h-5 w-5 text-primary' />
						Динамика доходов и расходов
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='space-y-4'>
						{monthlyStats.map((stat, index) => (
							<div
								key={index}
								className='flex items-center justify-between p-3 rounded-lg bg-muted/20'
							>
								<div className='flex items-center gap-4'>
									<div className='w-12 text-center'>
										<p className='font-medium text-foreground'>{stat.month}</p>
									</div>
									<div className='flex-1'>
										<div className='flex items-center gap-4'>
											<div className='flex items-center gap-2'>
												<div className='w-3 h-3 rounded-full bg-green-500' />
												<span className='text-sm text-muted-foreground'>
													Доходы
												</span>
												<span className='font-medium text-foreground'>
													${stat.income.toLocaleString()}
												</span>
											</div>
											<div className='flex items-center gap-2'>
												<div className='w-3 h-3 rounded-full bg-red-500' />
												<span className='text-sm text-muted-foreground'>
													Расходы
												</span>
												<span className='font-medium text-foreground'>
													${stat.expenses.toLocaleString()}
												</span>
											</div>
										</div>
									</div>
								</div>
								<div className='text-right'>
									<p className='font-medium text-foreground'>
										${(stat.income - stat.expenses).toLocaleString()}
									</p>
									<p className='text-xs text-muted-foreground'>Прибыль</p>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Filters */}
			<Card className='bg-card border-border'>
				<CardContent className='pt-6'>
					<div className='flex flex-col sm:flex-row gap-4'>
						<div className='relative flex-1'>
							<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
							<Input placeholder='Поиск операций...' className='pl-10' />
						</div>
						<Button variant='outline'>
							<Filter className='h-4 w-4 mr-2' />
							Тип операции
						</Button>
						<Button variant='outline'>Период</Button>
						<Button variant='outline'>Категория</Button>
					</div>
				</CardContent>
			</Card>

			{/* Transactions */}
			<Card className='bg-card border-border'>
				<CardHeader>
					<CardTitle className='text-card-foreground'>
						Последние операции
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='space-y-4'>
						{transactions.map(transaction => (
							<div
								key={transaction.id}
								className='flex items-center justify-between p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-all duration-200 hover:scale-[1.01] group'
							>
								<div className='flex items-center gap-4'>
									<div
										className={`w-12 h-12 rounded-lg flex items-center justify-center ${
											transaction.type === 'income'
												? 'bg-green-500/20'
												: 'bg-red-500/20'
										}`}
									>
										{transaction.type === 'income' ? (
											<ArrowUpRight className='h-5 w-5 text-green-500' />
										) : (
											<ArrowDownRight className='h-5 w-5 text-red-500' />
										)}
									</div>
									<div>
										<p className='font-medium text-foreground group-hover:text-primary transition-colors'>
											{transaction.description}
										</p>
										<p className='text-sm text-muted-foreground'>
											{transaction.category}
										</p>
										<p className='text-xs text-muted-foreground'>
											{transaction.date}
										</p>
									</div>
								</div>
								<div className='flex items-center gap-6'>
									<div className='text-center'>
										<div className='flex items-center gap-1'>
											<CreditCard className='h-4 w-4 text-muted-foreground' />
											<span className='text-sm text-muted-foreground'>
												{transaction.method}
											</span>
										</div>
									</div>
									<div className='text-right'>
										<p
											className={`font-medium text-lg ${
												transaction.type === 'income'
													? 'text-green-500'
													: 'text-red-500'
											}`}
										>
											{transaction.type === 'income' ? '+' : '-'}
											{transaction.amount}
										</p>
									</div>
									<Badge
										variant={
											transaction.status === 'completed'
												? 'default'
												: 'secondary'
										}
										className={
											transaction.status === 'pending'
												? 'bg-yellow-500/20 text-yellow-500'
												: ''
										}
									>
										{transaction.status === 'completed'
											? 'Завершено'
											: 'В обработке'}
									</Badge>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
