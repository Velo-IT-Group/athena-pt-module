import { CatalogItem, ProjectPhase, ProjectWorkPlan } from '@/types/manage';
import { v4 as uuid } from 'uuid';

export const createNestedPhaseFromTemplate = (workplan: ProjectWorkPlan, version: string, destinationIndex: number): NestedPhase[] => {
	return (
		workplan?.phases.map((phase: ProjectPhase, index) => {
			const { description, wbsCode } = phase;
			const phaseId = uuid();
			return {
				id: phaseId,
				description: description,
				hours: 0,
				order: destinationIndex + index + 1,
				visible: true,
				version,
				reference_id: null,
				tickets: phase.tickets.map((ticket) => {
					const { budgetHours, wbsCode, summary } = ticket;
					const ticketId = uuid();
					return {
						budget_hours: budgetHours,
						created_at: Date(),
						id: ticketId,
						order: parseInt(wbsCode ?? '0'),
						phase: phaseId,
						summary,
						visible: true,
						reference_id: null,
						tasks: ticket.tasks?.map((task) => {
							const { notes, summary, priority } = task;
							const taskId = uuid();
							return {
								created_at: Date(),
								id: taskId,
								notes,
								priority,
								summary,
								ticket: ticketId,
								visible: false,
							};
						}),
					};
				}) as NestedTicket[],
			};
		}) ?? []
	);
};

type CamelCaseObject = {
	[key: string]: any;
};

type SnakeCaseObject<T> = {
	[K in keyof T as Uncapitalize<string & K>]: T[K] extends object ? SnakeCaseObject<T[K]> : T[K];
};

export function flattenObject<T extends CamelCaseObject>(obj: T): SnakeCaseObject<T> {
	type FlattenResult<T> = T extends { name: infer U } ? U : SnakeCaseObject<T>;

	const flatObject: Partial<FlattenResult<T>> = {};

	for (const [key, value] of Object.entries(obj)) {
		if (typeof value === 'object' && value && value.id) {
			// @ts-ignore
			flatObject[key as keyof T] = value.id as FlattenResult<T>;
		} else if (typeof value === 'object' && value && value.name) {
			// @ts-ignore
			flatObject[key as keyof T] = value.name as FlattenResult<T>;
		} else {
			// @ts-ignore
			flatObject[key as keyof T] = value;
		}
	}

	return flatObject as unknown as SnakeCaseObject<T>;
}

export function convertToSnakeCase<T extends CamelCaseObject>(input: T, flatten: true): SnakeCaseObject<T>;
export function convertToSnakeCase(input: string): string;
export function convertToSnakeCase(input: any, flatten: boolean = true): any {
	if (typeof input === 'string') {
		return input.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
	}

	const snakeObject: Partial<SnakeCaseObject<typeof input>> = {};

	for (const [key, value] of Object.entries(input)) {
		const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase() as keyof SnakeCaseObject<typeof input>;
		snakeObject[snakeKey] = value;
	}

	if (flatten) {
		return flattenObject(snakeObject);
	}

	return snakeObject as SnakeCaseObject<typeof input>;
}

export const convertToCamelCase = (item: string | object, flatten: boolean = true) => {
	if (typeof item === 'string') {
		return item.toLowerCase().replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace('-', '').replace('_', ''));
	}

	const snakeObject: Record<string, any> = {};

	for (const [key, value] of Object.entries(item)) {
		const snakeKey = key.toLowerCase().replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace('-', '').replace('_', ''));
		snakeObject[snakeKey] = value;
	}

	// if (flatten) {
	// 	const flattenedObject = flattenObject(snakeObject);
	// 	return flattenedObject;
	// }

	console.log(snakeObject);

	return snakeObject;
};

type ReturnType = {
	laborTotal: number;
	productTotal: number;
	recurringTotal: number;
	totalPrice: number;
	laborHours: number;
	ticketHours?: number;
};

export const calculateTotals = (products: Product[], phases: NestedPhase[], labor_rate: number): ReturnType => {
	const ticketHours = phases && phases.length ? phases.map((p) => p.tickets?.map((t) => t.budget_hours).flat()).flat() : [];

	const ticketSum = ticketHours?.reduce((accumulator, currentValue) => {
		return (accumulator ?? 0) + (currentValue ?? 0);
	}, 0);

	const laborHours = ticketSum ?? 0;

	const laborTotal = laborHours * labor_rate;

	const productTotal = products.reduce((accumulator, currentValue) => {
		const price: number | null = currentValue.product_class === 'Bundle' ? currentValue.calculated_price : currentValue.price;

		return accumulator + (price ?? 0) * (currentValue?.quantity ?? 0);
	}, 0);

	const recurringTotal = products
		?.filter((product) => product.recurring_flag)
		.reduce((accumulator, currentValue) => accumulator + (currentValue?.price ?? 0) * (currentValue?.quantity ?? 0), 0);

	const totalPrice = laborTotal + productTotal;

	return {
		laborTotal,
		productTotal,
		recurringTotal,
		totalPrice,
		ticketHours: ticketSum,
		laborHours,
	};
};
