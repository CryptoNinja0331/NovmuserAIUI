import { TChapterChunkMetaData, TChunkInfo, TChunkType } from "../chapter";

export type TChunkReqDto = {
  id: string;
  metadata: TChapterChunkMetaData;
};

export type TChunkGenerationReqDto = {
  prev_chunk?: TChunkReqDto;
  is_first_chunk?: boolean;
  user_feedback?: string;
  chunk_type?: TChunkType;
};

export type TChunkSaveDto = {
  prev_chunk?: TChunkReqDto;
  cur_chunk: TChunkInfo;
  is_first_chunk?: boolean;
};
