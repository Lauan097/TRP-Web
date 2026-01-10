import type { Metadata } from "next";
import { Rajdhani } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Providers from "./providers";
import Footer from "./components/Footer";
import AuthGuard from "./components/AuthGuard";

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Trindade Penumbra - LGC",
  description: "Site oficial da Máfia Trindade Penumbra - LGC",
  icons: {
    icon: "/logo_trindade.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${rajdhani.variable} font-sans antialiased text-slate-50`}>
        <Providers>
          <AuthGuard>
              <Navbar />
              {children}
              <Footer />
          </AuthGuard>
        </Providers>
      </body>
    </html>
  );
}
