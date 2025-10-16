import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Loader } from '@/shared/ui/loader/Loader'
import {
	fetchStudiosSelection,
	selectCurrentStudio,
	selectIsSelectionLoading,
	selectStudiosSelection,
	setCurrentStudio,
} from '@/shared/slices/studiosSlice'

export const ChangeStudio = () => {
	const dispatch = useDispatch()

	const studiosSelection = useSelector(selectStudiosSelection)
	const currentStudio = useSelector(selectCurrentStudio)
	const isSelectionLoading = useSelector(selectIsSelectionLoading)

	useEffect(() => {
		dispatch(fetchStudiosSelection())
	}, [])

	const handleStudioChange = studio => {
		dispatch(setCurrentStudio(studio.uuid))
	}

	if (isSelectionLoading) {
		return <Loader />
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='outline' className='flex items-center gap-2'>
					{currentStudio
						? `Студия: ${currentStudio.name}`
						: studiosSelection.length > 0
						? `Студия: ${studiosSelection[0].name}`
						: 'Нет доступных студий'}
					<ChevronDown className='h-4 w-4 opacity-50' />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56'>
				{studiosSelection.map(studio => (
					<DropdownMenuItem
						key={studio.uuid}
						onClick={() => handleStudioChange(studio)}
						className={`flex flex-col items-start py-2 cursor-pointer ${
							currentStudio?.uuid === studio.uuid ? 'bg-accent' : ''
						}`}
					>
						<span className='font-medium'>{studio.name}</span>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
