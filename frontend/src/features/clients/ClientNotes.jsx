import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { TabsContent } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { MessageSquare } from 'lucide-react'

export const ClientNotes = ({ clientData }) => {
	return (
		<TabsContent value='notes' className='space-y-4'>
			<Card className='crypto-card'>
				<CardHeader>
					<CardTitle className='flex items-center gap-2'>
						<MessageSquare className='h-5 w-5 text-accent' />
						Заметки о клиенте
					</CardTitle>
					<CardDescription>
						Важная информация, предпочтения и особенности
					</CardDescription>
				</CardHeader>
				<CardContent className='space-y-4'>
					<Textarea
						placeholder='Добавить заметку о клиенте...'
						defaultValue={clientData.notes}
						className='min-h-[120px] bg-input border-border text-card-foreground'
					/>
					<div className='flex justify-end gap-2'>
						<Button variant='outline' size='sm'>
							Отменить
						</Button>
						<Button size='sm'>Сохранить заметки</Button>
					</div>
				</CardContent>
			</Card>
		</TabsContent>
	)
}
