import { ProjectTemplate } from '@/types/manage';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { baseConfig } from '@/lib/data';

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
