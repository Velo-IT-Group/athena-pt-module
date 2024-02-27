import { DraggableLocation } from 'react-beautiful-dnd';

interface Orderable {
	order: number;
}

export const reorder = <T extends Orderable>(list: T[], startIndex: number, endIndex: number): T[] => {
	const result = [...list];
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);
	result.forEach((item, index) => (item.order = index + 1));

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
export const move = <T extends Orderable>(
	source: T[],
	destination: T[],
	droppableSource: DraggableLocation,
	droppableDestination: DraggableLocation
) => {
	const sourceClone = Array.from(source);
	const destClone = Array.from(destination);
	const [removed] = sourceClone.splice(droppableSource.index, 1);

	destClone.splice(droppableDestination.index, 0, removed);

	const result = {};
	// @ts-ignore
	result[droppableSource.droppableId] = sourceClone;
	// @ts-ignore
	result[droppableDestination.droppableId] = destClone;

	return result;
};
