import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Get authorization header from request
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  try {
    const { key } = await request.json();
    if (!key) {
      return NextResponse.json(
        { error: 'File key is required' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:5000/mtym-api';
    const apiUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const endpoint = `${apiUrl}/media/get-presigned-url`;

    // Forward auth header to backend
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify({ key }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to generate presigned URL' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}