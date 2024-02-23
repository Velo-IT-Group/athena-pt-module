import { AxiosRequestConfig } from 'axios';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const baseConfig: AxiosRequestConfig = {
	method: 'get',
	baseURL: process.env.NEXT_PUBLIC_CW_URL!,
	headers: {
		clientId: process.env.NEXT_PUBLIC_CW_CLIENT_ID!,
	},
	auth: {
		username: process.env.NEXT_PUBLIC_CW_USERNAME!,
		password: process.env.NEXT_PUBLIC_CW_PASSWORD!,
	},
};
