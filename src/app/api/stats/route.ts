import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const guildId = "1295702106195492894";
    const botToken = process.env.DISCORD_BOT_TOKEN;

    if (!botToken) {
        console.error("DISCORD_BOT_TOKEN not found");
        return NextResponse.json({ memberCount: 0 }, { status: 500 });
    }

    const response = await fetch(`https://discord.com/api/v10/guilds/${guildId}?with_counts=true`, {
      headers: {
        Authorization: `Bot ${botToken}`,
      },
      next: { revalidate: 60 } 
    });

    if (!response.ok) {
      console.error("Failed to fetch guild data", response.status, response.statusText);
      return NextResponse.json({ memberCount: 0 }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json({ memberCount: data.approximate_member_count });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ memberCount: 0 }, { status: 500 });
  }
}
