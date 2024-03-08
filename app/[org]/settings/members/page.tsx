import React from 'react';
import { getMembers } from '@/lib/functions/read';
import { Button } from '@/components/ui/button';
import OrganizationLayout from '../../organization-layout';
import OrganizationSettingsLayout from '../organization-settings-layout';
import { ArrowTopRightIcon, PlusIcon } from '@radix-ui/react-icons';
import { notFound } from 'next/navigation';
import MembersList from './members-list';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import RoleSelector from './role-selector';

const roles = ['admin', 'member', 'owner'];

const OrganizationSettingsMembersPage = async ({ params }: { params: { org: string } }) => {
	const members = await getMembers();

	if (!members) return notFound();

	return (
		<OrganizationLayout org={params.org}>
			<OrganizationSettingsLayout org={params.org}>
				<p className='text-muted-foreground text-sm'>Manage members access</p>
				<div className='flex items-center gap-4'>
					<h2 className='text-2xl font-semibold'>Members</h2>
					<p className='text-muted-foreground ml-auto'>
						{members.length} {members.length > 1 ? 'members' : 'member'}
					</p>
					<Dialog>
						<DialogTrigger asChild>
							<Button>
								<PlusIcon className='mr-2' /> Add Member
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Change team member role</DialogTitle>
								<DialogDescription>Changing user&apos;s role changes their API token access.</DialogDescription>
							</DialogHeader>
							<div className='flex gap-2 items-center'>
								<Input placeholder='Email address' />
								<RoleSelector role='Member' />
							</div>
							<p>
								Learn more about{' '}
								<Link href='/' className='flex-col text-primary font-light hover:underline'>
									Team Member Roles <ArrowTopRightIcon className='inline-block' />
								</Link>
							</p>
							<DialogFooter className='flex items-center w-full justify-between'>
								<DialogClose asChild>
									<Button variant='secondary' type='button'>
										Cancel
									</Button>
								</DialogClose>
								<DialogClose asChild>
									<Button type='submit'>Confirm</Button>
								</DialogClose>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>

				<MembersList data={members} />
				{/* <MembersList data={members} /> */}

				{/* <Card>
					<CardHeader className='flex-row justify-between items-center'>
						<CardDescription>Invite new members by email address</CardDescription>
						<Button size='sm' variant='secondary' disabled>
							<Link2Icon className='w-4 h-4 mr-2' /> Invite Link
						</Button>
					</CardHeader>
					<CardContent className='bt space-y-4'>
						<div className='grid grid-cols-2 gap-4'>
							<div className='grid w-full items-center gap-1.5'>
								<Label htmlFor='email_address'>Email Address</Label>
								<Input disabled type='email' name='email_address' placeholder='jane@example.com' />
							</div>
							<div className='grid w-full items-center gap-1.5'>
								<Label htmlFor='role'>Role</Label>
								<Select name='role' defaultValue='member' disabled>
									<SelectTrigger tabIndex={3}>
										<SelectValue placeholder='Select a template' />
									</SelectTrigger>

									<SelectContent>
										<SelectGroup>
											{roles?.map((role) => (
												<SelectItem key={role} value={role}>
													{role}
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
							</div>
						</div>

						<Button variant='secondary' size='sm' disabled>
							<PlusCircledIcon className='h-4 w-4 mr-2' /> Add more
						</Button>
					</CardContent>
					<CardFooter className='py-3 justify-between border-t'>
						<p className='text-sm text-muted-foreground'>This feature is available on the Pro plan.</p>
						<Button size='sm'>Upgrade</Button>
					</CardFooter>
				</Card>

				<Tabs defaultValue='members'>
					<TabsList className='grid w-full grid-cols-2'>
						<TabsTrigger value='members'>Team Members</TabsTrigger>
						<TabsTrigger value='pending'>Pending Invitations</TabsTrigger>
					</TabsList>
					<Separator />
					<TabsContent value='members'>
						<Card>
							<CardHeader className='bg-muted/50'>
								<CardDescription>Select all</CardDescription>
							</CardHeader>
							<CardContent className='py-3'>
								<Table>
									<TableBody>
										{members.map((member) => (
											<TableRow key={member.id}>
												<TableCell className='flex items-center gap-4'>
													<Avatar>
														<AvatarFallback>NB</AvatarFallback>
													</Avatar>
													<div>
														<p className='text-sm font-medium'>{member.full_name}</p>
														<p className='text-sm font-medium text-muted-foreground'>nblack@velomethod.com</p>
													</div>
												</TableCell>
												<TableCell className='text-right'>Owner</TableCell>
												<TableCell className='text-right w-8'>
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button variant='ghost' size='icon'>
																<DotsHorizontalIcon className='w-4 h-4' />
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent>
															<DropdownMenuItem>Leave Team</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</CardContent>
						</Card>
					</TabsContent>
					<TabsContent value='pending'>
						<Card>
							<CardHeader>
								<CardTitle>Password</CardTitle>
								<CardDescription>Change your password here. After saving, youll be logged out.</CardDescription>
							</CardHeader>
							<CardContent className='space-y-2'>
								<div className='space-y-1'>
									<Label htmlFor='current'>Current password</Label>
									<Input id='current' type='password' />
								</div>
								<div className='space-y-1'>
									<Label htmlFor='new'>New password</Label>
									<Input id='new' type='password' />
								</div>
							</CardContent>
							<CardFooter>
								<Button>Save password</Button>
							</CardFooter>
						</Card>
					</TabsContent>
				</Tabs> */}
			</OrganizationSettingsLayout>
		</OrganizationLayout>
	);
};

export default OrganizationSettingsMembersPage;
