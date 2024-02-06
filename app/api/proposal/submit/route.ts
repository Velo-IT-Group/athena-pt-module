import createSupabaseServerClient from '@/lib/supabase/server';
import type { NextApiResponse } from 'next';
import { revalidatePath } from 'next/cache';

export async function POST(req: Request, res: NextApiResponse) {
	try {
		console.log('running function');
		const supabase = await createSupabaseServerClient();
		const body: ProposalInsert = await req.json();

		const data = {
			...body,
			organization: '1c80bfac-b59f-420b-8b0e-a330aa377edd',
		};

		console.log('DATA', data);

		const { data: proposal, error } = await supabase.from('proposals').insert(data).select('*').returns<Proposal>().single();

		console.log(proposal);

		if (error) throw error;

		revalidatePath('/proposal');

		return Response.json({ proposal });
	} catch (error) {
		return new Response(`Webhook error: ${error}`, {
			status: 400,
		});
	}
}
