import React from 'react';
import Sidebar from '@/components/Sidebar';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';

type Props = {
	children: React.ReactNode;
};

const PropsalLayout = async ({ children }: Props) => {
	return (
		<ResizablePanelGroup direction='horizontal'>
			<ResizablePanel defaultSize={20}>
				<Sidebar />
			</ResizablePanel>
			<ResizableHandle withHandle />
			<ResizablePanel defaultSize={80}>{children}</ResizablePanel>
		</ResizablePanelGroup>
	);
};

export default PropsalLayout;
