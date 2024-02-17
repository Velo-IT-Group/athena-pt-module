import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Label } from '@/components/ui/label';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarIcon, PaperPlaneIcon } from '@radix-ui/react-icons';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getProposal } from '@/lib/data';
import PhasesList from '@/components/PhasesList';

const discussion = [
	{
		id: '12345',
		name: 'Nick',
		body: 'Hey @Jeff, is this really necessary?',
	},
	{
		id: '123456',
		name: 'Jeff',
		body: 'Hey @Nick, yes, this is very necessary.',
	},
	{
		id: '1234567',
		name: 'Nick',
		body: 'Okay',
	},
];

const hardware = [
	{
		id: '1',
		name: 'V-VELO-SL-HWINSTALLED',
		price: 7461.55,
	},
	{
		id: '2',
		name: 'UTPSP1BUY',
		price: 8.47,
	},
	{
		id: '3',
		name: 'UTPSP1BUY',
		price: 8.47,
	},
	{
		id: '4',
		name: 'UTPSP1BUY',
		price: 8.47,
	},
];

type Props = {
	params: { id: string };
};

const ProposalReviewPage = async ({ params }: Props) => {
	const proposal = await getProposal(params.id);

	if (!proposal) return <div></div>;

	return (
		<div className='h-full bg-neutral-50 grid grid-cols-5 gap-24 py-12 px-24'>
			<div className='col-span-2'>
				<div className='space-y-4'>
					<h1 className='text-lg font-semibold'>Quote breakdown</h1>
					<p className='text-sm text-muted-foreground'>
						Based on your proposal, you can see what you&apos;ll be able to expect as your monthly expense.
					</p>

					<div className='rounded-xl border bg-neutral-100 p-4 space-y-4'>
						<div className='flex items-center justify-between px-4'>
							<p className='text-sm text-muted-foreground'>Quote Price</p>
							<p className='text-sm text-muted-foreground text-right'>
								$ <span className='font-medium'>17,866.11</span>
							</p>
						</div>

						<Card>
							<CardHeader>
								<CardTitle>Hardware</CardTitle>
							</CardHeader>
							<CardContent className='space-y-2'>
								{hardware.map((hardwareItem) => (
									<HoverCard key={hardwareItem.id}>
										<HoverCardTrigger asChild>
											<div className={`flex items-center justify-between before:content-['${discussion.length}']`}>
												<p className='text-sm text-muted-foreground hover:underline'>{hardwareItem.name}</p>
												<p className='text-sm text-muted-foreground text-right'>
													$ <span className='font-medium'>{hardwareItem.price}</span>
												</p>
											</div>
										</HoverCardTrigger>
										<HoverCardContent className='w-80 flex flex-1 flex-col'>
											<h4>Discussion</h4>
											<ScrollArea className='space-y-4 h-80'>
												{discussion.map((message) => (
													<div key={message.id} className='flex justify-between space-x-4 border-b p-4 last:border-b-0'>
														<Avatar>
															<AvatarImage src='https://github.com/vercel.png' />
															<AvatarFallback>VC</AvatarFallback>
														</Avatar>
														<div className='space-y-1'>
															<h4 className='text-sm font-semibold'>@nextjs</h4>
															<p className='text-sm'>The React Framework – created and maintained by @vercel.</p>
															<div className='flex items-center pt-2'>
																<CalendarIcon className='mr-2 h-4 w-4 opacity-70' />{' '}
																<span className='text-xs text-muted-foreground'>Joined December 2021</span>
															</div>
														</div>
													</div>
												))}
											</ScrollArea>
											<form className='flex w-full max-w-sm items-center space-x-2'>
												<Input id='message' name='message' placeholder='Send message...' />
												<Button type='submit' variant='outline' size='sm'>
													<PaperPlaneIcon className='w-4 h-4' />
												</Button>
											</form>
										</HoverCardContent>
									</HoverCard>
								))}
							</CardContent>

							<CardFooter>
								<div className='flex items-center justify-between w-full'>
									<p className='text-sm text-muted-foreground'>Hardware Subtotal</p>
									<p className='text-sm text-muted-foreground text-right'>
										$ <span className='font-medium'>250</span>
									</p>
								</div>
							</CardFooter>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Services</CardTitle>
							</CardHeader>
							<CardContent className='space-y-2'>
								<div className='flex items-center justify-between'>
									<p className='text-sm text-muted-foreground'>Total Labor Hours</p>
									<p className='text-sm text-muted-foreground text-right font-medium'>15</p>
								</div>
								<div className='flex items-center justify-between'>
									<p className='text-sm text-muted-foreground'>Sales Work</p>
									<p className='text-sm text-muted-foreground text-right font-medium'>15</p>
								</div>
								<div className='flex items-center justify-between'>
									<p className='text-sm text-muted-foreground'>Project Management</p>
									<p className='text-sm text-muted-foreground text-right font-medium'>0</p>
								</div>
								<div className='flex items-center justify-between'>
									<p className='text-sm text-muted-foreground'>Hours Required</p>
									<p className='text-sm text-muted-foreground text-right font-medium'>0</p>
								</div>
								<div className='flex items-center justify-between'>
									<p className='text-sm text-muted-foreground'>Labor Rate</p>
									<p className='text-sm text-muted-foreground text-right'>
										$ <span className='font-medium'>250</span>
									</p>
								</div>
								<Separator />
								<div className='flex items-center justify-between'>
									<p className='text-sm text-muted-foreground'>Hardware Subtotal</p>
									<p className='text-sm text-muted-foreground text-right'>
										$ <span className='font-medium'>250</span>
									</p>
								</div>
							</CardContent>
						</Card>
					</div>

					<Button className='mr-2'>Button</Button>
					<Dialog>
						<DialogTrigger asChild>
							<Button variant='outline'>Approve</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Are you absolutely sure?</DialogTitle>
								<DialogDescription>
									This action cannot be undone. This will permanently delete your account and remove your data from our servers.
								</DialogDescription>
							</DialogHeader>
							<form>
								<div className='grid w-full items-center gap-4'>
									<div className='flex flex-col space-y-1.5'>
										<Label htmlFor='name'>Initals</Label>
										<Input id='name' placeholder='Name of your project' />
									</div>
									<div className='flex flex-col space-y-1.5'>
										<Label htmlFor='name'>Name</Label>
										<Input id='name' placeholder='Name of your project' />
									</div>
								</div>
							</form>
							<DialogFooter>
								<Button type='submit'>Sign</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>
			</div>

			<Card className='col-span-3'>
				<CardHeader>
					<CardTitle>Scope Of Work</CardTitle>
				</CardHeader>

				<CardContent>
					<div className='space-y-4'>
						<Separator />
						{/* <PhasesList phases={proposal?.phases ?? []} /> */}
						{/* {proposal?.phases?.map((phase) => (
							<div className='space-y-2' key={phase.id}>
								<h3 className='text-sm font-medium tracking-tight'>{phase.description}</h3>
								<ul className='list-disc list-inside px-4'>
									{phase.tickets.map((ticket) => (
										<li key={ticket.id} className='text-sm'>
											{ticket.summary}
										</li>
									))}
								</ul>
							</div>
						))} */}
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default ProposalReviewPage;
