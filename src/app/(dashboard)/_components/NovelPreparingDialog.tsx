"use client";

import PrepareNovel, {
  TPrepareNovelProps,
  TPreparePage,
} from "@/components/PrepareNovel";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { TNovel } from "@/lib/types/api/novel";
import React from "react";
import NovelInitForm from "./NovelInitForm";
import { TNovelItemPreparingTaskState } from "./NovelItem";

type TNovelPreparingState = {
  isOpen?: boolean;
  preparePage?: TPreparePage;
} & Pick<TNovelItemPreparingTaskState, "last_step_field">;

export type TNovelPreparingDialogHandle = {
  open: (novel?: TNovel, prepareState?: TNovelItemPreparingTaskState) => void;
  close: () => void;
};

export type TNovelPreparingDialogProps = {
  showTrigger?: boolean;
  triggerText?: string;
} & Pick<TPrepareNovelProps, "initialPage">;

const NovelPreparingDialog = React.forwardRef<
  TNovelPreparingDialogHandle,
  TNovelPreparingDialogProps
>(({ showTrigger = true, triggerText, initialPage = "submitPrepare" }, ref) => {
  const [novelPreparingState, setNovelPreparingState] =
    React.useState<TNovelPreparingState>({
      isOpen: false,
      preparePage: initialPage,
    });

  const [novelState, setNovelState] = React.useState<{
    prevNovel?: TNovel | undefined;
    curNovel?: TNovel | undefined;
  }>();

  const openDialog = React.useCallback(
    (novel?: TNovel, prepareState?: TNovelItemPreparingTaskState) => {
      setNovelPreparingState({
        isOpen: true,
        preparePage: prepareState
          ? prepareState.preparingStatus === "pending"
            ? "submitPrepare"
            : "agentProcess"
          : "submitPrepare",
        last_step_field: prepareState?.last_step_field,
      });
      setNovelState({
        prevNovel: novel,
        curNovel: novel,
      });
    },
    []
  );

  const closeDialog = React.useCallback(() => {
    setNovelPreparingState((prev) => ({
      ...prev,
      isOpen: false,
    }));
  }, []);

  React.useImperativeHandle(ref, () => ({
    open: openDialog,
    close: closeDialog,
  }));

  React.useEffect(() => {
    if (!novelPreparingState.isOpen) {
      setTimeout(() => {
        setNovelState((prev) => ({
          ...prev,
          curNovel: undefined,
        }));
      }, 500);
    }
  }, [novelPreparingState.isOpen]);

  const handleDialogOpenChange = React.useCallback((open: boolean) => {
    setNovelPreparingState((prev) => ({
      ...prev,
      isOpen: open,
    }));
  }, []);

  const handleSetNovel = React.useCallback<
    (novel?: TNovel | undefined) => void
  >((novel) => {
    setNovelState((prev) => ({
      ...prev,
      curNovel: novel,
    }));
  }, []);

  console.log("🚀 ~ novelState:", novelState);

  return (
    <div className=" mx-auto text-center relative mt-1">
      <Dialog
        onOpenChange={handleDialogOpenChange}
        open={novelPreparingState.isOpen}
      >
        {showTrigger && (
          <DialogTrigger asChild>
            <Button className="button-gradient-2 z-[49] relative hover:scale-105 hover:opacity-60 text-sm">
              {triggerText}
            </Button>
          </DialogTrigger>
        )}
        <DialogContent className="max-w-[100vw] min-h-[100vh] bg-[#110630] border-css border-gradient-rounded text-white">
          {novelState?.prevNovel || novelState?.curNovel ? (
            // Render preparing page
            <PrepareNovel
              novelId={
                novelState?.curNovel
                  ? novelState.curNovel.id
                  : novelState.prevNovel?.id!
              }
              initialPage={novelPreparingState.preparePage}
            />
          ) : (
            // Render prepare form
            <NovelInitForm setNovel={handleSetNovel} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
});

NovelPreparingDialog.displayName = "NovelPreparingDialog";

export default React.memo(NovelPreparingDialog);
