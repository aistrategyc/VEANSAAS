import { useState, useEffect } from 'react'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentRole } from '@/role/slice/rolesCurrentSlice'

export function DropDownRole() {
	const dispatch = useDispatch()
	const roles = useSelector(state => state.rootReducer.roles?.roles)
	const currentRoleId = useSelector(
		state => state.rootReducer.rolesCurrent.roleId
	)
	const handleChange = role => {
		dispatch(setCurrentRole(role))
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='outline' className='flex items-center gap-2 m-4'>
					{currentRoleId}
					<ChevronDown className='h-4 w-4 opacity-50' />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56'>
				{roles.map(role => (
					<DropdownMenuItem
						key={role.id}
						onClick={() => handleChange(role.name)}
						className='flex flex-col items-start py-2 cursor-pointer'
					>
						<span className='font-medium'>{role.name}</span>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
