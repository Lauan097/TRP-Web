import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import type { NextAuthOptions, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import { API_BASE_URL } from "@/utils/constants";

interface DiscordProfile {
  id: string;
  username?: string;
  avatar?: string | null;
}

type TokenWithExtras = JWT & {
  accessToken?: string;
  username?: string;
  picture?: string;
  discordId?: string;
  isAdmin?: boolean;
  isMember?: boolean;
  isSpecial?: boolean;
};

async function checkRecruitmentStatus(userId: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/site/recruitment/status?user_id=${userId}`, {
      headers: {
        'X-API-Key': process.env.NEXT_PUBLIC_API_KEY || '',
      }
    });
    
    if (!res.ok) return { isMember: false, isSpecial: false };
    
    const data = await res.json();
    return {
      isMember: data.userStatus?.status === 'APPROVED_PRACTICAL',
      isSpecial: !!data.isSpecial
    };
  } catch (error) {
    console.error("Error checking recruitment status:", error);
    return { isMember: false, isSpecial: false };
  }
}

async function checkAdminStatus(accessToken: string) {
  try {
    const response = await fetch("https://discord.com/api/users/@me/guilds", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      console.error("Failed to fetch guilds:", response.status, response.statusText);
      return false;
    }
    const guilds = await response.json();
    const targetGuild = guilds.find((g: { id: string; permissions: string }) => g.id === "1295702106195492894");
    if (!targetGuild) {
      console.log("Target guild not found for user");
      return false;
    }
    
    const permissions = BigInt(targetGuild.permissions);
    const admin = BigInt(0x8);
    const isAdmin = (permissions & admin) === admin;
    console.log(`User admin status for guild 1295702106195492894: ${isAdmin}`);
    return isAdmin;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
      authorization: { params: { scope: 'identify email guilds guilds.join' } },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, profile, trigger }) {
      const t = token as TokenWithExtras;
      
      if (account && profile) {
        const discordProfile = profile as DiscordProfile;
        t.discordId = discordProfile.id;
        t.username = discordProfile.username;
        if (discordProfile.avatar) {
          t.picture = `https://cdn.discordapp.com/avatars/${discordProfile.id}/${discordProfile.avatar}.png`;
        }
        
        if (account.access_token) {
          t.accessToken = account.access_token;
          t.isAdmin = await checkAdminStatus(t.accessToken);
        }
      }
      
      if (trigger === "update" || (account && profile)) {
        if (t.discordId) {
          const status = await checkRecruitmentStatus(t.discordId);
          t.isMember = status.isMember;
          t.isSpecial = status.isSpecial;
        }
      }
      
      return t;
    },
    async session({ session, token }) {
      const t = token as TokenWithExtras;
      const user: Partial<Session["user"]> & { id?: string } = session.user ? { ...session.user } : {};
      user.id = t.discordId;
      user.name = t.username || user.name;
      user.image = t.picture || user.image;
      
      const s = { 
        ...session, 
        user 
      } as Session & { 
        accessToken?: string; 
        isAdmin?: boolean; 
        isMember?: boolean;
        isSpecial?: boolean;
        user: Session["user"] & { id?: string } 
      };
      
      s.accessToken = t.accessToken;
      s.isAdmin = t.isAdmin;
      s.isMember = t.isMember;
      s.isSpecial = t.isSpecial;
      
      return s;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
