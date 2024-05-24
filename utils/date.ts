export function relativeDate(date: Date) {
	// @ts-ignore
	const diff: number = Math.round((new Date() - new Date(date)) / 1000);

	const minute = 60;
	const hour = minute * 60;
	const day = hour * 24;
	const week = day * 7;
	const month = day * 30;
	const year = month * 12;

	if (diff < 30) {
		return 'just now';
	} else if (diff < minute) {
		return diff + ' seconds ago';
	} else if (diff < 2 * minute) {
		return 'a minute ago';
	} else if (diff < hour) {
		return Math.floor(diff / minute) + ' minutes ago';
	} else if (Math.floor(diff / hour) == 1) {
		return '1 hour ago';
	} else if (diff < day) {
		return Math.floor(diff / hour) + ' hours ago';
	} else if (diff < day * 2) {
		return 'yesterday';
	} else if (diff < week) {
		const dayAmount = Math.floor(diff / day);
		return `${dayAmount} ${dayAmount > 1 ? ' days ago' : 'day ago'}`;
	} else if (diff < month) {
		return Math.floor(diff / week) + ' weeks ago';
	} else if (diff < year && diff < year) {
		const monthAmount = Math.floor(diff / month);
		return `${monthAmount} ${monthAmount > 1 ? ' months ago' : ' month ago'}`;
	} else {
		return Math.floor(diff / year) + ' years ago';
	}
}
