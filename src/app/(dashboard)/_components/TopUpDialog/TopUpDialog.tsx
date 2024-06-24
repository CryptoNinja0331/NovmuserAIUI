"use client";

import CreatePayment from "@/components/CreatePayment";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import UserCredits from "@/components/userInfo/UserCredits";
import { getPrices } from "@/lib/apiCall/server/getPrices";
import { TPriceInfo } from "@/lib/types/api/payment";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const TopUpDialogInternal = () => {
  const { data: prices, isLoading } = useQuery<TPriceInfo[]>({
    queryKey: ["prices"],
    queryFn: async () => {
      const allPrices = await getPrices();

      return (
        allPrices.data
          ?.filter((item: TPriceInfo) => item.type !== "recurring")
          .sort(
            (item1, item2) => Number(item1.amount) - Number(item2.amount)
          ) ?? []
      );
    },
    // Cache 1 day
    staleTime: 1_000 * 60 * 60 * 24,
  });

  if (isLoading || !prices) {
    return null;
  }

  return (
    <div className="pt-[5rem]">
      <h1 className="heading-color mb-6 text-center !text-2xl tracking-wider">
        Top Up your account
      </h1>
      <div>
        <div className="flex flew-row text-xl font-medium justify-center">
          <h1 className="flex flex-row heading-color !text-xl gap-1">
            <span>Balance :</span>
            <UserCredits showIcon={false} />
          </h1>
        </div>
      </div>
      <div className="bg-[#010313] w-[70%] mx-auto p-6 rounded-md my-3">
        <div className="grid grid-cols-3 gap-8">
          {prices!.map((item: TPriceInfo) => (
            <div
              key={item.id}
              className="bg-[#160929] flex justify-center text-white py-8 px-6 rounded-sm"
            >
              <div className="flex flex-col justify-center items-center">
                <p className="my-4 text-3xl font-bold">
                  {item.credit_amount} <span className="text-sm">Credits</span>
                </p>
                <p className="flex flex-row items-center justify-center gap-2 text-center text-lg font-medium">
                  {`${item.currency?.toUpperCase()} $ ${item.amount}`}
                </p>
                <CreatePayment buttonText={"Top Up"} priceId={item.id} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MemorizedTopUpDialogInternal = React.memo(TopUpDialogInternal);

export type TTopUpDialogHandle = {
  open: () => void;
  close: () => void;
};

export type TTopDialogProps = {
  showTrigger?: boolean;
};

const TopUpDialog = React.forwardRef<TTopUpDialogHandle, TTopDialogProps>(
  ({ showTrigger = true }, ref) => {
    const [isOpen, setIsOpen] = React.useState<boolean>(false);

    const openDialog = React.useCallback(() => {
      setIsOpen(true);
    }, []);

    const closeDialog = React.useCallback(() => {
      setIsOpen(false);
    }, []);

    React.useImperativeHandle(ref, () => ({
      open: openDialog,
      close: closeDialog,
    }));

    return (
      <div
        style={{ marginTop: "2rem" }}
        className="mx-auto text-center relative"
      >
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          {showTrigger && (
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="mx-auto bg-bluish flex gap-2 mt-1 hover:bg-background hover:text-white"
              >
                Top Up
              </Button>
            </DialogTrigger>
          )}
          <DialogContent className="max-w-[100vw] min-h-[100vh] bg-[#110630] border-css border-gradient-rounded text-white">
            <MemorizedTopUpDialogInternal />
          </DialogContent>
        </Dialog>
      </div>
    );
  }
);

TopUpDialog.displayName = "TopUpDialog";

export default TopUpDialog;
