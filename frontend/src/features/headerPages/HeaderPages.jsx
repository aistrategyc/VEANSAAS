import { Button } from '@/components/ui/button'
import { Eye, MessageSquare, Plus } from 'lucide-react'

export const HeaderPages = ({
	title,
	description,
	nameButton,
	type = null,
	onClick,
}) => {
	return (
		<div className='flex flex-wrap items-center justify-between max-md:'>
			<div>
				<h1 className='max-sm:text-xl text-3xl font-bold text-foreground'>
					{title}
				</h1>
				<p className='max-sm:text-sm text-muted-foreground'>{description}</p>
			</div>
			<div className='flex gap-2 max-md:mt-2'>
				{(() => {
					switch (type) {
						case 'analytics':
							return (
								<>
									<Button variant='outline'>Экспорт</Button>
									<Button className='bg-primary hover:bg-primary/90'>
										Создать отчет
									</Button>
								</>
							)
						case 'main':
							return (
								<div className='flex gap-2'>
									<Button
										variant='outline'
										className='hover:scale-105 transition-all duration-200 bg-transparent'
									>
										<Eye className='h-4 w-4 mr-2' />
										Обзор
									</Button>
									<Button
										className='bg-primary hover:bg-primary/90 transition-all duration-200 hover:scale-105'
										onClick={onClick}
									>
										<Plus className='h-4 w-4 mr-2' />
										Новая запись
									</Button>
								</div>
							)
						case 'clientCard':
							return (
								<div className='flex gap-3'>
									<Button variant='outline' size='sm'>
										<MessageSquare className='h-4 w-4 mr-2' />
										Отправить SMS
									</Button>
									<Button size='sm'>
										<Plus className='h-4 w-4 mr-2' />
										Записать на прием
									</Button>
								</div>
							)
						default:
							return (
								<Button
									onClick={onClick}
									className='bg-primary hover:bg-primary/90'
								>
									<Plus className='h-4 w-4 mr-2' />
									{nameButton}
								</Button>
							)
					}
				})()}
			</div>
		</div>
	)
}
