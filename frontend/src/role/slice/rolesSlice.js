// store/slices/rolesSlice.js
import { parseJwt } from '@/shared/helper/jwt-helpers'
import { getCookie } from '@/shared/helper/cookie-utils'
import { createSlice } from '@reduxjs/toolkit'

// Моковые данные ролей
const initialRoles = [
	{
		id: '1',
		name: 'admin',
		description: 'Полный доступ ко всем функциям системы',
		permissions: [
			'settings:read',
			'settings:write',
			'settings:system',

			'analytics:view',
			'analytics:create',
			'analytics:export',

			'studios:view',
			'studios:create',
			'studios:edit',
			'studios:delete',
			'studios:export',

			'finance:view',
			'finance:create',
			'finance:edit',
			'finance:delete',
			'finance:export',

			'loyalty:view',
			'loyalty:create',
			'loyalty:edit',
			'loyalty:delete',
			'loyalty:export',

			'client:view',
			'client:create',
			'client:edit',
			'client:delete',
			'client:export',

			'staff:view',
			'staff:create',
			'staff:edit',
			'staff:delete',
			'staff:export',

			'records:view',
			'records:create',
			'records:edit',
			'records:delete',
			'records:export',

			'services:view',
			'services:create',
			'services:edit',
			'services:delete',
			'services:export',

			'inventory:view',
			'inventory:create',
			'inventory:edit',
			'inventory:delete',
			'inventory:export',

			'main:create',

			'view:page',
			'view:calendar',
			'view:inventory',
			'view:services',
			'view:appointments',
			'view:records',
			'view:staff',
			'view:clients',
			'view:loyalty',
			'view:schedule',
			'view:finances',
			'view:report',
			'view:studios',
			'view:analytics',
			'view:locations',
			'view:locations',
			'view:role',
		],
		isSystem: true,
	},
	{
		id: '2',
		name: 'masterOwner',
		description: 'Доступ к управлению пользователями и отчетам',
		permissions: [
			'view:page',
			'view:finance',
			'view:report',
			'view:studios',
			'view:analytics',
			'view:clients',
			'view:locations',
			'view:records',
		],
		isSystem: false,
	},
	{
		id: '3',
		name: 'master',
		description: 'Базовый доступ к системе',
		permissions: [
			'view:page',
			'view:calendar',
			'view:inventory',
			'view:clients',
			'view:services',
			'view:records',
		],
		isSystem: false,
	},
	{
		id: '4',
		name: 'student',
		description: 'Студент',
		permissions: [
			'view:page',
			'view:finance',
			'view:report',
			'view:studios',
			'view:analytics',
			'view:locations',
		],
		isSystem: false,
	},
]
const permissionsAll = parseJwt(getCookie('authToken'))?.permissions

const rolesSlice = createSlice({
	name: 'roles',
	initialState: {
		roles: initialRoles,
		permissions: permissionsAll,
		loading: false,
		error: null,
	},
	reducers: {
		// Создание новой роли
		createRole: (state, action) => {
			const newRole = {
				id: state.roles.length + 1,
				isSystem: false,
				...action.payload,
			}
			state.roles.push(newRole)
		},

		// Обновление существующей роли
		updateRole: (state, action) => {
			const updatedRole = action.payload
			state.roles = state.roles.map(role =>
				role.id === updatedRole.id ? { ...role, ...updatedRole } : role
			)
		},

		// Удаление роли
		deleteRole: (state, action) => {
			const roleId = action.payload
			state.roles = state.roles.filter(role => role.id !== roleId)
		},

		setRolesLoading: (state, action) => {
			state.loading = action.payload
		},

		setRolesError: (state, action) => {
			state.error = action.payload
		},
	},
})

export const {
	createRole,
	updateRole,
	deleteRole,
	setRolesLoading,
	setRolesError,
} = rolesSlice.actions

export default rolesSlice.reducer
