'use client';
import { FaCartPlus } from "react-icons/fa";
import { Button } from "./ui/button";
import { useAuth } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useState } from "react";
const CreatePayment = ({ paymentId, buttonText }: { paymentId: any, buttonText: string | null }) => {
    const [loading, setLoading] = useState(false)

    const { getToken } = useAuth();
    const handleCreatePayment = async () => {
        setLoading(true)

        const userToken = await getToken({ template: "UserToken" });
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/payment/create?price_id=${paymentId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${userToken}`,
                    },
                }
            );

            if (response.ok) {
                const responseData = await response.json();
                setLoading(false)

                window.location.assign(responseData.data.url);
            }
        } catch (e) {
            console.log(e);
        }
    }
    return (
        <div onClick={handleCreatePayment}>










            <Button className="mx-auto flex gap-2 mt-8 uppercase hover:bg-background hover:text-white" variant="outline" disabled={loading}>
                {
                    loading ? <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        PLEASE WAIT
                    </> :
                        <>

                            <FaCartPlus />
                            {buttonText}

                        </>
                }

            </Button>








        </div>
    );
};

export default CreatePayment;