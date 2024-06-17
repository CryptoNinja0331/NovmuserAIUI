"use client";
import { FaCartPlus } from "react-icons/fa";
import { Button } from "./ui/button";
import { useAuth } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import React from "react";
import useClientHttp from "@/hooks/useClientHttp";
import { TResponseDto } from "@/lib/http";

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
  const { post } = useClientHttp();
  const [loading, setLoading] = useState(false);

  const { getToken } = useAuth();
  const handleCreatePayment = async () => {
    setLoading(true);

    const userToken = await getToken({ template: "UserToken" });
    try {
      const response = await post<TResponseDto<any>>({
        url: `/payment/create?price_id=${priceId}`,
        token: userToken,
        config: {
          headers: {
            "Content-Type": "application/json",
          },
        },
      });
      if (response.success) {
        setLoading(false);
        window.location.assign(response.data.url);
      }
    } catch (e) {
      console.log("🚀 ~ handleCreatePayment ~ e:", e);
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
