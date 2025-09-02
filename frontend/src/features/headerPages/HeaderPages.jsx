import { Button } from '@/components/ui/button'
import { Plus, User } from 'lucide-react'
import React from 'react'

export const HeaderPages = ({
	title,
	description,
	nameButton,
	type = null,
}) => {
	return (
		<div className='flex items-center justify-between'>
			<div>
				<h1 className='text-3xl font-bold text-foreground'>{title}</h1>
				<p className='text-muted-foreground'>{description}</p>
			</div>
			<div className='flex gap-2'>
				{type == 'analytics' ? (
					<>
						<Button variant='outline'>Экспорт</Button>
						<Button className='bg-primary hover:bg-primary/90'>
							Создать отчет
						</Button>
					</>
				) : (
					<Button className='bg-primary hover:bg-primary/90'>
						<Plus className='h-4 w-4 mr-2' />
						{nameButton}
					</Button>
				)}
			</div>
		</div>
	)
}
