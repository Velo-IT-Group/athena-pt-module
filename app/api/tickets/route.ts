import { type ServiceTicket } from '@/types/manage';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { baseConfig } from '@/lib/utils';

export async function GET(request: Request) {
	let config: AxiosRequestConfig = {
		...baseConfig,
		url: '/service/tickets',
		params: {
			conditions: "closedFlag = false and board/id = 38 and type/id = 200 and summary contains 'Proposal'",
			pageSize: 1000,
			orderBy: 'id',
		},
	};

	try {
		const response: AxiosResponse<ServiceTicket, Error> = await axios.request(config);
		return Response.json(response.data);
	} catch (error) {
		return new Response(`${error}`, {
			status: 400,
		});
	}
}
