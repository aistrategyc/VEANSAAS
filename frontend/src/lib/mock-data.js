export const mockLocations = [
	{
		id: 'loc1',
		name: 'Салон "Красота" - Центр',
		address: 'ул. Тверская, 15, Москва',
		phone: '+7 (495) 123-45-67',
		timezone: 'Europe/Moscow',
		isActive: true,
		organizationId: 'org1',
		createdAt: '2024-01-01T00:00:00Z',
		updatedAt: '2024-01-01T00:00:00Z',
	},
	{
		id: 'loc2',
		name: 'Салон "Красота" - Арбат',
		address: 'ул. Арбат, 25, Москва',
		phone: '+7 (495) 987-65-43',
		timezone: 'Europe/Moscow',
		isActive: true,
		organizationId: 'org1',
		createdAt: '2024-01-01T00:00:00Z',
		updatedAt: '2024-01-01T00:00:00Z',
	},
]
export const mockServices = [
	{
		id: 'serv1',
		name: 'Женская стрижка',
		description: 'Стрижка любой сложности',
		categoryId: 'cat1',
		duration: 60,
		price: 2500,
		currency: 'RUB',
		requiredQualifications: ['HAIR_STYLING'],
		compatibleSpaceTypes: ['CHAIR'],
		bufferTime: 15,
		isActive: true,
		organizationId: 'org1',
		createdAt: '2024-01-01T00:00:00Z',
		updatedAt: '2024-01-01T00:00:00Z',
	},
	{
		id: 'serv2',
		name: 'Окрашивание волос',
		description: 'Полное окрашивание в один тон',
		categoryId: 'cat1',
		duration: 120,
		price: 4500,
		currency: 'RUB',
		requiredQualifications: ['MANICURE'],
		compatibleSpaceTypes: ['CHAIR'],
		bufferTime: 30,
		isActive: true,
		organizationId: 'org1',
		createdAt: '2024-01-01T00:00:00Z',
		updatedAt: '2024-01-01T00:00:00Z',
	},
	{
		id: 'serv3',
		name: 'Маникюр классический',
		description: 'Обрезной маникюр с покрытием',
		categoryId: 'cat2',
		duration: 90,
		price: 1800,
		currency: 'RUB',
		requiredQualifications: ['MANICURE'],
		compatibleSpaceTypes: ['STATION'],
		bufferTime: 15,
		isActive: true,
		organizationId: 'org1',
		createdAt: '2024-01-01T00:00:00Z',
		updatedAt: '2024-01-01T00:00:00Z',
	},
]
export const mockMasters = [
	{
		id: '1',
		name: 'Анна Администратор',
		specialization: 'Универсальный мастер',
		bio: 'Опыт работы 10 лет. Специализация: стрижки и укладки.',
		color: '#0891b2',
		qualifications: ['MANICURE', 'MANICURE', 'HAIR_STYLING'],
	},
	{
		id: '2',
		name: 'Мария Мастер',
		specialization: 'Колорист',
		bio: 'Опыт работы 7 лет. Специализация: сложное окрашивание.',
		color: '#059669',
		qualifications: ['MANICURE', 'MANICURE', 'HAIR_STYLING'],
	},
	{
		id: '3',
		name: 'Владимир Владелец',
		specialization: 'Топ-стилист',
		bio: 'Опыт работы 15 лет. Специализация: креативные стрижки.',
		color: '#dc2626',
		qualifications: ['MANICURE', 'MANICURE', 'HAIR_STYLING'],
	},
]

export const mockSpaces = [
	{
		id: 'space1',
		name: 'Кресло 1',
		locationId: 'loc1',
		type: 'CHAIR',
		capacity: 1,
		isActive: true,
		equipment: ['Фен', 'Утюжок', 'Плойка'],
		createdAt: '2024-01-01T00:00:00Z',
		updatedAt: '2024-01-01T00:00:00Z',
	},
	{
		id: 'space2',
		name: 'Кабинет массажа',
		locationId: 'loc1',
		type: 'ROOM',
		capacity: 1,
		isActive: true,
		equipment: ['Массажный стол', 'Ароматерапия'],
		createdAt: '2024-01-01T00:00:00Z',
		updatedAt: '2024-01-01T00:00:00Z',
	},
	{
		id: 'space3',
		name: 'Маникюрная станция 1',
		locationId: 'loc1',
		type: 'STATION',
		capacity: 1,
		isActive: true,
		equipment: ['УФ-лампа', 'Фрезер', 'Стерилизатор'],
		createdAt: '2024-01-01T00:00:00Z',
		updatedAt: '2024-01-01T00:00:00Z',
	},
]

// export const mockServiceCategories = [
// 	{
// 		id: 'cat1',
// 		name: 'Парикмахерские услуги',
// 		description: 'Стрижки, укладки, окрашивание',
// 		color: '#0891b2',
// 		organizationId: 'org1',
// 		isActive: true,
// 		createdAt: '2024-01-01T00:00:00Z',
// 		updatedAt: '2024-01-01T00:00:00Z',
// 	},
// 	{
// 		id: 'cat2',
// 		name: 'Маникюр и педикюр',
// 		description: 'Уход за ногтями',
// 		color: '#f97316',
// 		organizationId: 'org1',
// 		isActive: true,
// 		createdAt: '2024-01-01T00:00:00Z',
// 		updatedAt: '2024-01-01T00:00:00Z',
// 	},
// 	{
// 		id: 'cat3',
// 		name: 'Косметология',
// 		description: 'Уход за лицом и телом',
// 		color: '#dc2626',
// 		organizationId: 'org1',
// 		isActive: true,
// 		createdAt: '2024-01-01T00:00:00Z',
// 		updatedAt: '2024-01-01T00:00:00Z',
// 	},
// ]

// export const mockClients = [
// 	{
// 		id: 'client1',
// 		firstName: 'Анна',
// 		lastName: 'Петрова',
// 		email: 'anna.petrova@email.com',
// 		phone: '+7 (916) 123-45-67',
// 		dateOfBirth: '1990-05-15',
// 		gender: 'FEMALE',
// 		notes: 'Предпочитает натуральные оттенки',
// 		preferences: {
// 			preferredMasters: ['2'],
// 			allergies: ['Аммиак'],
// 			skinType: 'Чувствительная',
// 		},
// 		organizationId: 'org1',
// 		isActive: true,
// 		createdAt: '2024-01-01T00:00:00Z',
// 		updatedAt: '2024-01-01T00:00:00Z',
// 	},
// 	{
// 		id: 'client2',
// 		firstName: 'Мария',
// 		lastName: 'Иванова',
// 		email: 'maria.ivanova@email.com',
// 		phone: '+7 (916) 987-65-43',
// 		dateOfBirth: '1985-08-22',
// 		gender: 'FEMALE',
// 		notes: 'Регулярный клиент, приходит каждый месяц',
// 		organizationId: 'org1',
// 		isActive: true,
// 		createdAt: '2024-01-01T00:00:00Z',
// 		updatedAt: '2024-01-01T00:00:00Z',
// 	},
// 	{
// 		id: 'client3',
// 		firstName: 'Елена',
// 		lastName: 'Сидорова',
// 		email: 'elena.sidorova@email.com',
// 		phone: '+7 (916) 555-44-33',
// 		dateOfBirth: '1992-12-03',
// 		gender: 'FEMALE',
// 		organizationId: 'org1',
// 		isActive: true,
// 		createdAt: '2024-01-01T00:00:00Z',
// 		updatedAt: '2024-01-01T00:00:00Z',
// 	},
// ]

// export const mockAppointments = [
// 	{
// 		id: 'app1',
// 		clientId: 'client1',
// 		masterId: '2',
// 		serviceId: 'serv1',
// 		spaceId: 'space1',
// 		locationId: 'loc1',
// 		startTime: '2024-12-20T10:00:00Z',
// 		endTime: '2024-12-20T11:00:00Z',
// 		status: 'SCHEDULED',
// 		price: 2500,
// 		currency: 'RUB',
// 		notes: 'Первое посещение',
// 		organizationId: 'org1',
// 		createdAt: '2024-12-19T00:00:00Z',
// 		updatedAt: '2024-12-19T00:00:00Z',
// 	},
// 	{
// 		id: 'app2',
// 		clientId: 'client2',
// 		masterId: '2',
// 		serviceId: 'serv2',
// 		spaceId: 'space1',
// 		locationId: 'loc1',
// 		startTime: '2024-12-20T14:00:00Z',
// 		endTime: '2024-12-20T16:00:00Z',
// 		status: 'SCHEDULED',
// 		price: 4500,
// 		currency: 'RUB',
// 		organizationId: 'org1',
// 		createdAt: '2024-12-19T00:00:00Z',
// 		updatedAt: '2024-12-19T00:00:00Z',
// 	},
// ]

// Категории услуг
export const serviceCategoriesNew = [
	{ id: 'category-1', name: 'Парикмахерские услуги' },
	{ id: 'category-2', name: 'Ногтевой сервис' },
	{ id: 'category-3', name: 'Косметология' },
	{ id: 'category-4', name: 'Массаж' },
	{ id: 'category-5', name: 'Визаж' },
]

// Услуги
export const mockServicesNew = [
	{
		id: 'service-1',
		name: 'Женская стрижка',
		description: 'Стрижка и укладка волос',
		category: serviceCategoriesNew[0],
		duration: 60,
		price: 1500,
	},
	{
		id: 'service-2',
		name: 'Мужская стрижка',
		description: 'Стрижка и бритье',
		category: serviceCategoriesNew[0],
		duration: 45,
		price: 800,
	},
	{
		id: 'service-3',
		name: 'Окрашивание волос',
		description: 'Полное окрашивание волос',
		category: serviceCategoriesNew[0],
		duration: 120,
		price: 2500,
	},
	{
		id: 'service-4',
		name: 'Маникюр',
		description: 'Классический маникюр',
		category: serviceCategoriesNew[1],
		duration: 60,
		price: 1000,
	},
	{
		id: 'service-5',
		name: 'Педикюр',
		description: 'Уход за стопами',
		category: serviceCategoriesNew[1],
		duration: 90,
		price: 1500,
	},
	{
		id: 'service-6',
		name: 'Чистка лица',
		description: 'Профессиональная чистка кожи',
		category: serviceCategoriesNew[2],
		duration: 75,
		price: 2000,
	},
	{
		id: 'service-7',
		name: 'Массаж спины',
		description: 'Расслабляющий массаж',
		category: serviceCategoriesNew[3],
		duration: 60,
		price: 1800,
	},
	{
		id: 'service-8',
		name: 'Вечерний макияж',
		description: 'Макияж для особых случаев',
		category: serviceCategoriesNew[4],
		duration: 45,
		price: 1200,
	},
]

// Локации и пространства
export const mockLocationsNew = [
	{
		id: 'location-1',
		name: 'Главный салон',
		address: 'ул. Центральная, 1',
		spaces: [
			{
				id: 'space-1',
				name: 'Парикмахерская 1',
				description: 'Основное место для стрижек',
				capacity: 1,
				equipment: ['зеркало', 'кресло', 'мойка'],
				compatibleServices: [
					'service-1',
					'service-2',
					'service-3',
					'service-8',
				],
			},
			{
				id: 'space-2',
				name: 'Парикмахерская 2',
				description: 'Дополнительное место для стрижек',
				capacity: 1,
				equipment: ['зеркало', 'кресло', 'мойка'],
				compatibleServices: ['service-1', 'service-2', 'service-3'],
			},
			{
				id: 'space-3',
				name: 'Маникюрный кабинет',
				description: 'Кабинет для ногтевого сервиса',
				capacity: 1,
				equipment: ['стол', 'лампа', 'стерилизатор'],
				compatibleServices: ['service-4', 'service-5'],
			},
		],
	},
	{
		id: 'location-2',
		name: 'Спа-зона',
		address: 'ул. Спокойная, 15',
		spaces: [
			{
				id: 'space-4',
				name: 'Косметологический кабинет',
				description: 'Кабинет для косметических процедур',
				capacity: 1,
				equipment: ['кушетка', 'аппарат', 'стерилизатор'],
				compatibleServices: ['service-6', 'service-7'],
			},
			{
				id: 'space-5',
				name: 'Массажный кабинет',
				description: 'Кабинет для массажных процедур',
				capacity: 1,
				equipment: ['массажный стол', 'аромалампа', 'полотенца'],
				compatibleServices: ['service-7'],
			},
			{
				id: 'space-6',
				name: 'VIP-кабинет',
				description: 'Кабинет повышенной комфортности',
				capacity: 2,
				equipment: ['кресло', 'мойка', 'телевизор', 'кофемашина'],
				compatibleServices: [
					'service-1',
					'service-3',
					'service-6',
					'service-7',
					'service-8',
				],
			},
		],
	},
	{
		id: 'location-3',
		name: 'Бьюти-бар',
		address: 'ул. Модная, 7',
		spaces: [
			{
				id: 'space-7',
				name: 'Барная стойка',
				description: 'Место для быстрых услуг',
				capacity: 3,
				equipment: ['барные стулья', 'зеркало', 'инструменты'],
				compatibleServices: ['service-2', 'service-4', 'service-8'],
			},
			{
				id: 'space-8',
				name: 'Комната для визажа',
				description: 'Специализированное место для макияжа',
				capacity: 1,
				equipment: ['зеркало с подсветкой', 'кресло', 'кисти'],
				compatibleServices: ['service-8'],
			},
		],
	},
]

// lib/mock-data.js

// Клиенты
export const mockClients = [
	{
		id: '1',
		firstName: 'Анна',
		lastName: 'Иванова',
		phone: '+7 (900) 123-45-67',
		email: 'anna@example.com',
		notes: 'Постоянный клиент, предпочитает вечерние визиты',
		birthDate: '1990-05-15',
		createdAt: '2024-01-01T00:00:00Z',
		updatedAt: '2024-01-01T00:00:00Z',
	},
	{
		id: '2',
		firstName: 'Екатерина',
		lastName: 'Петрова',
		phone: '+7 (900) 234-56-78',
		email: 'ekaterina@example.com',
		notes: 'Новый клиент, записалась по акции',
		birthDate: '1985-12-03',
		createdAt: '2024-01-01T00:00:00Z',
		updatedAt: '2024-01-01T00:00:00Z',
	},
	{
		id: '3',
		firstName: 'Ольга',
		lastName: 'Сидорова',
		phone: '+7 (900) 345-67-89',
		email: 'olga@example.com',
		notes: 'VIP клиент, предпочитает утренние часы',
		birthDate: '1988-08-20',
		createdAt: '2024-01-01T00:00:00Z',
		updatedAt: '2024-01-01T00:00:00Z',
	},
	{
		id: '4',
		firstName: 'Мария',
		lastName: 'Кузнецова',
		phone: '+7 (900) 456-78-90',
		email: 'maria@example.com',
		notes: 'Приходит с подругами',
		birthDate: '1992-03-10',
		createdAt: '2024-01-01T00:00:00Z',
		updatedAt: '2024-01-01T00:00:00Z',
	},
	{
		id: '5',
		firstName: 'Александра',
		lastName: 'Смирнова',
		phone: '+7 (900) 567-89-01',
		email: 'alexandra@example.com',
		notes: 'Любит подробные консультации',
		birthDate: '1995-11-25',
		createdAt: '2024-01-01T00:00:00Z',
		updatedAt: '2024-01-01T00:00:00Z',
	},
]

// Категории услуг
export const mockCategories = [
	{
		id: 'cat1',
		name: 'Стрижки и укладки',
		description: 'Все виды стрижек и укладок',
	},
	{
		id: 'cat2',
		name: 'Окрашивание',
		description: 'Сложное и простое окрашивание',
	},
	{
		id: 'cat3',
		name: 'Уходовые процедуры',
		description: 'Уход за волосами и кожей головы',
	},
]

// Услуги
// export const mockServices = [
// 	{
// 		id: '1',
// 		name: 'Женская стрижка',
// 		duration: 60,
// 		price: 1500,
// 		categoryId: 'cat1',
// 		description: 'Стрижка с укладкой',
// 	},
// 	{
// 		id: '2',
// 		name: 'Мелирование',
// 		duration: 120,
// 		price: 3500,
// 		categoryId: 'cat2',
// 		description: 'Частичное мелирование',
// 	},
// 	{
// 		id: '3',
// 		name: 'Стрижка мужская',
// 		duration: 30,
// 		price: 800,
// 		categoryId: 'cat1',
// 		description: 'Мужская стрижка машинкой и ножницами',
// 	},
// 	{
// 		id: '4',
// 		name: 'Ботокс для волос',
// 		duration: 90,
// 		price: 2500,
// 		categoryId: 'cat3',
// 		description: 'Восстанавливающая процедура',
// 	},
// 	{
// 		id: '5',
// 		name: 'Окрашивание в один тон',
// 		duration: 90,
// 		price: 2000,
// 		categoryId: 'cat2',
// 		description: 'Полное окрашивание',
// 	},
// 	{
// 		id: '6',
// 		name: 'Укладка',
// 		duration: 40,
// 		price: 1000,
// 		categoryId: 'cat1',
// 		description: 'Укладка феном и щеткой',
// 	},
// ]

// Помещения (кабинеты)

// Мастера

// Статусы записей
export const appointmentStatuses = {
	SCHEDULED: 'scheduled',
	CONFIRMED: 'confirmed',
	COMPLETED: 'completed',
	CANCELLED: 'cancelled',
	NOSHOW: 'noShow',
}

// Генерация записей на разные даты
const generateAppointments = () => {
	const today = new Date()
	const appointments = []

	// Записи на сегодня
	appointments.push(
		{
			id: '101',
			clientId: '1',
			serviceId: '1',
			masterId: '1',
			spaceId: '1',
			startTime: new Date(
				today.getFullYear(),
				today.getMonth(),
				today.getDate(),
				10,
				0
			),
			endTime: new Date(
				today.getFullYear(),
				today.getMonth(),
				today.getDate(),
				11,
				0
			),
			status: appointmentStatuses.CONFIRMED,
			notes: 'Клиент просит не использовать спрей для укладки',
			createdAt: new Date(
				today.getFullYear(),
				today.getMonth(),
				today.getDate() - 2
			),
			updatedAt: new Date(
				today.getFullYear(),
				today.getMonth(),
				today.getDate() - 1
			),
		},
		{
			id: '102',
			clientId: '2',
			serviceId: '2',
			masterId: '2',
			spaceId: '2',
			startTime: new Date(
				today.getFullYear(),
				today.getMonth(),
				today.getDate(),
				11,
				0
			),
			endTime: new Date(
				today.getFullYear(),
				today.getMonth(),
				today.getDate(),
				13,
				0
			),
			status: appointmentStatuses.SCHEDULED,
			notes: 'Первое мелирование у этого клиента',
			createdAt: new Date(
				today.getFullYear(),
				today.getMonth(),
				today.getDate() - 1
			),
			updatedAt: new Date(
				today.getFullYear(),
				today.getMonth(),
				today.getDate() - 1
			),
		},
		{
			id: '103',
			clientId: '3',
			serviceId: '6',
			masterId: '3',
			spaceId: '3',
			startTime: new Date(
				today.getFullYear(),
				today.getMonth(),
				today.getDate(),
				14,
				0
			),
			endTime: new Date(
				today.getFullYear(),
				today.getMonth(),
				today.getDate(),
				14,
				40
			),
			status: appointmentStatuses.CONFIRMED,
			notes: 'VIP клиент, подготовить кабинет',
			createdAt: new Date(
				today.getFullYear(),
				today.getMonth(),
				today.getDate() - 3
			),
			updatedAt: new Date(
				today.getFullYear(),
				today.getMonth(),
				today.getDate() - 1
			),
		},
		{
			id: '104',
			clientId: '4',
			serviceId: '4',
			masterId: '1',
			spaceId: '1',
			startTime: new Date(
				today.getFullYear(),
				today.getMonth(),
				today.getDate(),
				15,
				0
			),
			endTime: new Date(
				today.getFullYear(),
				today.getMonth(),
				today.getDate(),
				16,
				30
			),
			status: appointmentStatuses.SCHEDULED,
			notes: 'Повторная процедура после мелирования',
			createdAt: new Date(
				today.getFullYear(),
				today.getMonth(),
				today.getDate() - 5
			),
			updatedAt: new Date(
				today.getFullYear(),
				today.getMonth(),
				today.getDate() - 2
			),
		},
		{
			id: '105',
			clientId: '5',
			serviceId: '5',
			masterId: '2',
			spaceId: '2',
			startTime: new Date(
				today.getFullYear(),
				today.getMonth(),
				today.getDate(),
				17,
				0
			),
			endTime: new Date(
				today.getFullYear(),
				today.getMonth(),
				today.getDate(),
				18,
				30
			),
			status: appointmentStatuses.CONFIRMED,
			notes: 'Клиент хочет сменить цвет на более темный',
			createdAt: new Date(
				today.getFullYear(),
				today.getMonth(),
				today.getDate() - 4
			),
			updatedAt: new Date(
				today.getFullYear(),
				today.getMonth(),
				today.getDate() - 1
			),
		}
	)

	// Записи на завтра
	const tomorrow = new Date(today)
	tomorrow.setDate(tomorrow.getDate() + 1)

	appointments.push(
		{
			id: '201',
			clientId: '3',
			serviceId: '1',
			masterId: '3',
			spaceId: '3',
			startTime: new Date(
				tomorrow.getFullYear(),
				tomorrow.getMonth(),
				tomorrow.getDate(),
				9,
				0
			),
			endTime: new Date(
				tomorrow.getFullYear(),
				tomorrow.getMonth(),
				tomorrow.getDate(),
				10,
				0
			),
			status: appointmentStatuses.SCHEDULED,
			notes: 'Корректировка стрижки',
			createdAt: new Date(
				today.getFullYear(),
				today.getMonth(),
				today.getDate() - 2
			),
			updatedAt: new Date(
				today.getFullYear(),
				today.getMonth(),
				today.getDate() - 1
			),
		},
		{
			id: '202',
			clientId: '1',
			serviceId: '3',
			masterId: '1',
			spaceId: '1',
			startTime: new Date(
				tomorrow.getFullYear(),
				tomorrow.getMonth(),
				tomorrow.getDate(),
				11,
				0
			),
			endTime: new Date(
				tomorrow.getFullYear(),
				tomorrow.getMonth(),
				tomorrow.getDate(),
				11,
				30
			),
			status: appointmentStatuses.CONFIRMED,
			notes: 'Мужская стрижка, клиент торопится',
			createdAt: new Date(
				today.getFullYear(),
				today.getMonth(),
				today.getDate() - 1
			),
			updatedAt: new Date(
				today.getFullYear(),
				today.getMonth(),
				today.getDate() - 1
			),
		}
	)

	// Записи на послезавтра
	const dayAfterTomorrow = new Date(today)
	dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2)

	appointments.push(
		{
			id: '301',
			clientId: '2',
			serviceId: '2',
			masterId: '2',
			spaceId: '2',
			startTime: new Date(
				dayAfterTomorrow.getFullYear(),
				dayAfterTomorrow.getMonth(),
				dayAfterTomorrow.getDate(),
				10,
				0
			),
			endTime: new Date(
				dayAfterTomorrow.getFullYear(),
				dayAfterTomorrow.getMonth(),
				dayAfterTomorrow.getDate(),
				12,
				0
			),
			status: appointmentStatuses.SCHEDULED,
			notes: 'Повторное мелирование',
			createdAt: new Date(
				today.getFullYear(),
				today.getMonth(),
				today.getDate() - 3
			),
			updatedAt: new Date(
				today.getFullYear(),
				today.getMonth(),
				today.getDate() - 2
			),
		},
		{
			id: '302',
			clientId: '4',
			serviceId: '4',
			masterId: '1',
			spaceId: '1',
			startTime: new Date(
				dayAfterTomorrow.getFullYear(),
				dayAfterTomorrow.getMonth(),
				dayAfterTomorrow.getDate(),
				14,
				0
			),
			endTime: new Date(
				dayAfterTomorrow.getFullYear(),
				dayAfterTomorrow.getMonth(),
				dayAfterTomorrow.getDate(),
				15,
				30
			),
			status: appointmentStatuses.CONFIRMED,
			notes: 'Процедура после окрашивания',
			createdAt: new Date(
				today.getFullYear(),
				today.getMonth(),
				today.getDate() - 4
			),
			updatedAt: new Date(
				today.getFullYear(),
				today.getMonth(),
				today.getDate() - 1
			),
		}
	)

	return appointments
}

export const mockAppointments = generateAppointments()

// Дополнительные утилиты для работы с данными
export const getAllSpaces = () => {
	return mockLocations.flatMap(location =>
		location.spaces.map(space => ({
			...space,
			locationName: location.name,
			locationId: location.id,
		}))
	)
}

export const getServiceById = id => {
	return mockServices.find(service => service.id === id)
}

export const getSpaceById = id => {
	return getAllSpaces().find(space => space.id === id)
}
