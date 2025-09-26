// pages/categories.jsx
'use client'

import { useState } from 'react'
import { CategoryModal } from '@/components/categories/CategoryModal'
import { AttributesManager } from '@/components/attributes/AttributesManager'

export default function CategoriesTabel() {
	const [categories, setCategories] = useState([])
	const [attributes, setAttributes] = useState([])
	const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
	const [editingCategory, setEditingCategory] = useState(null)

	const handleSaveAttribute = attributeData => {
		setAttributes(prev => {
			const existingIndex = prev.findIndex(attr => attr.id === attributeData.id)
			if (existingIndex >= 0) {
				return prev.map((attr, index) =>
					index === existingIndex ? attributeData : attr
				)
			}
			return [...prev, attributeData]
		})
	}

	const handleDeleteAttribute = attributeId => {
		setAttributes(prev => prev.filter(attr => attr.id !== attributeId))
		// Также удалить атрибут из всех категорий
		setCategories(prev =>
			prev.map(category => ({
				...category,
				attributeIds:
					category.attributeIds?.filter(id => id !== attributeId) || [],
			}))
		)
	}

	return (
		<div className='space-y-6'>
			<AttributesManager
				attributes={attributes}
				onSaveAttribute={handleSaveAttribute}
				onDeleteAttribute={handleDeleteAttribute}
			/>

			{/* Ваш существующий код для управления категориями */}

			<CategoryModal
				isOpen={isCategoryModalOpen}
				onClose={() => {
					setIsCategoryModalOpen(false)
					setEditingCategory(null)
				}}
				category={editingCategory}
				attributes={attributes}
				onSave={categoryData => {
					// Ваша логика сохранения категории
				}}
			/>
		</div>
	)
}
