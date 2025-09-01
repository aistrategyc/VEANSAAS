import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { LoginForm } from '@/features/auth/LoginForm'
import { SingUpForm } from '@/features/auth/SingUpForm'

export default function AuthLayout() {
	return (
		<div className='min-h-screen flex flex-col'>
			<main className='flex-1 flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8'>
				<div className='w-full max-w-md'>
					<div className='text-center mb-8'>
						<h1 className='text-3xl font-bold'>Добро пожаловать</h1>
						<p className='text-muted-foreground mt-2'>
							Войдите в свой аккаунт или создайте новый
						</p>
					</div>

					<Tabs defaultValue='login' className='w-full'>
						<TabsList className='grid w-full grid-cols-2'>
							<TabsTrigger value='login'>Вход</TabsTrigger>
							<TabsTrigger value='register'>Регистрация</TabsTrigger>
						</TabsList>

						<TabsContent value='login'>
							<Card>
								<CardHeader>
									<CardTitle>Вход в систему</CardTitle>
									<CardDescription>
										Введите ваши данные для входа в аккаунт
									</CardDescription>
								</CardHeader>
								<CardContent>
									<LoginForm />
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value='register'>
							<Card>
								<CardHeader>
									<CardTitle>Создать аккаунт</CardTitle>
									<CardDescription>
										Заполните форму для создания нового аккаунта
									</CardDescription>
								</CardHeader>
								<CardContent>
									<SingUpForm />
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>
				</div>
			</main>
		</div>
	)
}
