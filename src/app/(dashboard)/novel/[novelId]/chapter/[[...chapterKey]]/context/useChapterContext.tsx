import React, { useState } from 'react';
const initValue = {
  currentTopicId: "",
  currentPointerId: "",
  currentChunkId: "",
  updateCurrentChunkId: (_chunkId: string) => {},
  updateCurrentId: (_topicId: string, _pointerId: string) => {},
};
const ChapterContext = React.createContext(initValue);

const ChapterProvider = ({ children }: React.PropsWithChildren) => {
  const [currentTopicId, updateCurrentTopicId] = React.useState("");
  const [currentPointerId, updateCurrentPointerId] = React.useState("");
  const [currentChunkId, updateCurrentChunkId ] = useState("")
  const updateCurrentId = React.useCallback(
    (topicId: string, pointerId: string) => {
      console.log(topicId, pointerId);
      updateCurrentPointerId(pointerId);
      updateCurrentTopicId(topicId);
    },
    []
  );
  return (
    <ChapterContext.Provider
      value={{
        currentPointerId,
        currentTopicId,
        updateCurrentId,
        currentChunkId,
        updateCurrentChunkId
      }}
    >
      {children}
    </ChapterContext.Provider>
  );
};
export { ChapterContext, ChapterProvider };
