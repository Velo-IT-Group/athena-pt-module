import { ProjectTemplate, ProjectTemplateTicket, ProjectType, ProjectWorkPlan } from './types';

export const projectTypes: Array<ProjectType> = [
	{
		id: 1,
		name: 'Professional Services',
	},
];

export const projectTemplates: Array<ProjectTemplate> = [
	{
		id: 1,
		name: '"CN" + Infrastructure Refresh + Haas',
		description: 'Redesigning the company website for a modern and user-friendly experience',
		type: projectTypes[0],
	},
	{
		id: 2,
		name: 'Base Project Template',
		type: projectTypes[0],
	},
	{
		id: 3,
		name: 'Call Manager Implementation',
		description: 'Building a platform for data analysis and reporting',
		type: projectTypes[0],
	},
];

export const projectWorkPlans: Array<ProjectWorkPlan> = [
	{
		iD: 1,
		description: 'Voice Circuit Management',
		isPhase: true,
	},
	{
		iD: 2,
		description: 'Onsite Installation',
		isPhase: true,
		budgetAmount: 6.0,
	},
	{
		iD: 3,
		description: 'Setup & Prep Equipment',
		isPhase: true,
		budgetAmount: 36.0,
	},
];

export const projectTemplateTickets: Array<ProjectTemplateTicket> = [
	{
		id: 1,
		description: 'Voice Circuit Management',
		projectTemplateId: projectTemplates[0].id,
	},
	{
		id: 2,
		description: 'Onsite Installation',
		budgetHours: 6.0,
		projectTemplateId: projectTemplates[0].id,
	},
	{
		id: 3,
		description: 'Setup & Prep Equipment',
		budgetHours: 6.0,
		projectTemplateId: projectTemplates[0].id,
	},
];
