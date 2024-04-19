'use server';
import { baseHeaders } from '@/lib/utils';
import {
	CatalogComponent,
	CatalogItem,
	Company,
	Opportunity,
	ProjectTemplate,
	ProjectWorkPlan,
	ServiceTicket,
	SystemMember,
	TicketNote,
} from '@/types/manage';

const catalogItemFields: Array<keyof CatalogItem> = [
	'id',
	'identifier',
	'description',
	'type',
	'productClass',
	'unitOfMeasure',
	'price',
	'cost',
	'taxableFlag',
	'vendor',
	'recurringFlag',
	'recurringBillCycle',
	'recurringCost',
	'recurringCycleType',
	'category',
	'manufacturerPartNumber',
	'calculatedPrice',
	'calculatedCost',
];

const catalogComponentFields: Array<keyof CatalogComponent> = [
	'catalogItem',
	'cost',
	'id',
	'parentCatalogItem',
	'price',
	'quantity',
	'sequenceNumber',
];

export const getTemplates = async () => {
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
						tags: ['workplans'],
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

export const getTemplate = async (id: number) => {
	const templateResponse = await fetch(`${process.env.NEXT_PUBLIC_CW_URL!}/project/projectTemplates/${id}`, {
		next: {
			revalidate: 21600,
			tags: ['templates'],
		},
		headers: baseHeaders,
	});

	if (!templateResponse.ok) {
		throw Error('Error fetching template...', { cause: templateResponse.statusText });
	}

	const template: ProjectTemplate = await templateResponse.json();

	const workplanResponse = await fetch(`${process.env.NEXT_PUBLIC_CW_URL!}/project/projectTemplates/${template.id}/workplan`, {
		next: {
			revalidate: 21600,
			tags: ['workplans'],
		},
		headers: baseHeaders,
	});

	if (!workplanResponse.ok) {
		throw Error('Error fetching template...', { cause: workplanResponse.statusText });
	}

	const workplan: ProjectWorkPlan = await workplanResponse.json();

	return { ...template, workplan: workplan ?? [] };
};

export const getOpportunityProducts = async (id: number) => {
	const response = await fetch(`${process.env.NEXT_PUBLIC_CW_URL!}/project/projectTemplates/${id}`, {
		headers: baseHeaders,
	});

	if (!response.ok) {
		throw Error('Error fetching opportunity...', { cause: response.statusText });
	}

	return (await response.json()) as Opportunity;
};

export const getOpportunityTypes = async (): Promise<{ id: number; description: string }[]> => {
	const response = await fetch(`${process.env.NEXT_PUBLIC_CW_URL}/sales/opportunities/types?fields=id,description&orderBy=description`, {
		headers: baseHeaders,
	});

	if (!response.ok) {
		throw Error('Error fetching opportunity types...', { cause: response.statusText });
	}

	return await response.json();
};

export const getOpportunityStatuses = async (): Promise<{ id: number; name: string }[]> => {
	const response = await fetch(`${process.env.NEXT_PUBLIC_CW_URL}/sales/opportunities/statuses?fields=id,name&orderBy=name`, {
		headers: baseHeaders,
	});

	if (!response.ok) {
		throw Error('Error fetching opportunity statuses...', { cause: response.statusText });
	}

	return await response.json();
};

export const getProjectStatuses = async () => {
	const response = await fetch(`${process.env.NEXT_PUBLIC_CW_URL}/project/statuses?fields=id,name&orderBy=name`, { headers: baseHeaders });

	if (!response.ok) {
		throw Error('Error fetching project statuses...', { cause: response.statusText });
	}

	return await response.json();
};

export const getProjectBoards = async () => {
	const response = await fetch(`${process.env.NEXT_PUBLIC_CW_URL}/service/boards?conditions=projectFlag = true and inactiveFlag = false`, {
		headers: baseHeaders,
	});

	if (!response.ok) {
		throw Error('Error fetching project boards...', { cause: response.statusText });
	}

	return await response.json();
};

export const getTicketNotes = async (id: number) => {
	const response = await fetch(`${process.env.NEXT_PUBLIC_CW_URL}/service/tickets/${id}/allNotes?pageSize=250&orderBy=_info/sortByDate desc`, {
		headers: baseHeaders,
		cache: 'no-store',
	});

	if (!response.ok) {
		throw Error('Error fetching ticket notes...', { cause: response.statusText });
	}

	return (await response.json()) as TicketNote;
};

export const getCatalogItemComponents = async (id: number) => {
	const response = await fetch(`${process.env.NEXT_PUBLIC_CW_URL}/procurement/catalog/${id}/components?fields=${catalogComponentFields.toString()}`, {
		headers: baseHeaders,
	});

	if (!response.ok) {
		throw Error('Error getting catalog item components...', { cause: response.statusText });
	}

	const components: CatalogComponent[] = await response.json();

	if (!components.length) return;

	const componentString = components.map((c) => c.catalogItem.id).toString();

	const catalogItemsResponse = await fetch(`${process.env.NEXT_PUBLIC_CW_URL}/procurement/catalog?conditions=id in (${componentString})`, {
		headers: baseHeaders,
	});

	if (!catalogItemsResponse.ok) {
		throw Error('Error getting catalog items...', { cause: catalogItemsResponse.statusText });
	}

	const catalogItems: CatalogItem[] = await catalogItemsResponse.json();

	return components.map((c) => {
		const item = catalogItems.find((i) => i?.id === c?.catalogItem.id);

		return {
			...item,
			...c,
		};
	});
};

export const getCategories = async () => {
	const response = await fetch(`${process.env.NEXT_PUBLIC_CW_URL}/procurement/categories?pageSize=1000`, {
		headers: baseHeaders,
	});

	if (!response.ok) {
		throw Error('Error fetching categories...', { cause: response.statusText });
	}

	return await response.json();
};

export const getBillingCycles = async () => {
	const response = await fetch(`${process.env.NEXT_PUBLIC_CW_URL}/finance/billingCycles?pageSize=1000`, {
		headers: baseHeaders,
	});

	if (!response.ok) {
		throw Error('Error fetching billing cycles...', { cause: response.statusText });
	}

	return await response.json();
};

export const getSubCategories = async () => {
	const response = await fetch(`${process.env.NEXT_PUBLIC_CW_URL}/procurement/subcategories?pageSize=1000`, {
		headers: baseHeaders,
	});

	if (!response.ok) {
		throw Error('Error fetching subcategories...', { cause: response.statusText });
	}

	return await response.json();
};

export const getWorkplan = async (id: number) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CW_URL}/project/projectTemplates/${id}/workplan?fields=phases/tickets/id,phases/tickets/summary`,
		{
			headers: baseHeaders,
		}
	);

	if (!response.ok) {
		throw Error('Error fetching workplan...', { cause: response.statusText });
	}

	return (await response.json()) as ProjectWorkPlan;
};

export const getTicket = async (id: number, fields?: Array<keyof ServiceTicket>) => {
	const response = await fetch(`${process.env.NEXT_PUBLIC_CW_URL}/service/tickets/${id}?fields=${fields?.toString()}`, { headers: baseHeaders });

	if (!response.ok) {
		throw Error('Error fetching ticket...', { cause: response.statusText });
	}

	return (await response.json()) as ServiceTicket;
};

export const getCompany = async (id: number) => {
	const response = await fetch(`${process.env.NEXT_PUBLIC_CW_URL}/service/tickets/${id}`, { headers: baseHeaders });

	if (!response.ok) throw Error('Error fetching company...', { cause: response.statusText });

	return (await response.json()) as Company;
};

export const getTickets = async () => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CW_URL}/service/tickets?conditions=closedFlag = false and board/id = 38 and type/id = 200&pageSize=1000&orderBy=id`,
		{ headers: baseHeaders }
	);

	if (!response.ok) {
		throw Error('Error fetching tickets...', { cause: response.statusText });
	}

	return (await response.json()) as ServiceTicket[];
};

export const getCatalogItems = async (searchText?: string, identifier?: string, page?: number) => {
	const catalogItemsResponse = await fetch(
		`${process.env.NEXT_PUBLIC_CW_URL}/procurement/catalog?conditions=inactiveFlag=false ${
			searchText ? `and description contains '${searchText}'` : ''
		} ${identifier ? `and identifier contains '${identifier}'` : ''}&pageSize=10&orderBy=description&page=${page ?? 1}`,
		{ headers: baseHeaders }
	);

	if (!catalogItemsResponse.ok) throw Error('Error fetching catalog items...', { cause: catalogItemsResponse.statusText });

	const catalogItems: CatalogItem[] = await catalogItemsResponse.json();

	const catalogItemsCountResponse = await fetch(
		`${process.env.NEXT_PUBLIC_CW_URL}/procurement/catalog/count?conditions=inactiveFlag = false ${
			searchText ? `and description contains '${searchText}'` : ''
		} ${identifier ? `and identifier contains '${identifier}'` : ''}&pageSize=10&orderBy=description&page=${
			page ?? 1
		}&fields=${catalogItemFields.toString()}`,
		{ headers: baseHeaders }
	);

	if (!catalogItemsCountResponse.ok) throw Error('Error fetching catalog items count...', { cause: catalogItemsCountResponse.statusText });

	const { count }: { count: number } = await catalogItemsCountResponse.json();

	const bundles = catalogItems.filter((item) => item.productClass === 'Bundle');
	const bItems = (await Promise.all(bundles.map((b) => getCatalogItemComponents(b.id)))).flat().filter((i) => i !== undefined);

	const mappedData = catalogItems.map((item) => {
		return {
			...item,
			bundledItems: bItems?.filter((bItem) => bItem && bItem.parentCatalogItem.id === item.id),
		};
	});

	return { catalogItems: mappedData as CatalogItem[], count };
};

export const getSystemMembers = async (email: string): Promise<SystemMember> => {
	const response = await fetch(`${process.env.NEXT_PUBLIC_CW_URL}/system/members?conditions=primaryEmail like '${email}'`, {
		headers: baseHeaders,
	});

	const data = await response.json();

	return data;
};
