export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className='h-full flex-1 flex flex-col'>
			{/* {catalog} */}
			{children}
		</div>
	);
}
