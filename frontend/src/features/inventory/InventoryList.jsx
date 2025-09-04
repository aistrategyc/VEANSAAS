import React from 'react'
import { InventoryItem } from './InventoryItem'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const InventoryList = ({ inventories }) => {
	return (
		<Card className='bg-card border-border'>
			<CardHeader>
				<CardTitle className='text-card-foreground'>Список товаров</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='space-y-4'>
					{inventories.map(inventory => (
						<InventoryItem
							key={inventory.id}
							category={inventory.category}
							currentStock={inventory.currentStock}
							id={inventory.id}
							lastRestocked={inventory.lastRestocked}
							minStock={inventory.minStock}
							name={inventory.name}
							price={inventory.price}
							status={inventory.status}
							supplier={inventory.supplier}
							unit={inventory.unit}
						/>
					))}
				</div>
			</CardContent>
		</Card>
	)
}
