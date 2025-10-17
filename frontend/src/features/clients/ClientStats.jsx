import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Plus } from 'lucide-react'


export const ClientStats = ({ clients }) => {
	const total = clients.length
	const active = clients.filter(c => c.isActive).length
	const inactive = clients.filter(c => !c.isActive).length
	const thisMonth = clients.filter(c => {
		const created = new Date(c.createdAt)
		const now = new Date()
		return (
			created.getMonth() === now.getMonth() &&
			created.getFullYear() === now.getFullYear()
		)
	}).length

	return (
		<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
			<Card>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='text-sm font-medium'>Всего клиентов</CardTitle>
					<Users className='h-4 w-4 text-muted-foreground' />
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold'>{total}</div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='text-sm font-medium'>Активные</CardTitle>
					<Badge variant='default' className='h-4 px-1 text-xs'>
						A
					</Badge>
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold'>{active}</div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='text-sm font-medium'>Неактивные</CardTitle>
					<Badge variant='secondary' className='h-4 px-1 text-xs'>
						N
					</Badge>
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold'>{inactive}</div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='text-sm font-medium'>Новые за месяц</CardTitle>
					<Plus className='h-4 w-4 text-muted-foreground' />
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold'>{thisMonth}</div>
				</CardContent>
			</Card>
		</div>
	)
}
