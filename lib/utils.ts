import { AxiosRequestConfig } from 'axios';
import { type ClassValue, clsx } from 'clsx';
import { DroppableStateSnapshot } from 'react-beautiful-dnd';
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

export const getBackgroundColor = (snapshot: DroppableStateSnapshot): string => {
	// Giving isDraggingOver preference
	if (snapshot.isDraggingOver) {
		return 'bg-blue-50';
	}

	// If it is the home list but not dragging over
	if (snapshot.draggingFromThisWith) {
		return 'bg-pink-50';
	}

	// Otherwise use our default background
	return 'bg-transparent';
};
