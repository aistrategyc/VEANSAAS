import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Scissors, User } from 'lucide-react'
import React from 'react'

export const CalendarActions = () => {
	return (
		<Card className='bg-card border-border'>
			<CardHeader>
				<CardTitle className='text-card-foreground text-lg'>
					Быстрые действия
				</CardTitle>
			</CardHeader>
			<CardContent className='space-y-2'>
				<Button
					variant='outline'
					className='w-full justify-start text-sm bg-transparent'
				>
					<Plus className='h-4 w-4 mr-2' />
					Добавить запись
				</Button>
				<Button
					variant='outline'
					className='w-full justify-start text-sm bg-transparent'
				>
					<User className='h-4 w-4 mr-2' />
					Новый клиент
				</Button>
				<Button
					variant='outline'
					className='w-full justify-start text-sm bg-transparent'
				>
					<Scissors className='h-4 w-4 mr-2' />
					Чек-ин клиента
				</Button>
			</CardContent>
		</Card>
	)
}
