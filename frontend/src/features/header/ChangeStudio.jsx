import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'
import { getCookie } from '@/shared/helper/authHelper'
import { api } from '@/shared/api/api'
import { useEffect, useState } from 'react'

export const ChangeStudio = () => {
	const [studios, setStudios] = useState([])
	const [currentStudio, setCurrentStudio] = useState(null)

	const fetchStudios = async () => {
		await api.get('/studios/selection').then(response => {
			setStudios(response.data)
			const savedStudioUuid = localStorage.getItem('currentStudioUuid')
			if (savedStudioUuid) {
				const savedStudio = response.data.find(
					studio => studio.uuid === savedStudioUuid
				)
				if (savedStudio) {
					setCurrentStudio(savedStudio)
				}
			}
		})
	}

	const handleChange = studio => {
		setCurrentStudio(studio)
		localStorage.setItem('currentStudioUuid', studio.uuid)
	}

	useEffect(() => {
		fetchStudios()
	}, [])

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='outline' className='flex items-center gap-2'>
					{currentStudio ? `Студия: ${currentStudio.name}` : 'Выбрать студию'}
					<ChevronDown className='h-4 w-4 opacity-50' />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56'>
				{studios.map(studio => (
					<DropdownMenuItem
						key={studio.uuid}
						onClick={() => handleChange(studio)}
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
