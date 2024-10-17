'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

enum Status {
	FAILED, SUCCESS
}

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState({
		message: undefined,
		status: Status.SUCCESS
	});
	const [loading, setLoading] = useState(false);
	const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

		setLoading(true);
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
		
    const data = await res.json();
		setStatus({
			message: data.message || data.error,
			status: res.ok ? Status.SUCCESS : Status.FAILED
		})

		if(res.ok) {
			router.push("/protected");
		}

		setLoading(false);
  };

  return (<>
		{loading ? (
			<div className='absolute inset-0 h-full w-full z-10 bg-black/80 grid place-items-center'>
				Logging in ... 
			</div>
		) : ""}
		{status.message && (
			<p className={`${status.status === Status.FAILED ? "text-red-500" : "text-green-500"} text-center`}>
				{status.message}
			</p>
		)}
			<h1>Enter your credentials</h1>
			<form onSubmit={handleSubmit} className="flex flex-col gap-2">
				<Input 
					value={email} 
					type="email" 
					placeholder="Email" 
					id="bae-password"
					name="bae-password"
					autoComplete='bae-password'
					onChange={(e) => setEmail(e.target.value)} 
				/>
				<Input 
					value={password} 
					type="password" 
					placeholder="Password" 
					onChange={(e) => setPassword(e.target.value)} 
				/>
				<Button type="submit">Login</Button>
			</form>
		</>);
}
