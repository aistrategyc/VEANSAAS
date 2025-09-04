import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { SingUpSimpleForm } from '@/features/auth/SingUpSimpleForm'
export const RegisterSimple = () => {
	return (
		<div className='min-h-screen flex flex-col'>
			<main className='flex-1 flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8'>
				<div className='w-full max-w-md'>
					<Card>
						<CardHeader>
							<CardTitle className='text-2xl'>Создать аккаунт</CardTitle>
							<CardDescription >
								Заполните форму для создания нового аккаунта
							</CardDescription>
						</CardHeader>
						<CardContent>
							<SingUpSimpleForm />
						</CardContent>
					</Card>
				</div>
			</main>
		</div>
	)
}
