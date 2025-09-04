import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, Plus, Eye, Edit, Gift, TrendingUp, Crown } from 'lucide-react'
import { HeaderPages } from '@/features/headerPages/HeaderPages'
import { StatsList } from '@/features/stats/StatsList'
import { LoyaltyProgram } from '@/features/loyalty/LoyaltyProgram'
import { LoyaltyClients } from '@/features/loyalty/LoyaltyClients'

export default function LoyaltyPage() {
	const loyaltyPrograms = [
		{
			id: 1,
			name: 'Beauty VIP',
			type: 'Накопительная',
			description: 'Скидка от суммы покупок',
			minSpend: '$50,000',
			discount: '15%',
			members: 156,
			activeMembers: 142,
			totalRevenue: '$2,450,000',
			status: 'active',
		},
		{
			id: 2,
			name: 'Постоянный клиент',
			type: 'Бонусная',
			description: 'Бонусы за каждую покупку',
			minSpend: '$10,000',
			discount: '5%',
			members: 847,
			activeMembers: 623,
			totalRevenue: '$1,890,000',
			status: 'active',
		},
		{
			id: 3,
			name: 'Друг салона',
			type: 'Реферальная',
			description: 'Бонусы за приведенных друзей',
			minSpend: '$0',
			discount: '10%',
			members: 234,
			activeMembers: 189,
			totalRevenue: '$567,000',
			status: 'active',
		},
	]

	const topClients = [
		{
			id: 1,
			name: 'Анна Петрова',
			program: 'Beauty VIP',
			totalSpent: '$125,000',
			visits: 45,
			bonuses: '$12,500',
			lastVisit: '2024-01-14',
			tier: 'platinum',
		},
		{
			id: 2,
			name: 'Мария Сидорова',
			program: 'Beauty VIP',
			totalSpent: '$89,000',
			visits: 32,
			bonuses: '$8,900',
			lastVisit: '2024-01-13',
			tier: 'gold',
		},
		{
			id: 3,
			name: 'Екатерина Иванова',
			program: 'Постоянный клиент',
			totalSpent: '$67,000',
			visits: 28,
			bonuses: '$3,350',
			lastVisit: '2024-01-12',
			tier: 'silver',
		},
		{
			id: 4,
			name: 'Светлана Козлова',
			program: 'Друг салона',
			totalSpent: '$45,000',
			visits: 22,
			bonuses: '$4,500',
			lastVisit: '2024-01-11',
			tier: 'bronze',
		},
	]
	const statsLoyaltyList = [
		{ id: 1, icon: Star, count: '1,237', name: 'Участников программ' },
		{ id: 2, icon: Crown, count: 156, name: 'VIP клиенты' },
		{ id: 3, icon: Gift, count: '$245,600', name: 'Выдано бонусов' },
		{ id: 4, icon: TrendingUp, count: '$1203', name: 'Выручка от программ' },
	]

	return (
		<div className='space-y-6 animate-in fade-in-0 duration-500'>

			<HeaderPages
				description='Программы лояльности и бонусы'
				nameButton='Новая программа'
				title='Лояльность'
			/>
			<StatsList stats={statsLoyaltyList} />
			<LoyaltyProgram loyaltyPrograms={loyaltyPrograms} />
			<LoyaltyClients topClients={topClients} />

		</div>
	)
}
