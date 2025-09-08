import React from 'react'

export const CategoriesItem = ({ color, name, type, count }) => {
	return (
		<div className='flex flex-wrap items-center gap-3 p-3 rounded-lg bg-muted/20'>
			<div className={`w-3 h-3 rounded-full ${color}`} />
			<div>
				<p className='font-medium text-foreground text-sm max-md:text-xs'>
					{name}
				</p>
				<p className='text-xs text-muted-foreground'>
					{count} {type === 'service' ? 'услуг' : 'товаров'}
				</p>
			</div>
		</div>
	)
}
