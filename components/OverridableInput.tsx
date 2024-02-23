'use client';
import React, { HTMLInputTypeAttribute, useState } from 'react';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

type Props = {
	title: string;
	name: string;
	type: HTMLInputTypeAttribute;
	defaultValue: string | number | undefined;
	overriden: boolean;
};

const OverridableInput = ({ title, defaultValue, type, overriden = false, name }: Props) => {
	const [isChecked, setIsChecked] = useState(overriden);

	return (
		<div className='flex items-center gap-4'>
			<h5 className='min-w-44 max-w-44 text-xs font-medium'>{title}</h5>
			<Input type={type} defaultValue={defaultValue} name={name} disabled={!isChecked && !overriden} readOnly={!isChecked && !overriden} />
			<div className='flex items-center space-x-2'>
				<Label htmlFor='airplane-mode' className='font-medium text-xs'>
					Override
				</Label>
				<Switch id='airplane-mode' name='airplane-mode' onCheckedChange={setIsChecked} checked={isChecked} />
			</div>
		</div>
	);
};

export default OverridableInput;
