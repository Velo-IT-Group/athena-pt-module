import { DropResult } from 'react-beautiful-dnd';

export const reorder = (list: NestedPhase[] | NestedTicket[] | Task[], startIndex: number, endIndex: number) => {
	const result = [...list];
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);
	result.forEach((item, index) => (item.order = index + 1));

	const changedPhases: NestedPhase[] = [];
	console.log(changedPhases);

	for (var i = endIndex; i < result.length; i++) {
		console.log(result[i], i);
		if (!result[i].order) return;

		result[i].order = i + 1;
		changedPhases.push(result[i]);
	}

	console.log(changedPhases);

	return result;
};

/*
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);
	result.forEach((item, index) => (item.order = index + 1));

	const changedPhases: NestedPhase[] = [];

	for (var i = endIndex; i < result.length; i++) {
		// console.log(result[i], i);
		result[i].order = i + 1;
		changedPhases.push(result[i]);
	}
	console.log(changedPhases);

	Promise.all(changedPhases.map((phase) => updatePhase(phase.id, { order: phase.order })));

	return result; 
*/

/**
 * Moves an item from one list to another list.
 */
export const move = (source: any, destination: any, droppableSource: any, droppableDestination: any) => {
	const sourceClone = Array.from(source);
	const destClone = Array.from(destination);
	const [removed] = sourceClone.splice(droppableSource.index, 1);

	destClone.splice(droppableDestination.index, 0, removed);

	const result = {};
	result[droppableSource.droppableId] = sourceClone;
	result[droppableDestination.droppableId] = destClone;

	return result;
};
