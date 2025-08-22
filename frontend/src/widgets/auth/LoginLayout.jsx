import React from 'react'
import { LoginForm } from '../../features/auth/LoginForm'
import { Link } from 'react-router'

export const LoginLayout = () => {
	return (
		<div className='min-h-screen bg-gray-300 py-6 sm:py-8 lg:py-12 flex justify-center'>
			<div className='w-xl m-auto'>
				<h2 className='text-gray-700 text-4xl font-bold text-center mb-4 md:mb-6'>
					Login in
				</h2>
				<div className='max-w-lg h-70 bg-gray-100 rounded-3xl mx-auto p-10 shadow'>
					<LoginForm />
					<div className='text-sm'>
						<Link
							to='/register'
							className='font-medium text-blue-700 hover:text-blue-500'
						>
							Don't have an account?
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}
