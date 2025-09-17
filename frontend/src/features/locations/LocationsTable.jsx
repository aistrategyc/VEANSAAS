import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from '@/components/ui/table'
import { Edit, Trash2 } from 'lucide-react'

export function LocationsTable({ locations, onEdit, onDelete, userRole }) {
	const canEdit = userRole === 'admin' || userRole === 'master_owner'
	const canDelete = userRole === 'admin' || userRole === 'master_owner'

	return (
		<div className='rounded-md border'>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Название</TableHead>
						<TableHead>Адрес</TableHead>
						<TableHead>Рабочих мест</TableHead>
						<TableHead>Статус</TableHead>
						<TableHead>Часы работы</TableHead>
						{(canEdit || canDelete) && (
							<TableHead className='w-[100px]'>Действия</TableHead>
						)}
					</TableRow>
				</TableHeader>
				<TableBody>
					{locations.map(location => (
						<TableRow key={location.id}>
							<TableCell className='font-medium'>{location.name}</TableCell>
							<TableCell>{location.address}</TableCell>
							<TableCell>{location.spaces?.length}</TableCell>
							<TableCell>
								<Badge variant={location.isActive ? 'default' : 'secondary'}>
									{location.isActive ? 'Активна' : 'Неактивна'}
								</Badge>
							</TableCell>
							<TableCell>
								{location.workingHours?.start} - {location.workingHours?.end}
							</TableCell>
							{(canEdit || canDelete) && (
								<TableCell>
									<div className='flex items-center gap-2'>
										{canEdit && (
											<Button
												variant='ghost'
												size='sm'
												onClick={() => onEdit(location)}
											>
												<Edit className='h-4 w-4' />
											</Button>
										)}
										{canDelete && (
											<Button
												variant='ghost'
												size='sm'
												onClick={() => onDelete(location.id)}
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
