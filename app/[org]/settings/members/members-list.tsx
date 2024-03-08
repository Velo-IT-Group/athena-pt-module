'use client';
import React from 'react';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { memberColumns } from './columns';
import { DataTable } from '@/components/ui/data-table';

const MembersList = ({ data }: { data: Member[] }) => {
	console.log(data);
	const table = useReactTable<Member>({
		data,
		columns: memberColumns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div>
			<DataTable table={table} hideHeader />
		</div>
	);
};

export default MembersList;
