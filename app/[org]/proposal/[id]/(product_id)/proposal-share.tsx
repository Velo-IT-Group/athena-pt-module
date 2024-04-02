'use client';
import React from 'react';

import { CheckIcon, CopyIcon } from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export function ProposalShare({ proposalId, origin }: { proposalId: string; origin: string }) {
	const [hasCopied, setHasCopied] = React.useState(false);
	console.log(origin);

	React.useEffect(() => {
		setTimeout(() => {
			setHasCopied(false);
		}, 2000);
	}, [hasCopied]);
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant='secondary'>Share</Button>
			</PopoverTrigger>
			<PopoverContent align='end' className='w-[520px]'>
				<div className='flex flex-col text-center sm:text-left'>
					<h3 className='text-lg font-semibold'>Share proposal</h3>
					<p className='text-sm text-muted-foreground'>Anyone who has this link will be able to view this.</p>
				</div>
				<div className='grid flex-1 gap-4 pt-4'>
					<div className='grid gap-2'>
						<Label htmlFor='external_link' className='sr-only'>
							External Link
						</Label>

						<div className='flex items-center space-x-2'>
							<Input id='external_link' defaultValue={`${origin}/review/${proposalId}`} readOnly className='h-9' />
							<Button
								type='submit'
								size='sm'
								className='px-3'
								onClick={() => {
									navigator.clipboard.writeText(`${origin}/review/${proposalId}`);
									setHasCopied(true);
								}}
							>
								<span className='sr-only'>Copy</span>
								{hasCopied ? <CheckIcon className='h-4 w-4' /> : <CopyIcon className='h-4 w-4' />}
							</Button>
						</div>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}
