// mocks/rolesMock.js
export const mockRoles = {
	admin: {
		permissions: [
			'user:create',
			'user:read',
			'user:update',
			'user:delete',
			'report:view',
			'report:edit',
			'settings:read',
			'settings:write',
			'dashboard:view',
			'analytics:view',
			'main:create',
		],
		name: 'Administrator',
		description: 'Полный доступ ко всем функциям системы',
	},
	manager: {
		permissions: [
			'user:read',
			'user:update',
			'report:view',
			'report:edit',
			'dashboard:view',
			'analytics:view',
		],
		name: 'Manager',
		description: 'Доступ к управлению пользователями и отчетам',
	},
	user: {
		permissions: [
			'user:read',
			'report:view',
			'dashboard:view',
			'settings:write',
			'dashboard:view',
			'analytics:view',
			'report:edit',
		],
		name: 'User',
		description: 'Базовый доступ к системе',
	},
	auditor: {
		permissions: ['report:view', 'analytics:view', 'dashboard:view'],
		name: 'Auditor',
		description: 'Доступ только для просмотра отчетов и аналитики',
	},
}

export const mockUsers = [
	{
		id: 1,
		username: 'admin_user',
		email: 'admin@example.com',
		role: 'admin',
		permissions: mockRoles.admin.permissions,
	},
	{
		id: 2,
		username: 'manager_user',
		email: 'manager@example.com',
		role: 'manager',
		permissions: mockRoles.manager.permissions,
	},
	{
		id: 3,
		username: 'regular_user',
		email: 'user@example.com',
		role: 'user',
		permissions: mockRoles.user.permissions,
	},
]
