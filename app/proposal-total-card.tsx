import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ProposalTotalCard = () => {
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
							<Input id='total-labor-hours' type='number' value={48.0} placeholder='Total Labor Hours' readOnly />
						</div>
						<div className='flex flex-col space-y-1.5'>
							<Label htmlFor='sales-labor'>Sales Ticket and Proposal Work</Label>
							<Input id='sales-labor' type='number' value={48.0} placeholder='Total Labor Hours' readOnly />
						</div>
						<div className='flex flex-col space-y-1.5'>
							<Label htmlFor='project-management'>Project Management</Label>
							<Input id='project-management' type='number' value={48.0} placeholder='Total Labor Hours' readOnly />
						</div>
						<div className='flex flex-col space-y-1.5'>
							<Label htmlFor='hours-required'>Hours Required</Label>
							<Input id='hours-required' type='number' value={48.0} placeholder='Total Labor Hours' readOnly />
						</div>
						<div className='flex flex-col space-y-1.5'>
							<Label htmlFor='labor-rate'>Labor Rate</Label>
							<Input id='hours-required' type='number' value={250} placeholder='Total Labor Hours' readOnly />
						</div>
						<div className='flex flex-col space-y-1.5'>
							<Label htmlFor='total-labor-price'>Total Labor Price</Label>
							<Input id='total-labor-price' type='number' value={15000} placeholder='Total Labor Hours' readOnly />
						</div>
					</div>
				</form>
			</CardContent>
		</Card>
	);
};

export default ProposalTotalCard;
