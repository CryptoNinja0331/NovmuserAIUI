import { SignUp } from "@clerk/nextjs";

export default function Page() {
    return (
        <div className="flex justify-center items-center h-screen bg-[#0F0F1A] gradient-bg">
            <SignUp appearance={{
                elements: {
                    formButtonPrimary:
                        "button-gradient text-sm normal-case",
                },
            }} />;
        </div>
    )
}