import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'
import api from '@/shared/api/client'
import { useEffect, useState } from 'react'

export const ChangeStudio = () => {
	const [studios, setStudios] = useState([])
	const fetchStudios = async () => {
		await api.get('/studios/selection').then(response => {
			setStudios(response.data)
		})
	}
	const handleChange = studio => {
		localStorage.setItem('currentStudioUuid', studio.uuid)
	}

	useEffect(() => {
		fetchStudios()
	}, [])

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='outline' className='flex items-center gap-2'>
					Выбрать студию
					<ChevronDown className='h-4 w-4 opacity-50' />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56'>
				{studios.map(studio => (
					<DropdownMenuItem
						key={studio.uuid}
						onClick={() => handleChange(studio)}
						className='flex flex-col items-start py-2 cursor-pointer'
					>
						<span className='font-medium'>{studio.name}</span>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
