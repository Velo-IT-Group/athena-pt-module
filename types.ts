export type ProjectTemplate = {
	id: number;
	name: string;
	description?: string;
	type: ProjectType;
};

export type ProjectType = {
	id: number;
	name: string;
	defaultFlag?: boolean;
	inactiveFlag?: boolean;
};

export type ProjectPhase = {
	id: number;
	templateId: number;
	description: string;
	markAsMilestoneFlag: boolean;
	billPhaseSeparately: boolean;
	wbsCode: string;
	tickets: Array<ProjectTemplateTicket>;
};

export type ProjectTemplateTicket = {
	id: number;
	projectTemplateId?: number;
	projectTemplatePhaseId?: number;
	lineNumber?: number;
	description?: string;
	notes?: string;
	internalAnalysis?: string;
	resolution?: string;
	budgetHours?: number;
	duration?: number;
	summary: string;
	wbsCode?: string;
	billSeparatelyFlag?: boolean;
	markAsMilestoneFlag?: boolean;
	recordType?: string;
	pmTmpProjectRecID?: number;
	priority?: {
		id: number;
		name: string;
		sort: number;
		level: string;
		_info: {
			additionalProp1: string;
			additionalProp2: string;
			additionalProp3: string;
		};
	};
	source?: {
		id: number;
		name: string;
		_info: {
			additionalProp1: string;
			additionalProp2: string;
			additionalProp3: string;
		};
	};
	workRole?: {
		id: number;
		name: string;
		_info: {
			additionalProp1: string;
			additionalProp2: string;
			additionalProp3: string;
		};
	};
	workType?: {
		id: number;
		name: string;
		_info: {
			additionalProp1: string;
			additionalProp2: string;
			additionalProp3: string;
		};
	};
};

export type ProjectTemplateTask = {
	id: number;
	ticketId?: number;
	sequence?: number;
	description?: string;
	summary?: string;
};

export type ProjectWorkPlan = {
	treeID?: string;
	iD?: number;
	recID?: number;
	displayID?: string;
	sR_Service_RecID?: number;
	description?: string;
	projectName?: string;
	budgetAmount?: number;
	isProject?: boolean;
	isPhase?: boolean;
	isTicket?: boolean;
	isNewItem?: boolean;
	wbsCode?: string;
	parentPhaseRecID?: number;
	phases: Array<ProjectPhase>;
};
