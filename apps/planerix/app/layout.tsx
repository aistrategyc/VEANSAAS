import '@/styles/globals.css';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Liderix — Операционная система для современного бизнеса',
  description: 'OKR, проекты, CRM, финансы и ИИ аналитика в одной платформе.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <Header />
        <main className="pt-24">{children}</main>
        <Footer />
      </body>
    </html>
  );
}