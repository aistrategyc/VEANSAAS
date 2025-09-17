import { Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from '@/components/ui/table'

export function SpacesTable({ spaces, onEdit, onDelete, userRole }) {
	const canEdit = userRole === 'admin' || userRole === 'master_owner'
	const canDelete = userRole === 'admin' || userRole === 'master_owner'

	return (
		<div className='rounded-md border'>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Название</TableHead>
						<TableHead>Тип</TableHead>
						<TableHead>Совместимые услуги</TableHead>
						<TableHead>Статус</TableHead>
						{(canEdit || canDelete) && (
							<TableHead className='w-[100px]'>Действия</TableHead>
						)}
					</TableRow>
				</TableHeader>
				<TableBody>
					{spaces.map(space => (
						<TableRow key={space.id}>
							<TableCell className='font-medium'>{space.name}</TableCell>
							<TableCell>
								<Badge variant='outline'>{space.type}</Badge>
							</TableCell>
							<TableCell>
								<div className='flex flex-wrap gap-1'>
									{space.compatibleServices?.slice(0, 3).map(serviceId => (
										<Badge
											key={serviceId}
											variant='secondary'
											className='text-xs'
										>
											Услуга {serviceId?.slice(0, 8)}
										</Badge>
									))}
									{space.compatibleServices?.length > 3 && (
										<Badge variant='secondary' className='text-xs'>
											+{space.compatibleServices?.length - 3}
										</Badge>
									)}
								</div>
							</TableCell>
							<TableCell>
								<Badge variant={space.isActive ? 'default' : 'secondary'}>
									{space.isActive ? 'Активно' : 'Неактивно'}
								</Badge>
							</TableCell>
							{(canEdit || canDelete) && (
								<TableCell>
									<div className='flex items-center gap-2'>
										{canEdit && (
											<Button
												variant='ghost'
												size='sm'
												onClick={() => onEdit(space)}
											>
												<Edit className='h-4 w-4' />
											</Button>
										)}
										{canDelete && (
											<Button
												variant='ghost'
												size='sm'
												onClick={() => onDelete(space.id)}
											>
												<Trash2 className='h-4 w-4' />
											</Button>
										)}
									</div>
								</TableCell>
							)}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}
