export const getCurrencyString = (value: number) => {
	let USDollar = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	});

	return USDollar.format(value);
};
