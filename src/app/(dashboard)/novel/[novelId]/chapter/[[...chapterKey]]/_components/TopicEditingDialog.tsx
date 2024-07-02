"use client";

import { FC } from "react";

import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import BalanceNotEnoughAlert from "@/components/alert/BalanceNotEnoughAlert";
import { Button } from "@/components/ui/button";
import { TChapterInfo } from "@/lib/types/api/chapter";
import TopicEditingTree, { TTopicEditingTreeHandle } from "./TopicEditingTree";
import React from "react";
import { Loader2 } from "lucide-react";
import { FaSave } from "react-icons/fa";

export type TTopicEditingDialogProps = {
  chapterInfo: TChapterInfo;
};

export type TTopicEditingDialogHandle = {
  openDialog: () => void;
  closeDialog: () => void;
};

const TopicEditingDialog = React.forwardRef<
  TTopicEditingDialogHandle,
  TTopicEditingDialogProps
>(({ chapterInfo }, ref) => {
  // submitLoader

  const [open, setOpen] = React.useState<boolean>(false);
  const [submitted, setSubmitted] = React.useState<boolean>(false);
  const topicEditingTreeRef = React.useRef<TTopicEditingTreeHandle>(null);

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
      setSubmitted(true);
      setTimeout(() => {
        topicEditingTreeRef.current?.submitForm();
        setSubmitted(false);
        setOpen(false);
      }, 500);
    }
  }, []);

  //   const [openTopicsModal, setOpenTopicsModal] = React.useState<boolean>(false);
  //   const onSubmit: SubmitHandler<FormValues> = React.useCallback(
  //     async (data) => {
  //       try {
  //         const token = await getToken({ template: "UserToken" });

  //         if (!data?.topics || data?.topics?.length === 0) {
  //           setErrorMessage("You must have at least one topic to save.");
  //           toast.error("You must have at least one topic to save.");
  //           return;
  //         }

  //         for (let topic of data.topics) {
  //           if (topic.topic_points.length === 0) {
  //             setErrorMessage("Each topic must have at least one topic point.");
  //             toast.error("Each topic must have at least one topic point.");
  //             return;
  //           }
  //         }

  //         setErrorMessage(null);
  //         setSubmitLoader(true);

  //         const response = await fetch(
  //           `${process.env.NEXT_PUBLIC_SERVER_URL}/chapter/edit/${chapterKey}/topics`,
  //           {
  //             method: "PUT",
  //             headers: {
  //               "Content-Type": "application/json",
  //               Authorization: `Bearer ${token}`,
  //             },
  //             body: JSON.stringify(data),
  //           }
  //         );

  //         if (response.ok) {
  //           const responseData = await response.json();
  //           setSubmitLoader(false);
  //           console.log(responseData.data);
  //           toast.success("Changes saved successfully.");
  //         } else {
  //           throw new Error("Failed to save changes");
  //         }
  //       } catch (error) {
  //         console.error("Error:", error);
  //         setSubmitLoader(false);
  //         toast.error("An error occurred while saving changes.");
  //       }
  //     },
  //     []
  //   );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {!chapterInfo?.details && (
          <Button className="bg-bluish text-center flex gap-2 mx-auto mt-3 hover:bg-background hover:text-white">
            Initialize Topics
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-[85vw] bg-[#150F2D] text-white">
        <SimpleBar style={{ maxHeight: "80vh" }}>
          {/* <form
            id="topic-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 w-1/2 relative p-[2.5rem]"
          >
            {chapterTopics ? (
              chapterTopics.map((topic, topicIndex) => (
                <div key={topicIndex}>
                  <div className="bg-[#0C0C0D] border relative border-input rounded-md p-4">
                    <IoAddCircle className="text-white text-2xl absolute top-[50%] left-[-30px]" />
                    <div className="mb-4 flex items-center justify-between">
                      <h1>Topic:</h1>
                      <Controller
                        name={`topics.${topicIndex}.name`}
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            className="bg-[#150F2D] p-2 focus:outline-0 rounded-sm text-white w-full"
                          />
                        )}
                      />
                      <RxCross2
                        className="cursor-pointer"
                        onClick={() => handleDeleteTopic(topicIndex)}
                      />
                    </div>
                    <h1 className="mb-2">Abstract</h1>
                    <div className="bg-[#150F2D] rounded-md p-3">
                      <Controller
                        name={`topics.${topicIndex}.abstract`}
                        control={control}
                        render={({ field }) => (
                          <textarea
                            {...field}
                            className="bg-[#150F2D] p-2 rounded-sm text-white w-full"
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    {topic.topic_points.map((point, pointIndex) => (
                      <div key={pointIndex} className="flex justify-end">
                        <div className="bg-[#0C0C0D] w-[70%] point border relative topics-point border-input rounded-md p-4">
                          <IoAddCircle className="text-white text-2xl absolute top-[50%] left-[-30px]" />
                          <div className="mb-4 flex items-start justify-between">
                            <h1>Topic point:</h1>
                            <RxCross2
                              className="cursor-pointer"
                              onClick={() =>
                                handleDeleteTopicPoint(topicIndex, pointIndex)
                              }
                            />
                          </div>
                          <div className="bg-[#150F2D] rounded-md p-3">
                            <Controller
                              name={`topics.${topicIndex}.topic_points.${pointIndex}.point_content`}
                              control={control}
                              render={({ field }) => (
                                <input
                                  {...field}
                                  className="bg-[#150F2D] p-2 rounded-sm text-white w-full"
                                />
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div>
                <div className="bg-[#0C0C0D] relative border topics border-input rounded-md p-4">
                  <IoAddCircle className="text-white text-2xl absolute top-[50%] left-[-30px]" />
                  <div className="mb-4 flex items-start justify-between">
                    <h1>Topics: this is a topic</h1>
                  </div>
                  <h1 className="mb-2">Abstract</h1>
                  <div className="bg-[#150F2D] rounded-md p-3">
                    <h1>This is an abstract</h1>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <div className="bg-[#0C0C0D] w-[70%] point border relative topics-point border-input rounded-md p-4">
                    <IoAddCircle className="text-white text-2xl absolute top-[50%] left-[-30px]" />
                    <div className="mb-4 flex items-start justify-between">
                      <h1>Topic point:</h1>
                    </div>
                    <div className="bg-[#150F2D] rounded-md p-3">
                      <h1>This is the content of the topic point</h1>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </form> */}
          <TopicEditingTree
            ref={topicEditingTreeRef}
            chapterInfo={chapterInfo}
          />
        </SimpleBar>
        <div className="">
          <div className="flex items-center justify-end gap-4">
            <Button
              form="topic-form"
              type="submit"
              className="flex gap-1 items-center hover:bg-background hover:text-white"
              variant="outline"
              disabled={submitted}
              onClick={handleSubmit}
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
            {/* <Button
              onClick={handleAiGeneration}
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
            </Button> */}
          </div>
        </div>
        <BalanceNotEnoughAlert />
      </DialogContent>
    </Dialog>
  );
});

TopicEditingDialog.displayName = "TopicEditingDialog";

export default React.memo(TopicEditingDialog);
