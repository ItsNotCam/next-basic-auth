'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
	const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

		if(res.status === 200) {
			router.push('/login');
		}

    const data = await res.json();
    setMessage(data.message || data.error);
  };

	return (<>
		{message && <p className="text-red-500 text-center">{message}</p>}
		<h1>Enter your credentials</h1>
		<form onSubmit={handleSubmit} className="flex flex-col gap-2">
			<Input value={email} type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
			<Input value={password} type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
			<Button type="submit">Register</Button>
		</form>
	</>);
}
