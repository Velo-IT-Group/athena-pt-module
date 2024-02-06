import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { baseConfig } from '../../route';
import { ProjectWorkPlan } from '@/types';

export async function GET(request: Request, { params }: { params: { id: string } }) {
	const id = params.id; // 'a', 'b', or 'c'
	let config: AxiosRequestConfig = {
		...baseConfig,
		url: `/project/projectTemplates/${id}/workplan`,
		// params: {
		// 	fields: 'id,name,description',
		// },
	};

	try {
		const response: AxiosResponse<ProjectWorkPlan, Error> = await axios.request(config);
		return Response.json(response.data);
	} catch (error) {
		return new Response(`Error: ${error}`, {
			status: 400,
		});
	}
}
