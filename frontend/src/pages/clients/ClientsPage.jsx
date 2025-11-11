import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { ClientsTable } from '@/features/clients/ClientsTable'
import { ClientModal } from '@/features/clients/ClientModal'
import { ClientStats } from '@/features/clients/ClientStats'
import { Filters } from '@/widgets/filters/Filters'
import { HeaderWrapper } from '@/widgets/wrapper/HeaderWrapper'
import { useClient } from '@/features/clients/hooks/useClients'
import { Loader } from '@/shared/ui/loader/Loader'

export default function ClientsPag() {
	const [selectedClient, setSelectedClient] = useState(null)
	const [isClientModalOpen, setIsClientModalOpen] = useState(false)

	const {
		clients,
		pagination,
		fetchClients,

		createClient,
		updateClient,
		isLoading,
		handlePageChange,
	} = useClient()

	useEffect(() => {
		fetchClients()
	}, [])

	const handleCreateClient = () => {
		setSelectedClient(null)
		setIsClientModalOpen(true)
	}

	const handleEditClient = client => {
		setSelectedClient(client)
		setIsClientModalOpen(true)
	}

	const handleCloseModal = () => {
		setIsClientModalOpen(false)
		setSelectedClient(null)
	}
	const handlePageChangeWrapper = page => {
		handlePageChange(page, pagination.pageSize)
	}
	const handleDeleteClient = clientId => {}

	if (isLoading) {
		return <Loader />
	}
	return (
		<div className='space-y-6'>
			<HeaderWrapper desc='Управление базой клиентов салона' title='Клиенты'>
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
				currentPage={pagination.currentPage}
				pageSize={pagination.pageSize}
				totalCount={pagination.totalCount}
				onPageChange={handlePageChangeWrapper}
			/>

			<ClientModal
				isOpen={isClientModalOpen}
				onClose={handleCloseModal}
				client={selectedClient}
				handleCreate={createClient}
				handleUpdate={updateClient}
			/>
		</div>
	)
}
