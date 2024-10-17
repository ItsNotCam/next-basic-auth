import RegisterForm from './_registerForm';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default async function RegisterPage() {
	const sessionCookie = cookies().get('token');
	if(sessionCookie) {
		const token: string = sessionCookie.value.replaceAll("\"","");
		let validLogin = await verifyToken(token).catch((e: any) => false);
		if(validLogin) {
			redirect("/protected");
		}
	}

  
  return (
    <div className="h-screen w-full grid place-items-center">
			<div className="flex flex-col">
				<Card className='relative overflow-hidden'>
					<CardHeader>
						<CardTitle>Register</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col gap-2">
						<RegisterForm />
					</CardContent>
				</Card>
				<Link className="underline text-center mt-4 hover:text-gray-300" href="/login">
					Login
				</Link>
			</div>
		</div>
	);
}
