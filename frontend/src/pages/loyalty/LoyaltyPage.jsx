import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, Plus, Eye, Edit, Gift, TrendingUp, Crown } from 'lucide-react'

export default function LoyaltyPage() {
	const loyaltyPrograms = [
		{
			id: 1,
			name: 'Beauty VIP',
			type: 'Накопительная',
			description: 'Скидка от суммы покупок',
			minSpend: '₽50,000',
			discount: '15%',
			members: 156,
			activeMembers: 142,
			totalRevenue: '₽2,450,000',
			status: 'active',
		},
		{
			id: 2,
			name: 'Постоянный клиент',
			type: 'Бонусная',
			description: 'Бонусы за каждую покупку',
			minSpend: '₽10,000',
			discount: '5%',
			members: 847,
			activeMembers: 623,
			totalRevenue: '₽1,890,000',
			status: 'active',
		},
		{
			id: 3,
			name: 'Друг салона',
			type: 'Реферальная',
			description: 'Бонусы за приведенных друзей',
			minSpend: '₽0',
			discount: '10%',
			members: 234,
			activeMembers: 189,
			totalRevenue: '₽567,000',
			status: 'active',
		},
	]

	const topClients = [
		{
			id: 1,
			name: 'Анна Петрова',
			program: 'Beauty VIP',
			totalSpent: '₽125,000',
			visits: 45,
			bonuses: '₽12,500',
			lastVisit: '2024-01-14',
			tier: 'platinum',
		},
		{
			id: 2,
			name: 'Мария Сидорова',
			program: 'Beauty VIP',
			totalSpent: '₽89,000',
			visits: 32,
			bonuses: '₽8,900',
			lastVisit: '2024-01-13',
			tier: 'gold',
		},
		{
			id: 3,
			name: 'Екатерина Иванова',
			program: 'Постоянный клиент',
			totalSpent: '₽67,000',
			visits: 28,
			bonuses: '₽3,350',
			lastVisit: '2024-01-12',
			tier: 'silver',
		},
		{
			id: 4,
			name: 'Светлана Козлова',
			program: 'Друг салона',
			totalSpent: '₽45,000',
			visits: 22,
			bonuses: '₽4,500',
			lastVisit: '2024-01-11',
			tier: 'bronze',
		},
	]

	return (
		<div className='space-y-6 animate-in fade-in-0 duration-500'>
			{/* Header */}
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold text-foreground'>Лояльность</h1>
					<p className='text-muted-foreground'>Программы лояльности и бонусы</p>
				</div>
				<Button className='bg-primary hover:bg-primary/90 transition-all duration-200 hover:scale-105'>
					<Plus className='h-4 w-4 mr-2' />
					Новая программа
				</Button>
			</div>

			{/* Stats */}
			<div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
				<Card className='bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:scale-105'>
					<CardContent className='pt-6'>
						<div className='flex items-center gap-2'>
							<Star className='h-4 w-4 text-purple-500' />
							<div>
								<p className='text-2xl font-bold text-card-foreground'>1,237</p>
								<p className='text-sm text-muted-foreground'>
									Участников программ
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card className='bg-gradient-to-br from-gold-500/10 to-yellow-600/5 border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300 hover:scale-105'>
					<CardContent className='pt-6'>
						<div className='flex items-center gap-2'>
							<Crown className='h-4 w-4 text-yellow-500' />
							<div>
								<p className='text-2xl font-bold text-card-foreground'>156</p>
								<p className='text-sm text-muted-foreground'>VIP клиенты</p>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card className='bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20 hover:border-green-500/40 transition-all duration-300 hover:scale-105'>
					<CardContent className='pt-6'>
						<div className='flex items-center gap-2'>
							<Gift className='h-4 w-4 text-green-500' />
							<div>
								<p className='text-2xl font-bold text-card-foreground'>
									₽245,600
								</p>
								<p className='text-sm text-muted-foreground'>Выдано бонусов</p>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card className='bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:scale-105'>
					<CardContent className='pt-6'>
						<div className='flex items-center gap-2'>
							<TrendingUp className='h-4 w-4 text-blue-500' />
							<div>
								<p className='text-2xl font-bold text-card-foreground'>
									₽4,907,000
								</p>
								<p className='text-sm text-muted-foreground'>
									Выручка от программ
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Loyalty Programs */}
			<Card className='bg-card border-border'>
				<CardHeader>
					<CardTitle className='text-card-foreground flex items-center gap-2'>
						<Star className='h-5 w-5 text-primary' />
						Программы лояльности
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
						{loyaltyPrograms.map(program => (
							<Card
								key={program.id}
								className='bg-muted/20 border-border hover:border-primary/20 transition-all duration-300 hover:scale-[1.02]'
							>
								<CardHeader>
									<div className='flex items-center justify-between'>
										<CardTitle className='text-lg text-card-foreground'>
											{program.name}
										</CardTitle>
										<Badge variant='default'>{program.type}</Badge>
									</div>
									<p className='text-sm text-muted-foreground'>
										{program.description}
									</p>
								</CardHeader>
								<CardContent className='space-y-4'>
									<div className='grid grid-cols-2 gap-4'>
										<div className='text-center p-2 rounded-lg bg-background/50'>
											<p className='font-bold text-foreground'>
												{program.members}
											</p>
											<p className='text-xs text-muted-foreground'>
												Участников
											</p>
										</div>
										<div className='text-center p-2 rounded-lg bg-background/50'>
											<p className='font-bold text-foreground'>
												{program.discount}
											</p>
											<p className='text-xs text-muted-foreground'>Скидка</p>
										</div>
									</div>
									<div className='space-y-2'>
										<div className='flex justify-between'>
											<span className='text-sm text-muted-foreground'>
												Активные:
											</span>
											<span className='text-sm font-medium text-foreground'>
												{program.activeMembers}
											</span>
										</div>
										<div className='flex justify-between'>
											<span className='text-sm text-muted-foreground'>
												Выручка:
											</span>
											<span className='text-sm font-medium text-foreground'>
												{program.totalRevenue}
											</span>
										</div>
										<div className='flex justify-between'>
											<span className='text-sm text-muted-foreground'>
												Мин. сумма:
											</span>
											<span className='text-sm font-medium text-foreground'>
												{program.minSpend}
											</span>
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
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Top Loyalty Clients */}
			<Card className='bg-card border-border'>
				<CardHeader>
					<CardTitle className='text-card-foreground flex items-center gap-2'>
						<Crown className='h-5 w-5 text-yellow-500' />
						Топ клиенты программ лояльности
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='space-y-4'>
						{topClients.map((client, index) => (
							<div
								key={client.id}
								className='flex items-center justify-between p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-all duration-200 hover:scale-[1.01] group'
							>
								<div className='flex items-center gap-4'>
									<div
										className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
											client.tier === 'platinum'
												? 'bg-gray-300 text-gray-800'
												: client.tier === 'gold'
												? 'bg-yellow-400 text-yellow-900'
												: client.tier === 'silver'
												? 'bg-gray-400 text-gray-900'
												: 'bg-orange-400 text-orange-900'
										}`}
									>
										{index + 1}
									</div>
									<div>
										<p className='font-medium text-foreground group-hover:text-primary transition-colors'>
											{client.name}
										</p>
										<p className='text-sm text-muted-foreground'>
											{client.program}
										</p>
									</div>
								</div>
								<div className='flex items-center gap-6'>
									<div className='text-center'>
										<p className='font-medium text-foreground'>
											{client.totalSpent}
										</p>
										<p className='text-xs text-muted-foreground'>Потрачено</p>
									</div>
									<div className='text-center'>
										<p className='font-medium text-foreground'>
											{client.visits}
										</p>
										<p className='text-xs text-muted-foreground'>Визитов</p>
									</div>
									<div className='text-center'>
										<p className='font-medium text-foreground'>
											{client.bonuses}
										</p>
										<p className='text-xs text-muted-foreground'>Бонусы</p>
									</div>
									<div className='text-center'>
										<p className='font-medium text-foreground'>
											{client.lastVisit}
										</p>
										<p className='text-xs text-muted-foreground'>
											Последний визит
										</p>
									</div>
									<Badge
										variant='outline'
										className={
											client.tier === 'platinum'
												? 'border-gray-400 text-gray-400'
												: client.tier === 'gold'
												? 'border-yellow-500 text-yellow-500'
												: client.tier === 'silver'
												? 'border-gray-500 text-gray-500'
												: 'border-orange-500 text-orange-500'
										}
									>
										{client.tier === 'platinum'
											? 'Платина'
											: client.tier === 'gold'
											? 'Золото'
											: client.tier === 'silver'
											? 'Серебро'
											: 'Бронза'}
									</Badge>
									<div className='flex items-center gap-1'>
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
