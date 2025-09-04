import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import {
	Calendar,
	Clock,
	Plus,
	ChevronLeft,
	ChevronRight,
	Eye,
	Edit,
	User,
	Scissors,
	Euro,
} from 'lucide-react'
import { CalendarNavigation } from '@/features/calendar/CalendarNavigation'
import { CalendarSchedule } from '@/features/calendar/CalendarSchedule'
import { CalendarSidebar } from '@/features/calendar/CalendarSidebar'

export default function CalendarPage() {
	// const [currentDate, setCurrentDate] = useState(new Date())
	// const [selectedDate, setSelectedDate] = (useState < Date) | (null > null)
	const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false)

	const appointments = [
		{
			id: 1,
			date: '2024-01-15',
			time: '09:00',
			duration: 150,
			client: 'Анна Петрова',
			phone: '+33 1 23 45 67 89',
			service: 'Стрижка + окрашивание',
			master: 'Елена Кузнецова',
			price: 85,
			status: 'confirmed',
			prepaid: 25,
			notes: 'Клиент просит сохранить длину',
		},
		{
			id: 2,
			date: '2024-01-15',
			time: '10:30',
			duration: 75,
			client: 'Мария Сидорова',
			phone: '+33 1 98 76 54 32',
			service: 'Маникюр',
			master: 'Ольга Морозова',
			price: 35,
			status: 'in-progress',
			prepaid: 0,
			notes: '',
		},
		{
			id: 3,
			date: '2024-01-15',
			time: '12:00',
			duration: 180,
			client: 'Екатерина Иванова',
			phone: '+33 1 11 22 33 44',
			service: 'Татуировка',
			master: 'Дмитрий Волков',
			price: 150,
			status: 'confirmed',
			prepaid: 50,
			notes: 'Эскиз согласован',
		},
	]

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='flex flex-wrap items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold text-foreground'>Календарь</h1>
					<p className='text-muted-foreground'>
						Управление записями и расписанием
					</p>
				</div>
				<div className='flex flex-wrap gap-2'>
					<Button variant='outline'>
						<Calendar className='h-4 w-4 mr-2' />
						Сегодня
					</Button>
					<Dialog
						open={isNewAppointmentOpen}
						onOpenChange={setIsNewAppointmentOpen}
					>
						<DialogTrigger asChild>
							<Button className='bg-primary hover:bg-primary/90'>
								<Plus className='h-4 w-4 mr-2' />
								Новая запись
							</Button>
						</DialogTrigger>
						<DialogContent className='max-w-md'>
							<DialogHeader>
								<DialogTitle>Новая запись</DialogTitle>
								<DialogDescription>
									Создайте новую запись для клиента
								</DialogDescription>
							</DialogHeader>
							<div className='space-y-4'>
								<div>
									<Label htmlFor='client'>Клиент</Label>
									<Input id='client' placeholder='Имя клиента' />
								</div>
								<div>
									<Label htmlFor='phone'>Телефон</Label>
									<Input id='phone' placeholder='+33 1 23 45 67 89' />
								</div>
								<div>
									<Label htmlFor='service'>Услуга</Label>
									<Select>
										<SelectTrigger>
											<SelectValue placeholder='Выберите услугу' />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='haircut'>Стрижка - €45</SelectItem>
											<SelectItem value='coloring'>
												Окрашивание - €65
											</SelectItem>
											<SelectItem value='manicure'>Маникюр - €35</SelectItem>
											<SelectItem value='tattoo'>Татуировка - €150</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div>
									<Label htmlFor='master'>Мастер</Label>
									<Select>
										<SelectTrigger>
											<SelectValue placeholder='Выберите мастера' />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='elena'>Елена Кузнецова</SelectItem>
											<SelectItem value='olga'>Ольга Морозова</SelectItem>
											<SelectItem value='dmitry'>Дмитрий Волков</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className='grid grid-cols-2 gap-4'>
									<div>
										<Label htmlFor='date'>Дата</Label>
										<Input id='date' type='date' />
									</div>
									<div>
										<Label htmlFor='time'>Время</Label>
										<Input id='time' type='time' />
									</div>
								</div>
								<div>
									<Label htmlFor='prepaid'>Предоплата (€)</Label>
									<Input id='prepaid' type='number' placeholder='0' />
								</div>
								<div>
									<Label htmlFor='notes'>Заметки</Label>
									<Textarea
										id='notes'
										placeholder='Дополнительная информация'
									/>
								</div>
								<div className='flex gap-2'>
									<Button
										className='flex-1'
										onClick={() => setIsNewAppointmentOpen(false)}
									>
										Создать запись
									</Button>
									<Button
										variant='outline'
										onClick={() => setIsNewAppointmentOpen(false)}
									>
										Отмена
									</Button>
								</div>
							</div>
						</DialogContent>
					</Dialog>
				</div>
			</div>
			<CalendarNavigation />
			<div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
				<CalendarSchedule appointment={appointments} />
				<CalendarSidebar />
			</div>
		</div>
	)
}
