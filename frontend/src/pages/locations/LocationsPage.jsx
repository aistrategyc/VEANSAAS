import { useState } from 'react'

// import { LocationModal } from "@/components/locations/location-modal"
// import { SpaceModal } from "@/components/locations/space-modal"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, MapPin, Home } from 'lucide-react'
import { RoleGuard } from '@/components/ui/role-guard'
import { NoAccessState } from '@/components/ui/no-access-state'
import { mockLocations, mockSpaces } from '@/lib/mock-data'
import { LocationsTable } from '@/features/locations/LocationsTable'
import { SpacesTable } from '@/features/locations/LocationsSpacesTable'

export default function LocationsPage() {
	const user = {
		id: '3',
		email: 'owner@salon.com',
		name: 'Владимир Владелец',
		role: 'admin',
		organizationId: 'org1',
		allowedLocationIds: ['loc1'],
		allowedSpaceIds: ['space1', 'space2'],
		isActive: true,
		createdAt: '2024-01-01T00:00:00Z',
		updatedAt: '2024-01-01T00:00:00Z',
	}
	const [locations, setLocations] = useState(mockLocations)
	const [spaces, setSpaces] = useState(mockSpaces)
	const [selectedLocation, setSelectedLocation] = useState(null)
	const [selectedSpace, setSelectedSpace] = useState(null)
	// const [isLocationModalOpen, setIsLocationModalOpen] = useState(false)
	// const [isSpaceModalOpen, setIsSpaceModalOpen] = useState(false)

	// Filter data based on user permissions
	const filteredLocations = locations.filter(location => {
		if (user?.role === 'MasterOwner' && user.allowedLocationIds) {
			return user.allowedLocationIds.includes(location.id)
		}
		return true
	})

	const filteredSpaces = spaces.filter(space => {
		if (user?.role === 'MasterOwner' && user.allowedSpaceIds) {
			return user.allowedSpaceIds.includes(space.id)
		}
		return filteredLocations.some(loc => loc.id === space.locationId)
	})

	const handleCreateLocation = () => {
		setSelectedLocation(null)
		setIsLocationModalOpen(true)
	}

	const handleEditLocation = location => {
		setSelectedLocation(location)
		setIsLocationModalOpen(true)
	}

	const handleSaveLocation = locationData => {
		if (selectedLocation) {
			setLocations(prev =>
				prev.map(location =>
					location.id === selectedLocation.id
						? { ...location, ...locationData }
						: location
				)
			)
		} else {
			const newLocation = {
				id: `loc${Date.now()}`,
				organizationId: 'org1',
				isActive: true,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				timezone: 'Europe/Moscow',
				...locationData,
			}
			setLocations(prev => [newLocation, ...prev])
		}
		setIsLocationModalOpen(false)
		setSelectedLocation(null)
	}

	const handleDeleteLocation = locationId => {
		setLocations(prev =>
			prev.map(location =>
				location.id === locationId ? { ...location, isActive: false } : location
			)
		)
	}

	const handleCreateSpace = () => {
		setSelectedSpace(null)
		setIsSpaceModalOpen(true)
	}

	const handleEditSpace = space => {
		setSelectedSpace(space)
		setIsSpaceModalOpen(true)
	}

	const handleSaveSpace = spaceData => {
		if (selectedSpace) {
			setSpaces(prev =>
				prev.map(space =>
					space.id === selectedSpace.id ? { ...space, ...spaceData } : space
				)
			)
		} else {
			const newSpace = {
				id: `space${Date.now()}`,
				isActive: true,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				capacity: 1,
				...spaceData,
			}
			setSpaces(prev => [newSpace, ...prev])
		}
		setIsSpaceModalOpen(false)
		setSelectedSpace(null)
	}

	const handleDeleteSpace = spaceId => {
		setSpaces(prev =>
			prev.map(space =>
				space.id === spaceId ? { ...space, isActive: false } : space
			)
		)
	}

	const stats = {
		totalLocations: filteredLocations.filter(l => l.isActive).length,
		totalSpaces: filteredSpaces.filter(s => s.isActive).length,
		chairSpaces: filteredSpaces.filter(s => s.type === 'CHAIR' && s.isActive)
			.length,
		roomSpaces: filteredSpaces.filter(s => s.type === 'ROOM' && s.isActive)
			.length,
	}

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight'>Локации и места</h1>
					<p className='text-muted-foreground'>
						Управление филиалами и рабочими местами
					</p>
				</div>
				<RoleGuard allowedRoles={['admin']}>
					<div className='flex items-center space-x-2'>
						<Button variant='outline' onClick={handleCreateSpace}>
							<Home className='h-4 w-4 mr-2' />
							Добавить место
						</Button>
						<Button onClick={handleCreateLocation}>
							<Plus className='h-4 w-4 mr-2' />
							Добавить локацию
						</Button>
					</div>
				</RoleGuard>
			</div>

			{/* Stats Cards */}
			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Всего локаций</CardTitle>
						<MapPin className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{stats.totalLocations}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Всего мест</CardTitle>
						<Home className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{stats.totalSpaces}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Кресла</CardTitle>
						<span className='text-xs text-muted-foreground'>CHAIR</span>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{stats.chairSpaces}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Кабинеты</CardTitle>
						<span className='text-xs text-muted-foreground'>ROOM</span>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{stats.roomSpaces}</div>
					</CardContent>
				</Card>
			</div>

			<Tabs defaultValue='locations' className='space-y-4'>
				<TabsList>
					<TabsTrigger value='locations'>Локации</TabsTrigger>
					<TabsTrigger value='spaces'>Места</TabsTrigger>
				</TabsList>

				<TabsContent value='locations' className='space-y-4'>
					<LocationsTable
						locations={filteredLocations}
						onEdit={handleEditLocation}
						onDelete={handleDeleteLocation}
						currentUser={user}
					/>
				</TabsContent>

				<TabsContent value='spaces' className='space-y-4'>
					<SpacesTable
						spaces={filteredSpaces}
						locations={filteredLocations}
						onEdit={handleEditSpace}
						onDelete={handleDeleteSpace}
						currentUser={user}
					/>
				</TabsContent>
			</Tabs>

			{/* Modals */}
			{/* <LocationModal
          isOpen={isLocationModalOpen}
          onClose={() => {
            setIsLocationModalOpen(false)
            setSelectedLocation(null)
          }}
          location={selectedLocation}
          onSave={handleSaveLocation}
        />

        <SpaceModal
          isOpen={isSpaceModalOpen}
          onClose={() => {
            setIsSpaceModalOpen(false)
            setSelectedSpace(null)
          }}
          space={selectedSpace}
          locations={filteredLocations.filter((l) => l.isActive)}
          onSave={handleSaveSpace}
        /> */}
		</div>
	)
}
