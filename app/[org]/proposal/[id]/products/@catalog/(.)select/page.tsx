import { getCatalogItems } from '@/lib/functions/read';
import CatalogPicker from '../../catalog-picker';
import { Dialog } from '@/components/ui/dialog';

type Props = {
	params: { org: string; id: string };
	searchParams: { [key: string]: string | string[] | undefined };
};

export default async function Page({ params, searchParams }: Props) {
	const query = typeof searchParams.query === 'string' ? String(searchParams.query) : undefined;
	const page = typeof searchParams.page === 'string' ? Number(searchParams.page) : 1;
	const { catalogItems, count } = await getCatalogItems(query, page);

	console.log(catalogItems, count);

	return (
		<Dialog open>
			<CatalogPicker proposal={params.id} catalogItems={catalogItems} params={params} page={page} count={count} />
		</Dialog>
	);
}
