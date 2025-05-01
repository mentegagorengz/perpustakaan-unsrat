import withPWA from 'next-pwa';
import type { NextConfig } from 'next';
import path from 'path';

const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['yourdomain.com'], // ganti jika perlu load gambar dari domain luar
  },
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL,
  },
  // experimental: {
  //   serverActions: true, // kalau kamu pakai fitur App Router
  // },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
};

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: isDev, // ⛔ Matikan PWA saat development
})(nextConfig);



// import withPWA from 'next-pwa';
// import type { NextConfig } from 'next';

// const nextConfig: NextConfig = {
//   reactStrictMode: true,
//   // konfigurasi lainnya
// };

// export default withPWA({
//   dest: 'public',
//   register: true,
//   skipWaiting: true,
//   disable: process.env.NODE_ENV === 'development',
// })(nextConfig);
