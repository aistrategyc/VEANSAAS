// components/RoleManager.jsx
import React, { useState } from 'react'
import { Plus, Edit, Trash2, Save, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router'

// Описания разрешений
const permissionDescriptions = {
	'client:create': 'Создание клиента',
	'client:view': 'Просмотр клиента',
	'client:edit': 'Редактирование клиента',
	'client:delete': 'Удаление клиента',
	'client:export': 'Экспорт клиента',

	'staff:create': 'Создание сотрудника',
	'staff:view': 'Просмотр сотрудников',
	'staff:edit': 'Редактирование сотрудников',
	'staff:delete': 'Удаление сотрудников',
	'staff:export': 'Экспорт сотрудников',

	'records:create': 'Создание записей',
	'records:view': 'Просмотр записей',
	'records:edit': 'Редактирование записей',
	'records:delete': 'Удаление записей',
	'records:export': 'Экспорт записей',

	'services:create': 'Создание услуг',
	'services:view': 'Просмотр услуг',
	'services:edit': 'Редактирование услуг',
	'services:delete': 'Удаление услуг',
	'services:export': 'Экспорт услуг',

	'inventory:create': 'Создание товара',
	'inventory:view': 'Просмотр товара',
	'inventory:edit': 'Редактирование товара',
	'inventory:delete': 'Удаление товара',
	'inventory:export': 'Экспорт товара',

	'loyalty:create': 'Создание программы лояльности',
	'loyalty:view': 'Просмотр программ лояльности',
	'loyalty:edit': 'Редактирование программы лояльности',
	'loyalty:delete': 'Удаление программы лояльности',
	'loyalty:export': 'Экспорт программ лояльности',

	'finance:create': 'Создание финансовых операций',
	'finance:view': 'Просмотр финансовых операций',
	'finance:edit': 'Редактирование финансовых операций',
	'finance:delete': 'Удаление финансовых операций',
	'finance:export': 'Экспорт финансовых операций',

	'studios:create': 'Создание студий',
	'studios:view': 'Просмотр студий',
	'studios:edit': 'Редактирование студий',
	'studios:delete': 'Удаление студий',
	'studios:export': 'Экспорт студий',

	'analytics:view': 'Просмотр аналитики',
	'analytics:create': 'Создать отчет аналитики',
	'analytics:export': 'Экспорт аналитики',

	'settings:read': 'Просмотр ролей и разрешений',
	'settings:write': 'Создание ролей и разрешений',
	'settings:system': 'Настройка системных прав',

	'view:page': 'Просмотр страниц',
	'view:calendar': 'Просмотр страниц',
	'view:inventory': 'Просмотр страниц',
	'view:services': 'Просмотр страниц',
	'view:records': 'Просмотр страниц',
	'view:staff': 'Просмотр страниц',
	'view:client': 'Просмотр страниц',
	'view:loyalty': 'Просмотр страниц',
	'view:finance': 'Просмотр страниц',
	'view:report': 'Просмотр страниц',
	'view:studios': 'Просмотр страниц',
	'view:analytics': 'Просмотр страниц',
	'view:locations': 'Просмотр страниц',
	'view:role': 'Просмотр страниц',
}

// Группировка разрешений по категориям
const permissionCategories = [
	{
		name: 'Клиенты',
		permissions: [
			'client:view',
			'client:create',
			'client:edit',
			'client:delete',
			'client:export',
		],
	},
	{
		name: 'Доступ страниц',
		permissions: [
			'view:page',
			'view:calendar',
			'view:inventory',
			'view:services',
			'view:records',
			'view:staff',
			'view:client',
			'view:loyalty',
			'view:finance',
			'view:report',
			'view:studios',
			'view:analytics',
			'view:locations',
			'view:role',
		],
	},
	{
		name: 'Сотрудники',
		permissions: [
			'staff:view',
			'staff:create',
			'staff:edit',
			'staff:delete',
			'staff:export',
		],
	},
	{
		name: 'Записи',
		permissions: [
			'records:view',
			'records:create',
			'records:edit',
			'records:delete',
			'records:export',
		],
	},
	{
		name: 'Услуги',
		permissions: [
			'services:view',
			'services:create',
			'services:edit',
			'services:delete',
			'services:export',
		],
	},
	{
		name: 'Склад',
		permissions: [
			'inventory:view',
			'inventory:create',
			'inventory:edit',
			'inventory:delete',
			'inventory:export',
		],
	},
	{
		name: 'Лояльность',
		permissions: [
			'loyalty:view',
			'loyalty:create',
			'loyalty:edit',
			'loyalty:delete',
			'loyalty:export',
		],
	},
	{
		name: 'Финансы',
		permissions: [
			'finance:view',
			'finance:create',
			'finance:edit',
			'finance:delete',
			'finance:export',
		],
	},
	{
		name: 'Студии',
		permissions: [
			'studios:view',
			'studios:create',
			'studios:edit',
			'studios:delete',
			'studios:export',
		],
	},
	{
		name: 'Аналитика',
		permissions: ['analytics:view', 'analytics:create', 'analytics:export'],
	},
	{
		name: 'Настройки',
		permissions: ['settings:read', 'settings:write', 'settings:system'],
	},
]

const RolePage = () => {
	const dispatch = useDispatch()
	const roles = useSelector(state => state.rootReducer.roles.roles)

	const [selectedRole, setSelectedRole] = useState(null)
	const [isEditing, setIsEditing] = useState(false)
	const [isCreating, setIsCreating] = useState(false)
	const [editRole, setEditRole] = useState({
		name: '',
		description: '',
		permissions: [],
	})

	// Создание новой роли
	const handleCreateRole = () => {
		setIsCreating(true)
		setEditRole({
			name: '',
			description: '',
			permissions: [],
		})
		setSelectedRole(null)
	}

	const handleEditRole = role => {
		setIsEditing(true)
		setIsCreating(false)
		setEditRole({
			id: role.id,
			name: role.name,
			description: role.description,
			permissions: [...role.permissions],
		})
		setSelectedRole(role)
	}

	// Сохранение новой роли или изменений
	const handleSave = () => {
		if (editRole.name && editRole.name.trim()) {
			if (isCreating) {
				// Создание новой роли
				dispatch(createRole(editRole))
				setIsCreating(false)
				setEditRole({
					name: '',
					description: '',
					permissions: [],
				})
			} else {
				// Обновление существующей роли
				dispatch(updateRole(editRole))
				setIsEditing(false)
				setSelectedRole({ ...selectedRole, ...editRole })
			}
		}
	}

	// Отмена редактирования/создания
	const handleCancel = () => {
		setIsEditing(false)
		setIsCreating(false)
		setEditRole({
			name: '',
			description: '',
			permissions: [],
		})
		if (selectedRole && !isCreating) {
			setEditRole({
				id: selectedRole.id,
				name: selectedRole.name,
				description: selectedRole.description,
				permissions: [...selectedRole.permissions],
			})
		}
	}

	// Удаление роли
	const handleDeleteRole = (roleId, e) => {
		e.stopPropagation()
		if (window.confirm('Вы уверены, что хотите удалить эту роль?')) {
			dispatch(deleteRole(roleId))
			if (selectedRole && selectedRole.id === roleId) {
				setSelectedRole(null)
				setIsEditing(false)
			}
		}
	}

	// Переключение разрешения
	const togglePermission = permission => {
		const newPermissions = editRole.permissions.includes(permission)
			? editRole.permissions.filter(p => p !== permission)
			: [...editRole.permissions, permission]

		setEditRole({ ...editRole, permissions: newPermissions })
	}

	// Переключение всей категории
	const toggleCategory = category => {
		const categoryPermissions = permissionCategories.find(
			c => c.name === category
		).permissions
		const allSelected = categoryPermissions.every(p =>
			editRole.permissions.includes(p)
		)

		const newPermissions = allSelected
			? editRole.permissions.filter(p => !categoryPermissions.includes(p))
			: [
					...editRole.permissions,
					...categoryPermissions.filter(p => !editRole.permissions.includes(p)),
			  ]

		setEditRole({ ...editRole, permissions: newPermissions })
	}

	return (
		<div className='p-6 max-w-6xl mx-auto'>
			<div className='flex justify-between items-center mb-6'>
				<h1 className='text-3xl font-bold text-gray'>Управление ролями</h1>
				<Button onClick={handleCreateRole} className='gap-2'>
					<Plus size={16} />
					Создать роль
				</Button>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{/* Список ролей */}
				<Card className='lg:col-span-1'>
					<CardHeader>
						<CardTitle>Роли системы</CardTitle>
						<CardDescription>Выберите роль для редактирования</CardDescription>
					</CardHeader>
					<CardContent>
						<div className='space-y-2'>
							{roles.map(role => (
								<div
									key={role.id}
									className={`p-4 border rounded-lg cursor-pointer transition-colors ${
										selectedRole?.id === role.id
											? 'border-blue-500'
											: 'border-gray-100 hover:border-gray-300'
									}`}
									onClick={() => {
										setSelectedRole(role)
										setIsEditing(false)
										setIsCreating(false)
										setEditRole({
											id: role.id,
											name: role.name,
											description: role.description,
											permissions: [...role.permissions],
										})
									}}
								>
									<div className='flex justify-between items-start'>
										<div>
											<h3 className='font-semibold text-gray'>{role.name}</h3>
											<p className='text-sm text-gray-600 mt-1'>
												{role.description}
											</p>
											<div className='flex items-center gap-2 mt-2'>
												<Badge variant='secondary'>
													{role.permissions.length} разрешений
												</Badge>
												{role.isSystem && (
													<Badge variant='outline'>Системная</Badge>
												)}
											</div>
										</div>
										{!role.isSystem && (
											<div className='flex gap-1'>
												<Button
													variant='ghost'
													size='sm'
													onClick={e => {
														e.stopPropagation()
														handleEditRole(role)
													}}
												>
													<Edit size={14} />
												</Button>
												<Button
													variant='ghost'
													size='sm'
													onClick={e => handleDeleteRole(role.id, e)}
												>
													<Trash2 size={14} />
												</Button>
											</div>
										)}
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Детали роли и редактирование */}
				<Card className='lg:col-span-2'>
					<CardHeader>
						<CardTitle>
							{isCreating
								? 'Создание новой роли'
								: selectedRole
								? isEditing
									? `Редактирование: ${selectedRole.name}`
									: selectedRole.name
								: 'Выберите роль'}
						</CardTitle>
						<CardDescription>
							{isCreating
								? 'Заполните данные новой роли'
								: selectedRole
								? selectedRole.description
								: 'Выберите роль из списка для просмотра и редактирования'}
						</CardDescription>
					</CardHeader>
					<CardContent>
						{selectedRole || isCreating ? (
							<div className='space-y-6'>
								{/* Редактирование названия и описания */}
								{(isEditing || isCreating) && (
									<div className='space-y-4'>
										<div>
											<Label htmlFor='role-name'>Название роли *</Label>
											<Input
												id='role-name'
												value={editRole.name}
												onChange={e =>
													setEditRole({ ...editRole, name: e.target.value })
												}
												placeholder='Введите название роли'
											/>
										</div>
										<div>
											<Label htmlFor='role-description'>Описание</Label>
											<Input
												id='role-description'
												value={editRole.description}
												onChange={e =>
													setEditRole({
														...editRole,
														description: e.target.value,
													})
												}
												placeholder='Введите описание роли'
											/>
										</div>
									</div>
								)}

								{/* Разрешения */}
								<div>
									<h3 className='font-semibold text-lg mb-4'>Разрешения</h3>

									{isEditing || isCreating ? (
										// Режим редактирования
										<div className='space-y-4'>
											{permissionCategories.map(category => {
												const categoryPermissions = category.permissions
												const selectedCount = categoryPermissions.filter(p =>
													editRole.permissions.includes(p)
												).length
												const allSelected =
													selectedCount === categoryPermissions.length
												const someSelected = selectedCount > 0 && !allSelected

												return (
													<div
														key={category.name}
														className='border rounded-lg p-4'
													>
														<div className='flex items-center gap-3 mb-3'>
															<Checkbox
																checked={allSelected}
																indeterminate={someSelected}
																onCheckedChange={() =>
																	toggleCategory(category.name)
																}
															/>
															<Label className='font-semibold text-base'>
																{category.name}
															</Label>
															<Badge variant='outline'>
																{selectedCount}/{categoryPermissions.length}
															</Badge>
														</div>
														<div className='grid grid-cols-1 md:grid-cols-2 gap-2 ml-8'>
															{categoryPermissions.map(permission => (
																<div
																	key={permission}
																	className='flex items-center gap-2'
																>
																	<Checkbox
																		checked={editRole.permissions.includes(
																			permission
																		)}
																		onCheckedChange={() =>
																			togglePermission(permission)
																		}
																	/>
																	<Label className='text-sm'>
																		{permissionDescriptions[permission]}
																	</Label>
																</div>
															))}
														</div>
													</div>
												)
											})}
										</div>
									) : (
										// Режим просмотра
										<div className='space-y-4'>
											{permissionCategories.map(category => {
												const rolePermissions = selectedRole.permissions.filter(
													p => category.permissions.includes(p)
												)

												if (rolePermissions.length === 0) return null

												return (
													<div
														key={category.name}
														className='border rounded-lg p-4'
													>
														<h4 className='font-semibold mb-3'>
															{category.name}
														</h4>
														<div className='flex flex-wrap gap-2'>
															{rolePermissions.map(permission => (
																<Badge key={permission} variant='secondary'>
																	{permissionDescriptions[permission]}
																</Badge>
															))}
														</div>
													</div>
												)
											})}
										</div>
									)}
								</div>

								{/* Кнопки действий */}
								{(isEditing || isCreating) && (
									<div className='flex gap-3 pt-4 border-t'>
										<Button
											onClick={handleSave}
											className='gap-2'
											disabled={!editRole.name.trim()}
										>
											<Save size={16} />
											{isCreating ? 'Создать роль' : 'Сохранить'}
										</Button>
										<Button
											variant='outline'
											onClick={handleCancel}
											className='gap-2'
										>
											<X size={16} />
											Отмена
										</Button>
									</div>
								)}

								{!isEditing &&
									!isCreating &&
									selectedRole &&
									!selectedRole.isSystem && (
										<div className='pt-4 border-t'>
											<Button
												onClick={() => handleEditRole(selectedRole)}
												className='gap-2'
											>
												<Edit size={16} />
												Редактировать роль
											</Button>
										</div>
									)}
							</div>
						) : (
							<div className='text-center py-12 text-gray-500'>
								<p>Выберите роль из списка слева для просмотра деталей</p>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	)
}

export default RolePage
