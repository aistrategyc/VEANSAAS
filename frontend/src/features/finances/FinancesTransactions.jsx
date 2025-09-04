import React from 'react'
import { FinancesTransactionsItem } from './FinancesTransactionsItem'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const FinancesTransactions = () => {
	const transactions = [
		{
			id: 1,
			type: 'income',
			description: 'Оплата услуг - Анна Петрова',
			amount: '₽4,500',
			method: 'Карта',
			date: '2024-01-15 14:30',
			category: 'Парикмахерские услуги',
			status: 'completed',
		},
		{
			id: 2,
			type: 'income',
			description: 'Оплата услуг - Мария Сидорова',
			amount: '₽2,000',
			method: 'Наличные',
			date: '2024-01-15 12:15',
			category: 'Маникюр',
			status: 'completed',
		},
		{
			id: 3,
			type: 'expense',
			description: 'Закупка материалов - Beauty Supply',
			amount: '₽15,000',
			method: 'Перевод',
			date: '2024-01-15 10:00',
			category: 'Расходные материалы',
			status: 'completed',
		},
		{
			id: 4,
			type: 'income',
			description: 'Оплата услуг - Екатерина Иванова',
			amount: '₽15,000',
			method: 'Карта',
			date: '2024-01-15 09:45',
			category: 'Татуировка',
			status: 'completed',
		},
		{
			id: 5,
			type: 'expense',
			description: 'Аренда помещения',
			amount: '₽85,000',
			method: 'Перевод',
			date: '2024-01-15 09:00',
			category: 'Аренда',
			status: 'pending',
		},
	]
	return (
		<Card className='bg-card border-border'>
			<CardHeader>
				<CardTitle className='text-card-foreground'>
					Последние операции
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='space-y-4'>
					{transactions.map(transaction => (
						<FinancesTransactionsItem
							key={transaction.id}
							id={transactions.id}
							amount={transaction.amount}
							category={transaction.category}
							date={transaction.date}
							description={transaction.description}
							method={transaction.method}
							status={transaction.status}
							type={transaction.type}
						/>
					))}
				</div>
			</CardContent>
		</Card>
	)
}
