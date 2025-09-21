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

export function ChangeStudio() {
	const [studios, setStudios] = useState([])
	const featchStudios = async () => {
		await api.get('/studios/').then(response => {
			setStudios(response.data.items)
		})
	}
	const handleChange = studio => {
		localStorage.setItem('currentStudioUuid', studio.uuid)
	}

	useEffect(() => {
		featchStudios()
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
						key={studio.id}
						onClick={() => handleChange(studio)}
						className='flex flex-col items-start py-2 cursor-pointer'
					>
						<span className='font-medium'>{studio.name}</span>
					</DropdownMenuItem>
				))}
				<DropdownMenuItem onClick={() => handleChange({ uuid: 'ddd' })}>
					nema
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
