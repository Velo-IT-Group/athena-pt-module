export default function Layout({ catalog, children }: { catalog: React.ReactNode; children: React.ReactNode }) {
	return (
		<>
			{catalog}
			{children}
		</>
	);
}
