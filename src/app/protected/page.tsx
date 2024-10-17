// app/protected/page.tsx
import { redirect } from 'next/navigation';
import LogoutButton from './_logoutButton';
import { cookies } from 'next/headers';
import { logout, verifyToken } from '@/lib/auth';
import { deleteToken } from '@/lib/db';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

export default async function ProtectedPage() {
  const cookieStore = cookies();

	const sessionToken = cookieStore.get('token');
	if(sessionToken === undefined || sessionToken.value === undefined) {
		redirect("/login");
	}

	try {
		await verifyToken(sessionToken.value.replaceAll("\"",""));
	} catch(e: any) {
		console.log("invalid access attempt", e.message);
		deleteToken(sessionToken.value);
		redirect("/login");
	}

	let user = cookieStore.get('email');
	let username = user?.value || 'unknown';

	return (
		<div className='h-screen w-full grid place-items-center'>
			<Card className='max-w-[400px] flex flex-col gap-2'>
				<CardHeader>
					<h1 className='text-xl text-center'>This is a protected page</h1>
				</CardHeader>
				<CardContent>
					<h2 className="text-lg">Welcome, {username}!</h2>
					<p>You are logged in and can view this page.</p>
				</CardContent>
				<CardFooter>
					<LogoutButton />
				</CardFooter>
			</Card>
		</div>
  );
}
