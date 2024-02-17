import React from 'react';
import { getProposals } from '@/lib/data';
import { DataTable } from './data-table';
import { columns } from './columns';
import { Button } from '@/components/ui/button';
import { PlusIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

const ProposalsPage = async () => {
	const proposals = await getProposals();

	if (!proposals) return <div></div>;

	return (
		<div className='grid gap-4 container mx-auto'>
			<div className='flex justify-between w-full items-center'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight'>Proposals</h1>
					<p>The proposals list here shows all proposals.</p>
				</div>
				<Button asChild>
					<Link href='/proposal/new'>
						<PlusIcon className='w-4 h-4 mr-2' /> Add Proposal
					</Link>
				</Button>
			</div>

			<div className='flex items-center justify-between gap-2'>
				<DataTable columns={columns} data={proposals} />
			</div>
		</div>
	);
};

export default ProposalsPage;
