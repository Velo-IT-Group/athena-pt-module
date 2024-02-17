import React from 'react';

type Props = {
	children: React.ReactNode;
};

const PropsalLayout = ({ children }: Props) => {
	return <div className='flex flex-col w-full min-h-screen'>{children}</div>;
};

export default PropsalLayout;
