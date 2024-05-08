import Navbar from "@/components/ui/Navbar";
import '../globals.css';
import style from '../style.module.css';
import { ClerkLoading, ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import Sidebar from "@/components/ui/Sidebar";
import StoreProvider from "./StoreProvider";

export const metadata: Metadata = {
    title: "Your Personal AI Novel Writer",
    description: "Your Personal AI Novel Writer",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {

    return (
        <ClerkProvider>
            <html lang="en">
                <body  >
                    <div className={style.dashboard}>
                        <div>
                            <ClerkLoading>
                                <div className="text-center text-xl mt-4">
                                    Loading...........
                                </div>
                            </ClerkLoading>
                        </div>
                        <div className="grid  grid-cols-[14rem_1fr] grid-rows-[auto_1fr] h-screen">
                            <StoreProvider>
                                <Navbar />
                                <Sidebar />

                                <main className=" p-10 pb-16 z-[49] relative">
                                    <Toaster position="bottom-center" />

                                    {children}


                                </main>
                            </StoreProvider>
                        </div>
                    </div>
                </body>
            </html>
        </ClerkProvider>
    );
}






