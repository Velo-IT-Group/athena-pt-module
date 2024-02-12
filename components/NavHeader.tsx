import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const NavHeader = () => {
	return (
		<header className='w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
			<div className='container flex h-14 max-w-screen-2xl items-center'>
				<Link href='/'>
					<Image src='/velo-logo-black.svg' alt='velo-logo' width={64} height={64} />
				</Link>
				<nav></nav>
			</div>
		</header>
	);
};

export default NavHeader;
