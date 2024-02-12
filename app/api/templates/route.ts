import { ProjectTemplate } from '@/types/manage';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export const baseConfig: AxiosRequestConfig = {
	method: 'get',
	baseURL: process.env.NEXT_PUBLIC_CW_URL,
	headers: {
		clientId: process.env.NEXT_PUBLIC_CW_CLIENT_ID,
	},
	auth: {
		username: process.env.NEXT_PUBLIC_CW_USERNAME!,
		password: process.env.NEXT_PUBLIC_CW_PASSWORD!,
	},
};

export async function GET(request: Request) {
	let config: AxiosRequestConfig = {
		...baseConfig,
		url: '/project/projectTemplates',
		params: {
			fields: 'id,name,description',
			pageSize: 1000,
			orderBy: 'name',
		},
	};

	try {
		const response: AxiosResponse<ProjectTemplate, Error> = await axios.request(config);
		return Response.json(response.data);
	} catch (error) {
		return new Response(`Error: ${error}`, {
			status: 400,
		});
	}
}
