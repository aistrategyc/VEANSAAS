import { Card, CardContent } from '@/components/ui/card'
import { LoginForm } from '@/features/auth/LoginForm'
import AuthLayout from '@/widgets/auth/AuthLayout'
import { Link } from 'react-router-dom'

const LoginPage = () => {
	return (
		<AuthLayout>
			<Card className='border-none shadow-none bg-transparent'>
				<CardContent>
					<LoginForm />
					<p className='text-center text-sm text-muted-foreground mt-4'>
						Нет аккаунта?{' '}
						<Link
							to='/register'
							className='text-primary font-medium hover:underline'
						>
							Создать
						</Link>
					</p>
				</CardContent>
			</Card>
		</AuthLayout>
	)
}
export default LoginPage
