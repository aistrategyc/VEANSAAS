import { HeaderPages } from '@/features/headerPages/HeaderPages'
import { FiltersPages } from '@/features/filtersPages/FiltersPages'
import { AppointmentsList } from '@/features/appointments/AppointmentsList'

export default function AppointmentsPage() {
	const appointments = [
		{
			id: 1,
			time: '09:00',
			date: '2024-01-15',
			client: 'Анна Петрова',
			phone: '+33 1 23 45 67 89',
			service: 'Стрижка + окрашивание',
			master: 'Елена Кузнецова',
			duration: '2ч 30мин',
			price: '€85',
			status: 'confirmed',
			prepaid: '€25',
			notes: 'Клиент просит сохранить длину',
		},
		{
			id: 2,
			time: '10:30',
			date: '2024-01-15',
			client: 'Мария Сидорова',
			phone: '+33 1 98 76 54 32',
			service: 'Маникюр',
			master: 'Ольга Морозова',
			duration: '1ч 30мин',
			price: '€35',
			status: 'in-progress',
			prepaid: '€0',
			notes: '',
		},
		{
			id: 3,
			time: '12:00',
			date: '2024-01-15',
			client: 'Екатерина Иванова',
			phone: '+33 1 11 22 33 44',
			service: 'Татуировка',
			master: 'Дмитрий Волков',
			duration: '3ч',
			price: '€150',
			status: 'confirmed',
			prepaid: '€50',
			notes: 'Эскиз согласован',
		},
		{
			id: 4,
			time: '14:00',
			date: '2024-01-15',
			client: 'Светлана Козлова',
			phone: '+33 1 56 78 90 12',
			service: 'Пирсинг',
			master: 'Анна Лебедева',
			duration: '30мин',
			price: '€25',
			status: 'pending',
			prepaid: '€0',
			notes: '',
		},
	]

	return (
		<div className='space-y-6'>
			<HeaderPages
				title='Записи'
				description='Управление записями клиентов'
				nameButton='Новая запись'
				secondaryBtn='Чек-ин'
			/>
			<FiltersPages type='appointments' />
			<AppointmentsList appointments={appointments} />
		</div>
	)
}
