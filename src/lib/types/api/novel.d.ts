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
