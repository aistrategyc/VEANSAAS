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

import { ClientStats } from '@/features/clients/ClientStats'
import { Filters } from '@/widgets/filters/Filters'
import { HeaderWrapper } from '@/widgets/wrapper/HeaderWrapper'

export default function ClientsPag() {
	const [clients, setClients] = useState(mockClients)
	const [selectedClient, setSelectedClient] = useState(null)
	const [isClientModalOpen, setIsClientModalOpen] = useState(false)
	const [isImportModalOpen, setIsImportModalOpen] = useState(false)

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

	const handleDeleteClient = clientId => {
		setClients(prev => prev.filter(client => client.id !== clientId))
	}

	const handleImportComplete = importedClients => {
		setClients(prev => [...importedClients, ...prev])
		setIsImportModalOpen(false)
	}

	return (
		<div className='space-y-6'>
			<HeaderWrapper desc='Управление базой клиентов салона' title='Клиенты'>
				<Button variant='outline' onClick={() => setIsImportModalOpen(true)}>
					<Upload className='h-4 w-4 mr-2' />
					Импорт
				</Button>
				<Button onClick={handleCreateClient}>
					<Plus className='h-4 w-4 mr-2' />
					Добавить клиента
				</Button>
			</HeaderWrapper>

			<ClientStats clients={clients} />
			<Filters
				title='Поиск и фильтры'
				description='Найдите нужных клиентов по различным критериям'
				searchPlaceholder='Поиск по имени, email или телефону...'
			/>

			<ClientsTable
				clients={clients}
				onEdit={handleEditClient}
				onDelete={handleDeleteClient}
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
