import { motion } from 'framer-motion'

export default function AuthLayout({ children }) {
	return (
		<div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted'>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4, ease: 'easeOut' }}
				className='w-full max-w-md p-8 rounded-2xl border bg-card shadow-xl'
			>
				<div className='text-center'>
					<h1 className='text-3xl font-semibold text-foreground'>
						Добро пожаловать
					</h1>
					<p className='text-muted-foreground mt-2'>
						Войдите или создайте новый аккаунт
					</p>
				</div>
				{children}
			</motion.div>
		</div>
	)
}
