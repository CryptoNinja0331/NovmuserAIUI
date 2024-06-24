"use client";

import TopUpDialog, {
  TTopUpDialogHandle,
} from "@/app/(dashboard)/_components/TopUpDialog/TopUpDialog";
import emitter from "@/lib/emitters";
import { useRouter } from "next/navigation";
import React, { FC } from "react";
import Swal from "sweetalert2";

export type TBalanceNotEnoughAlertProps = {
  handleOnTopUp?: () => void;
};

const BalanceNotEnoughAlert: FC<TBalanceNotEnoughAlertProps> = ({
  handleOnTopUp,
}) => {
  const router = useRouter();
  const topUpDialogRef = React.useRef<TTopUpDialogHandle>(null);

  React.useEffect(() => {
    const balanceNotEnoughListener = (msg: string | null | undefined) => {
      console.log("🚀 ~ balanceNotEnoughListener ~ fire swal");
      Swal.fire({
        title: msg ?? "",
        text: "Your account balance is low. Please add more funds to continue using our services.",
        icon: "error",
        showCancelButton: true,
        target: "#balanceNotEnoughContainer",
        confirmButtonText: "Top up",
      }).then((res) => {
        if (res.isConfirmed) {
          handleOnTopUp?.();
          if (topUpDialogRef.current) {
            topUpDialogRef.current.open();
          }
        }
      });
    };

    emitter.on("402-error", balanceNotEnoughListener);

    return () => {
      emitter.off("402-error", balanceNotEnoughListener);
    };
  }, [router, handleOnTopUp]);

  return (
    <div id="balanceNotEnoughContainer" className="fixed">
      <TopUpDialog ref={topUpDialogRef} showTrigger={false} />
    </div>
  );
};

export default React.memo(BalanceNotEnoughAlert);
