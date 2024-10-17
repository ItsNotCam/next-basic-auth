'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const LogoutButton: React.FC = () => {
	const router = useRouter();

	const handleLogout = async() => {
		await fetch("/api/logout", { method: "POST" });
		router.push("/login");
	};

	return (
		<Button onClick={handleLogout}>
			Logout
		</Button>
	);
};

export default LogoutButton;