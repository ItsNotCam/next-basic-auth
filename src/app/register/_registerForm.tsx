'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

enum Status {
	FAILED, SUCCESS
}

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState({
		message: undefined,
		status: Status.SUCCESS
	});
	const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

		setLoading(true);
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
		
    const data = await res.json();
		setStatus({
			message: data.message || data.error,
			status: res.ok ? Status.SUCCESS : Status.FAILED
		})

		setLoading(false);
  };

	return (<>
		{loading ? (
			<div className='absolute inset-0 h-full w-full z-10 bg-black/80 grid place-items-center'>
				Registering ... 
			</div>
		) : ""}
		{status.message && (
			<p className={`${status.status === Status.FAILED ? "text-red-500" : "text-green-500"} text-center`}>
				{status.message}
			</p>
		)}
		<h1>Enter your credentials</h1>
		<form onSubmit={handleSubmit} className="flex flex-col gap-2">
			<Input value={email} type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
			<Input value={password} type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
			<Button type="submit">Register</Button>
		</form>
	</>);
}
