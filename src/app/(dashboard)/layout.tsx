import Navbar from "@/components/ui/Navbar";
import Sidebar from "@/components/ui/Sidebar";
import '../globals.css';
import { auth, ClerkLoading, ClerkProvider } from "@clerk/nextjs";
import { redirect } from "next/navigation";


export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const { userId } = await auth()

    if (!userId) {
        redirect('/sing-in')
    }

    return (
        <ClerkProvider>
            <html lang="en">
                <body >
                    <div>
                        <div>
                            <ClerkLoading>
                                <div className="text-center text-xl mt-4">
                                    Loading...........
                                </div>
                            </ClerkLoading>
                        </div>
                        <div className="grid grid-cols-[20rem_1fr] grid-rows-[auto_1fr] h-screen">
                            <Navbar />
                            <Sidebar />

                            <main className="bg-gray-50 p-10 pb-16">
                                <div className="p-4">{children}</div>
                            </main>

                        </div>
                    </div>
                </body>
            </html>
        </ClerkProvider>
    );
}






