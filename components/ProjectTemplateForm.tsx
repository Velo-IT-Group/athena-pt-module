import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProjectTemplate } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';

export async function ProjectTemplateForm() {
	const res = await fetch(`http://localhost:3000/api/templates`);
	const templates: Array<ProjectTemplate> = await res.json();

	const items: Array<ProjectTemplate> = [];

	return (
		<Card>
			<CardHeader>
				<CardTitle>Notify me about...</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='flex flex-col items-start'>
					{templates.map((template) => {
						const indexToRemove = items.findIndex((item) => item.id === template.id);
						return (
							<div className='flex items-center gap-2' key={template.id}>
								<Checkbox
									checked={items.some((item) => item.id === template.id)}
									onCheckedChange={(checked) => {
										return checked ? items.push(template) : items.splice(indexToRemove);
									}}
								/>
								{template.name}
							</div>
						);
					})}
				</div>
			</CardContent>
		</Card>
	);
}

export default ProjectTemplateForm;
