"use client";

import { useAuth } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { FaRobot } from "react-icons/fa6";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { useForm, Controller, SubmitHandler } from "react-hook-form";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { RxCross2 } from "react-icons/rx";
import { IoAddCircle } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { FaEdit, FaSave } from "react-icons/fa";
import { toast } from "sonner";
import { TChapterInfo } from "@/lib/types/api/chapter";
import TopicEditingDialog, {
  TTopicEditingDialogHandle,
} from "./TopicEditingDialog";
import React from "react";

interface Topic {
  id?: string;
  name: string;
  abstract: string;
  topic_points: {
    id?: string;
    point_content: string;
  }[];
}

interface FormValues {
  topics: {
    id?: string;
    name: string;
    abstract: string;
    edit_type: string;
    add_index: number;
    topic_points: {
      id?: string;
      point_content: string;
      edit_type: string;
      add_index: number;
    }[];
  }[];
}

interface ChapterUiProps {
  novelId: string;
  chapterKey: string;
  chapterInfo: TChapterInfo;
}

const ChapterUi = ({ novelId, chapterKey, chapterInfo }: ChapterUiProps) => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  // const [openTopicsModal, setOpenTopicsModal] = useState(false);
  const [submitLoader, setSubmitLoader] = useState(false);
  const [topicsData, setTopicsData] = useState<{ topics: Topic[] } | null>(
    null
  );
  const { control, handleSubmit, reset } = useForm<FormValues>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const topicEditingDialogRef = React.useRef<TTopicEditingDialogHandle>(null);

  useEffect(() => {
    if (chapterInfo?.details) {
      const topics_from_resp: Topic[] =
        chapterInfo.details?.chapter_topics?.topics ?? [];
      const topics: FormValues["topics"] = topics_from_resp.map(
        (topic, idx) => ({
          id: topic.id,
          name: topic.name,
          abstract: topic.abstract,
          edit_type: "U",
          add_index: idx,
          topic_points: topic.topic_points.map((point, pointIdx) => ({
            id: point.id,
            point_content: point.point_content,
            edit_type: "U",
            add_index: pointIdx,
          })),
        })
      );
      reset({ topics });
      setTopicsData({ topics: topics_from_resp });
    }
  }, [chapterInfo.details, reset]);

  const handleAiGeneration = async () => {
    setLoading(true);
    const token = await getToken({ template: "UserToken" });

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/chapter/topic/${novelId}/${chapterKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const responseData = await response.json();
      setLoading(false);
      setTopicsData(responseData.data);

      const topics_from_resp: Topic[] = responseData.data.topics;
      const topics: FormValues["topics"] = topics_from_resp.map(
        (topic, idx) => ({
          id: topic.id,
          name: topic.name,
          abstract: topic.abstract,
          edit_type: "A",
          add_index: idx,
          topic_points: topic.topic_points.map((point, pointIdx) => ({
            id: point.id,
            point_content: point.point_content,
            edit_type: "A",
            add_index: pointIdx,
          })),
        })
      );
      reset({ topics });
    } else {
      console.error("Failed to initialize novel");
      setLoading(false);
    }
  };

  const handleDeleteTopic = (index: number) => {
    const updatedTopics =
      topicsData?.topics.filter((_, i) => i !== index) || [];
    setTopicsData({ topics: updatedTopics });
    reset({
      topics: updatedTopics.map((topic, idx) => ({
        ...topic,
        edit_type: topic.id ? "D" : "A",
        add_index: idx,
        topic_points: topic.topic_points.map((point, pointIdx) => ({
          ...point,
          point_content: point.point_content,
          edit_type: point.id ? "D" : "A",
          add_index: pointIdx,
        })),
      })),
    });
  };

  const handleDeleteTopicPoint = (topicIndex: number, pointIndex: number) => {
    const updatedTopics =
      topicsData?.topics.map((topic, i) => {
        if (i === topicIndex) {
          const updatedPoints = topic.topic_points.filter(
            (_, j) => j !== pointIndex
          );
          return { ...topic, topic_points: updatedPoints };
        }
        return topic;
      }) || [];
    setTopicsData({ topics: updatedTopics });
    reset({
      topics: updatedTopics.map((topic, idx) => ({
        ...topic,
        edit_type: topic.id ? "U" : "A",
        add_index: idx,
        topic_points: topic.topic_points.map((point, pointIdx) => ({
          ...point,
          point_content: point.point_content,
          edit_type: point.id ? "D" : "A",
          add_index: pointIdx,
        })),
      })),
    });
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const token = await getToken({ template: "UserToken" });

      if (!data?.topics || data?.topics?.length === 0) {
        setErrorMessage("You must have at least one topic to save.");
        toast.error("You must have at least one topic to save.");
        return;
      }

      for (let topic of data.topics) {
        if (topic.topic_points.length === 0) {
          setErrorMessage("Each topic must have at least one topic point.");
          toast.error("Each topic must have at least one topic point.");
          return;
        }
      }

      setErrorMessage(null);
      setSubmitLoader(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/chapter/edit/${chapterKey}/topics`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        setSubmitLoader(false);
        console.log(responseData.data);
        toast.success("Changes saved successfully.");
      } else {
        throw new Error("Failed to save changes");
      }
    } catch (error) {
      console.error("Error:", error);
      setSubmitLoader(false);
      toast.error("An error occurred while saving changes.");
    }
  };

  return (
    <div>
      <h1 className="p-2 flex gap-1 items-center font-medium border-b border-input">
        Topic Roadmap
        {chapterInfo?.details?.chapter_topics && (
          <FaEdit
            className="cursor-pointer"
            // onClick={() => setOpenTopicsModal(true)}
            onClick={() => topicEditingDialogRef.current?.openDialog()}
          />
        )}
      </h1>
      {/* <Dialog open={openTopicsModal} onOpenChange={setOpenTopicsModal}>
        <DialogTrigger asChild>
          {!chapterInfo?.details?.chapter_topics && (
            <Button className="bg-bluish text-center flex gap-2 mx-auto mt-3 hover:bg-background hover:text-white">
              Initialize Topics
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="max-w-[85vw] bg-[#150F2D] text-white">
          <SimpleBar style={{ maxHeight: "80vh" }}>
            <form
              id="topic-form"
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 w-1/2 relative p-[2.5rem]"
            >
              {topicsData ? (
                topicsData.topics.map((topic, topicIndex) => (
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
            </form>
          </SimpleBar>
          <div className="">
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            <div className="flex items-center justify-end gap-4">
              <Button
                form="topic-form"
                type="submit"
                className="flex gap-1 items-center hover:bg-background hover:text-white"
                variant="outline"
                disabled={submitLoader}
              >
                {submitLoader ? (
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
              <Button
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
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog> */}

      {/* // TODO 2024-07-02 not finished below */}
      <TopicEditingDialog
        ref={topicEditingDialogRef}
        {...{ novelId, chapterInfo }}
      />
    </div>
  );
};

export default ChapterUi;
