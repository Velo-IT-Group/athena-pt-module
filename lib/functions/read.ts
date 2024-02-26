'use server';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { CatalogItem, ProjectTemplate, ProjectWorkPlan, ServiceTicket } from '@/types/manage';
import { QueryData } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/server';
import { baseConfig } from '@/lib/utils';
import { unstable_cache } from 'next/cache';

export const getPhases = unstable_cache(
	async (id: string): Promise<Array<Phase & { tickets: Array<Ticket & { tasks: Task[] }> }> | undefined> => {
		'use server';
		const supabase = createClient();

		const { data, error } = await supabase.from('phases').select('*, tickets(*, tasks(*))').eq('proposal', id).order('order');

		if (!data || error) {
			console.error(error);
			return;
		}

		return data;
	},
	['phases'],
	{ tags: ['phases'] }
);

export const getUser = async () => {
	'use server';
	const supabase = createClient();

	try {
		const {
			data: { user },
		} = await supabase.auth.getUser();
		return user;
	} catch (error) {
		console.error(error);
	}
};

export const getWorkplan = async (id: number): Promise<ProjectWorkPlan | undefined> => {
	'use server';
	const url = `/project/projectTemplates/${id}/workplan`;
	let config: AxiosRequestConfig = {
		...baseConfig,
		url,
		params: {
			fields: 'phases/tickets/id,phases/tickets/summary',
		},
	};

	const response: AxiosResponse<ProjectWorkPlan, Error> = await axios.request(config);
	return response.data;
};

export const getTicket = async (id: number): Promise<ServiceTicket | undefined> => {
	'use server';
	var myHeaders = new Headers();
	myHeaders.append('clientId', '9762e3fa-abbd-4179-895e-ca7b0e015ab2');
	myHeaders.append('Authorization', 'Basic dmVsbytYMzJMQjRYeDVHVzVNRk56Olhjd3Jmd0dwQ09EaFNwdkQ=');

	var requestOptions: RequestInit = {
		method: 'GET',
		headers: myHeaders,
		next: {
			tags: ['tickets'],
		},
	};

	const response = await fetch(`https://manage.velomethod.com/v4_6_release/apis/3.0/service/tickets/${id}`, requestOptions);

	return await response.json();
};

export const getTickets = unstable_cache(
	async (): Promise<ServiceTicket[] | undefined> => {
		'use server';
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
			const response: AxiosResponse<ServiceTicket[], Error> = await axios.request(config);
			console.log(response);
			return response.data;
		} catch (error) {
			console.error(error);
			return;
		}
	},
	['serviceTickets'],
	{ tags: ['serviceTickets'] }
);

export const getCatalogItems = unstable_cache(
	async () => {
		'use server';
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
			const response: AxiosResponse<CatalogItem[], Error> = await axios.request(config);
			return response.data;
		} catch (error) {
			console.error(error);
			return;
		}
		var myHeaders = new Headers();
		myHeaders.append('clientId', '9762e3fa-abbd-4179-895e-ca7b0e015ab2');
		myHeaders.append('Authorization', 'Basic dmVsbytYMzJMQjRYeDVHVzVNRk56Olhjd3Jmd0dwQ09EaFNwdkQ=');

		var requestOptions = {
			method: 'GET',
			headers: myHeaders,
		};

		const response = await fetch(
			'https://manage.velomethod.com/v4_6_release/apis/3.0/procurement/catalog?conditions=inactiveFlag = false&fields=id,identifier,description,price,cost',
			requestOptions
		);

		return await response.json();
	},
	['catalog'],
	{ tags: ['catalog'] }
);

export const getProducts = unstable_cache(
	async (id: string) => {
		'use server';
		const supabase = createClient();

		const { data: products, error } = await supabase.from('products').select('*').eq('proposal', id);

		if (!products || error) {
			console.error('ERROR IN GET PRODUCTS QUERY', error);
			return;
		}

		return products;
	},
	['products'],
	{ tags: ['products'] }
);

export const getProposal = unstable_cache(
	async (id: string) => {
		'use server';
		const supabase = createClient();

		const proposalWithPhasesQuery = supabase
			.from('proposals')
			.select('*, phases(*, tickets(*, tasks(*)))')
			.eq('id', id)
			.order('order', { referencedTable: 'phases', ascending: true })
			.single();

		type ProposalWithPhases = QueryData<typeof proposalWithPhasesQuery>;

		const { data: proposal, error } = await proposalWithPhasesQuery;

		if (!proposal || error) {
			console.error('ERROR IN GET PROPOSAL QUERY', error);
			return;
		}

		return proposal as ProposalWithPhases;
	},
	['proposals'],
	{ tags: ['proposals'] }
);

export const getOrganization = unstable_cache(
	async () => {
		'use server';
		const supabase = createClient();
		const { data, error } = await supabase.from('organizations').select().single();

		if (!data || error) {
			console.error('ERROR IN GETTING ORGANIZATION QUERY', error);
			return;
		}

		return data;
	},
	['organizations'],
	{ tags: ['organizations'] }
);

export const getProposals = unstable_cache(
	async () => {
		'use server';
		const supabase = createClient();

		const proposalsQuery = supabase.from('proposals').select('*, phases(*, tickets(*, tasks(*)))').order('updated_at', { ascending: false });

		type Proposals = QueryData<typeof proposalsQuery>;

		const { data: proposals, error } = await proposalsQuery;

		if (!proposals || error) {
			console.error(error);
			return;
		}

		// console.log(proposals);

		return proposals as Proposals;
	},
	['proposals'],
	{ tags: ['proposals'] }
);

export const getTemplates = unstable_cache(
	async (): Promise<Array<ProjectTemplate> | undefined> => {
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

			return mappedTemplates;
		} catch (error) {
			console.error(error);
			return;
		}
	},
	['templates'],
	{ tags: ['templates'] }
);

export const getTemplate = unstable_cache(
	async (id: number): Promise<ProjectTemplate | undefined> => {
		let config: AxiosRequestConfig = {
			...baseConfig,
			url: `/project/projectTemplates/${id}`,
		};

		try {
			const response: AxiosResponse<ProjectTemplate, Error> = await axios.request(config);
			console.log(response.data);
			const workplan = await axios.request<ProjectWorkPlan>({ ...baseConfig, url: `/project/projectTemplates/${response.data.id}/workplan` });
			console.log(workplan.data);

			return { ...response.data, workplan: workplan?.data ?? [] };
		} catch (error) {
			console.error(error);
			return;
		}
	},
	['templates'],
	{ tags: ['templates'] }
);
