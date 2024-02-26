export type ProductState = {
	newProduct?: Product;
	updatedProduct?: Product;
	deletedProduct?: string;
	pending: boolean;
};

export type PhaseState = {
	newPhases?: NestedPhase[];
	newPhase?: NestedPhase;
	updatedPhase?: NestedPhase;
	deletedPhase?: string;
	pending: boolean;
};

export type TicketState = {
	newTicket?: NestedTicket;
	updatedTicket?: NestedTicket;
	deletedTicket?: string;
	pending: boolean;
};

export type TaskState = {
	newTask?: Task;
	updatedTask?: Task;
	deletedTask?: string;
	pending: boolean;
};
