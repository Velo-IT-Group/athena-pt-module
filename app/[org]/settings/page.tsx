import React from 'react';
import SubmitButton from '@/components/SubmitButton';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getOrganization, getTemplates } from '@/lib/functions/read';
import { getCurrencyString, parseAmount } from '@/utils/money';
import { updateOrganization } from '@/lib/functions/update';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import OrganizationLayout from '../organization-layout';
import OrganizationSettingsLayout from './organization-settings-layout';
import Image from 'next/image';

type Props = {
	params: { org: string };
	searchParams: { [key: string]: string | string[] | undefined };
};

const OrganizationSettingsPage = async ({ params }: Props) => {
	const organization = await getOrganization();
	const templates = await getTemplates();

	if (!organization) return <div></div>;

	return (
		<OrganizationLayout org={params.org}>
			<OrganizationSettingsLayout org={params.org}>
				<Card>
					<form
						action={async (data: FormData) => {
							'use server';
							await updateOrganization(organization.id, { name: data.get('name') as string });
						}}
					>
						<CardHeader>
							<CardTitle>Organization Name</CardTitle>
							<CardDescription>
								This is your team&apos;s visible name within Vercel. For example, the name of your company or department.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Input required name='name' defaultValue={organization.name} />
						</CardContent>
						<CardFooter className='bg-muted/50 py-3'>
							<p className='text-sm text-muted-foreground'>Please use 32 characters at maximum.</p>
							<SubmitButton className='ml-auto'>Save</SubmitButton>
						</CardFooter>
					</form>
				</Card>

				<Card>
					<form
						action={async (data: FormData) => {
							'use server';
							await updateOrganization(organization.id, { name: data.get('name') as string });
						}}
					>
						<CardHeader>
							<CardTitle>Organization URL</CardTitle>
							<CardDescription>
								This is your organization&apos;s URL namespace on Velo. Within it, your organization can inspect their proposals, check out any recent
								activity, or configure settings to their liking.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='flex items-center'>
								<p className='border-l border-t border-b rounded-l-lg rounded-s-lg grid items-center px-3 my-auto text-sm text-muted-foreground bg-muted/50 h-9'>
									vpt.velomethod.com/
								</p>
								<Input required name='slug' defaultValue={organization.slug ?? ''} className='max-w-xs' />
							</div>
						</CardContent>
						<CardFooter className='bg-muted/50 py-3'>
							<p className='text-sm text-muted-foreground'>Please use 48 characters at maximum.</p>
							<SubmitButton className='ml-auto'>Save</SubmitButton>
						</CardFooter>
					</form>
				</Card>

				<Card>
					<form
						action={async (data: FormData) => {
							'use server';
							await updateOrganization(organization.id, { name: data.get('name') as string });
						}}
					>
						<CardHeader className='flex-row justify-between'>
							<div className='space-y-1.5'>
								<CardTitle>Team Avatar</CardTitle>
								<CardDescription>
									This is your team&apos;s avatar.
									<br />
									Click on the avatar to upload a custom one from your files.
								</CardDescription>
							</div>
							<Image src='/avatar.svg' alt='' width={75} height={75} className='rounded-full' />
						</CardHeader>

						<CardFooter className='bg-muted/50 py-3'>
							<p className='text-sm text-muted-foreground'>Please use 48 characters at maximum.</p>
						</CardFooter>
					</form>
				</Card>

				<Card>
					<form
						action={async (data: FormData) => {
							'use server';
							const default_template = parseInt(data.get('default_template') as string);
							const labor_rate = parseAmount(data.get('labor_rate') as string);
							console.log(default_template, labor_rate);
							// @ts-ignore
							await updateOrganization(organization.id, { labor_rate, default_template });
						}}
					>
						<CardHeader>
							<CardTitle>Proposal Defaults</CardTitle>
							<CardDescription>These are the default settings used when creating new proposals.</CardDescription>
						</CardHeader>
						<CardContent className='grid grid-cols-2 gap-4'>
							<div className='grid w-full items-center gap-1.5'>
								<Label htmlFor='labor_rate'>Labor Rate</Label>
								<Input name='labor_rate' defaultValue={getCurrencyString(organization.labor_rate)} />
							</div>
							<div className='grid w-full items-center gap-1.5'>
								<Label htmlFor='default_template'>Project Template</Label>
								{/* @ts-ignore */}
								<Select name='default_template' defaultValue={organization.default_template ? String(organization.default_template) : undefined}>
									<SelectTrigger tabIndex={3}>
										<SelectValue placeholder='Select a template' />
									</SelectTrigger>

									<SelectContent>
										<SelectGroup>
											{templates?.map((template) => (
												// @ts-ignore
												<SelectItem key={template.id} value={String(template.id)}>
													{template.name}
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
							</div>
						</CardContent>
						<CardFooter className='bg-muted/50 py-3'>
							<SubmitButton className='ml-auto'>Save</SubmitButton>
						</CardFooter>
					</form>
				</Card>

				<Card>
					<form
						action={async (data: FormData) => {
							'use server';
							const default_template = parseInt(data.get('default_template') as string);
							const labor_rate = parseAmount(data.get('labor_rate') as string);
							console.log(default_template, labor_rate);
							// @ts-ignore
							await updateOrganization(organization.id, { labor_rate, default_template });
						}}
					>
						<CardHeader>
							<CardTitle>Pricing Tiers</CardTitle>
							<CardDescription>These are the default settings used when creating new proposals.</CardDescription>
						</CardHeader>
						<CardContent className='grid grid-cols-2 gap-4'>
							<div className='grid w-full items-center gap-1.5'>
								<Label htmlFor='labor_rate'>Default Price</Label>
								<Input name='labor_rate' defaultValue={getCurrencyString(organization.labor_rate)} />
							</div>
							<div className='grid w-full items-center gap-1.5'>
								<Label htmlFor='default_template'>Project Template</Label>
							</div>
						</CardContent>
						<CardFooter className='bg-muted/50 py-3'>
							<SubmitButton className='ml-auto'>Save</SubmitButton>
						</CardFooter>
					</form>
				</Card>
			</OrganizationSettingsLayout>
		</OrganizationLayout>
	);
};

export default OrganizationSettingsPage;
