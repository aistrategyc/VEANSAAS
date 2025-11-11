import { motion } from 'framer-motion'

export const ProgressSteps = ({ currentStep, totalSteps }) => {
	const progress = (currentStep / totalSteps) * 100

	return (
		<div className='mt-3 mb-3'>
			<div className='flex justify-between text-sm text-muted-foreground mb-2'>
				<span>
					Шаг {currentStep} из {totalSteps}
				</span>
				<span>{Math.round(progress)}%</span>
			</div>
			<div className='w-full bg-muted rounded-full h-2'>
				<motion.div
					className='bg-primary h-2 rounded-full'
					initial={{ width: 0 }}
					animate={{ width: `${progress}%` }}
					transition={{ duration: 0.5, ease: 'easeOut' }}
				/>
			</div>
		</div>
	)
}
