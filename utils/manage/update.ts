'use server';

import { ManageProductUpdate } from '@/lib/functions/update';
import { baseHeaders } from '@/lib/utils';
import { ProductsItem } from '@/types/manage';
import { retryWithDelay, wait } from '../helpers';

// export const getSystemMembers = async (email: string): Promise<SystemMember[]> => {
// const response = await fetch(`${process.env.NEXT_PUBLIC_CW_URL}/system/members?conditions=primaryEmail like '${email}'`, {
// 	headers: baseHeaders,
// });

// 	const data = await response.json();

// 	return data;
// };

export const updateManageProduct = async (product: ManageProductUpdate): Promise<ProductsItem | undefined> => {
	const response = await fetch(`${process.env.NEXT_PUBLIC_CW_URL}/procurement/products/${product.id}`, {
		headers: baseHeaders,
		method: 'patch',
		body: JSON.stringify(product.values),
	});

	if (response.status !== 200) {
		await wait(1000);
		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_CW_URL}/procurement/products/${product.id}`, {
				headers: baseHeaders,
				method: 'patch',
				body: JSON.stringify(product.values),
			});

			const data = await response.json();

			return data;
		} catch (error) {
			console.log(error);
		}
	}

	const data = await response.json();

	return data;
};

export const updateManageProject = async (id: number) => {
	await fetch(`${process.env.NEXT_PUBLIC_CW_URL}/project/projects/${id}`, {
		headers: baseHeaders,
		method: 'patch',
		body: JSON.stringify([
			{
				op: 'replace',
				path: '/billProjectAfterClosedFlag',
				value: true,
			},
			{
				op: 'replace',
				path: '/budgetFlag',
				value: true,
			},
			{
				op: 'replace',
				path: '/estimatedHours',
				value: 57,
			},
			{
				op: 'replace',
				path: '/billingMethod',
				value: 'FixedFee',
			},
		]),
	});
};
