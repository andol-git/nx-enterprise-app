'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

const handleLogin = async () => {
  const res = await fetch('http://localhost:3000/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  console.log('LOGIN RESPONSE:', data);

  if (data.success) {
    router.push('/dashboard');
  }

};

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-6 bg-white rounded-xl shadow-md w-80">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <input className="w-full p-2 border mb-3" placeholder="Email"  onChange={(e) => setEmail(e.target.value)} />
        <input type="password" className="w-full p-2 border mb-3" placeholder="Password"  onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleLogin} className="w-full bg-blue-500 text-white p-2 rounded">
          Login
        </button>
      </div>
    </div>
  );
}