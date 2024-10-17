import { cookies } from 'next/headers';
import LoginForm from './_loginForm';
import { verifyToken } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RegisterForm from '../register/_registerForm';
import Link from 'next/link';

export default async function LoginPage() {
	const sessionCookie = cookies().get('token');
	if(sessionCookie) {
		const token: string = sessionCookie.value.replaceAll("\"","");
		let validLogin: boolean = await verifyToken(token).catch(() => false);
		if(validLogin) {
			redirect("/protected");
		}
	}
  
  return (
    <div className="h-screen w-full grid place-items-center">
			<div className="flex flex-col">
				<Card className='relative overflow-hidden'>
					<CardHeader>
						<CardTitle>Login</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col gap-2">
						<LoginForm />
					</CardContent>
				</Card>
				<Link className="underline text-center mt-4 hover:text-gray-300" href="/register">
					Register
				</Link>
			</div>
		</div>
	);
}
