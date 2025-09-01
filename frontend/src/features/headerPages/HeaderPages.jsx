import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import React from 'react'

export const HeaderPages = ({ title, description, nameButton }) => {
	return (
		<div className='flex items-center justify-between'>
			<div>
				<h1 className='text-3xl font-bold text-foreground'>{title}</h1>
				<p className='text-muted-foreground'>{description}</p>
			</div>
			<Button className='bg-primary hover:bg-primary/90'>
				<Plus className='h-4 w-4 mr-2' />
				{nameButton}
			</Button>
		</div>
	)
}
