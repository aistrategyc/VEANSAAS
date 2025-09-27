import { Edit, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'

export function ServicesTable({
	services,
	categories,
	onEdit,
	onDelete,
	currentUser,
}) {
	const canEdit =
		currentUser?.role === 'Admin' || currentUser?.role === 'MasterOwner'
	const canDelete =
		currentUser?.role === 'Admin' || currentUser?.role === 'MasterOwner'

	const getCategoryById = categoryId => {
		return categories.find(c => c.id === categoryId)
	}

	if (services.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Услуги не найдены</CardTitle>
					<CardDescription>
						Попробуйте изменить параметры поиска или добавьте новую услугу
					</CardDescription>
				</CardHeader>
			</Card>
		)
	}

	return (
		<Card>
			<CardContent className='p-0'>
				<div className='rounded-md border'>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Название</TableHead>
								<TableHead>Категория</TableHead>
								<TableHead>Длительность</TableHead>
								<TableHead>Цена</TableHead>
								<TableHead>Статус</TableHead>
								<TableHead>Квалификации</TableHead>
								{(canEdit || canDelete) && (
									<TableHead className='w-[100px]'>Действия</TableHead>
								)}
							</TableRow>
						</TableHeader>
						<TableBody>
							{services.map(service => {
								const category = getCategoryById(service.categoryId)
								return (
									<TableRow key={service.id}>
										<TableCell>
											<div>
												<div className='font-medium'>{service.name}</div>
												{service.description && (
													<div className='text-sm text-muted-foreground line-clamp-1'>
														{service.description}
													</div>
												)}
											</div>
										</TableCell>
										<TableCell>
											{category && (
												<Badge
													variant='secondary'
													className='flex items-center space-x-1 w-fit'
												>
													<div
														className='w-2 h-2 rounded-full'
														style={{ backgroundColor: category.color }}
													/>
													<span>{category.name}</span>
												</Badge>
											)}
										</TableCell>
										<TableCell>
											<div className='flex flex-col'>
												<span>{service.duration} мин</span>
												{service.bufferTime && service.bufferTime > 0 && (
													<span className='text-xs text-muted-foreground'>
														+{service.bufferTime} мин подготовка
													</span>
												)}
											</div>
										</TableCell>
										<TableCell>
											<span className='font-medium'>
												{service.price.toLocaleString()} ₽
											</span>
										</TableCell>
										<TableCell>
											<Badge
												variant={service.isActive ? 'default' : 'secondary'}
											>
												{service.isActive ? 'Активна' : 'Неактивна'}
											</Badge>
										</TableCell>
										<TableCell>
											<div className='flex flex-wrap gap-1'>
												{service.requiredQualifications
													.slice(0, 2)
													.map(qual => (
														<Badge
															key={qual}
															variant='outline'
															className='text-xs'
														>
															{qual}
														</Badge>
													))}
												{service.requiredQualifications.length > 2 && (
													<Badge variant='outline' className='text-xs'>
														+{service.requiredQualifications.length - 2}
													</Badge>
												)}
											</div>
										</TableCell>
										{(canEdit || canDelete) && (
											<TableCell>
												<div className='flex items-center gap-2'>
													{canEdit && (
														<Button
															variant='ghost'
															size='sm'
															onClick={() => onEdit(service)}
														>
															<Edit className='h-4 w-4' />
														</Button>
													)}
													{canDelete && (
														<Button
															variant='ghost'
															size='sm'
															onClick={() => onDelete(service.id)}
															className='text-destructive hover:text-destructive'
														>
															<Trash2 className='h-4 w-4' />
														</Button>
													)}
												</div>
											</TableCell>
										)}
									</TableRow>
								)
							})}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	)
}
