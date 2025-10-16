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

export function ServicesTable({ services, categories, onEdit, onDelete }) {
	const currentUser = 'Admin'
	const canEdit = currentUser === 'Admin' || currentUser === 'MasterOwner'
	const canDelete = currentUser === 'Admin' || currentUser === 'MasterOwner'

	const getCategoryByUuid = categoryUuid => {
		return categories.find(c => c.uuid === categoryUuid)
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
			<CardHeader className='pb-3'>
				<CardTitle className='text-xl'>Услуги</CardTitle>
				<CardDescription>
					Список всех услуг салона ({services.length})
				</CardDescription>
			</CardHeader>
			<CardContent className='p-0'>
				<div className='rounded-md border'>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className='pl-6'>Название</TableHead>
								<TableHead>Категория</TableHead>
								<TableHead>Цена</TableHead>
								<TableHead>Статус</TableHead>
								{(canEdit || canDelete) && (
									<TableHead className='w-[120px] text-right pr-6'>
										Действия
									</TableHead>
								)}
							</TableRow>
						</TableHeader>
						<TableBody>
							{services.map(service => {
								const category = getCategoryByUuid(service.category_uuid)
								return (
									<TableRow
										key={service.uuid}
										className='group hover:bg-muted/50'
									>
										<TableCell className='pl-6'>
											<div className='space-y-1'>
												<div className='font-medium text-base'>
													{service.name}
												</div>
												{service.description && (
													<div className='text-sm text-muted-foreground line-clamp-2 max-w-md'>
														{service.description}
													</div>
												)}
											</div>
										</TableCell>
										<TableCell>
											{category ? (
												<div className='flex items-center space-x-2'>
													{category.color && (
														<div
															className='w-3 h-3 rounded-full flex-shrink-0'
															style={{ backgroundColor: category.color }}
														/>
													)}
													<span className='text-sm font-medium'>
														{category.name}
													</span>
												</div>
											) : (
												<Badge variant='outline' className='text-xs'>
													Без категории
												</Badge>
											)}
										</TableCell>
										<TableCell>
											<div className='flex flex-col'>
												<span className='font-semibold text-base'>
													{service.base_price} $
												</span>
												{parseFloat(service.base_price) === 0 && (
													<span className='text-xs text-muted-foreground'>
														Бесплатно
													</span>
												)}
											</div>
										</TableCell>
										<TableCell>
											<Badge
												variant={service.is_active ? 'default' : 'secondary'}
												className={
													service.is_active
														? 'bg-green-100 text-green-800 hover:bg-green-100 border-green-200'
														: 'bg-gray-100 text-gray-600 hover:bg-gray-100'
												}
											>
												{service.is_active ? 'Активна' : 'Неактивна'}
											</Badge>
										</TableCell>
										{(canEdit || canDelete) && (
											<TableCell>
												<div className='flex items-center justify-end space-x-1 pr-2'>
													{canEdit && (
														<Button
															variant='ghost'
															size='sm'
															onClick={() => onEdit(service)}
															className='h-8 w-8 p-0 hover:bg-primary/10'
														>
															<Edit className='h-4 w-4' />
															<span className='sr-only'>Редактировать</span>
														</Button>
													)}
													{canDelete && (
														<Button
															variant='ghost'
															size='sm'
															onClick={() => onDelete(service)}
															className='h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10'
														>
															<Trash2 className='h-4 w-4' />
															<span className='sr-only'>Удалить</span>
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
