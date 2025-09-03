import { Button } from '@/components/ui/button'
import { Eye, Plus, User } from 'lucide-react'
import React from 'react'

export const HeaderPages = ({
	title,
	description,
	nameButton,
	type = null,
}) => {
	return (
		<div className='flex flex-wrap items-center justify-between'>
			<div>
				<h1 className='max-sm:text-xl text-3xl font-bold text-foreground'>
					{title}
				</h1>
				<p className='max-sm:text-sm text-muted-foreground'>{description}</p>
			</div>
			<div className='flex gap-2'>
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
		</div>
	)
}
