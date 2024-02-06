import Sidebar from '@/components/Sidebar';
import createSupabaseServerClient from '@/lib/supabase/server';
import React from 'react';

type Props = {
	children: React.ReactNode;
};

const PropsalLayout = async ({ children }: Props) => {
	const supabase = await createSupabaseServerClient();
	const { data: proposals, error } = await supabase.from('proposals').select('*');

	return (
		<div className='grid lg:grid-cols-8 h-full'>
			<Sidebar proposals={proposals} />
			<div className='col-span-6 p-4'>{children}</div>
		</div>
	);
};

export default PropsalLayout;
