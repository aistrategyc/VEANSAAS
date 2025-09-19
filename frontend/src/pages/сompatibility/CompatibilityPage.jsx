'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Search, Save, RotateCcw } from 'lucide-react'

import { NoAccessState } from '@/components/ui/no-access-state'
import {
	mockServices,
	mockLocations,
	mockServicesNew,
	mockLocationsNew,
} from '@/lib/mock-data'

export default function CompatibilityPage() {
	const user = {
		role: 'admin',
	}
	const [searchTerm, setSearchTerm] = useState('')
	const [selectedLocation, setSelectedLocation] = useState('all')
	const [selectedCategory, setSelectedCategory] = useState('all')
	const [compatibility, setCompatibility] = useState(() => {
		const initial = {}
		mockServicesNew.forEach(service => {
			initial[service.id] = {}
			mockLocationsNew
				.flatMap(location =>
					location.spaces.map(space => ({
						...space,
						locationName: location.name,
					}))
				)
				.forEach(space => {
					// Используем существующие данные совместимости из моковых данных
					initial[service.id][space.id] = space.compatibleServices.includes(
						service.id
					)
				})
		})
		return initial
	})
	const [hasChanges, setHasChanges] = useState(false)

	// Проверка доступа - только админы и владельцы могут управлять совместимостью
	if (!user || (user.role !== 'admin' && user.role !== 'master_owner')) {
		return <NoAccessState />
	}

	// Получаем все места из всех локаций
	const allSpaces = mockLocationsNew.flatMap(location =>
		location.spaces.map(space => ({ ...space, locationName: location.name }))
	)

	// Фильтрация услуг
	const filteredServices = mockServicesNew.filter(service => {
		const matchesSearch = service.name
			.toLowerCase()
			.includes(searchTerm.toLowerCase())
		const matchesCategory =
			selectedCategory === 'all' || service.category.name === selectedCategory
		return matchesSearch && matchesCategory
	})

	// Фильтрация мест
	const filteredSpaces = allSpaces.filter(space => {
		return selectedLocation === 'all' || space.locationName === selectedLocation
	})

	const toggleCompatibility = (serviceId, spaceId) => {
		setCompatibility(prev => ({
			...prev,
			[serviceId]: {
				...prev[serviceId],
				[spaceId]: !prev[serviceId]?.[spaceId],
			},
		}))
		setHasChanges(true)
	}

	const handleSave = () => {
		// Логика сохранения изменений
		console.log('Сохранение матрицы совместимости', compatibility)
		setHasChanges(false)
	}

	const handleReset = () => {
		// Сброс к исходному состоянию
		setHasChanges(false)
		// Логика сброса
	}

	const getCompatibilityStats = () => {
		let total = 0
		let compatible = 0

		filteredServices.forEach(service => {
			filteredSpaces.forEach(space => {
				total++
				if (compatibility[service.id]?.[space.id]) {
					compatible++
				}
			})
		})

		return {
			total,
			compatible,
			percentage: total > 0 ? Math.round((compatible / total) * 100) : 0,
		}
	}

	const stats = getCompatibilityStats()

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight'>
						Матрица совместимости
					</h1>
					<p className='text-muted-foreground'>
						Управление совместимостью услуг и рабочих мест
					</p>
				</div>
				<div className='flex gap-2'>
					{hasChanges && (
						<Button variant='outline' onClick={handleReset}>
							<RotateCcw className='mr-2 h-4 w-4' />
							Сбросить
						</Button>
					)}
					<Button onClick={handleSave} disabled={!hasChanges}>
						<Save className='mr-2 h-4 w-4' />
						Сохранить
					</Button>
				</div>
			</div>

			{/* Статистика */}
			<div className='grid gap-4 md:grid-cols-3'>
				<Card>
					<CardHeader className='pb-2'>
						<CardTitle className='text-sm font-medium'>
							Всего комбинаций
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{stats.total}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='pb-2'>
						<CardTitle className='text-sm font-medium'>Совместимых</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold text-green-600'>
							{stats.compatible}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='pb-2'>
						<CardTitle className='text-sm font-medium'>
							Процент совместимости
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{stats.percentage}%</div>
					</CardContent>
				</Card>
			</div>

			{/* Фильтры */}
			<Card>
				<CardHeader>
					<CardTitle>Фильтры</CardTitle>
				</CardHeader>
				<CardContent className='flex gap-4'>
					<div className='relative flex-1'>
						<Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
						<Input
							placeholder='Поиск услуг...'
							value={searchTerm}
							onChange={e => setSearchTerm(e.target.value)}
							className='pl-10'
						/>
					</div>
					<Select value={selectedLocation} onValueChange={setSelectedLocation}>
						<SelectTrigger className='w-[200px]'>
							<SelectValue placeholder='Локация' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='all'>Все локации</SelectItem>
							{mockLocations.map(location => (
								<SelectItem key={location.id} value={location.name}>
									{location.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Select value={selectedCategory} onValueChange={setSelectedCategory}>
						<SelectTrigger className='w-[200px]'>
							<SelectValue placeholder='Категория' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='all'>Все категории</SelectItem>
							<SelectItem value='Парикмахерские услуги'>
								Парикмахерские услуги
							</SelectItem>
							<SelectItem value='Ногтевой сервис'>Ногтевой сервис</SelectItem>
							<SelectItem value='Косметология'>Косметология</SelectItem>
						</SelectContent>
					</Select>
				</CardContent>
			</Card>

			{/* Матрица совместимости */}
			<Card>
				<CardHeader>
					<CardTitle>Матрица совместимости услуг и мест</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='overflow-x-auto'>
						<table className='w-full border-collapse'>
							<thead>
								<tr>
									<th className='border p-2 text-left font-medium'>Услуга</th>
									{filteredSpaces.map(space => (
										<th
											key={space.id}
											className='border p-2 text-center font-medium min-w-[120px]'
										>
											<div className='space-y-1'>
												<div className='text-sm'>{space.name}</div>
												<Badge variant='outline' className='text-xs'>
													{space.locationName}
												</Badge>
											</div>
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{filteredServices.map(service => (
									<tr key={service.id}>
										<td className='border p-2'>
											<div className='space-y-1'>
												<div className='font-medium'>{service.name}</div>
												<Badge variant='secondary' className='text-xs'>
													{service.category.name}
												</Badge>
											</div>
										</td>
										{filteredSpaces.map(space => (
											<td key={space.id} className='border p-2 text-center'>
												<Switch
													checked={
														compatibility[service.id]?.[space.id] || false
													}
													onCheckedChange={() =>
														toggleCompatibility(service.id, space.id)
													}
												/>
											</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</CardContent>
			</Card>

			{/* Легенда */}
			<Card>
				<CardHeader>
					<CardTitle>Легенда</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='flex gap-6'>
						<div className='flex items-center gap-2'>
							<Switch checked={true} disabled />
							<span className='text-sm'>Услуга совместима с местом</span>
						</div>
						<div className='flex items-center gap-2'>
							<Switch checked={false} disabled />
							<span className='text-sm'>Услуга не совместима с местом</span>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
