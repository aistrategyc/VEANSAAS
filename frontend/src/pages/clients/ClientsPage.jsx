'use client'

import { useState } from 'react'

// import { ClientModal } from '@/components/clients/client-modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Plus, Search, Upload, Download, Users } from 'lucide-react'
import { mockClients } from '@/lib/mock-data'
import { ClientsTable } from '@/features/clients/ClientsTable'
import { ClientModal } from '@/features/clients/ClientModal'
import { ImportModal } from '@/features/clients/ClientImportModal'
import { PermissionGuard } from '@/role/PermissionGuard'

export default function ClientsPag() {
	const [clients, setClients] = useState(mockClients)
	const [searchQuery, setSearchQuery] = useState('')
	const [statusFilter, setStatusFilter] = useState('all')
	const [selectedClient, setSelectedClient] = useState(null)
	const [isClientModalOpen, setIsClientModalOpen] = useState(false)
	const [isImportModalOpen, setIsImportModalOpen] = useState(false)

	// Filter clients based on search and status
	const filteredClients = clients.filter(client => {
		const matchesSearch =
			searchQuery === '' ||
			`${client.firstName} ${client.lastName}`
				.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
			client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			client.phone?.includes(searchQuery)

		const matchesStatus =
			statusFilter === 'all' ||
			(statusFilter === 'active' ? client.isActive : !client.isActive)

		return matchesSearch && matchesStatus
	})

	const handleCreateClient = () => {
		setSelectedClient(null)
		setIsClientModalOpen(true)
	}

	const handleEditClient = client => {
		setSelectedClient(client)
		setIsClientModalOpen(true)
	}

	const handleSaveClient = clientData => {
		if (selectedClient) {
			// Edit existing client
			setClients(prev =>
				prev.map(client =>
					client.id === selectedClient.id
						? { ...client, ...clientData }
						: client
				)
			)
		} else {
			// Create new client
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

	const handleDeleteClient = clientId => {
		setClients(prev => prev.filter(client => client.id !== clientId))
	}

	const handleImportComplete = importedClients => {
		setClients(prev => [...importedClients, ...prev])
		setIsImportModalOpen(false)
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

	const stats = {
		total: clients.length,
		active: clients.filter(c => c.isActive).length,
		inactive: clients.filter(c => !c.isActive).length,
		thisMonth: clients.filter(c => {
			const created = new Date(c.createdAt)
			const now = new Date()
			return (
				created.getMonth() === now.getMonth() &&
				created.getFullYear() === now.getFullYear()
			)
		}).length,
	}

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight'>Клиенты</h1>
					<p className='text-muted-foreground'>
						Управление базой клиентов салона
					</p>
				</div>
				<PermissionGuard requiredPermission='client:edit'>
					<div className='flex items-center space-x-2'>
						<Button variant='outline' onClick={handleExport}>
							<Download className='h-4 w-4 mr-2' />
							Экспорт
						</Button>
						<Button
							variant='outline'
							onClick={() => setIsImportModalOpen(true)}
						>
							<Upload className='h-4 w-4 mr-2' />
							Импорт
						</Button>
						<Button onClick={handleCreateClient}>
							<Plus className='h-4 w-4 mr-2' />
							Добавить клиента
						</Button>
					</div>
				</PermissionGuard>
			</div>

			{/* Stats Cards */}
			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							Всего клиентов
						</CardTitle>
						<Users className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{stats.total}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Активные</CardTitle>
						<Badge variant='default' className='h-4 px-1 text-xs'>
							A
						</Badge>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{stats.active}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Неактивные</CardTitle>
						<Badge variant='secondary' className='h-4 px-1 text-xs'>
							N
						</Badge>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{stats.inactive}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							Новые за месяц
						</CardTitle>
						<Plus className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{stats.thisMonth}</div>
					</CardContent>
				</Card>
			</div>

			{/* Filters */}
			<Card>
				<CardHeader>
					<CardTitle>Поиск и фильтры</CardTitle>
					<CardDescription>
						Найдите нужных клиентов по различным критериям
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='flex flex-col sm:flex-row gap-4'>
						<div className='flex-1'>
							<div className='relative'>
								<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
								<Input
									placeholder='Поиск по имени, email или телефону...'
									value={searchQuery}
									onChange={e => setSearchQuery(e.target.value)}
									className='pl-10'
								/>
							</div>
						</div>
						<Select
							value={statusFilter}
							onValueChange={value => setStatusFilter(value)}
						>
							<SelectTrigger className='w-[180px]'>
								<SelectValue placeholder='Статус' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='all'>Все клиенты</SelectItem>
								<SelectItem value='active'>Активные</SelectItem>
								<SelectItem value='inactive'>Неактивные</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			<ClientsTable
				clients={filteredClients}
				onEdit={handleEditClient}
				onDelete={handleDeleteClient}
				currentUser={'Admin'}
			/>

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
