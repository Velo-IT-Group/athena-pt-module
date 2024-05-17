'use client';
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import ProductsList from './products-list';
import { DragHandleDots2Icon } from '@radix-ui/react-icons';
import { Input } from '@/components/ui/input';
import { updateSection } from '@/lib/functions/update';
import { toast } from 'sonner';
import CatalogPicker from './catalog-picker';
import { CatalogItem } from '@/types/manage';
import { Draggable } from 'react-beautiful-dnd';

type Props = {
	section: Section & { products: NestedProduct[] };
	catalogItems: CatalogItem[];
	params: { org: string; id: string; version: string };
	page: number;
	count: number;
	searchParams?: { [key: string]: string | string[] | undefined };
	url?: string;
};

const ProductSection = ({ section, catalogItems, params, page, count, searchParams, url }: Props) => {
	return (
		<Draggable draggableId={section.id} index={catalogItems && catalogItems.length ? catalogItems.length - 1 : 0}>
			{(provided) => (
				<Card>
					<CardHeader>
						<CardTitle className='flex items-center gap-2'>
							<DragHandleDots2Icon />
							<Input
								// readOnly={pending}
								onBlur={async (e) => {
									if (e.currentTarget.value !== section.name) {
										console.log('updating phase');
										await updateSection({ id: section.id, name: e.currentTarget.value });
										toast('Phase has been updated.', {
											description: Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date()),
										});
									}
								}}
								className='border border-transparent hover:border-border hover:cursor-default rounded-lg shadow-none px-2 -mx-2 py-2 -my-2 min-w-60'
								defaultValue={section.name}
							/>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<ProductsList products={section?.products ?? []} catalogItems={catalogItems} count={count} page={page} params={params} proposal={''} />
					</CardContent>
					<CardFooter>
						<CatalogPicker
							proposal=''
							catalogItems={catalogItems}
							count={count}
							page={page}
							params={params}
							section={section.id}
							searchParams={searchParams}
							url={url}
						/>
					</CardFooter>
				</Card>
			)}
		</Draggable>
	);
};

export default ProductSection;
