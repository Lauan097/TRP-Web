import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.DISCLOUD_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'DISCLOUD_API_KEY not configured' }, { status: 500 });
  }

  try {
    const response = await fetch('https://api.discloud.app/v2/app/all/logs', {
      headers: {
        'api-token': apiKey,
      },
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch logs from Discloud' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching logs:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
