'use client'

import React, { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { X, Upload, File, Image as ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function FormFileInput({
	title,
	name,
	control,
	rules,
	error,
	accept = 'image/*',
	className,
}) {
	const formContext = useFormContext()
	const [isDragOver, setIsDragOver] = useState(false)

	const handleFileSelect = onChange => {
		const input = document.createElement('input')
		input.type = 'file'
		input.accept = accept
		input.onchange = e => {
			const file = e.target.files?.[0] || null
			onChange(file)
			if (formContext) {
				formContext.trigger(name)
			}
		}
		input.click()
	}

	const handleDrop = (e, onChange) => {
		e.preventDefault()
		setIsDragOver(false)

		const files = e.dataTransfer.files
		if (files.length > 0) {
			const file = files[0]
			if (accept === 'image/*' ? file.type.startsWith('image/') : true) {
				onChange(file)
				if (formContext) {
					formContext.trigger(name)
				}
			}
		}
	}

	const handleRemoveFile = onChange => {
		onChange(null)
		if (formContext) {
			formContext.trigger(name)
		}
	}

	return (
		<div className='space-y-2 mt-2 mb-4'>
			<div className='flex items-center mb-2'>
				<Label htmlFor={name}>{title}</Label>
			</div>
			<Controller
				name={name}
				control={control}
				rules={rules}
				render={({ field: { onChange, value } }) => (
					<div className='space-y-3 m-1'>
						<div
							className={cn(
								'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
								isDragOver
									? 'border-primary bg-primary/5'
									: 'border-muted-foreground/25 hover:border-muted-foreground/50'
							)}
							onDrop={e => handleDrop(e, onChange)}
							onDragOver={e => {
								e.preventDefault()
								setIsDragOver(true)
							}}
							onDragLeave={() => setIsDragOver(false)}
							onClick={() => handleFileSelect(onChange)}
						>
							<Upload className='h-8 w-8 mx-auto mb-2 text-muted-foreground' />
							<p className='text-sm text-muted-foreground'>
								Перетащите файл сюда или нажмите для выбора
							</p>
							<p className='text-xs text-muted-foreground mt-1'>
								PNG, JPG, GIF до 5MB
							</p>
						</div>

						{value && (
							<Card>
								<CardContent className='p-3'>
									<div className='flex items-center justify-between'>
										<div className='flex items-center gap-3'>
											{value.type.startsWith('image/') ? (
												<img
													src={URL.createObjectURL(value)}
													alt='Preview'
													className='h-12 w-12 rounded object-cover'
												/>
											) : (
												<div className='flex h-12 w-12 items-center justify-center rounded bg-muted'>
													<File className='h-6 w-6 text-muted-foreground' />
												</div>
											)}
											<div className='flex flex-col'>
												<p className='text-sm font-medium'>{value.name}</p>
												<p className='text-sm text-muted-foreground'>
													{(value.size / 1024 / 1024).toFixed(2)} MB
												</p>
											</div>
										</div>
										<Button
											type='button'
											variant='ghost'
											size='sm'
											onClick={() => handleRemoveFile(onChange)}
											className='h-8 w-8 p-0 text-muted-foreground hover:text-destructive'
										>
											<X className='h-4 w-4' />
											<span className='sr-only'>Удалить файл</span>
										</Button>
									</div>
								</CardContent>
							</Card>
						)}
					</div>
				)}
			/>

			{error && <p className='text-sm font-medium text-destructive'>{error}</p>}
		</div>
	)
}
