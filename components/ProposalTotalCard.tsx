import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Props = {
	proposal: Proposal;
};

const ProposalTotalCard = ({ proposal }: Props) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Totals</CardTitle>
				<CardDescription>Deploy your new project in one-click.</CardDescription>
			</CardHeader>
			<CardContent>
				<form>
					<div className='grid w-full items-center gap-4'>
						<div className='flex flex-col space-y-1.5'>
							<Label htmlFor='total-labor-hours'>Total Labor Hours</Label>
							<Input
								id='total-labor-hours'
								pattern='^\$\d{1,3}(,\d{3})*(\.\d+)?$'
								type='number'
								value={proposal.total_labor_hours}
								placeholder='Total Labor Hours'
								readOnly
							/>
						</div>
						<div className='flex flex-col space-y-1.5'>
							<Label htmlFor='sales-labor'>Sales Ticket and Proposal Work</Label>
							<Input id='sales-labor' type='number' value={proposal.sales_hours} placeholder='Total Labor Hours' readOnly />
						</div>
						<div className='flex flex-col space-y-1.5'>
							<Label htmlFor='project-management'>Project Management</Label>
							<Input id='project-management' type='number' value={proposal.management_hours} placeholder='Total Labor Hours' readOnly />
						</div>
						<div className='flex flex-col space-y-1.5'>
							<Label htmlFor='hours-required'>Hours Required</Label>
							<Input id='hours-required' type='number' value={proposal.total_labor_hours} placeholder='Total Labor Hours' readOnly />
						</div>
						<div className='flex flex-col space-y-1.5'>
							<Label htmlFor='labor-rate'>Labor Rate</Label>
							<Input id='hours-required' type='number' value={proposal.labor_rate} placeholder='Total Labor Hours' readOnly />
						</div>
						<div className='flex flex-col space-y-1.5'>
							<Label htmlFor='total-labor-price'>Total Labor Price</Label>
							<Input
								id='total-labor-price'
								pattern='^\$\d{1,3}(,\d{3})*(\.\d+)?$'
								type='text'
								datatype='currency'
								// onKeyUp={}
								value={proposal.total_labor_price}
								placeholder='Total Labor Hours'
								readOnly
							/>
						</div>
					</div>
				</form>
			</CardContent>
		</Card>
	);
};

export default ProposalTotalCard;
