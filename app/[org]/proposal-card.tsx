import { Pencil1Icon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import ProposalOptions from './proposal-options';
import { statuses } from './proposal/[id]/products/data/data';
import { relativeDate } from '@/utils/date';
import { calculateTotals } from '@/utils/helpers';
import { getCurrencyString } from '@/utils/money';

export function ProposalCard({ proposal, orgId }: { proposal: NestedProposal; orgId: string }) {
	const status = statuses.find((status) => status.value === proposal.status);
	const { totalPrice } = calculateTotals(
		proposal?.products ?? [],
		proposal?.phases ?? [],
		proposal.labor_rate,
		proposal.management_hours,
		proposal.sales_hours
	);

	return (
		<Card className='flex flex-col'>
			<CardHeader className='grid grid-cols-[1fr_110px] items-start gap-4 space-y-0'>
				<div className='space-y-1'>
					<CardTitle>{proposal.name}</CardTitle>
					<CardDescription>{getCurrencyString(totalPrice)}</CardDescription>
				</div>
				<div className='flex items-center space-x-1 rounded-md bg-secondary text-secondary-foreground'>
					<Button variant='secondary' className='px-3 shadow-none' asChild>
						<Link href={`/${orgId}/proposal/${proposal.id}`}>
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
					<div className='flex items-center'>
						{status && (
							<>
								{status.icon && <status.icon className='mr-1 h-3 w-3 text-muted-foreground' />}
								<span className='whitespace-nowrap'>{status.label}</span>
							</>
						)}
					</div>

					<div className='flex items-center text-muted-foreground text-xs animate-in fade-in truncate capitalize'>
						Updated {relativeDate(new Date(proposal.updated_at))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
