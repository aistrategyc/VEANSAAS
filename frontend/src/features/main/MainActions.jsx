import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Scissors, UserCheck, Users } from 'lucide-react'

export const MainActions = ({ addAppointment }) => {
	return (
		<Card className='bg-card border-border hover:border-primary/20 transition-all duration-300'>
			<CardHeader>
				<CardTitle className='text-card-foreground'>Быстрые действия</CardTitle>
			</CardHeader>
			<CardContent className='space-y-3'>
				<Button
					className='w-full justify-start bg-transparent hover:bg-primary/10 transition-all duration-200 hover:scale-105'
					variant='outline'
					onClick={addAppointment}
				>
					<Calendar className='h-4 w-4 mr-2 text-blue-500' />
					Новая запись
				</Button>
				<Button
					className='w-full justify-start bg-transparent hover:bg-green-500/10 transition-all duration-200 hover:scale-105'
					variant='outline'
				>
					<Users className='h-4 w-4 mr-2 text-green-500' />
					Добавить клиента
				</Button>
				<Button
					className='w-full justify-start bg-transparent hover:bg-purple-500/10 transition-all duration-200 hover:scale-105'
					variant='outline'
				>
					<Scissors className='h-4 w-4 mr-2 text-purple-500' />
					Новая услуга
				</Button>
				<Button
					className='w-full justify-start bg-transparent hover:bg-orange-500/10 transition-all duration-200 hover:scale-105'
					variant='outline'
				>
					<UserCheck className='h-4 w-4 mr-2 text-orange-500' />
					Добавить мастера
				</Button>
			</CardContent>
		</Card>
	)
}
