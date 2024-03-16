import {
	ArrowDownIcon,
	ArrowRightIcon,
	ArrowUpIcon,
	CheckCircledIcon,
	CircleIcon,
	CrossCircledIcon,
	QuestionMarkCircledIcon,
	StopwatchIcon,
} from '@radix-ui/react-icons';

export const labels = [
	{
		value: 'bug',
		label: 'Bug',
	},
	{
		value: 'feature',
		label: 'Feature',
	},
	{
		value: 'documentation',
		label: 'Documentation',
	},
];

export const categories = [
	{
		value: 'HS (Haas)',
		label: 'HS (Haas)',
		icon: QuestionMarkCircledIcon,
	},
	{
		value: 'HW (Hardware)',
		label: 'HW (Hardware)',
		icon: CircleIcon,
	},
	{
		value: 'MS (Managed Services)',
		label: 'MS (Managed Services)',
		icon: StopwatchIcon,
	},
	{
		value: 'SR (Service)',
		label: 'SR (Service)',
		icon: CheckCircledIcon,
	},
	{
		value: 'SW (Software)',
		label: 'SW (Software)',
		icon: CrossCircledIcon,
	},
];

export const statuses = [
	{
		value: 'building',
		label: 'Building',
		icon: CircleIcon,
	},
	{
		value: 'inProgress',
		label: 'In Progress',
		icon: StopwatchIcon,
	},
	{
		value: 'signed',
		label: 'Signed',
		icon: CheckCircledIcon,
	},
	{
		value: 'canceled',
		label: 'Canceled',
		icon: CrossCircledIcon,
	},
];

export const priorities = [
	{
		label: 'Low',
		value: 'low',
		icon: ArrowDownIcon,
	},
	{
		label: 'Medium',
		value: 'medium',
		icon: ArrowRightIcon,
	},
	{
		label: 'High',
		value: 'high',
		icon: ArrowUpIcon,
	},
];
