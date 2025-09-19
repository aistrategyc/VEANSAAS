'use client'

import { useState } from 'react'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RoleGuard } from '@/components/ui/role-guard'
import { DatePickerWithRange } from '@/components/ui/date-range-picker'
import {
	Download,
	FileText,
	TrendingUp,
	Users,
	Calendar,
	DollarSign,
	Clock,
	Star,
} from 'lucide-react'
import { NoAccessState } from '@/components/ui/no-access-state'

// Mock data for reports
const mockReports = [
	{
		id: '1',
		name: 'Отчет по доходам',
		description: 'Детальный анализ доходов за период',
		type: 'revenue',
		period: 'За месяц',
		generatedAt: '2024-01-15T10:30:00Z',
		status: 'ready',
		fileSize: '2.3 MB',
	},
	{
		id: '2',
		name: 'Отчет по клиентам',
		description: 'Статистика по клиентской базе',
		type: 'clients',
		period: 'За квартал',
		generatedAt: '2024-01-14T15:45:00Z',
		status: 'ready',
		fileSize: '1.8 MB',
	},
	{
		id: '3',
		name: 'Отчет по мастерам',
		description: 'Производительность и рейтинги мастеров',
		type: 'masters',
		period: 'За месяц',
		generatedAt: '2024-01-13T09:15:00Z',
		status: 'generating',
		fileSize: null,
	},
]

const reportTemplates = [
	{
		id: 'revenue',
		name: 'Отчет по доходам',
		description: 'Анализ доходов, популярных услуг и трендов',
		icon: DollarSign,
		color: 'text-green-600',
	},
	{
		id: 'clients',
		name: 'Отчет по клиентам',
		description: 'Статистика клиентской базы и лояльности',
		icon: Users,
		color: 'text-blue-600',
	},
	{
		id: 'appointments',
		name: 'Отчет по записям',
		description: 'Анализ загруженности и эффективности',
		icon: Calendar,
		color: 'text-purple-600',
	},
	{
		id: 'masters',
		name: 'Отчет по мастерам',
		description: 'Производительность и рейтинги сотрудников',
		icon: Star,
		color: 'text-orange-600',
	},
	{
		id: 'services',
		name: 'Отчет по услугам',
		description: 'Популярность и прибыльность услуг',
		icon: TrendingUp,
		color: 'text-cyan-600',
	},
	{
		id: 'schedule',
		name: 'Отчет по расписанию',
		description: 'Анализ загруженности по времени и дням',
		icon: Clock,
		color: 'text-indigo-600',
	},
]

export default function ReportsPage() {
	const { user } = {
		role: 'admin',
	}
	const [activeTab, setActiveTab] = useState('generate')
	const [selectedDateRange, setSelectedDateRange] = useState(null)

	const handleGenerateReport = templateId => {
		console.log(`Generating report: ${templateId}`)
		// Here would be the actual report generation logic
	}

	const handleDownloadReport = reportId => {
		console.log(`Downloading report: ${reportId}`)
		// Here would be the actual download logic
	}

	return (
		<RoleGuard allowedRoles={['admin', 'MasterOwner']}>
			<div className='space-y-6'>
				{/* Header */}
				<div className='flex items-center justify-between'>
					<div>
						<h1 className='text-3xl font-bold text-foreground'>Отчеты</h1>
						<p className='text-muted-foreground'>
							Генерация и управление отчетами
						</p>
					</div>
					<DatePickerWithRange
						value={selectedDateRange}
						onChange={setSelectedDateRange}
					/>
				</div>

				{/* Quick Stats */}
				<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
					<Card>
						<CardContent className='p-6'>
							<div className='flex items-center space-x-2'>
								<FileText className='w-5 h-5 text-primary' />
								<div>
									<p className='text-2xl font-bold'>12</p>
									<p className='text-sm text-muted-foreground'>Всего отчетов</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className='p-6'>
							<div className='flex items-center space-x-2'>
								<Download className='w-5 h-5 text-green-600' />
								<div>
									<p className='text-2xl font-bold'>8</p>
									<p className='text-sm text-muted-foreground'>
										Готовы к скачиванию
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className='p-6'>
							<div className='flex items-center space-x-2'>
								<Clock className='w-5 h-5 text-orange-600' />
								<div>
									<p className='text-2xl font-bold'>3</p>
									<p className='text-sm text-muted-foreground'>В процессе</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className='p-6'>
							<div className='flex items-center space-x-2'>
								<TrendingUp className='w-5 h-5 text-blue-600' />
								<div>
									<p className='text-2xl font-bold'>24.5 MB</p>
									<p className='text-sm text-muted-foreground'>Общий размер</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				<Tabs value={activeTab} onValueChange={setActiveTab}>
					<TabsList>
						<TabsTrigger value='generate'>Создать отчет</TabsTrigger>
						<TabsTrigger value='history'>История отчетов</TabsTrigger>
					</TabsList>

					<TabsContent value='generate' className='space-y-6'>
						<Card>
							<CardHeader>
								<CardTitle>Выберите тип отчета</CardTitle>
								<CardDescription>
									Создайте детальный отчет по выбранным параметрам
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
									{reportTemplates.map(template => {
										const Icon = template.icon
										return (
											<Card
												key={template.id}
												className='hover:shadow-md transition-shadow cursor-pointer'
											>
												<CardContent className='p-6'>
													<div className='flex items-start space-x-4'>
														<div
															className={`p-2 rounded-lg bg-muted ${template.color}`}
														>
															<Icon className='w-6 h-6' />
														</div>
														<div className='flex-1'>
															<h3 className='font-semibold text-foreground mb-2'>
																{template.name}
															</h3>
															<p className='text-sm text-muted-foreground mb-4'>
																{template.description}
															</p>
															<Button
																size='sm'
																onClick={() =>
																	handleGenerateReport(template.id)
																}
																className='w-full'
															>
																Создать отчет
															</Button>
														</div>
													</div>
												</CardContent>
											</Card>
										)
									})}
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value='history' className='space-y-6'>
						<Card>
							<CardHeader>
								<CardTitle>История отчетов</CardTitle>
								<CardDescription>
									Ранее созданные отчеты и их статус
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className='space-y-4'>
									{mockReports.map(report => (
										<div
											key={report.id}
											className='flex items-center justify-between p-4 border rounded-lg'
										>
											<div className='flex-1'>
												<div className='flex items-center space-x-3 mb-2'>
													<h3 className='font-semibold text-foreground'>
														{report.name}
													</h3>
													<Badge
														variant={
															report.status === 'ready'
																? 'default'
																: 'secondary'
														}
													>
														{report.status === 'ready'
															? 'Готов'
															: 'Генерируется'}
													</Badge>
												</div>
												<p className='text-sm text-muted-foreground mb-1'>
													{report.description}
												</p>
												<div className='flex items-center space-x-4 text-xs text-muted-foreground'>
													<span>{report.period}</span>
													<span>
														Создан:{' '}
														{new Date(report.generatedAt).toLocaleDateString(
															'ru-RU'
														)}
													</span>
													{report.fileSize && (
														<span>Размер: {report.fileSize}</span>
													)}
												</div>
											</div>
											<div className='flex items-center space-x-2'>
												{report.status === 'ready' && (
													<Button
														size='sm'
														variant='outline'
														onClick={() => handleDownloadReport(report.id)}
													>
														<Download className='w-4 h-4 mr-2' />
														Скачать
													</Button>
												)}
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</RoleGuard>
	)
}
