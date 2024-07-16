import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import uuid from "react-uuid";
import { TChapterTopicDoc } from './types/api/chapter';
import * as _ from "lodash";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getUUid = () => {
  return uuid();
};

export const cloneDeep = <T>(arg: T): T => {
  return _.cloneDeep<T>(arg);
};
/**
 * 获取下一个pointerId和topicId
 * @param topics
 * @param prevPointer
 */
export const getNextTopicAndChunkId = (topics: TChapterTopicDoc[], prevPointer: string) => {
  if (topics.length == 0 || !prevPointer) {
    console.warn('getNextTopicAndChunkId argument is not present')
  }

  let topicIndex = -1;
  let pointerIndex = -1;
  topics.some((topic, index) => {
    const flag = topic.topic_points.some((pointer, i) => {
      if (prevPointer == pointer.id) {
        if (i < topic.topic_points.length - 1) {
          topicIndex = index
          pointerIndex = i + 1
        } else if(index < topics.length - 1){
          topicIndex = index + 1;
          pointerIndex = 0
        }
        return true
      }
      return  false
    })
    return flag
  })
  if (topicIndex > -1 && pointerIndex > -1) {
    return {
      topic_id: topics?.[topicIndex].id,
      topic_point_id: topics?.[topicIndex]?.topic_points?.[pointerIndex].id
    }
  }
  return {}
}
