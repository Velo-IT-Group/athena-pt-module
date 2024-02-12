import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { baseConfig } from '@/lib/data';
import { ProjectWorkPlan } from '@/types/manage';

export async function GET(request: Request, { params }: { params: { id: string } }) {
	const id = params.id; // 'a', 'b', or 'c'
	let url = `/project/projectTemplates/${id}/workplan`;
	let config: AxiosRequestConfig = {
		...baseConfig,
		url,
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
