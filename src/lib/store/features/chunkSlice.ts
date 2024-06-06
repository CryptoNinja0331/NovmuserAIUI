import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChunkData {
  meta_data: {
    cur_topic_id: string;
    cur_topic_point_id: string;
    cur_chunk_id: string;
    chunk_type: string;
  };
  // Add any other properties you need
}

interface ChunkDataState {
  allChunkData: ChunkData[];
  humanFirstChunk: boolean;
}

const initialState: ChunkDataState = {
  allChunkData: [],
  humanFirstChunk: false,
};

const chunkDataSlice = createSlice({
  name: "chunkData",
  initialState,
  reducers: {
    addChunkData: (state, action: PayloadAction<ChunkData>) => {
      state.allChunkData.push(action.payload);
    },
    clearChunkData: (state) => {
      state.allChunkData = [];
    },
    updateHumanFirstChunk: (state, action) => {
      state.humanFirstChunk = action.payload;
    },
  },
});

export const { addChunkData, clearChunkData,updateHumanFirstChunk } = chunkDataSlice.actions;
export default chunkDataSlice.reducer;
