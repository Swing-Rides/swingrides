import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'files.example.com',
			},
			{ 
				protocol: 'https', 
				hostname: 'api.dicebear.com' 
			},
		],
	},
};

export default nextConfig;
