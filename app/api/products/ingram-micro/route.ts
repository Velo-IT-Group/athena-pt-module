export async function GET(request: Request) {
	const headers = new Headers();
	headers.append('accept', 'application/json');
	headers.append('IM-CustomerNumber', '20-222222');
	headers.append('IM-CountryCode', 'US');
	headers.append('IM-CorrelationID', 'fbac82ba-cf0a-4bcf-fc03-0c5084');
	headers.append('IM-SenderID', 'MyCompany');
	headers.append('Content-Type', 'application/json');

	try {
		const response = await fetch(
			'https://api.ingrammicro.com:443/sandbox/resellers/v6/catalog/priceandavailability?includeAvailability=true&includePricing=true&includeProductAttributes=false',
			{
				headers,
				method: 'POST',
				mode: 'no-cors',
				body: JSON.stringify({
					products: [
						{
							ingramPartNumber: '123512',
						},
					],
				}),
			}
		);

		const products = await response.json();

		return Response.json(products);
	} catch (error) {
		return new Response(`${error}`, {
			status: 400,
		});
	}
}
