import { Badge } from '@/components/ui/badge'
import { UserCheck, Star, Calendar, Plus } from 'lucide-react'
import { HeaderPages } from '@/features/headerPages/HeaderPages'
import { StatsList } from '@/features/stats/StatsList'

import { StaffTable } from '@/features/staff/StaffTable'
import { useStaff } from '@/features/staff/hooks/useStaff'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { HeaderWrapper } from '@/widgets/wrapper/HeaderWrapper'
import { Button } from '@/components/ui/button'
import { StaffModal } from '@/features/staff/StaffModal'

export default function StaffPage() {
	const statsEmployeeList = [
		{ id: 1, icon: UserCheck, count: '24', name: 'Всего сотрудников' },
		{ id: 2, icon: Badge, count: '21', name: 'Активные' },
		{ id: 3, icon: Calendar, count: '3', name: 'В отпуске' },
		{ id: 4, icon: Star, count: '4.8', name: 'Средний рейтинг' },
	]
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

	const { staff, fetchStaff, createInvite } = useStaff()
	const { currentStudio } = useSelector(state => state.rootReducer.studios)

	useEffect(() => {
		fetchStaff()
	}, [currentStudio])

	const handleIsOpenModal = () => {
		setIsCreateModalOpen(true)
	}
	const handleCloseModal = () => {
		setIsCreateModalOpen(false)
	}

	return (
		<div className='space-y-6'>
			<HeaderWrapper title='Сотрудники' desc='Управление персоналом'>
				<Button onClick={handleIsOpenModal}>
					<Plus className='h-4 w-4 mr-2' />
					Добавить сотрудника
				</Button>
			</HeaderWrapper>
			<StatsList stats={statsEmployeeList} />
			<StaffTable staffList={staff} />

			<StaffModal
				isOpen={isCreateModalOpen}
				onClose={handleCloseModal}
				handleCreate={createInvite}
				currentStudio={currentStudio}
			/>
		</div>
	)
}
