import ProductForm from '@/components/forms/ProductForm';
import { getBillingCycles, getProduct, getProducts } from '@/lib/functions/read';
import { notFound } from 'next/navigation';
import React from 'react';

type Props = {
	params: { org: string; id: string; product_id: string };
};

const ProductPage = async ({ params }: Props) => {
	const product = await getProduct(params.product_id);
	const billingCycles = await getBillingCycles();

	if (!product) {
		notFound();
	}

	return (
		<main>
			<ProductForm product={product} billingCycles={billingCycles} />
		</main>
	);
};

export default ProductPage;
