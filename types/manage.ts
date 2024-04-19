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

export type TicketNote = {
	id: number;
	ticketId: number;
	text: string;
	detailDescriptionFlag: boolean;
	internalAnalysisFlag: boolean;
	resolutionFlag: boolean;
	issueFlag: boolean;
	member: {
		id: number;
		identifier: string;
		name: string;
	};
	dateCreated: string;
	createdBy: string;
	internalFlag: boolean;
	externalFlag: boolean;
	sentimentScore: number;
};

export type ProjectPhase = {
	id: number;
	templateId: number;
	projectId?: number;
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

export type ProductClass = 'Agreement' | 'Bundle' | 'Inventory' | 'NonInventory' | 'Service';

export type CatalogItem = {
	id: number;
	identifier?: string;
	description?: string;
	inactiveFlag?: boolean;
	subcategory?: Subcategory;
	type?: Type;
	productClass: ProductClass;
	bundledItems?: CatalogItem[] | undefined;
	serializedFlag?: boolean;
	serializedCostFlag?: boolean;
	phaseProductFlag?: boolean;
	unitOfMeasure?: UnitOfMeasure;
	price?: number;
	cost?: number;
	priceAttribute?: string;
	taxableFlag?: boolean;
	dropShipFlag?: boolean;
	specialOrderFlag?: boolean;
	customerDescription?: string;
	manufacturer?: Manufacturer;
	manufacturerPartNumber?: string;
	vendor?: Vendor;
	vendorSku?: string;
	notes?: string;
	integrationXRef?: string;
	sla?: Sla;
	entityType?: EntityType;
	recurringFlag?: boolean;
	recurringRevenue?: number;
	recurringCost?: number;
	recurringOneTimeFlag?: boolean;
	recurringBillCycle?: RecurringBillCycle;
	recurringCycleType?: string;
	calculatedPriceFlag?: boolean;
	calculatedCostFlag?: boolean;
	category?: Category;
	calculatedPrice?: number;
	calculatedCost?: number;
	billableOption?: string;
};

export type CatalogComponent = {
	id: number;
	sequenceNumber: number;
	quantity: number;
	catalogItem: CatalogItem;
	hidePriceFlag: boolean;
	hideItemIdentifierFlag: boolean;
	hideDescriptionFlag: boolean;
	hideQuantityFlag: boolean;
	hideExtendedPriceFlag: boolean;
	parentCatalogItem: { id: number };
	price: number;
	cost: number;
};

export interface SystemMember {
	id: number;
	identifier: string;
	firstName: string;
	lastName: string;
}

interface QuoteItem {
	id: string;
	id_quote: string;
	approval_content_hash: string;
	approval_margin_minimum: number;
	approval_on_change: boolean;
	approval_price_minimum: number;
	base_price: number;
	config_id: string;
	config_position: number;
	cost: number;
	cost_modifier: string;
	cw_agreement: string;
	cw_class: string;
	deferment_periods: number;
	disable_remaps: boolean;
	discount: number;
	discount_amount: number;
	discount_amount_converted: number;
	enforce_item_mod_tags: boolean;
	etilize_product_id: number;
	etilize_serialized_attributes: string;
	extended_cost: number;
	extended_price: number;
	extended_price_converted: number;
	extended_suggested_price: number;
	external_quote_number: string;
	external_reference: string;
	factor_item_mfp: string;
	factor_qty_fixed: number;
	factor_qty_multiplier: number;
	federal_gov_price: number;
	gross_margin: number;
	grouping_code: string;
	gsa_price: number;
	gst: number;
	gst_converted: number;
	gst_rate: number;
	id_quote_tabs: string;
	id_recurring_revenue: string;
	is_bundle_component: boolean;
	is_bundle_header: boolean;
	is_deferrable: boolean;
	is_hidden_item: boolean;
	is_metadata_item: boolean;
	is_mod_tag_modified: boolean;
	is_optional: boolean;
	is_override_qty: boolean;
	is_phase_item: boolean;
	is_printed: boolean;
	is_promotion: boolean;
	is_protected_item: boolean;
	is_protected_price: boolean;
	is_rampable: boolean;
	is_rebate: boolean;
	is_recurring_taxable: boolean;
	is_selected: boolean;
	is_show_price: boolean;
	is_sold: boolean;
	is_taxable: boolean;
	is_totals_included: boolean;
	item_cube: number;
	item_height: number;
	item_length: number;
	item_notes_html: string;
	item_number: string;
	item_width: number;
	invoice_grouping_id: number;
	keywords: string;
	line_type: string;
	local_price_formula: string;
	long_description: string;
	manufacturer_part_number: string;
	marketing_information: string;
	markup: number;
	modify_date: string;
	net_cost: number;
	on_hand: number;
	on_hand_warehouse1: number;
	on_hand_warehouse2: number;
	on_order: number;
	option_group: string;
	option_locked: boolean;
	override_package_details: boolean;
	override_price: number;
	override_price_modifier: string;
	owner: string;
	package_price: number;
	package_qty: number;
	parent_quote_item: string;
	pdf_attachment: string;
	period: string;
	po_number: string;
	pos_description: string;
	po_status: string;
	price_converted: number;
	price_modifier: string;
	product_category: string;
	product_class: string;
	product_sub_category: string;
	product_type: string;
	promotion_comment: string;
	pst: number;
	pst_converted: number;
	pst_rate: number;
	quantity: number;
	quosal_description: string;
	quosal_purchasing_notes: string;
	quote: string;
	quote_tab: string;
	quote_item_price: number;
	quote_name: string;
	quote_readable_id: string;
	ramp_periods: number;
	rebate_comment: string;
	recurring_amount: number;
	recurring_base_price: number;
	recurring_calculated_price_modifier: string;
	recurring_cost: number;
	recurring_cost_modifier: string;
	recurring_extended_cost: number;
	recurring_extended_suggested_price: number;
	recurring_gst: number;
	recurring_price: number;
	recurring_price_modifier: string;
	recurring_pst: number;
	recurring_suggested_price: number;
	recurring_tax: number;
	recurring_total: number;
	replacement_sku: string;
	short_description: string;
	sort_order: number;
	source: string;
	source_manufacturer_id: string;
	source_manufacturer_name: string;
	source_selection_details: string;
	source_vendor_id: string;
	source_vendor_name: string;
	starting_cost: number;
	state_gov_price: number;
	suggested_price: number;
	svc_spread: number;
	tax: number;
	tax_code: string;
	tax_converted: number;
	tax_rate: number;
	total_weight: number;
	uom: string;
	uom_factor: number;
	uom_weight: number;
	uop: string;
	uop_factor: number;
	upc_number: string;
	user_id: string;
	vendor_part_number: string;
	warehouse: string;
	warehouse_code: string;
}

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
	opportunity?: ReferenceType;
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

export interface Opportunity {
	id: number;
	name: string;
	expectedCloseDate: string;
	type: ReferenceType;
	stage: ReferenceType;
	status: ReferenceType;
	priority: ReferenceType;
	probability: ReferenceType;
	rating: ReferenceType;
	primarySalesRep: ReferenceType;
	locationId: number;
	businessUnitId: number;
	company: ReferenceType;
	contact: ReferenceType;
	site: ReferenceType;
	dateBecameLead: string;
	totalSalesTax: number;
	shipToCompany: ReferenceType;
	shipToSite: ReferenceType;
	billToCompany: ReferenceType;
	billToContact: ReferenceType;
	billToSite: ReferenceType;
	billingTerms: ReferenceType;
	currency: Currency;
	companyLocationId: number;
}

export interface ProductsItem {
	id: number;
	catalogItem: CatalogItem;
	description?: string;
	sequenceNumber?: number;
	quantity?: number;
	unitOfMeasure?: ReferenceType;
	price: number;
	cost: number;
	extPrice: number;
	extCost: number;
	discount?: number;
	margin?: number;
	agreementAmount?: number;
	priceMethod?: string;
	billableOption?: string;
	agreement?: ReferenceType;
	locationId?: number;
	location?: ReferenceType;
	businessUnitId?: number;
	businessUnit?: ReferenceType;
	vendor?: ReferenceType;
	vendorSku?: string;
	taxableFlag?: boolean;
	dropshipFlag?: boolean;
	specialOrderFlag?: boolean;
	phaseProductFlag?: boolean;
	cancelledFlag?: boolean;
	quantityCancelled?: number;
	cancelledReason?: string;
	customerDescription?: string;
	internalNotes?: string;
	productSuppliedFlag?: boolean;
	subContractorShipToId?: number;
	subContractorAmountLimit?: number;
	recurring?: Recurring;
	sla?: ReferenceType;
	entityType?: ReferenceType;
	ticket?: ReferenceType;
	project?: ReferenceType;
	phase?: ReferenceType;
	salesOrder?: ReferenceType;
	opportunity?: ReferenceType;
	invoice?: Invoice;
	warehouseId?: number;
	warehouseIdObject?: ReferenceType;
	warehouseBinId?: number;
	warehouseBinIdObject?: ReferenceType;
	calculatedPriceFlag?: boolean;
	calculatedCostFlag?: boolean;
	forecastDetailId?: number;
	cancelledBy?: number;
	cancelledDate?: string;
	warehouse?: string;
	warehouseBin?: string;
	purchaseDate?: string;
	taxCode?: ReferenceType;
	integrationXRef?: string;
	listPrice?: number;
	serialNumberIds?: Array<number>;
	serialNumbers?: Array<string>;
	company?: ReferenceType;
	forecastStatus?: ReferenceType;
	productClass?: string;
	needToPurchaseFlag?: boolean;
	needToOrderQuantity?: number;
	minimumStockFlag?: boolean;
	shipSet?: string;
	calculatedPrice?: number;
	calculatedCost?: number;
	poApprovedFlag?: boolean;
	uom?: string;
	addComponentsFlag?: boolean;
	ignorePricingSchedulesFlag?: boolean;
	asioSubscriptionsID?: string;
	bypassForecastUpdate?: boolean;
}

export interface Project {
	id: number;
	actualEnd?: string;
	actualHours?: number;
	actualStart?: string;
	agreement?: ReferenceType;
	billExpenses?: string;
	billingAmount?: number;
	billingAttention?: string;
	billingMethod?: string;
	billingRateType?: string;
	billingTerms?: ReferenceType;
	billProducts?: string;
	billProjectAfterClosedFlag?: boolean;
	billTime?: string;
	billToCompany?: ReferenceType;
	billToContact?: ReferenceType;
	billToSite?: ReferenceType;
	billUnapprovedTimeAndExpense?: boolean;
	board?: ReferenceType;
	budgetAnalysis?: string;
	budgetFlag?: boolean;
	budgetHours?: number;
	company?: ReferenceType;
	contact?: ReferenceType;
	customerPO?: string;
	description?: string;
	currency?: Currency;
	downpayment?: number;
	estimatedEnd?: string;
	percentComplete?: number;
	estimatedExpenseRevenue?: number;
	estimatedHours?: number;
	estimatedProductRevenue?: number;
	estimatedStart?: string;
	estimatedTimeRevenue?: number;
	expenseApprover?: ReferenceType;
	includeDependenciesFlag?: boolean;
	includeEstimatesFlag?: boolean;
	location?: ReferenceType;
	department?: ReferenceType;
	manager?: ReferenceType;
	name?: string;
	opportunity?: ReferenceType;
	projectTemplateId?: number;
	restrictDownPaymentFlag?: boolean;
	scheduledEnd?: string;
	scheduledHours?: number;
	scheduledStart?: string;
	shipToCompany?: ReferenceType;
	shipToContact?: ReferenceType;
	shipToSite?: ReferenceType;
	site?: ReferenceType;
	status?: ReferenceType;
	closedFlag?: boolean;
	timeApprover?: ReferenceType;
	type?: ReferenceType;
	doNotDisplayInPortalFlag?: boolean;
	billingStartDate?: string;
	poAmount?: number;
	estimatedTimeCost?: number;
	estimatedExpenseCost?: number;
	estimatedProductCost?: number;
	taxCode?: ReferenceType;
	companyLocation?: ReferenceType;
}

export interface Invoice {
	id: number;
	identifier: string;
	billingType: string;
	applyToType: string;
	invoiceDate: string;
	chargeFirmFlag: boolean;
}

export interface Recurring {
	recurringRevenue: number;
	recurringCost: number;
	startDate: string;
	endDate: string;
	billCycleId: number;
	billCycle: ReferenceType;
	cycles: number;
	cycleType: string;
}

export interface ReferenceType {
	id: number;
	identifier?: string;
	name: string;
}

export interface Subcategory {
	id: number;
	name: string;
}

export interface Type {
	id: number;
	name: string;
}

export interface UnitOfMeasure {
	id: number;
	name: string;
}

export interface Manufacturer {
	id: number;
	name: string;
}

export interface Vendor {
	id: number;
	identifier: string;
	name: string;
}

export interface Sla {
	id: number;
	name: string;
}

export interface EntityType {
	id: number;
	name: string;
}
export interface RecurringBillCycle {
	id: number;
	name: string;
}

export interface Category {
	id: number;
	name: string;
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
