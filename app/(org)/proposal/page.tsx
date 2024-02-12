import React from 'react';
import { ProjectTemplate, ProjectWorkPlan } from '@/types/manage';
import { getTemplates } from '@/lib/data';

const ProposalPage = async () => {
	const templates = await getTemplates();
	// const templateResult = await fetch(`http://localhost:3000/api/templates/`);
	// const res = await fetch(`http://localhost:3000/api/templates/93/workplan`);

	// const workPlan: ProjectWorkPlan = await res.json();
	// const templates: Array<ProjectTemplate> = await templateResult.json();

	return <div className='grid grid-cols-4 gap-6 items-start'></div>;
};

export default ProposalPage;
