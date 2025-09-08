import { Button } from '@/components/ui/button'
import { useAuth } from '@/shared/hooks/useAuth'
import { Eye, Plus, User } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

export const HeaderPages = ({
	title,
	description,
	nameButton,
	type = null,
}) => {
	const { currentRole } = useAuth()
	const [permissions, setPermissions] = useState([])
	const roles = useSelector(state => state.rootReducer.roles.roles)
	useEffect(() => {
		setPermissions(roles.find(user => user.name === currentRole).permissions)
	}, [roles])

	const hasPermission = requiredPermission => {
		if (!requiredPermission) return true
		return permissions.includes(requiredPermission)
	}

	return (
		<div className='flex flex-wrap items-center justify-between max-md:'>
			<div>
				<h1 className='max-sm:text-xl text-3xl font-bold text-foreground'>
					{title}
				</h1>
				<p className='max-sm:text-sm text-muted-foreground'>{description}</p>
			</div>
			{hasPermission('main:create') && (
				<div className='flex gap-2 max-md:mt-2'>
					{(() => {
						switch (type) {
							case 'analytics':
								return (
									<>
										<Button variant='outline'>Экспорт</Button>
										<Button className='bg-primary hover:bg-primary/90'>
											Создать отчет
										</Button>
									</>
								)
							case 'main':
								return (
									<div className='flex gap-2'>
										<Button
											variant='outline'
											className='hover:scale-105 transition-all duration-200 bg-transparent'
										>
											<Eye className='h-4 w-4 mr-2' />
											Обзор
										</Button>
										<Button className='bg-primary hover:bg-primary/90 transition-all duration-200 hover:scale-105'>
											<Plus className='h-4 w-4 mr-2' />
											Новая запись
										</Button>
									</div>
								)
							default:
								return (
									<Button className='bg-primary hover:bg-primary/90'>
										<Plus className='h-4 w-4 mr-2' />
										{nameButton}
									</Button>
								)
						}
					})()}
				</div>
			)}
		</div>
	)
}
