import React from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
	phase: Phase;
	tickets: Array<Ticket>;
	ref: React.Ref<HTMLButtonElement> | undefined;
};

const PhaseListItem = ({ phase, tickets, ref }: Props) => {
	return (
		<Card className='flex'>
			<CardHeader className='flex flex-row items-center justify-between w-full'>
				<div className='flex flex-col items-start'>
					<CardTitle>Phase {phase.order}</CardTitle>
					<CardDescription>{phase?.description ?? 'New Phase'}</CardDescription>
				</div>
				<div className='flex flex-col items-start'>
					<CardTitle>Hours:</CardTitle>
					<CardDescription>{phase.hours ?? 0}</CardDescription>
				</div>
			</CardHeader>
		</Card>
	);
};

export default PhaseListItem;
