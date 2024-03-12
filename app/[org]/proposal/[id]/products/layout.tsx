export default function Layout({ catalog, children }: { catalog: React.ReactNode; children: React.ReactNode }) {
	return (
		<div className='h-full flex-1 flex flex-col'>
			{catalog}
			{children}
		</div>
	);
}
