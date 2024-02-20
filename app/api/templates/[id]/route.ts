import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { baseConfig } from '@/lib/data';
import { ProjectTemplate, ProjectWorkPlan } from '@/types/manage';

export async function GET(request: Request, { params }: { params: { id: number } }) {
	const { id } = params;
	let config: AxiosRequestConfig = {
		...baseConfig,
		url: `/project/projectTemplates/${id}`,
	};

	try {
		const response: AxiosResponse<ProjectTemplate, Error> = await axios.request(config);
		console.log(response.data);
		const workplan = await axios.request<ProjectWorkPlan>({ ...baseConfig, url: `/project/projectTemplates/${response.data.id}/workplan` });
		console.log(workplan.data);

		return Response.json({ ...response.data, workplan: workplan.data });
	} catch (error) {
		return new Response(`Error: ${error}`, {
			status: 400,
		});
	}
}
