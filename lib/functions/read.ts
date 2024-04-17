'use server';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import type {
	CatalogComponent,
	CatalogItem,
	Category,
	ProductsItem,
	ProjectTemplate,
	ProjectWorkPlan,
	ReferenceType,
	ServiceTicket,
	Subcategory,
	TicketNote,
} from '@/types/manage';
import { QueryData } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/server';
import { baseConfig, baseHeaders } from '@/lib/utils';
import { unstable_cache } from 'next/cache';
import { redirect } from 'next/navigation';

const catalogItemFields =
	'calculatedCostFlag,calculatedPriceFlag,calculatedPrice,manufacturerPartNumber,calculatedCost,category/name,cost,customerDescription,parentCatalogItem,description,dropShipFlag,id,identifier,inactiveFlag,manufacturer/name,phaseProductFlag,price,productClass,proposal,recurringBillCycle/id,recurringCost,recurringCycleType,recurringFlag,recurringOneTimeFlag,recurringRevenue,serializedCostFlag,serializedFlag,specialOrderFlag,subcategory/name,taxableFlag,type,uniqueId,unitOfMeasure/id,vendor/name';

const catalogComponentFields =
	'catalogItem,cost,hideDescriptionFlag,hideExtendedPriceFlag,hideItemIdentifierFlag,hidePriceFlag,hideQuantityFlag,id,parentCatalogItem,price,quantity,sequenceNumber';

export const getPhases = unstable_cache(
	async (id: string): Promise<Array<Phase & { tickets: Array<Ticket & { tasks: Task[] }> }> | undefined> => {
		const supabase = createClient();

		const { data, error } = await supabase.from('phases').select('*, tickets(*, tasks(*))').eq('version', id).order('order');

		if (!data || error) {
			throw Error('Error in getting phases', { cause: error });
		}

		return data;
	},
	['phases'],
	{ tags: ['phases'] }
);

export const getUser = async () => {
	const supabase = createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	return user;
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

export const getCompany = async (id: number): Promise<ServiceTicket | undefined> => {
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

export const getTickets = async (): Promise<ServiceTicket[] | undefined> => {
	'use server';
	let config: AxiosRequestConfig = {
		...baseConfig,
		url: '/service/tickets',
		params: {
			conditions: 'closedFlag = false and board/id = 38 and type/id = 200',
			pageSize: 1000,
			orderBy: 'id',
		},
	};

	try {
		const response: AxiosResponse<ServiceTicket[], Error> = await axios.request(config);
		// console.log(response);
		return response.data;
	} catch (error) {
		console.error(error);
		return;
	}
};

export const getCatalogItems = async (searchText?: string, identifier?: string, page?: number) => {
	let config: AxiosRequestConfig = {
		...baseConfig,
		url: '/procurement/catalog',
		params: {
			conditions: `inactiveFlag = false ${searchText ? `and description contains '${searchText}'` : ''} ${
				identifier ? `and identifier contains '${identifier}'` : ''
			}`,
			pageSize: 10,
			page: page ?? 1,
			orderBy: 'description',
			fields: catalogItemFields,
		},
	};

	try {
		const response: AxiosResponse<CatalogItem[], Error> = await axios.request(config);

		config = {
			...baseConfig,
			url: '/procurement/catalog/count',
			params: {
				conditions: `inactiveFlag = false ${searchText ? `and description contains '${searchText}'` : ''}`,
				pageSize: 10,
				page: page ?? 1,
			},
		};

		const countResponse: AxiosResponse<{ count: number }, Error> = await axios.request(config);
		const bundles = response.data.filter((item) => item.productClass === 'Bundle');
		const bItems = (await Promise.all(bundles.map((b) => getCatalogItemComponents(b.id)))).flat();

		// console.log(response.data);

		const mappedData = response.data.map((item) => {
			return {
				...item,
				bundledItems: bItems?.filter((bItem) => bItem && bItem.parentCatalogItem.id === item.id),
			};
		});

		return { catalogItems: mappedData as CatalogItem[], count: countResponse.data.count };
	} catch (error) {
		console.error(error);
		return { catalogItems: [], count: 0 };
	}
};

export const getCatalogItemsById = async (ids: number[]) => {
	let config: AxiosRequestConfig = {
		...baseConfig,
		url: '/procurement/catalog',
		params: {
			conditions: `id in (${ids.toString()})`,
			orderBy: 'description',
		},
	};

	try {
		const response: AxiosResponse<CatalogItem[], Error> = await axios.request(config);

		return response.data;
	} catch (error) {
		console.error(error);
		return;
	}
};

export const getCatalogItem = async (id: number) => {
	let config: AxiosRequestConfig = {
		...baseConfig,
		url: `/procurement/catalog/${id}`,
	};

	try {
		const headers = new Headers();
		headers.append('clientId', '9762e3fa-abbd-4179-895e-ca7b0e015ab2');
		headers.append('Authorization', 'Basic dmVsbytYMzJMQjRYeDVHVzVNRk56Olhjd3Jmd0dwQ09EaFNwdkQ=');

		const response = await fetch(`${process.env.NEXT_PUBLIC_CW_URL!}/procurement/catalog/${id}`, { method: 'GET', headers });

		const data = await response.json();

		return data;
	} catch (error) {
		console.error(error);
	}
};

// export const getCatalogItems = unstable_cache(
// 	async (searchText?: string, page?: number) => {
// 		let config: AxiosRequestConfig = {
// 			...baseConfig,
// 			url: '/procurement/catalog',
// 			params: {
// 				conditions: `inactiveFlag = false ${searchText ? `and description contains '${searchText}'` : ''}`,
// 				pageSize: 10,
// 				page: page ?? 1,
// 				orderBy: 'description',
// 				fields: catalogItemFields,
// 			},
// 		};

// 		try {
// 			const response: AxiosResponse<CatalogItem[], Error> = await axios.request(config);

// 			config = {
// 				...baseConfig,
// 				url: '/procurement/catalog/count',
// 				params: {
// 					conditions: `inactiveFlag = false ${searchText ? `and description contains '${searchText}'` : ''}`,
// 					pageSize: 10,
// 					page: page ?? 1,
// 				},
// 			};

// 			const countResponse: AxiosResponse<{ count: number }, Error> = await axios.request(config);
// 			const bundles = response.data.filter((item) => item.productClass === 'Bundle');
// 			const bItems = (await Promise.all(bundles.map((b) => getCatalogItemComponents(b.id)))).flat();

// 			const mappedData = response.data.map((item) => {
// 				return {
// 					...item,
// 					bundledItems: bItems?.filter((bItem) => bItem && bItem.parentCatalogItem.id === item.id),
// 				};
// 			});

// 			return { catalogItems: mappedData as CatalogItem[], count: countResponse.data.count };
// 		} catch (error) {
// 			console.error(error);
// 			return { catalogItems: [], count: 0 };
// 		}
// 	},
// 	['catalog'],
// 	{ tags: ['catalog'] }
// );

export const getComments = async (id: string) => {
	const supabase = createClient();

	const { data, error } = await supabase.from('comments').select('*, user(*)').eq('proposal', id);

	if (!data || error) {
		throw Error('Error in getting comments', { cause: error });
	}

	return data;
};

export const getCatalogItemComponents = async (id: number) => {
	let config: AxiosRequestConfig = {
		...baseConfig,
		url: `/procurement/catalog/${id}/components`,
		params: {
			fields: catalogComponentFields,
		},
	};

	try {
		const response: AxiosResponse<CatalogComponent[], Error> = await axios.request(config);

		if (!response.data.length) return;

		config = {
			...baseConfig,
			url: '/procurement/catalog',
			params: {
				conditions: `id in (${response.data.map((c) => c.catalogItem.id).toString()})`,
				fields: catalogItemFields,
			},
		};

		const catalogItems: AxiosResponse<CatalogItem[], Error> = await axios.request(config);

		const mappedCatalogItems = response.data.map((c) => {
			const item = catalogItems.data.find((i) => i?.id === c?.catalogItem.id);

			return {
				...item,
				...c,
			};
		});

		console.log(mappedCatalogItems);

		return mappedCatalogItems;
	} catch (error) {
		console.error(error);
		return;
	}
};

export const getCategories = unstable_cache(
	async () => {
		let config: AxiosRequestConfig = {
			...baseConfig,
			url: '/procurement/categories',
			params: {
				pageSize: 1000,
			},
		};

		try {
			const response: AxiosResponse<Category[], Error> = await axios.request(config);

			return response.data;
		} catch (error) {
			console.error(error);
			return [];
		}
	},
	['categories'],
	{ tags: ['categories'] }
);

export const getBillingCycles = unstable_cache(
	async () => {
		let config: AxiosRequestConfig = {
			...baseConfig,
			url: '/finance/billingCycles',
			params: {
				pageSize: 1000,
			},
		};

		try {
			const response: AxiosResponse<ReferenceType[], Error> = await axios.request(config);

			return response.data;
		} catch (error) {
			console.error(error);
			return [];
		}
	},
	['billingCycles'],
	{ tags: ['billingCycles'] }
);

export const getSubCategories = unstable_cache(
	async () => {
		let config: AxiosRequestConfig = {
			...baseConfig,
			url: '/procurement/subcategories',
			params: {
				pageSize: 1000,
			},
		};

		try {
			const response: AxiosResponse<Subcategory[], Error> = await axios.request(config);

			return response.data;
		} catch (error) {
			console.error(error);
			return [];
		}
	},
	['subcategories'],
	{ tags: ['subcategories'] }
);

export const getTicketNotes = async (id: number) => {
	let config: AxiosRequestConfig = {
		...baseConfig,
		url: `/service/tickets/${id}/allNotes`,
		params: {
			pageSize: 250,
			orderBy: '_info/sortByDate desc',
		},
	};

	try {
		const response: AxiosResponse<TicketNote[], Error> = await axios.request(config);

		return response.data;
	} catch (error) {
		console.error(error);
		return [];
	}
};

export const getSections = unstable_cache(
	async (id: string) => {
		const supabase = createClient();

		const { data: sections, error } = await supabase
			.from('sections')
			.select('*, products(*, products(*))')
			.eq('version', id)
			.is('products.parent', null)
			.order('created_at')
			.returns<Array<Section & { products: NestedProduct[] }>>();

		if (!sections || error) {
			throw Error('Error in getting sections', { cause: error });
		}

		return sections;
	},
	['sections'],
	{ tags: ['sections'] }
);

export const getSection = unstable_cache(
	async (id: string) => {
		const supabase = createClient();

		const { data: section, error } = await supabase
			.from('sections')
			.select('*, products(*, products(*))')
			.eq('id', id)
			.is('products.parent', null)
			.single();

		if (!section || error) {
			throw Error('Error in getting sections', { cause: error });
		}

		return section as Section & { products: Product[] };
	},
	['sections'],
	{ tags: ['sections'] }
);

export const getProducts = unstable_cache(
	async (id: string) => {
		const supabase = createClient();

		const { data: products, error } = await supabase
			.from('products')
			.select(`*, products(*, products(*))`)
			.eq('version', id)
			.is('parent', null)
			.order('sequence_number')
			.returns<NestedProduct[]>();

		if (!products || error) {
			throw Error('Error in getting products...', { cause: error });
		}

		return products;
	},
	['products'],
	{ tags: ['products'] }
);

export const getProduct = unstable_cache(
	async (id: string) => {
		const supabase = createClient();

		const { data: product, error } = await supabase.from('products').select('*, parent(*)').eq('unique_id', id).single();

		if (!product || error) {
			throw Error('Error in getting product...', { cause: error });
		}

		return product;
	},
	['products'],
	{ tags: ['products'] }
);

export const getMembers = unstable_cache(
	async () => {
		const supabase = createClient();
		const { data, error } = await supabase.from('organizations').select('profiles(*)').single();

		if (!data || error) {
			throw Error('Error in getting members', { cause: error });
		}

		return data.profiles;
	},
	['members'],
	{ tags: ['members'] }
);

export const getProposal = unstable_cache(
	async (id: string, version: string) => {
		const supabase = createClient();

		try {
			const { data, error } = await supabase
				.from('proposals')
				.select(
					`*,
						working_version(*,
							sections(*, products(*)),
							products(*),
							phases(*, 
								tickets(*, 
									tasks(*)
								)
							)
						),
						versions:versions!public_versions_proposal_fkey(*),
						created_by(*)
					)
				`
				)
				.eq('id', id)
				.eq('working_version', version)
				.single();

			if (!data || error) {
				throw Error('Error in getting proposal', { cause: error });
			}

			return data as unknown as NestedProposal & { versions: Version[] };
		} catch (error) {
			console.error(error);
		}
	},
	['proposals'],
	{ tags: ['proposals'] }
);

export const getOrganization = unstable_cache(
	async () => {
		'use server';
		const supabase = createClient();
		const { data, error } = await supabase.from('organizations').select('*, organization_integrations(*, integration(*))').single();

		if (!data || error) {
			throw Error('Error in getting organization', { cause: error });
		}

		return data;
	},
	['organizations'],
	{ tags: ['organizations'] }
);

export const getIntegrations = unstable_cache(async () => {
	'use server';
	const supabase = createClient();

	const { data, error } = await supabase.from('integrations').select().order('name', { ascending: true });

	if (!data || error) {
		throw Error('Error in getting integrations', { cause: error });
	}

	return data;
});

export const getActivity = async () => {
	const supabase = createClient();

	const { data, error } = await supabase.from('activity_log').select().order('event_timestamp', { ascending: true });

	if (!data || error) {
		throw Error('Error in getting integrations', { cause: error });
	}

	return data;
};

export const getProposals = unstable_cache(
	async (order?: keyof Proposal, searchText?: string) => {
		const supabase = createClient();

		const proposalsQuery = searchText
			? supabase
					.from('proposals')
					.select('*')
					.order(order ?? 'updated_at', { ascending: false })
					.ilike('name', searchText)
			: supabase
					.from('proposals')
					.select('*')
					.order(order ?? 'updated_at', { ascending: false });

		type Proposals = QueryData<typeof proposalsQuery>;

		const { data: proposals, error } = await proposalsQuery;

		if (!proposals || error) {
			throw Error('Error in getting proposals', { cause: error });
		}

		return proposals as Proposals;
	},
	['proposals'],
	{ tags: ['proposals'] }
);

export const getTemplates = async (): Promise<Array<ProjectTemplate> | undefined> => {
	try {
		const projectTemplateResponse = await fetch(
			`${process.env.NEXT_PUBLIC_CW_URL!}/project/projectTemplates?fields=id,name,description&pageSize=1000&orderBy=name`,
			{
				next: {
					revalidate: 21600,
					tags: ['templates'],
				},
				headers: baseHeaders,
			}
		);

		if (!projectTemplateResponse.ok) {
			console.error(projectTemplateResponse.statusText);
			throw Error('Error fetching project templates...', { cause: projectTemplateResponse.statusText });
		}

		const templates: ProjectTemplate[] = await projectTemplateResponse.json();

		const workplansResponse = await Promise.all(
			templates.map(({ id }) =>
				fetch(`${process.env.NEXT_PUBLIC_CW_URL!}/project/projectTemplates/${id}/workplan`, {
					next: {
						revalidate: 21600,
						tags: ['templates'],
					},
					headers: baseHeaders,
				})
			)
		);

		const workplans: ProjectWorkPlan[] = await Promise.all(workplansResponse.map((r) => r.json()));

		return templates.map((template) => {
			return {
				...template,
				workplan: workplans.find((workplan) => workplan.templateId === template.id),
			};
		});
	} catch (error) {
		console.error(error);
		return;
	}
};

export const getTemplate = unstable_cache(
	async (id: number): Promise<ProjectTemplate | undefined> => {
		let config: AxiosRequestConfig = {
			...baseConfig,
			url: `/project/projectTemplates/${id}`,
		};

		try {
			const response: AxiosResponse<ProjectTemplate, Error> = await axios.request(config);
			// console.log(response.data);
			const workplan = await axios.request<ProjectWorkPlan>({ ...baseConfig, url: `/project/projectTemplates/${response.data.id}/workplan` });
			// console.log(workplan.data);

			return { ...response.data, workplan: workplan?.data ?? [] };
		} catch (error) {
			console.error(error);
			return;
		}
	},
	['templates'],
	{ tags: ['templates'] }
);

export const getOpportunityProducts = async (id: number): Promise<ProductsItem[] | undefined> => {
	let config: AxiosRequestConfig = {
		...baseConfig,
		url: `/procurement/products?conditions=opportunity/id=${id}`,
	};

	try {
		const response: AxiosResponse<ProductsItem[], Error> = await axios.request(config);

		return response.data;
	} catch (error) {
		console.error(error);
		return;
	}
};

export const getOpportunityTypes = async (): Promise<{ id: number; description: string }[] | undefined> => {
	const headers = new Headers();
	headers.set('clientId', process.env.NEXT_PUBLIC_CW_CLIENT_ID!);
	headers.set('Authorization', 'Basic ' + btoa(process.env.NEXT_PUBLIC_CW_USERNAME! + ':' + process.env.NEXT_PUBLIC_CW_PASSWORD!));

	const response = await fetch(`${process.env.NEXT_PUBLIC_CW_URL}/sales/opportunities/types?fields=id,description&orderBy=description`, {
		headers,
	});

	return await response.json();
};

export const getOpportunityStatuses = async (): Promise<{ id: number; name: string }[] | undefined> => {
	const headers = new Headers();
	headers.set('clientId', process.env.NEXT_PUBLIC_CW_CLIENT_ID!);
	headers.set('Authorization', 'Basic ' + btoa(process.env.NEXT_PUBLIC_CW_USERNAME! + ':' + process.env.NEXT_PUBLIC_CW_PASSWORD!));

	const response = await fetch(`${process.env.NEXT_PUBLIC_CW_URL}/sales/opportunities/statuses?fields=id,name&orderBy=name`, { headers });

	return await response.json();
};

export const getProjectStatuses = async () => {
	const headers = new Headers();
	headers.set('clientId', process.env.NEXT_PUBLIC_CW_CLIENT_ID!);
	headers.set('Authorization', 'Basic ' + btoa(process.env.NEXT_PUBLIC_CW_USERNAME! + ':' + process.env.NEXT_PUBLIC_CW_PASSWORD!));

	const response = await fetch(`${process.env.NEXT_PUBLIC_CW_URL}/project/statuses?fields=id,name&orderBy=name`, { headers });

	return await response.json();
};

export const getProjectBoards = async () => {
	const headers = new Headers();
	headers.set('clientId', process.env.NEXT_PUBLIC_CW_CLIENT_ID!);
	headers.set('Authorization', 'Basic ' + btoa(process.env.NEXT_PUBLIC_CW_USERNAME! + ':' + process.env.NEXT_PUBLIC_CW_PASSWORD!));

	const response = await fetch(`${process.env.NEXT_PUBLIC_CW_URL}/service/boards?conditions=projectFlag = true and inactiveFlag = false`, {
		headers,
	});

	return await response.json();
};

export const signIn = async (formData: FormData) => {
	'use server';

	const email = formData.get('email') as string;
	const password = formData.get('password') as string;
	const supabase = createClient();

	const { error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});

	if (error) {
		console.error(error);
		// redirect(`/login?message=${error}`);
		throw Error('Error signing in', { cause: error });
	}

	return redirect('/velo-it-group');
};

export const getIngramPricing = async () => {
	const headers = new Headers();
	headers.append('accept', 'application/json');
	headers.append('IM-CustomerNumber', '20-222222');
	headers.append('IM-CountryCode', 'US');
	headers.append('IM-CorrelationID', 'fbac82ba-cf0a-4bcf-fc03-0c5084');
	headers.append('IM-SenderID', 'MyCompany');
	headers.append('Content-Type', 'application/json');

	try {
		const response = await fetch(process.env.NEXT_PUBLIC_INGRAM_URL!, {
			headers,
			method: 'POST',
			mode: 'no-cors',
			body: JSON.stringify({
				products: [
					{
						ingramPartNumber: '123512',
					},
				],
			}),
		});

		const products = await response.json();

		return products;
	} catch (error) {
		return new Response(`${error}`, {
			status: 400,
		});
	}
};

export const getSynnexPricing = async () => {
	const headers = new Headers();
	headers.append('accept', 'application/json');
	headers.append('IM-CustomerNumber', '20-222222');
	headers.append('IM-CountryCode', 'US');
	headers.append('IM-CorrelationID', 'fbac82ba-cf0a-4bcf-fc03-0c5084');
	headers.append('IM-SenderID', 'MyCompany');
	headers.append('Content-Type', 'application/json');

	try {
		const response = await fetch(process.env.NEXT_PUBLIC_SYNNEX_URL!);

		const products = await response.json();

		return products;
	} catch (error) {
		return new Response(`${error}`, {
			status: 400,
		});
	}
};

export const getVersions = unstable_cache(
	async (id: string) => {
		const supabase = createClient();
		const { data, error } = await supabase.from('versions').select().eq('proposal', id).order('number', { ascending: false });

		if (error || !data) {
			throw Error("Can't fetch versions...", { cause: error });
		}

		return data;
	},
	['versions'],
	{ tags: ['versions'] }
);
