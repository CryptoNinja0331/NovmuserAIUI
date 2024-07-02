import { TResourceEditingTypes } from "./common";

export type TChapterInfoMetaData = {
  novel_id: string;
  author_id: string;
};

export type TChapterInfo = {
  id: string;
  chapter_key: string;
  metadata: TChapterChunkMetaData;
  details: {
    chapter_topics: TChapterTopicsDoc;
    chapter_chunks?: TChapterChunkDoc[];
  };
};

export type TChunkType = "leader" | "follower";

export type TChunkGenerateFrom = "ai" | "human";

export type TTopicMapping = {
  topic_id: string;
  topic_point_id: string;
};

export type TChapterChunkMetaData = {
  topic_mapping: TTopicMapping;
  chunk_type: TChunkType;
  generate_from: TChunkGenerateFrom;
};

export type TChapterChunkDoc = {
  id: string;
  metadata: TChapterChunkMetaData;
  chunk_content: string;
};

export type TChapterTopicPoint = {
  id: string;
  point_content: string;
};

export type TChapterTopic = {
  name: string;
  abstract: string;
  topic_points: string[];
};

export type TChapterTopics = {
  topics: TChapterTopic[];
};

export type TChapterTopicPoint = {
  id: string;
  point_content: string;
};

export type TChapterTopicDoc = {
  id: string;
  name: string;
  abstract: string;
  topic_points: TChapterTopicPointDoc[];
};

export type TChapterTopicsDoc = {
  topics: TChapterTopicDoc[];
};

export type TChapterTopicPointDoc = {
  id: string;
  point_content: string;
};

export type TChunkInfo = {
  metadata: TChapterChunkMetaData;
  chunk_content: string;
};

export type TChunkStreamEventDto = {
  event_id: string;
  runner_id: string;
  content: string;
  meta_data?: {
    chapter_key: string;
    prev_chunk_id?: string;
    cur_topic_id: string;
    cur_topic_point_id: string;
    chunk_type: TChunkType;
    generate_from: TChunkGenerateFrom;
    whole_content?: string;
  };
  is_final: boolean;
};

export type TChapterTopicPointEditDto = {
  // When update the topic point, this field must be non-none
  id?: string;
  point_content?: string;
  edit_type: TResourceEditingTypes;
  //   When add topic point, this field must be non-none
  add_index?: number;
};

export type TChapterTopicEditDto = {
  // When update the topic, this field must be non-none
  id?: string;
  name?: string;
  abstract?: string;
  edit_type: TResourceEditingTypes;
  //   When add topic, this field must be non-none
  add_index?: number;
  topic_points?: TChapterTopicPointEditDto[];
};

export type TChapterTopicsEditDto = {
  topics?: TChapterTopicEditDto[];
};
