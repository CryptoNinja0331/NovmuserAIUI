import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import '../globals.css';
import { ClerkProvider, ClerkLoading, ClerkLoaded } from '@clerk/nextjs';
import { Toaster } from "@/components/ui/sonner";
const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ['latin']
});
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
    <ClerkProvider >
      <html lang="en">
        <body className={poppins.className}>
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
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
