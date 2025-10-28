import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
	MoreHorizontal,
	Edit,
	Trash2,
	Phone,
	Mail,
	Calendar,
} from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'
import { PermissionGuard } from '@/widgets/permissions/PermissionGuard'
import { Link } from 'react-router'
import { Pagination } from '@/shared/ui/Pagination'

export function StaffTable({
	staffList,
	onDelete,
	currentPage = 1,
	pageSize = 10,
	totalCount = 0,
	onPageChange,
}) {
	const totalPages = Math.ceil(totalCount / pageSize)
	const startItem = (currentPage - 1) * pageSize + 1
	const endItem = Math.min(currentPage * pageSize, totalCount)

	if (staffList?.length === 0) {
		return (
			<EmptyState
				title='Нет клиентов'
				description='Начните добавлять клиентов в вашу базу данных'
				action={{
					label: 'Добавить первого клиента',
					onClick: () => {},
				}}
				icon={<Calendar className='h-12 w-12 text-muted-foreground' />}
			/>
		)
	}
	return (
		<Card>
			<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
				<CardTitle>База клиентов ({totalCount})</CardTitle>
				{totalPages > 1 && (
					<div className='flex items-center space-x-2 text-sm text-muted-foreground'>
						<span>
							{startItem}-{endItem} из {totalCount}
						</span>
					</div>
				)}
			</CardHeader>
			<CardContent>
				<div className='rounded-md border'>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Сотрудник</TableHead>
								<TableHead>Имя</TableHead>
								<TableHead>Роль</TableHead>
								<TableHead>Контакты</TableHead>
								<TableHead>Статус</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{staffList?.map(staff => (
								<TableRow key={staff.uuid}>
									<TableCell>
										<Link to={`/clients/${staff.uuid}`}>
											<div className='flex items-center space-x-3'>
												<Avatar>
													<AvatarFallback>
														{staff.first_name?.[0]}
														{staff.last_name?.[0]}
													</AvatarFallback>
												</Avatar>
												<div>
													<div className='font-medium'>
														{staff.first_name} {staff.last_name}
													</div>
												</div>
											</div>
										</Link>
									</TableCell>

									<TableCell>
										<div className='space-y-1'>
											{staff.first_name} {staff.last_name}
										</div>
									</TableCell>
									<TableCell>
										<div className='space-y-1'>
											{staff.studio_membership.roles.map(role => role)}
										</div>
									</TableCell>
									<TableCell>
										<div className='space-y-1'>
											{staff.phone_number && (
												<div className='flex items-center text-sm'>
													<Phone className='h-3 w-3 mr-1 text-muted-foreground' />
													{staff.phone_number}
												</div>
											)}
											{staff.email && (
												<div className='flex items-center text-sm'>
													<Mail className='h-3 w-3 mr-1 text-muted-foreground' />
													{staff.email}
												</div>
											)}
										</div>
									</TableCell>
									<TableCell>
										<Badge variant={staff.is_active ? 'default' : 'secondary'}>
											{staff.is_active ? 'Активен' : 'Неактивен'}
										</Badge>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
				{totalPages > 1 && (
					<Pagination
						currentPage={currentPage}
						totalCount={totalCount}
						pageSize={pageSize}
						onPageChange={onPageChange}
					/>
				)}
			</CardContent>
		</Card>
	)
}
