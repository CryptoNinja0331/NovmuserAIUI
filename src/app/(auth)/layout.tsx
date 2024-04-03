import type { Metadata } from "next";
import { Inter } from "next/font/google";
import '../globals.css';
import { ClerkProvider, ClerkLoading, ClerkLoaded } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Your Personal AI Novel Writer",
  description: "Your Personal AI Novel Writer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{
      baseTheme: dark
    }}>
      <html lang="en">
        <body className={inter.className}>
          <div>
            <div>
              <ClerkLoading>
                <div className="text-center text-xl mt-4">
                  Loading...........
                </div>
              </ClerkLoading>
            </div>
            <ClerkLoaded>
              {children}
            </ClerkLoaded>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
