import { StatsList } from '@/features/stats/StatsList'
import { FiltersPages } from '@/features/filtersPages/FiltersPages'
import { ClientList } from '@/features/clients/ClientList'
import { HeaderPages } from '@/features/headerPages/HeaderPages'
import { Calendar, Download, Plus, Star, Upload, Users } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { mockClients } from '@/lib/mock-data'
import { RoleGuard } from '@/components/ui/role-guard'
import { ClientModal } from '@/features/clients/ClientModal'
import { ImportModal } from '@/features/clients/ClientImportModal'

export default function ClientsPage() {
	const clientsList = [
		{
			id: 1,
			name: 'Анна Петрова',
			phone: '+33 1 42 86 83 26',
			email: 'anna.petrova@email.com',
			lastVisit: '2024-01-10',
			totalVisits: 15,
			totalSpent: '€2,750',
			status: 'vip',
			nextAppointment: '2024-01-15 09:00',
			services: ['Маникюр', 'Педикюр', 'Наращивание ресниц'],
			notes: 'Предпочитает утренние записи',
		},
		{
			id: 2,
			name: 'Мария Сидорова',
			phone: '+49 30 12345678',
			email: 'maria.sidorova@email.com',
			lastVisit: '2024-01-08',
			totalVisits: 8,
			totalSpent: '€1,200',
			status: 'regular',
			nextAppointment: '2024-01-15 10:30',
			services: ['Стрижка', 'Окрашивание'],
			notes: 'Аллергия на аммиак',
		},
		{
			id: 3,
			name: 'Екатерина Иванова',
			phone: '+39 06 1234567',
			email: 'ekaterina.ivanova@email.com',
			lastVisit: '2024-01-05',
			totalVisits: 3,
			totalSpent: '€1,850',
			status: 'new',
			nextAppointment: '2024-01-15 12:00',
			services: ['Татуировка', 'Пирсинг'],
			notes: 'Первая большая работа',
		},
		{
			id: 4,
			name: 'Светлана Козлова',
			phone: '+34 91 123 45 67',
			email: 'svetlana.kozlova@email.com',
			lastVisit: '2023-12-20',
			totalVisits: 12,
			totalSpent: '€1,480',
			status: 'inactive',
			nextAppointment: null,
			services: ['Массаж', 'Косметология'],
			notes: 'Не отвечает на звонки',
		},
		{
			id: 5,
			name: 'Ольга Морозова',
			phone: '+41 22 123 45 67',
			email: 'olga.morozova@email.com',
			lastVisit: '2024-01-12',
			totalVisits: 22,
			totalSpent: '€3,200',
			status: 'vip',
			nextAppointment: '2024-01-16 14:00',
			services: ['Лазерная эпиляция', 'RF-лифтинг'],
			notes: 'Постоянный клиент, скидка 15%',
		},
		{
			id: 6,
			name: 'Дарья Волкова',
			phone: '+43 1 123 45 67',
			email: 'darya.volkova@email.com',
			lastVisit: '2024-01-09',
			totalVisits: 5,
			totalSpent: '€680',
			status: 'regular',
			nextAppointment: '2024-01-17 11:00',
			services: ['Брови', 'Ламинирование ресниц'],
			notes: 'Студентка, скидка 10%',
		},
	]
	const statsClientList = [
		{ id: 1, icon: Users, count: '1,247', name: 'Всего клиентов' },
		{ id: 2, icon: Star, count: 156, name: 'VIP клиентов' },
		{ id: 3, icon: Calendar, count: 89, name: 'Новые за месяц' },
		{ id: 4, count: 23, name: 'Неактивные' },
	]
	const [isClientModalOpen, setIsClientModalOpen] = useState(false)
	const [selectedClient, setSelectedClient] = useState()
	const [isImportModalOpen, setIsImportModalOpen] = useState(false)
	const [clients, setClients] = useState(mockClients)

	const handleCreateClient = () => {
		setSelectedClient(null)
		setIsClientModalOpen(true)
	}
	const handleImportComplete = importedClients => {
		setClients(prev => [...importedClients, ...prev])
		setIsImportModalOpen(false)
	}

	const handleSaveClient = clientData => {
		if (selectedClient) {
			setClients(prev =>
				prev.map(client =>
					client.id === selectedClient.id
						? { ...client, ...clientData }
						: client
				)
			)
		} else {
			const newClient = {
				id: `client${Date.now()}`,
				organizationId: 'org1',
				isActive: true,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				...clientData,
			}
			setClients(prev => [newClient, ...prev])
		}
		setIsClientModalOpen(false)
		setSelectedClient(null)
	}

	const handleExport = () => {
		const csvContent = [
			[
				'Имя',
				'Фамилия',
				'Email',
				'Телефон',
				'Дата рождения',
				'Пол',
				'Заметки',
			].join(','),
			...filteredClients.map(client =>
				[
					client.firstName,
					client.lastName,
					client.email || '',
					client.phone || '',
					client.dateOfBirth || '',
					client.gender || '',
					client.notes || '',
				]
					.map(field => `"${field}"`)
					.join(',')
			),
		].join('\n')

		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
		const link = document.createElement('a')
		const url = URL.createObjectURL(blob)
		link.setAttribute('href', url)
		link.setAttribute(
			'download',
			`clients_${new Date().toISOString().split('T')[0]}.csv`
		)
		link.style.visibility = 'hidden'
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
	}
	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight'>Клиенты</h1>
					<p className='text-muted-foreground'>
						Управление базой клиентов салона
					</p>
				</div>
				<div className='flex items-center space-x-2'>
					<Button variant='outline' onClick={handleExport}>
						<Download className='h-4 w-4 mr-2' />
						Экспорт
					</Button>
					<RoleGuard allowedRoles={['admin', 'MasterOwner']}>
						<Button
							variant='outline'
							onClick={() => setIsImportModalOpen(true)}
						>
							<Upload className='h-4 w-4 mr-2' />
							Импорт
						</Button>
					</RoleGuard>
					<Button onClick={handleCreateClient}>
						<Plus className='h-4 w-4 mr-2' />
						Добавить клиента
					</Button>
				</div>
			</div>
			<StatsList stats={statsClientList} />
			<FiltersPages />
			<ClientList clients={clientsList} />
			<ClientModal
				isOpen={isClientModalOpen}
				onClose={() => {
					setIsClientModalOpen(false)
					setSelectedClient(null)
				}}
				client={selectedClient}
				onSave={handleSaveClient}
			/>
			<ImportModal
				isOpen={isImportModalOpen}
				onClose={() => setIsImportModalOpen(false)}
				onImportComplete={handleImportComplete}
			/>
		</div>
	)
}
