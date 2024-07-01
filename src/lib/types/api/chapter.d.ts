import { TChapterChunk } from "./chapterChunk";
import { TChapterTopics } from "./chapterTopic";

export type TChapterInfo = {
  id: string;
  chapter_key: string;
  metadata: {
    novel_id: string;
  };
  details: {
    chapter_topics?: TChapterTopics;
    chapter_chunks?: TChapterChunk[];
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

export type TChapterChunk = {
  id: string;
  metadata: TChapterChunkMetaData;
  chunk_content: string;
};

export type TChapterTopicPoint = {
  id: string;
  point_content: string;
};

export type TChapterTopic = {
  id: string;
  name: string;
  abstract: string;
  topic_points: TChapterTopicPoint[];
};

export type TChapterTopics = {
  topics: TChapterTopic[];
};

export type TChapterTopicPoint = {
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
