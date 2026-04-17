import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (email === 'test@test.com' && password === '123456') {
    const response = NextResponse.json({ success: true });
    response.cookies.set('token', 'your-jwt-or-session-id', {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
    });
    return response;
  }

  return NextResponse.json({ success: false });
}
