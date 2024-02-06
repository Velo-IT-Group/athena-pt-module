import { ProjectTemplate } from '@/types';
import React from 'react';
import { Checkbox } from './ui/checkbox';

type Props = {
	templates: Array<ProjectTemplate>;
};

const TemplatePicker = ({ templates }: Props) => {
	return (
		<>
			{templates.map((template) => (
				<div className='flex items-center gap-2' key={template.id}>
					<Checkbox />
					{template.name}
				</div>
			))}
		</>
	);
};

export default TemplatePicker;
