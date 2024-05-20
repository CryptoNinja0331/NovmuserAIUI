import '../globals.css';
import style from '../style.module.css';
import { ClerkLoading, ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import Sidebar from "@/components/ui/Sidebar";
import StoreProvider from "./StoreProvider";
import Navbar from '@/components/ui/Navbar';
import { dark } from '@clerk/themes';
import { Toaster } from "@/components/ui/sonner";
export const metadata: Metadata = {
    title: "Your Personal AI Novel Writer",
    description: "Your Personal AI Novel Writer",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {

    return (
        <ClerkProvider appearance={{
            baseTheme: dark
        }}>
            <html lang="en">
                <body className='bg-[#0F0F1A] gradient-bg'>
                    <div >
                        <div>
                            <ClerkLoading>
                                <div className="text-center text-xl mt-4">
                                    Loading...........
                                </div>
                            </ClerkLoading>
                        </div>
                        <div className={`h-screen w-full ${style.dashboard}`} >

                            <StoreProvider>

                                <div className='flex h-full'>
                                    <Sidebar />
                                    <main className="flex-1  z-[49] relative">
                                        <Navbar />
                                        {children}
                                    </main>
                                    <Toaster
                                    />
                                </div>
                            </StoreProvider>
                        </div>
                    </div>
                </body>
            </html>
        </ClerkProvider>
    );
}






