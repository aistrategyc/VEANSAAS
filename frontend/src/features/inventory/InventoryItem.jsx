import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Edit, Eye, Package, Trash2 } from 'lucide-react'
export const InventoryItem = ({
	status,
	name,
	category,
	supplier,
	currentStock,
	minStock,
	unit,
	price,
	lastRestocked,
	id,
}) => {
	return (
		<div className='flex flex-wrap items-center justify-between p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-all duration-200 hover:scale-[1.01] group'>
			<div className='flex items-center gap-4'>
				<div
					className={`w-12 h-12 rounded-lg flex items-center justify-center ${
						status === 'out-of-stock'
							? 'bg-red-500/20'
							: status === 'low-stock'
							? 'bg-yellow-500/20'
							: 'bg-green-500/20'
					}`}
				>
					<Package
						className={`h-5 w-5 ${
							status === 'out-of-stock'
								? 'text-red-500'
								: status === 'low-stock'
								? 'text-yellow-500'
								: 'text-green-500'
						}`}
					/>
				</div>
				<div>
					<p className='font-medium text-foreground group-hover:text-primary transition-colors'>
						{name}
					</p>
					<p className='text-sm text-muted-foreground'>{category}</p>
					<p className='text-xs text-muted-foreground'>Поставщик: {supplier}</p>
				</div>
			</div>
			<div className='flex flex-wrap items-center gap-6 max-md:mt-3'>
				<div className='text-center'>
					<p
						className={`font-medium ${
							currentStock === 0
								? 'text-red-500'
								: currentStock <= minStock
								? 'text-yellow-500'
								: 'text-foreground'
						}`}
					>
						{currentStock} {unit}
					</p>
					<p className='text-xs text-muted-foreground'>В наличии</p>
				</div>
				<div className='text-center'>
					<p className='font-medium text-foreground'>
						{minStock} {unit}
					</p>
					<p className='text-xs text-muted-foreground'>Минимум</p>
				</div>
				<div className='text-center'>
					<p className='font-medium text-foreground'>{price}</p>
					<p className='text-xs text-muted-foreground'>Цена</p>
				</div>
				<div className='text-center'>
					<p className='font-medium text-foreground'>{lastRestocked}</p>
					<p className='text-xs text-muted-foreground'>Последнее пополнение</p>
				</div>
				<Badge
					variant={
						status === 'in-stock'
							? 'default'
							: status === 'low-stock'
							? 'secondary'
							: 'destructive'
					}
					className={
						status === 'low-stock' ? 'bg-yellow-500/20 text-yellow-500' : ''
					}
				>
					{status === 'in-stock'
						? 'В наличии'
						: status === 'low-stock'
						? 'Заканчивается'
						: 'Закончился'}
				</Badge>
				<div className='flex items-center gap-1'>
					<Button size='sm' variant='ghost' className='hover:bg-primary/10'>
						<Eye className='h-4 w-4' />
					</Button>
					<Button size='sm' variant='ghost' className='hover:bg-primary/10'>
						<Edit className='h-4 w-4' />
					</Button>
					<Button size='sm' variant='ghost' className='hover:bg-destructive/10'>
						<Trash2 className='h-4 w-4' />
					</Button>
				</div>
			</div>
		</div>
	)
}
