import React from 'react';

const SlashIcon = ({ className }: { className: string }) => {
	return (
		<svg
			className={className}
			data-testid='geist-icon'
			fill='none'
			height='24'
			shapeRendering='geometricPrecision'
			stroke='currentColor'
			strokeLinecap='round'
			strokeLinejoin='round'
			strokeWidth='1'
			viewBox='0 0 24 24'
			width='24'
			// style={{color: var(--ds-gray-alpha-400) width: 22px; height: 22px;}}
			style={{ color: 'gray', width: 22, height: 22 }}
		>
			<path d='M16.88 3.549L7.12 20.451'></path>
		</svg>
	);
};

export default SlashIcon;
