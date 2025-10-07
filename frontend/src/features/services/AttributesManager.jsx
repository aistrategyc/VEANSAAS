// components/attributes/AttributesManager.jsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Edit, Trash2, Plus, Search } from 'lucide-react'
import { AttributeModal } from './AttributeModal'

export function AttributesManager({
	attributes = [],
	onSaveAttribute,
	onDeleteAttribute,
}) {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [editingAttribute, setEditingAttribute] = useState(null)
	const [searchTerm, setSearchTerm] = useState('')

	const filteredAttributes = attributes.filter(attr =>
		attr.name.toLowerCase().includes(searchTerm.toLowerCase())
	)

	const getAttributeTypeLabel = type => {
		const types = {
			text: 'Текст',
			number: 'Число',
			select: 'Список',
		}
		return types[type] || type
	}

	const handleEdit = attribute => {
		setEditingAttribute(attribute)
		setIsModalOpen(true)
	}

	const handleCreate = () => {
		setEditingAttribute(null)
		setIsModalOpen(true)
	}

	const handleSave = attributeData => {
		onSaveAttribute(attributeData)
		setIsModalOpen(false)
		setEditingAttribute(null)
	}

	return (
		<>
			<Card>
				<CardHeader>
					<div className='flex items-center justify-between'>
						<div>
							<CardTitle>Атрибуты</CardTitle>
							<CardDescription>
								Управление всеми атрибутами системы
							</CardDescription>
						</div>
						<Button onClick={handleCreate}>
							<Plus className='h-4 w-4 mr-2' />
							Создать атрибут
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					{/* Search */}
					<div className='mb-4'>
						<div className='relative'>
							<Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
							<Input
								placeholder='Поиск атрибутов...'
								value={searchTerm}
								onChange={e => setSearchTerm(e.target.value)}
								className='pl-8'
							/>
						</div>
					</div>

					{/* Attributes Table */}
					{filteredAttributes.length === 0 ? (
						<div className='text-center py-8 text-muted-foreground'>
							{attributes.length === 0
								? 'Атрибуты не созданы'
								: 'Атрибуты не найдены'}
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Название</TableHead>
									<TableHead>Тип</TableHead>
									<TableHead>Значения</TableHead>
									<TableHead>Обязательный</TableHead>
									<TableHead className='w-[100px]'>Действия</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredAttributes.map(attribute => (
									<TableRow key={attribute.id}>
										<TableCell className='font-medium'>
											{attribute.name}
										</TableCell>
										<TableCell>
											<Badge variant='outline'>
												{getAttributeTypeLabel(attribute.type)}
											</Badge>
										</TableCell>
										<TableCell>
											{attribute.type === 'select' && attribute.values ? (
												<div className='max-w-xs truncate'>
													{attribute.values.join(', ')}
												</div>
											) : (
												<span className='text-muted-foreground'>—</span>
											)}
										</TableCell>
										<TableCell>
											<Badge
												variant={attribute.isRequired ? 'default' : 'outline'}
											>
												{attribute.isRequired ? 'Да' : 'Нет'}
											</Badge>
										</TableCell>
										<TableCell>
											<div className='flex items-center gap-2'>
												<Button
													variant='ghost'
													size='sm'
													onClick={() => handleEdit(attribute)}
												>
													<Edit className='h-4 w-4' />
												</Button>
												<Button
													variant='ghost'
													size='sm'
													onClick={() => onDeleteAttribute(attribute.id)}
													className='text-destructive hover:text-destructive'
												>
													<Trash2 className='h-4 w-4' />
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>

			<AttributeModal
				isOpen={isModalOpen}
				onClose={() => {
					setIsModalOpen(false)
					setEditingAttribute(null)
				}}
				attribute={editingAttribute}
				onSave={handleSave}
			/>
		</>
	)
}
