'use client';
import { Input } from '@/components/ui/input';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

type Props = {
	baseUrl: string;
	placeholder: string;
};

const Search = ({ baseUrl, placeholder }: Props) => {
	const router = useRouter();
	const [text, setText] = useState('');
	const [query] = useDebounce(text, 500);

	useEffect(() => {
		if (!query) {
			router.push(`${baseUrl}`);
		} else {
			router.push(`${baseUrl}?search=${query}`);
		}
	}, [query, router, baseUrl]);

	return (
		<div
			className='flex h-9 items-center w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
			cmdk-input-wrapper=''
		>
			<MagnifyingGlassIcon className='mr-2 h-4 w-4 shrink-0 opacity-50' />
			<Input
				placeholder={placeholder}
				value={text}
				onChange={(event) => setText(event.target.value)}
				className='border-0 shadow-none focus-visible:ring-0'
			/>
		</div>
	);
};

export default Search;
