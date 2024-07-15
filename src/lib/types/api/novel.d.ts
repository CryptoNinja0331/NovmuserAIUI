import { TCharacter, TPlotOutline, TWorldView } from "./agent";

export type TNovelTaskStatus = "PENDING" | "CANCELLED" | "FINISHED";

export type TNovelDetailsFields =
  | "brain_storming"
  | "characters"
  | "world_view"
  | "plot_outline"
  | "chapter_outline";

export type TNovelPreparingTask = {
  task_id: string;
  status: TNovelTaskStatus;
  last_step_field?: TNovelDetailsFields;
};

export type TNovelDetails = {
  brain_storming?: string;
  characters?: TCharacter;
  world_view?: TWorldView;
  plot_outline?: TPlotOutline;
};

export type TNovelMetadata = {
  name: string;
  requirements?: string;
  author_id: number | string;
  status?: "draft" | "published";
  created_at: string;
  updated_at: string;
};

export type TNovel = {
  id: string;
  metadata: TNovelMetadata;
  details?: TNovelDetails;
};
