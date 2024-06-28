/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false, // turn to false
	devIndicators: {
		autoPrerender: true,
	},
	redirects: () => [
		{
			source: '/',
			destination: '/login',
			permanent: true,
		},
	],
};

module.exports = nextConfig;
