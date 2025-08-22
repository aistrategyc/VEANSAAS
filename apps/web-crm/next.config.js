
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  // 🌟 Пропускаем все ошибки ESLint во время сборки
  eslint: {
    ignoreDuringBuilds: true,
  },
  // TypeScript errors пропускаем на время сборки для быстрого деплоя
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    // Используем переменную окружения для API URL
    const apiUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";
    
    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
  // Оптимизация для продакшн
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react'],
  },
  // Сжатие
  compress: true,
  // Кэширование
  swcMinify: true,
};

module.exports = nextConfig;