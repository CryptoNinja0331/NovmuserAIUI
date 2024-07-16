export type TWsMsgDto<KeyType = TNovelPrepareWsMsgKeys> = {
  msg_key: KeyType;
  msg_type: "text" | "json" | "bytes";
  msg?: any;
};

export type TNovelPrepareWsMsgKeys =
  | "prepare_novel"
  | "brain_storming"
  | "novel_world_generation"
  | "character_generation"
  | "plot_planning"
  | "chapter_outline_generation"
  | "finish_prepare";
