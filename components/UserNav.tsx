'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type User } from '@supabase/supabase-js';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { updateUserMetadata } from '@/lib/functions/update';
import SubmitButton from './SubmitButton';
import { handleSignOut } from '@/app/[org]/actions';
import { useRouter } from 'next/navigation';

const UserNav = ({ user, className, url }: { user: User; className?: string; url?: string }) => {
	const { push } = useRouter();
	let nameSplit = (user.user_metadata.full_name as string).split(' ');

	return (
		<Dialog>
			<DropdownMenu>
				<DropdownMenuTrigger
					className={className}
					asChild
				>
					<Button
						variant='ghost'
						className='relative h-8 w-8 rounded-full'
					>
						<Avatar className='h-8 w-8'>
							<AvatarImage
								src={url}
								alt='@shadcn'
							/>
							<AvatarFallback>
								{nameSplit && nameSplit.length && nameSplit[0][0]}
								{nameSplit && nameSplit.length > 1 && nameSplit[1][0]}
							</AvatarFallback>
						</Avatar>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					className='w-56'
					align='end'
				>
					<DropdownMenuLabel className='font-normal'>
						<div className='flex flex-col space-y-1'>
							<p className='text-sm font-medium leading-none'>
								{user.user_metadata?.first_name} {user.user_metadata?.last_name}
							</p>
							<p className='text-xs leading-none text-muted-foreground'>{user.email}</p>
						</div>
					</DropdownMenuLabel>

					<DropdownMenuSeparator />

					{/* <DropdownMenuGroup>
						<DialogTrigger asChild>
							<DropdownMenuItem>Profile</DropdownMenuItem>
						</DialogTrigger>
					</DropdownMenuGroup> */}

					{/* <DropdownMenuSeparator /> */}

					<DropdownMenuItem
						onClick={async () => {
							await handleSignOut();
							push('/login');
						}}
					>
						Log out
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<DialogContent>
				<form
					className='grid gap-4'
					action={async (data: FormData) => {
						try {
							await updateUserMetadata(data, user.user_metadata);

							toast('Successfully updated profile!');
						} catch (error) {
							toast('Error updating profile!', { description: error as string });
						}
					}}
				>
					<DialogHeader>
						<DialogTitle>Profile</DialogTitle>
						<DialogDescription>View / Update your profile below.</DialogDescription>
					</DialogHeader>

					<div className='grid gap-2'>
						<Label htmlFor='first_name'>First Name</Label>
						<Input
							name='first_name'
							defaultValue={user.user_metadata.first_name}
							placeholder='Jim'
							required
						/>
					</div>

					<div className='grid gap-2'>
						<Label htmlFor='last_name'>Last Name</Label>
						<Input
							name='last_name'
							defaultValue={user.user_metadata.last_name}
							placeholder='Bob'
							required
						/>
					</div>

					<DialogFooter>
						<DialogClose asChild>
							<Button variant='secondary'>Close</Button>
						</DialogClose>

						<SubmitButton>Save</SubmitButton>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default UserNav;
