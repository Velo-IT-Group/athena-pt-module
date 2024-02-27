import { ProjectPhase, ProjectWorkPlan } from '@/types/manage';
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
							};
						}),
					};
				}) as NestedTicket[],
			};
		}) ?? []
	);
};
