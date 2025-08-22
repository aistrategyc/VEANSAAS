import React from 'react'
import { SingUpForm } from '../../features/auth/SingUpForm'
import { Link } from 'react-router'

export const SingUpLayout = () => {
	return (
		<div className='min-h-screen bg-gray-300 py-6 sm:py-8 lg:py-12 flex justify-center'>
			<div>
				<h2 className='text-gray-700 text-4xl font-bold text-center mb-4 md:mb-6'>
					Sing Up
				</h2>
				<div className=' max-w-screen w-5xl flex justify-center'>
					<div className='max-w-xl h-185 bg-gray-100 rounded-3xl mx-auto p-10 pt-3 shadow'>
						<h2 className='text-gray-700 text-2xl font-bold text-center'>
							Person
						</h2>
						<SingUpForm />
						{/* <div className='text-sm'>
							<Link
								to='/login'
								className='font-medium text-blue-700 hover:text-blue-500'
							>
								You have an account?
							</Link>
						</div> */}
					</div>
				</div>
			</div>
		</div>
	)
}
