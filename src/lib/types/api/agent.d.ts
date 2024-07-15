// region start (Character)

export type TCharacter = {
  name: string;
  age?: number;
  sex?: "male" | "femal" | "unknown";
  nationality?: string;
  appearance?: string;
  physical_description?: string;
  occupation?: string;
  personality?: string;
  background?: string;
  motivation?: string;
  development?: string;
  emotional_arcs?: string;
  relationships?: string;
};

export type TCharacters = {
  main_characters: TCharacter[];
  supporting_characters?: TCharacter[];
};

// region end (Character designer)

// region begin (World view)
export type TWorldView = {
  novel_type: string;
  novel_style: string;
  point_of_view:
    | "first person"
    | "third person limited"
    | "third person omniscient"
    | "second person";
  geography: string;
  politics?: string;
  economy?: string;
  culture?: string;
  history?: string;
  important_landmarks?: string[];
  key_issues?: string;
};

// region end (World view)

// region begin (PlotOutline)
type TPlotOutline = {
  beginning: TPlotBeginning;
  development: TPlotDevelopment;
  climax: TPlotClimax;
  ending: TPlotEnding;
};

type TPlotBeginning = {
  scene: string;
  main_characters: string[];
  event: string;
};

type TPlotDevelopment = {
  inciting_incident: string;
  conflict_expansion: string;
  subplots?: TSubplot[];
};

type TSubplot = {
  plot: string;
  involved_characters: string[];
  expected_impact: string;
};

type TPlotClimax = {
  key_turn: string;
  decisions: string;
  consequences: string;
};

type TPlotEnding = {
  conflict_resolution: string;
  character_outcomes: string;
  world_state: string;
  loose_ends: string;
};
// region end (PlotOutline)

// region begin (ChapterOutline)
type TCharacterProfile = {
  name: string;
  description?: string;
};

type TChapter = {
  chapter_key: string;
  chapter_number?: string;
  title?: string;
  summary?: string;
  major_events?: string[];
  conflict?: string;
  emotional_development: string;
  revealed_information?: string;
  chapter_end?: string;
  characters?: TCharacterProfile[];
};

type TChapterOutline = {
  chapters: TChapter[];
};
// region end (ChapterOutline)
