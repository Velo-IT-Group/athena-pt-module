import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { baseConfig } from '@/lib/utils';
import { ProjectTemplate, ProjectWorkPlan } from '@/types/manage';

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
		const response: AxiosResponse<Array<ProjectTemplate>, Error> = await axios.request(config);
		const workplans = await Promise.all(
			response.data.map(({ id }) => axios.request<ProjectWorkPlan>({ ...baseConfig, url: `/project/projectTemplates/${id}/workplan` }))
		);

		const mappedTemplates = response.data.map((template) => {
			return {
				...template,
				workplan: workplans.find((workplan) => workplan.data.templateId === template.id)?.data,
			};
		});

		return Response.json(mappedTemplates);
	} catch (error) {
		return new Response(`Error: ${error}`, {
			status: 400,
		});
	}
}
