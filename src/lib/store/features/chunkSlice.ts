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
}

const initialState: ChunkDataState = {
  allChunkData: [],
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
  },
});

export const { addChunkData, clearChunkData } = chunkDataSlice.actions;
export default chunkDataSlice.reducer;
