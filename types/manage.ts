export type ProjectTemplate = {
	id: number;
	name: string;
	description?: string;
	type?: ProjectType;
	workplan?: ProjectWorkPlan;
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
	budgetHours: number;
	duration?: number;
	summary: string;
	wbsCode?: string;
	billSeparatelyFlag?: boolean;
	markAsMilestoneFlag?: boolean;
	tasks?: Array<ProjectTemplateTask>;
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
	notes?: string;
	description?: string;
	priority?: number;
	summary?: string;
};

export type ProjectWorkPlan = {
	templateId: number;
	phases: Array<ProjectPhase>;
};

export type CatalogItem = {
	id: number;
	identifier: string;
	description: string;
	price: number;
	cost: number;
};

export interface ServiceTicket {
	id: number;
	summary: string;
	recordType?: string;
	board?: Board;
	status?: Status;
	workRole?: WorkRole;
	workType?: WorkType;
	company?: Company;
	site?: Site;
	siteName?: string;
	addressLine1?: string;
	addressLine2?: string;
	city?: string;
	stateIdentifier?: string;
	zip?: string;
	country?: Country;
	contact?: Contact;
	contactName?: string;
	contactPhoneNumber?: string;
	contactPhoneExtension?: string;
	contactEmailAddress?: string;
	type?: Type;
	subType?: SubType;
	item?: Item;
	team?: Team;
	owner?: Owner;
	priority?: Priority;
	serviceLocation?: ServiceLocation;
	source?: Source;
	requiredDate?: string;
	budgetHours?: number;
	opportunity?: Opportunity;
	agreement?: Agreement;
	severity?: string;
	impact?: string;
	externalXRef?: string;
	poNumber?: string;
	knowledgeBaseCategoryId?: number;
	knowledgeBaseSubCategoryId?: number;
	allowAllClientsPortalView?: boolean;
	customerUpdatedFlag?: boolean;
	automaticEmailContactFlag?: boolean;
	automaticEmailResourceFlag?: boolean;
	automaticEmailCcFlag?: boolean;
	automaticEmailCc?: string;
	initialDescription?: string;
	initialInternalAnalysis?: string;
	initialResolution?: string;
	initialDescriptionFrom?: string;
	contactEmailLookup?: string;
	processNotifications?: boolean;
	skipCallback?: boolean;
	closedDate?: string;
	closedBy?: string;
	closedFlag?: boolean;
	actualHours?: number;
	approved?: boolean;
	estimatedExpenseCost?: number;
	estimatedExpenseRevenue?: number;
	estimatedProductCost?: number;
	estimatedProductRevenue?: number;
	estimatedTimeCost?: number;
	estimatedTimeRevenue?: number;
	billingMethod?: string;
	billingAmount?: number;
	hourlyRate?: number;
	subBillingMethod?: string;
	subBillingAmount?: number;
	subDateAccepted?: string;
	dateResolved?: string;
	dateResplan?: string;
	dateResponded?: string;
	resolveMinutes?: number;
	resPlanMinutes?: number;
	respondMinutes?: number;
	isInSla?: boolean;
	knowledgeBaseLinkId?: number;
	resources?: string;
	parentTicketId?: number;
	hasChildTicket?: boolean;
	hasMergedChildTicketFlag?: boolean;
	knowledgeBaseLinkType?: string;
	billTime?: string;
	billExpenses?: string;
	billProducts?: string;
	predecessorType?: string;
	predecessorId?: number;
	predecessorClosedFlag?: boolean;
	lagDays?: number;
	lagNonworkingDaysFlag?: boolean;
	estimatedStartDate?: string;
	duration?: number;
	location?: Location;
	department?: Department;
	mobileGuid?: string;
	sla?: Sla;
	slaStatus?: string;
	requestForChangeFlag?: boolean;
	currency?: Currency;
	mergedParentTicket?: MergedParentTicket;
	integratorTags?: string[];
	escalationStartDateUTC?: string;
	escalationLevel?: number;
	minutesBeforeWaiting?: number;
	respondedSkippedMinutes?: number;
	resplanSkippedMinutes?: number;
	respondedHours?: number;
	respondedBy?: string;
	resplanHours?: number;
	resplanBy?: string;
	resolutionHours?: number;
	resolvedBy?: string;
	minutesWaiting?: number;
}

export interface Board {
	id: number;
	name: string;
}

export interface Status {
	id: number;
	name: string;
	sort: number;
}

export interface WorkRole {
	id: number;
	name: string;
}

export interface WorkType {
	id: number;
	name: string;
}

export interface Company {
	id: number;
	identifier: string;
	name: string;
}

export interface Site {
	id: number;
	name: string;
}

export interface Country {
	id: number;
	identifier: string;
	name: string;
}

export interface Contact {
	id: number;
	name: string;
}

export interface Type {
	id: number;
	name: string;
}

export interface SubType {
	id: number;
	name: string;
}

export interface Item {
	id: number;
	name: string;
}

export interface Team {
	id: number;
	name: string;
}

export interface Owner {
	id: number;
	identifier: string;
	name: string;
}

export interface Priority {
	id: number;
	name: string;
	sort: number;
	level: string;
}

export interface ServiceLocation {
	id: number;
	name: string;
}

export interface Source {
	id: number;
	name: string;
}

export interface Opportunity {
	id: number;
	name: string;
}

export interface Agreement {
	id: number;
	name: string;
	type: string;
}

export interface Location {
	id: number;
	name: string;
}

export interface Department {
	id: number;
	identifier: string;
	name: string;
}

export interface Sla {
	id: number;
	name: string;
}

export interface Currency {
	id: number;
	symbol: string;
	currencyCode: string;
	decimalSeparator: string;
	numberOfDecimals: number;
	thousandsSeparator: string;
	negativeParenthesesFlag: boolean;
	displaySymbolFlag: boolean;
	currencyIdentifier: string;
	displayIdFlag: boolean;
	rightAlign: boolean;
	name: string;
}

export interface MergedParentTicket {
	id: number;
	summary: string;
}
