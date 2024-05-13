import { Pencil1Icon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import ProposalOptions from '@/app/[org]/proposal-options';
import { relativeDate } from '@/utils/date';
import ProposalCardStatus from './status';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function ProposalCard({ proposal, orgId }: { proposal: Proposal; orgId: string }) {
	return (
		<Card className='flex flex-col'>
			<CardHeader className='grid grid-cols-[1fr_110px] items-start gap-4 space-y-0'>
				<div className='space-y-1'>
					<CardTitle>{proposal.name}</CardTitle>
				</div>
				<div className='flex items-center space-x-1 rounded-md bg-secondary text-secondary-foreground'>
					<Button variant='secondary' className='px-3 shadow-none' asChild>
						<Link href={`/${orgId}/proposal/${proposal.id}/${proposal.working_version}`}>
							<Pencil1Icon className='mr-2 h-4 w-4' />
							Edit
						</Link>
					</Button>
					<Separator orientation='vertical' className='h-[20px]' />
					<ProposalOptions proposalId={proposal.id} orgId={orgId} />
				</div>
			</CardHeader>
			<CardContent className='mt-auto'>
				<div className='flex items-center justify-between space-x-4 text-sm text-muted-foreground'>
					<Suspense fallback={<Skeleton className='h-5 w-40' />}>
						<ProposalCardStatus ticketId={proposal.service_ticket} />
					</Suspense>

					<div className='flex items-center text-muted-foreground text-xs animate-in fade-in truncate capitalize'>
						Updated {relativeDate(new Date(proposal.updated_at))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
