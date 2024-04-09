import React from 'react';
import OrganizationLayout from '../organization-layout';
import { Input } from '@/components/ui/input';
import DatePicker from '@/components/DatePicker';
import { Separator } from '@/components/ui/separator';
import { getActivity } from '@/lib/functions/read';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const Page = async ({ params }: { params: { org: string } }) => {
	const activities = await getActivity();

	return (
		<OrganizationLayout org={params.org}>
			<div className='grow px-6 py-4 w-full space-y-4 flex flex-col'>
				<div className='w-full space-y-4'>
					<h1 className='text-2xl font-medium leading-none'>Activites</h1>

					<div className='flex items-center gap-4'>
						<Input />
						<Input />
						<Input />
					</div>

					<Separator />

					<ScrollArea>
						{activities.map((activity) => (
							<div key={activity.id} className='grid gap-3 border-b last:border-0'>
								<div className='flex items-center gap-3'>
									<Avatar>
										<AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' />
										<AvatarFallback>CN</AvatarFallback>
									</Avatar>
									<div>
										<p className='font-medium text-sm'>Nick Black</p>
										<p className='text-sm text-muted-foreground'>Stuff</p>
									</div>
								</div>
								<p className='text-sm text-muted-foreground'>
									Updated status from <Badge>Approved by DM</Badge> to <Badge>Final Approval</Badge> on April 12th, 3:28 PM
								</p>
							</div>
						))}
					</ScrollArea>
				</div>
			</div>
		</OrganizationLayout>
	);
};

export default Page;
