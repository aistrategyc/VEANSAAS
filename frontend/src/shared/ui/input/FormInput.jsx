import React, { useState } from 'react'
import { useController } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff } from 'lucide-react'
import { PhoneInput } from '@/components/ui/phone-input'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'

export const FormInput = ({
	placeholder,
	title,
	type,
	name,
	control,
	rows,
	rules = { require: true },
	className,
	step = 10,
	error,
}) => {
	const [showPassword, setShowPassword] = useState(false)
	const {
		field,
		fieldState: { invalid, isTouched, isDirty },
		formState: { touchedFields, dirtyFields },
	} = useController({
		name,
		control,
		rules,
	})

	const isPasswordField = type === 'password'
	const isPhoneField = type === 'tel'
	const isTextareaField = type === 'textarea'
	const isPriceField = type === 'price'

	const inputType = isPasswordField
		? showPassword
			? 'text'
			: 'password'
		: type

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword)
	}

	return (
		<div className='space-y-2 mt-2 mb-4'>
			<div className='flex items-center mb-2'>
				<Label htmlFor={name}>{title}</Label>
			</div>

			{isPhoneField ? (
				<div>
					<PhoneInput
						international
						defaultCountry='PL'
						placeholder={placeholder || 'Введите номер телефона'}
						value={field.value}
						onChange={field.onChange}
						className='w-full'
					/>
				</div>
			) : isTextareaField ? (
				<div>
					<Textarea
						id={name}
						{...field}
						placeholder={placeholder || 'Введите текст...'}
						rows={rows}
						className={className}
					/>
				</div>
			) : isPriceField ? (
				<div className='relative'>
					<Input
						id={name}
						{...field}
						type='number'
						min='0'
						step={step}
						className={className}
						error={error}
					/>
					<span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm'>
						$
					</span>
				</div>
			) : (
				<div className='relative'>
					<Input
						error={error}
						placeholder={placeholder}
						type={inputType}
						{...field}
						id={name}
					/>
					{isPasswordField && (
						<button
							type='button'
							className='absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 text-gray-500 hover:text-gray-700 focus:outline-none'
							onClick={togglePasswordVisibility}
						>
							{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
						</button>
					)}
				</div>
			)}
			{error && <p className='text-red-500 text-sm h-5 ml-2'>{error} </p>}
		</div>
	)
}
