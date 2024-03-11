'use client';

import * as React from 'react';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function InternalReviewSelector({ members }: { members: Profile[] }) {
	return (
		<Select name='selected_member' required>
			<SelectTrigger>
				<SelectValue placeholder='Choose approver' />
			</SelectTrigger>
			<SelectContent>
				{members.map((member, index) => (
					<SelectItem key={member.id} value={member.id}>
						{member.full_name}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
