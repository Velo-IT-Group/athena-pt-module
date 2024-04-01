'use client';

import DatePicker from '@/components/DatePicker';
import { updateProposal } from '@/lib/functions/update';
import React from 'react';

const ExpirationDatePicker = ({ id, expiration_date }: { id: string; expiration_date?: string }) => {
	const [date, setDate] = React.useState<Date | null>(expiration_date ? new Date(expiration_date) : null);

	const changeDate = async (date: Date) => {
		setDate(date);
		await updateProposal(id, { expiration_date: date.toISOString() });
	};

	return <DatePicker date={date} setDate={changeDate} />;
};

export default ExpirationDatePicker;
