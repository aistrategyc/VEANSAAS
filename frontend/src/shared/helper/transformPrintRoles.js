export const transPrintRoles = name => {
	return {
		studio_owner: 'Владелец',
		studio_manager: 'Менеджер',
		master: 'Мастер',
		administrator: 'Администратор',
	}[name]
}
