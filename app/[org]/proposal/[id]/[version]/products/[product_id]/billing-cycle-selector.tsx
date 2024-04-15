'use client';
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ReferenceType } from '@/types/manage';
import { updateProduct } from '@/lib/functions/update';

type Props = {
	defaultValue?: string;
	unique_id: string;
	billingCycles: ReferenceType[];
	overrides: object;
};

const BillingCycleSelector = ({ billingCycles, unique_id, overrides, defaultValue }: Props) => {
	return (
		<Select
			onValueChange={async (e) => {
				const obj = overrides as object;
				// @ts-ignore
				const robj = overrides.recurring as object;
				await updateProduct(unique_id, {
					overrides: {
						...overrides,
						recurring: {
							...robj,
							billCycleId: e,
						},
					},
				});
			}}
			defaultValue={defaultValue}
		>
			<SelectTrigger>
				<SelectValue placeholder='Select a recurring type' />
			</SelectTrigger>

			<SelectContent>
				{billingCycles.map((cycle) => (
					<SelectItem key={cycle.id} value={cycle.id.toString()}>
						{cycle.name}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

export default BillingCycleSelector;
