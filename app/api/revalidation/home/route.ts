import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
	console.log('HELLO');
	const data = await request.formData();

	console.log(request);

	const slug = data.get('slug') as string;

	console.log(slug);

	revalidatePath(`/`);

	return new Response(`Ok`, {
		status: 200,
	});
}
