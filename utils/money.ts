export const getCurrencyString = (value: number) => {
	let USDollar = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	});

	return USDollar.format(value);
};

export const parseAmount = (value: string) => {
	const re = /\$([+-]?(?=\.\d|\d)(?:\d+)?(?:\.?\d*))(?:[Ee]([+-]?\d+))?/;
	const ok = re.exec(value);
	console.log(ok);
	if (!re.exec(value)) return;
	const split = value.split('$');
	if (split.length <= 1) return;
	return parseFloat(split[1]);
};
