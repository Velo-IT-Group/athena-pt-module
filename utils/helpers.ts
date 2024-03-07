import { CatalogItem, ProjectPhase, ProjectWorkPlan } from '@/types/manage';
import { v4 as uuid } from 'uuid';

export const createNestedPhaseFromTemplate = (workplan: ProjectWorkPlan, proposalId: string, destinationIndex: number): NestedPhase[] => {
	return (
		workplan?.phases.map((phase: ProjectPhase, index) => {
			const { description, wbsCode } = phase;
			const phaseId = uuid();
			return {
				id: phaseId,
				description: description,
				hours: 0,
				order: destinationIndex + index + 1,
				proposal: proposalId,
				visible: true,
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

export const productFromCatalogItem = (item: CatalogItem, proposal: string, parent?: string) => {
	const { id, cost, phaseProductFlag, recurringFlag, taxableFlag, manufacturerPartNumber, description, notes, price, vendor, vendorSku } = item;
	return {
		catalog_item_id: id,
		cost,
		extended_price: price,
		is_phase_item: phaseProductFlag,
		is_recurring: recurringFlag,
		is_taxable: taxableFlag,
		manufacturing_part_number: manufacturerPartNumber,
		name: description,
		notes,
		price,
		proposal,
		quantity: 1,
		suggested_price: price,
		vendor_name: vendor?.name,
		vendor_part_number: vendorSku,
	};
};
