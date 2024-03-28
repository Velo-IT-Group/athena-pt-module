'use client';
import { getIngramPricing, getSynnexPricing } from '@/lib/functions/read';
import { getCurrencyString } from '@/utils/money';
import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';

type Props = {
	distributor: 'synnex' | 'ingram' | 'cdw';
};

function IntegrationPricingModule({ distributor }: Props) {
	const [loading, setLoading] = useState(true);
	const [price, setPrice] = useState<number | undefined>();

	useEffect(() => {
		const getPrice = async (): Promise<number> => {
			switch (distributor) {
				case 'ingram':
					const response = await getIngramPricing();
					return response?.pricing ?? 0;
					break;
				case 'synnex':
					const synnexResponse = await getSynnexPricing();
					return synnexResponse?.pricing ?? 0;
					break;
				case 'cdw':
					return 0;
					break;
				default:
					return 0;
					break;
			}
		};

		getPrice().then((price) => {
			setPrice(price);
			setLoading(false);
		});
	}, [distributor]);

	return (
		<>
			{loading ? (
				<Skeleton className='h-4 w-16 ml-auto' />
			) : (
				<Button type='button' size='sm' variant='link' className='ml-auto font-medium p-0 h-auto'>
					{getCurrencyString(price ?? 0)}
				</Button>
			)}
		</>
	);
}

export default IntegrationPricingModule;
