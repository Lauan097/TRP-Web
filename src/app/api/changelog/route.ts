import { NextResponse } from 'next/server';

interface GitHubRelease {
  id: number;
  tag_name: string;
  name: string;
  published_at: string;
  updated_at: string;
  body: string;
  html_url: string;
  author: {
    login: string;
    avatar_url: string;
  };
}

export async function GET() {
  try {
    const response = await fetch('https://api.github.com/repos/Evillxz/TRP-Bot/releases', {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      },
      // revalidate every minute to reflect edits faster while being mindful of rate limits
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      console.error('GitHub API Error:', response.status, response.statusText);
      return NextResponse.json([], { status: response.status });
    }

    const data = await response.json();

    const releases = data.map((release: GitHubRelease) => ({
      id: release.id,
      version: release.tag_name,
      title: release.name,
      date: release.published_at,
      updatedAt: release.updated_at || null,
      description: release.body,
      url: release.html_url,
      author: {
        name: release.author.login,
        avatar: release.author.avatar_url
      }
    }));

    return NextResponse.json(releases);
  } catch (error) {
    console.error('Error fetching changelog:', error);
    return NextResponse.json([], { status: 500 });
  }
}
