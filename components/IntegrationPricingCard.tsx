import React, { Suspense, useEffect, useState } from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';
import { Separator } from './ui/separator';
import { getOrganization } from '@/lib/functions/read';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowTopRightIcon } from '@radix-ui/react-icons';
import { Skeleton } from './ui/skeleton';
import { getCurrencyString } from '@/utils/money';
import { Button } from './ui/button';

type Props = {
	description: string;
	id: string;
	vendorSku: string;
	setPrice?: (price: number) => void;
};

const IntegrationPricingCard = ({ description, id, vendorSku, setPrice }: Props) => {
	const [integrations, setIntegrations] = useState<OrganizationIntegration[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		getOrganization()
			.then((data) => setIntegrations(data.organization_integrations))
			.catch((e) => console.error(e));

		setTimeout(() => setLoading(false), 4000);
	}, []);

	return (
		<HoverCardContent className='space-y-4 w-80'>
			<div>
				<h3 className='text-sm font-medium'>{description}</h3>
				<p className='text-sm text-muted-foreground font-medium'>Compare prices by reseller.</p>
			</div>
			<Separator />
			<ul className='space-y-1'>
				{integrations.map(({ integration }) => (
					// @ts-ignore
					<li className='flex gap-2 items-center relative' key={integration?.name}>
						<div className='border rounded-lg overflow-hidden h-5 w-5 relative'>
							{/* @ts-ignore */}
							<Image className='rounded-lg object-cover w-5 h-5' src={`/${integration.logo}`} alt={`${integration.logo} logo`} fill />
						</div>

						{/* @ts-ignore */}
						{integration?.url ? (
							<Link
								// @ts-ignore
								href={integration.url}
								target='_blank'
								className='text-muted-foreground text-sm hover:underline hover:decoration-muted-foreground'
							>
								<h4>
									{/* @ts-ignore */}
									{integration.name}
									<ArrowTopRightIcon className='w-3 h-3 inline-block' />
								</h4>
							</Link>
						) : (
							// @ts-ignore
							<h4 className='text-muted-foreground text-sm'>{integration.name}</h4>
						)}

						{/* <Suspense fallback={<Skeleton />}> */}
						{loading ? (
							<Skeleton className='h-4 w-16 ml-auto' />
						) : (
							<Button
								type='button'
								size='sm'
								variant='link'
								onClick={() => {
									if (setPrice) {
										setPrice(123);
									}
								}}
								className='ml-auto font-medium'
							>
								{getCurrencyString(123)}
							</Button>
						)}
						{/* </Suspense> */}
					</li>
				))}
			</ul>
		</HoverCardContent>
	);
};

export default IntegrationPricingCard;
