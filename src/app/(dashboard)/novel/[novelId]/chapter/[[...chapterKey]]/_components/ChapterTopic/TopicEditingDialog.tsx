"use client";

import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import BalanceNotEnoughAlert from "@/components/alert/BalanceNotEnoughAlert";
import { Button } from "@/components/ui/button";
import useClientHttp from "@/hooks/useClientHttp";
import useClientToken from "@/hooks/useClientToken";
import { TResponseDto } from "@/lib/http";
import { TChapterInfo, TChapterTopics } from "@/lib/types/api/chapter";
import { Loader2 } from "lucide-react";
import React, { MouseEventHandler } from "react";
import { FaRobot, FaSave } from "react-icons/fa";
import TopicEditingTree, {
  TOPIC_EDITING_TREE_ID,
  TTopicEditingTreeHandle,
} from "./TopicEditingTree";
import { showErrorAlert } from "@/lib/alerts";

export type TTopicEditingDialogProps = {
  novelId: string;
  chapterInfo: TChapterInfo;
};

export type TTopicEditingDialogHandle = {
  openDialog: () => void;
  closeDialog: () => void;
};

type TSubmitButtonProps = {
  timeout?: number | undefined;
  onClick: MouseEventHandler | undefined;
};
const SubmitButton = ({ timeout, onClick }: TSubmitButtonProps) => {
  const [submitted, setSubmitted] = React.useState<boolean>(false);

  const handleClick = React.useCallback<MouseEventHandler<any>>(
    (e) => {
      e.preventDefault();
      setSubmitted(true);
      setTimeout(() => {
        onClick?.(e);
        setSubmitted(false);
      }, timeout);
    },
    [onClick, timeout]
  );

  return (
    <Button
      form="topic-form"
      type="submit"
      className="flex gap-1 items-center hover:bg-background hover:text-white"
      variant="outline"
      disabled={submitted}
      onClick={handleClick}
    >
      {submitted ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          PLEASE WAIT
        </>
      ) : (
        <>
          <FaSave />
          Save Changes
        </>
      )}
    </Button>
  );
};

type TTopicAiGenerationButtonProps = {
  timeout?: number | undefined;
  onClickGeneration: () => Promise<void>;
};
const TopicAiGenerationButton = ({
  timeout,
  onClickGeneration,
}: TTopicAiGenerationButtonProps) => {
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleClick = React.useCallback<MouseEventHandler<any>>(
    (e) => {
      e.preventDefault();
      setLoading(true);
      setTimeout(async () => {
        try {
          await onClickGeneration?.();
        } catch (e) {
          console.error("🚀 ~ handleAiGeneration ~ e:", e);
          showErrorAlert({
            title: "Failed to generate topics from AI",
            text: "Please try again.",
            target: `#${TOPIC_EDITING_TREE_ID}`,
          });
        } finally {
          setLoading(false);
        }
      }, timeout);
    },
    [onClickGeneration, timeout]
  );

  return (
    <Button
      onClick={handleClick}
      className="button-gradient-2 z-[49] flex gap-1 items-center"
      disabled={loading}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          PLEASE WAIT
        </>
      ) : (
        <>
          <FaRobot className="text-xl" />
          Try AI generation
        </>
      )}
    </Button>
  );
};

const TopicEditingDialog = React.forwardRef<
  TTopicEditingDialogHandle,
  TTopicEditingDialogProps
>(({ novelId, chapterInfo }, ref) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const topicEditingTreeRef = React.useRef<TTopicEditingTreeHandle>(null);

  const { post } = useClientHttp();
  const { getClientToken } = useClientToken();

  React.useImperativeHandle(
    ref,
    () => ({
      openDialog: () => setOpen(true),
      closeDialog: () => setOpen(false),
    }),
    []
  );

  const handleSubmit = React.useCallback(() => {
    if (topicEditingTreeRef.current) {
      topicEditingTreeRef.current?.submitForm();
      setOpen(false);
    }
  }, []);

  const handleAiGeneration = React.useCallback(async () => {
    console.log("handleAiGeneration");
    const resp = await post<TResponseDto<TChapterTopics>>({
      url: `/chapter/topic/${novelId}/${chapterInfo.chapter_key}`,
      token: await getClientToken(),
    });
    const chapterTopicsFromAi: TChapterTopics = resp.data!;
    topicEditingTreeRef.current?.fillChapterTopics(chapterTopicsFromAi);
  }, [chapterInfo.chapter_key, getClientToken, novelId, post]);

  const showTopicsInitialization = React.useMemo<boolean>(() => {
    return !chapterInfo?.details?.chapter_topics;
  }, [chapterInfo?.details?.chapter_topics]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {showTopicsInitialization && (
          <Button className="bg-bluish text-center flex gap-2 mx-auto mt-3 hover:bg-background hover:text-white">
            Initialize Topics
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-[85vw] bg-[#150F2D] text-white">
        <SimpleBar style={{ maxHeight: "80vh" }}>
          <TopicEditingTree
            ref={topicEditingTreeRef}
            chapterInfo={chapterInfo}
          />
        </SimpleBar>
        <div className="flex items-center justify-end gap-4">
          <SubmitButton onClick={handleSubmit} timeout={600} />
          {/* Only support topics ai generation at the initialization step */}
          {showTopicsInitialization && (
            <TopicAiGenerationButton
              onClickGeneration={handleAiGeneration}
              timeout={600}
            />
          )}
        </div>
        <BalanceNotEnoughAlert />
      </DialogContent>
    </Dialog>
  );
});

TopicEditingDialog.displayName = "TopicEditingDialog";

export default React.memo(TopicEditingDialog);
