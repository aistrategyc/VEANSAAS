import { HeaderPages } from '@/features/headerPages/HeaderPages'
import { FinancesStats } from '@/features/finances/FinancesStats'
import { FinancesMonthlyChart } from '@/features/finances/FinancesMonthlyChart'
import { FinancesTransactions } from '@/features/finances/FinancesTransactions'

export default function FinancesPage() {
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
			<HeaderPages
				description='Управление доходами и расходами'
				nameButton='Добавить операцию'
				title='Финансы'
			/>

			{/* Переписать  */}
			<FinancesStats />
			<FinancesMonthlyChart monthlyStats={monthlyStats} />
			<FinancesTransactions />
		</div>
	)
}
