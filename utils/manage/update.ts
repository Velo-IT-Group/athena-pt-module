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
	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_CW_URL}/procurement/products/${product.id}`, {
			headers: baseHeaders,
			method: 'PATCH',
			body: JSON.stringify(product.values),
		});

		console.log(product.id, JSON.stringify(product.values));

		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${JSON.stringify(response.statusText, null, 2)}`);
		}

		const data = await response.json();

		return data;
	} catch (error) {
		console.error('Error updating manage product:', JSON.stringify(error, null, 2));

		// Retry logic
		await wait(1000); // Wait for 1 second before retrying
		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_CW_URL}/procurement/products/${product.id}`, {
				headers: baseHeaders,
				method: 'patch',
				body: JSON.stringify(product.values),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${JSON.stringify(response.statusText, null, 2)}`);
			}

			const data = await response.json();
			return data;
		} catch (error) {
			console.error('Error retrying update manage product:', JSON.stringify(error, null, 2));
			// Handle the error or rethrow it
			throw error;
		}
	}
};

export const updateManageProject = async (id: number, estimatedHours: number) => {
	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_CW_URL}/project/projects/${id}`, {
			headers: baseHeaders,
			method: 'PATCH',
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
					value: estimatedHours,
				},
				{
					op: 'replace',
					path: '/billingMethod',
					value: 'FixedFee',
				},
			]),
		});

		if (!response.ok) {
			// Check for HTTP error status and throw an error
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		// Optionally, return data if needed
		// const data = await response.json();
		// return data;
	} catch (error) {
		// Handle the error
		console.error('Error updating manage project:', error);
		throw error; // Rethrow the error if needed
	}
};
