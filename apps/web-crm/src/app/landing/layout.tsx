// src/app/landing/layout.tsx
export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="bg-white text-gray-900">
        {children}
      </body>
    </html>
  );
}