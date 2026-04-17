'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [data, setData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login'); // 🔐 protect route
      return;
    }

    fetch('http://localhost:3000/api/protected', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Dashboard</h2>

      <pre>{JSON.stringify(data, null, 2)}</pre>

      <button
        onClick={() => {
          document.cookie = 'token=; Max-Age=0; path=/';
          window.location.href = '/login'; 
        }}
      >
        Logout
      </button>
    </div>
  );
}