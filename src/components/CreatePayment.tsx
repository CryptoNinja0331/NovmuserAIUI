"use client";
import { FaCartPlus } from "react-icons/fa";
import { Button } from "./ui/button";
import { useAuth } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import React from "react";

const CreatePayment = ({
  priceId,
  buttonText,
  disable = false,
  disableButtonText,
}: {
  priceId: string;
  buttonText: string | null;
  disable?: boolean;
  disableButtonText?: string | null;
}) => {
  const [loading, setLoading] = useState(false);

  const { getToken } = useAuth();
  const handleCreatePayment = async () => {
    setLoading(true);

    const userToken = await getToken({ template: "UserToken" });
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/payment/create?price_id=${priceId}`,
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
        setLoading(false);

        window.location.assign(responseData.data.url);
      }
    } catch (e) {
      console.log(e);
      throw new Error("Failed to fetch data");
    }
  };

  const textInButton = React.useMemo(() => {
    if (disable) {
      return disableButtonText ?? "";
    }
    return buttonText;
  }, [disableButtonText, buttonText, disable]);

  return (
    <div>
      <Button
        className="mx-auto flex gap-2 mt-8 uppercase hover:bg-background hover:text-white"
        variant="outline"
        disabled={loading || disable}
        onClick={handleCreatePayment}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            PLEASE WAIT
          </>
        ) : (
          <>
            {!disable && <FaCartPlus />}
            {textInButton}
          </>
        )}
      </Button>
    </div>
  );
};

export default CreatePayment;
