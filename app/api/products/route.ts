import { CatalogItem } from '@/types/manage';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { baseConfig } from '@/lib/data';

export async function GET(request: Request) {
	let config: AxiosRequestConfig = {
		...baseConfig,
		url: '/procurement/catalog',
		params: {
			conditions: 'inactiveFlag = false',
			pageSize: 1000,
			orderBy: 'description',
			fields: 'id,identifier,description,price,cost',
		},
	};

	try {
		const response: AxiosResponse<CatalogItem, Error> = await axios.request(config);
		return Response.json(response.data);
	} catch (error) {
		return new Response(`${error}`, {
			status: 400,
		});
	}
}
