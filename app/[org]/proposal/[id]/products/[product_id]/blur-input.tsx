'use client';
import { Input } from '@/components/ui/input';
import { updateProduct } from '@/lib/functions/update';
import React from 'react';
import { toast } from 'sonner';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	objectId: string;
	objectKey: string;
	overrides?: object;
}

const BlurInput = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, objectId, overrides, objectKey, ...props }, ref) => {
	const handleBlur = async (e: React.FocusEvent<HTMLInputElement, Element>, key: string) => {
		const comparison =
			type === 'number'
				? e.currentTarget && e.currentTarget.valueAsNumber !== props.defaultValue
				: e.currentTarget && e.currentTarget.value !== props.defaultValue;

		if (comparison) {
			const obj = overrides as object;
			console.log(obj);
			const overridingObj = {
				...obj,
				[key]: e.currentTarget.value,
			};

			console.log(overridingObj);
			await updateProduct(
				objectId,
				overrides
					? {
							overrides: overridingObj,
					  }
					: { [key]: e.currentTarget.value }
			);
			toast('Product updated!');
		}
	};

	return (
		<Input
			type={type}
			className={className}
			onBlur={async (e) => {
				console.log(e, objectKey);
				await handleBlur(e, objectKey);
			}}
			{...props}
		/>
	);
});

BlurInput.displayName = 'BlurInput';

export default BlurInput;
