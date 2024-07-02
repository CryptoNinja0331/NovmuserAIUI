import { Textarea } from "@/components/ui/textarea";
import { cn, getUUid } from "@/lib/utils";
import React, {
  ChangeEventHandler,
  FC,
  FocusEventHandler,
  MouseEventHandler,
} from "react";

import {
  CreateHandler,
  DeleteHandler,
  NodeApi,
  NodeRendererProps,
  RenameHandler,
  Tree,
  TreeApi,
} from "react-arborist";
import { IoAddCircle } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { FaCheck, FaChevronDown, FaChevronUp, FaEdit } from "react-icons/fa";
import {
  TChapterInfo,
  TChapterTopicDoc,
  TChapterTopicEditDto,
  TChapterTopicPointEditDto,
  TChapterTopicsEditDto,
} from "@/lib/types/api/chapter";
import { TFormEditingMode } from "@/lib/types/api/common";
import { cloneDeep } from "lodash";
import { showErrorAlert } from "@/lib/alerts";
import useClientToken from "@/hooks/useClientToken";
import useClientHttp from "@/hooks/useClientHttp";

type TTopicTreeNodeType = "topic" | "topicPoint";

type TNodeNameValue = {
  name: string;
  abstract?: string;
};

type TTopicTreeNodeData = {
  id: string;
  name: string;
  hasPersisted: boolean;
  nodeType: TTopicTreeNodeType;
  children?: TTopicTreeNodeData[];
};

const INITIAL_FIELDS_DATA = {
  topicName: "New Topic",
  topicAbstract: "Topic abstract",
  topicPointContent: "New Topic Point",
};

const generateDefaultTopicPointTreeData = (): TTopicTreeNodeData => {
  return {
    id: getUUid(),
    name: INITIAL_FIELDS_DATA.topicPointContent,
    nodeType: "topicPoint",
    hasPersisted: false,
  };
};

const generateDefaultTopicTreeData = (): TTopicTreeNodeData => {
  return {
    id: getUUid(),
    name: JSON.stringify({
      name: INITIAL_FIELDS_DATA.topicName,
      abstract: INITIAL_FIELDS_DATA.topicAbstract,
    } as TNodeNameValue),
    nodeType: "topic",
    hasPersisted: false,
    children: [generateDefaultTopicPointTreeData()],
  };
};

const INITIAL_TREE_DATA: TTopicTreeNodeData[] = [
  generateDefaultTopicTreeData(),
];

const TREE_NODE_HEIGHT: number = 180;

class IndexGenerator {
  private index: number = -1;

  getIndex = () => {
    return this.index;
  };

  indexIncrement = () => {
    this.index++;
  };
}

type TAddTopicTreeNodeButtonPairProps = {
  onClickAddBefore: MouseEventHandler | undefined;
  onClickAddAfter: MouseEventHandler | undefined;
};

const AddTopicTreeNodeButtonPair: FC<TAddTopicTreeNodeButtonPairProps> = ({
  onClickAddBefore,
  onClickAddAfter,
}) => {
  const className =
    "flex flex-row items-center justify-center gap-2 p-2 rounded-full bg-gray-950 border border-input  hover:opacity-40 cursor-pointer";

  return (
    <div className="flex flex-col gap-3 text-sm">
      <div className={className} onClick={onClickAddBefore}>
        <IoAddCircle />
        <span>Add Before</span>
      </div>
      <div className={className} onClick={onClickAddAfter}>
        <IoAddCircle />
        <span>Add After</span>
      </div>
    </div>
  );
};

type TTopicTreeNodeInternalProps = NodeRendererProps<TTopicTreeNodeData> & {
  onOuterClick: MouseEventHandler | undefined;
  handleToggleExpand: MouseEventHandler | undefined;
  onEditingAreaFocus: FocusEventHandler | undefined;
  onDelete: MouseEventHandler | undefined;
} & TAddTopicTreeNodeButtonPairProps;

const TopicTreeNodeInternal = React.memo(
  ({
    style,
    node,
    onOuterClick,
    handleToggleExpand,
    onEditingAreaFocus,
    onDelete,
    ...rest
  }: TTopicTreeNodeInternalProps) => {
    const nodeNameJsonStr = node.data.name;
    console.log("🚀 ~ topicTreeNodeRenderer ~ nodeNameValue:", nodeNameJsonStr);

    // Decoding node name
    const nodeNameJsonObj: TNodeNameValue = JSON.parse(nodeNameJsonStr);
    const { name: nameOriginal, abstract: abstractOriginal } = nodeNameJsonObj;

    const nameRef = React.useRef<string>(nameOriginal);
    const abstractRef = React.useRef<string | undefined>(abstractOriginal);

    const expandableIconRenderer = React.useMemo(() => {
      if (node.isClosed) {
        return <FaChevronDown className="text-white" />;
      } else {
        return <FaChevronUp className="text-white" />;
      }
    }, [node.isClosed]);

    const handleTopicNameChange = React.useCallback<ChangeEventHandler<any>>(
      (e) => {
        nameRef.current = e.target.value;
      },
      []
    );

    const handleTopicAbstractChange = React.useCallback<
      ChangeEventHandler<any>
    >((e) => {
      abstractRef.current = e.target.value;
    }, []);

    const handleEditingConfirm = React.useCallback(() => {
      const nameCurrent = nameRef.current ?? "";
      const abstractCurrent = abstractRef.current ?? "";
      if (
        nameCurrent === nameOriginal &&
        abstractCurrent === abstractOriginal
      ) {
        // Nothing changed
        node.reset();
        console.log("🚀 ~ handleEditingConfirm ~ Nothing changed");
      } else {
        // Submit updated field value
        const updatedNodeNameJsonObj: TNodeNameValue = {
          name: nameCurrent,
          abstract: abstractCurrent,
        };
        const submitValue = JSON.stringify(updatedNodeNameJsonObj);
        node.submit(submitValue);
        console.log("🚀 ~ handleEditingConfirm ~ submitValue:", submitValue);
      }
    }, [abstractOriginal, nameOriginal, node]);

    return (
      <div style={style} onClick={onOuterClick}>
        <div className="flex flex-row items-center gap-2 ">
          <AddTopicTreeNodeButtonPair {...rest} />
          <div
            className={`flex-1 flex flex-col gap-1 bg-[#0C0C0D] border border-input rounded-md h-[${TREE_NODE_HEIGHT}px]`}
          >
            <div className="flex flex-row gap-3 items-center justify-between p-2">
              <div
                className="flex flex-row items-center gap-2 bg-violet-500 py-1 px-2 rounded-md cursor-pointer"
                onClick={handleToggleExpand}
              >
                <span>Topic</span>
                {expandableIconRenderer}
              </div>
              <input
                defaultValue={nameOriginal}
                placeholder="Please enter the topic name"
                onFocus={onEditingAreaFocus}
                disabled={!node.isEditing}
                onChange={handleTopicNameChange}
                className="bg-[#0C0C0D] focus:outline-0 rounded-sm text-white w-full"
              />
              <div className="flex flex-row justify-end items-center">
                {node.isEditing ? (
                  <FaCheck
                    className="text-violet-400 text-2xl mx-3 cursor-pointer"
                    onClick={handleEditingConfirm}
                  />
                ) : (
                  <FaEdit
                    className="text-white text-2xl mx-3 cursor-pointer"
                    onClick={() => {
                      node.edit();
                    }}
                  />
                )}
                <RxCross2
                  className="cursor-pointer text-3xl mx-1"
                  onClick={onDelete}
                />
              </div>
            </div>
            <div className="rounded-md p-3 flex-1">
              <Textarea
                defaultValue={abstractOriginal}
                placeholder="Please enter the topic abstract"
                className="p-2 rounded-sm text-white w-full flex-1 resize-none"
                onFocus={onEditingAreaFocus}
                onChange={handleTopicAbstractChange}
                disabled={!node.isEditing}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

TopicTreeNodeInternal.displayName = "TopicTreeNodeInternal";

type TTopicPointTreeNodeInternalProps =
  NodeRendererProps<TTopicTreeNodeData> & {
    onOuterClick: MouseEventHandler | undefined;
    onEditingAreaFocus: FocusEventHandler | undefined;
    onDelete: MouseEventHandler | undefined;
  } & TAddTopicTreeNodeButtonPairProps;

const TopicPointTreeNodeInternal = React.memo(
  ({
    style,
    node,
    onOuterClick,
    onEditingAreaFocus,
    onDelete,
    ...rest
  }: TTopicPointTreeNodeInternalProps) => {
    const topicPointContent = node.data.name;
    const contentRef = React.useRef<string>(topicPointContent);
    const handleEditingConfirm = React.useCallback(() => {
      const contentCurrent = contentRef.current ?? "";
      if (contentCurrent === topicPointContent) {
        // Nothing changed
        node.reset();
        console.log("🚀 ~ handleEditingConfirm ~ Nothing changed");
      } else {
        // Submit updated field value
        node.submit(contentCurrent);
        console.log("🚀 ~ handleEditingConfirm ~ submitValue:", contentCurrent);
      }
    }, [node, topicPointContent]);

    const handleTopicPointContentChange = React.useCallback<
      ChangeEventHandler<any>
    >((e) => {
      contentRef.current = e.target.value;
    }, []);

    return (
      <div style={style} onClick={onOuterClick}>
        <div className="flex flex-row items-center gap-2 ">
          <AddTopicTreeNodeButtonPair {...rest} />
          <div
            className={`flex-1 flex flex-col gap-1 point border topics-point border-input rounded-md h-[${TREE_NODE_HEIGHT}px] bg-[#0C0C0D]`}
          >
            <div className="flex flex-row gap-2 items-center justify-between p-2">
              <h1 className="bg-violet-500 py-1 px-2 rounded-md">
                Topic Point
              </h1>
              <div className="flex flex-row justify-end items-center">
                {node.isEditing ? (
                  <FaCheck
                    className="text-violet-400 text-2xl mx-3 cursor-pointer"
                    onClick={handleEditingConfirm}
                  />
                ) : (
                  <FaEdit
                    className="text-white text-2xl mx-3 cursor-pointer"
                    onClick={() => {
                      node.edit();
                    }}
                  />
                )}
                <RxCross2
                  className="cursor-pointer text-xl mx-1"
                  onClick={onDelete}
                />
              </div>
            </div>
            <div className="rounded-md p-3">
              <Textarea
                defaultValue={topicPointContent}
                placeholder="Please enter the point content"
                onFocus={onEditingAreaFocus}
                className="p-2 rounded-sm text-white w-full resize-none"
                onChange={handleTopicPointContentChange}
                disabled={!node.isEditing}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

TopicPointTreeNodeInternal.displayName = "TopicPointTreeNodeInternal";

type TIndexGenerator = {
  indexIncrement: () => void;
  getIndex: () => number;
};

const getNodeIndexById = (
  parentNode: NodeApi<TTopicTreeNodeData>,
  targetNodeId: string,
  indexGenerator: TIndexGenerator
): number => {
  for (const node of parentNode?.children ?? []) {
    indexGenerator.indexIncrement();
    if (node.id === targetNodeId) {
      return indexGenerator.getIndex();
    }
    if (node.children) {
      const result = getNodeIndexById(node, targetNodeId, indexGenerator);
      if (result !== -1) {
        return result;
      }
    }
  }
  return -1;
};

const getPreviouSiblingNodeIndex = (
  node: NodeApi<TTopicTreeNodeData>,
  curNodeIndex: number
) => {
  if (!node.parent || curNodeIndex === 0) {
    return -1;
  }
  const parentNode = node.parent;
  if (node.isLeaf) {
    if (parentNode?.children?.[0]?.id === node.id) {
      // The current node already be the first node belongs to the parent
      return -1;
    }
    return curNodeIndex - 1;
  } else {
    for (let i = (parentNode?.children?.length ?? 0) - 1; i >= 0; i--) {
      if (parentNode?.children?.[i].id === node.id) {
        const preSiblingNode = parentNode.children[i - 1];
        const indexGenerator = new IndexGenerator();
        const preSiblingNodeIndex = getNodeIndexById(
          parentNode,
          preSiblingNode.id,
          {
            getIndex: indexGenerator.getIndex,
            indexIncrement: indexGenerator.indexIncrement,
          }
        );
        return preSiblingNodeIndex;
      }
    }
  }
  return -1;
};

const ChapterTopicTreeNode = React.memo(
  (props: NodeRendererProps<TTopicTreeNodeData>) => {
    const { node, tree } = props;
    console.log("🚀 ~ node:", node);

    const nodeType = node.data.nodeType;

    const handleClickStopPropagation = React.useCallback<MouseEventHandler>(
      (e) => {
        e.stopPropagation();
      },
      []
    );

    const handleOnFucus = React.useCallback<FocusEventHandler<any>>(
      (e) => {
        e.currentTarget?.select();
        if (!node.isEditing) {
          node.edit();
        }
      },
      [node]
    );

    const handleToggleExpand = React.useCallback(() => {
      if (node.isClosed) {
        node.open();
      } else {
        node.close();
      }
    }, [node]);

    const handleDeleteNode = React.useCallback(() => {
      tree.delete(node.id);
    }, [node.id, tree]);

    const doHandleClickAdd = React.useCallback(
      (addType: "before" | "after") => {
        const treeRoot = tree.root;
        const parentNode = node.parent;
        // Find the stable index in the tree
        let indexGenerator = new IndexGenerator();
        const curNodeIndex = getNodeIndexById(treeRoot, node.id, {
          getIndex: indexGenerator.getIndex,
          indexIncrement: indexGenerator.indexIncrement,
        });

        console.log("🚀 ~ curNodeIndex:", curNodeIndex);
        let targetIndex = curNodeIndex;
        if (addType === "before") {
          // Get the index of previous sibling node, or -1 if the current node
          // already be the first node belongs to the parent
          targetIndex = getPreviouSiblingNodeIndex(node, curNodeIndex);
        }
        console.log("🚀 ~ handleClickAdd ~ parent:", parentNode);
        console.log("🚀 ~ targetIndex:", targetIndex);
        tree.create({
          parentId: parentNode?.id,
          type: nodeType === "topic" ? "internal" : "leaf",
          index: targetIndex,
        });
      },

      [node, nodeType, tree]
    );

    const handleClickAddBefore = React.useCallback(() => {
      doHandleClickAdd("before");
    }, [doHandleClickAdd]);

    const handleClickAddAfter = React.useCallback(() => {
      doHandleClickAdd("after");
    }, [doHandleClickAdd]);

    const renderer = React.useMemo(() => {
      if (nodeType === "topic") {
        // Render topic node
        return (
          <TopicTreeNodeInternal
            {...{
              ...props,
              onOuterClick: handleClickStopPropagation,
              handleToggleExpand,
              onEditingAreaFocus: handleOnFucus,
              onDelete: handleDeleteNode,
              onClickAddBefore: handleClickAddBefore,
              onClickAddAfter: handleClickAddAfter,
            }}
          />
        );
      } else if (nodeType === "topicPoint") {
        // Render topic point node
        return (
          <TopicPointTreeNodeInternal
            {...{
              ...props,
              onOuterClick: handleClickStopPropagation,
              onEditingAreaFocus: handleOnFucus,
              onDelete: handleDeleteNode,
              onClickAddBefore: handleClickAddBefore,
              onClickAddAfter: handleClickAddAfter,
            }}
          />
        );
      }
      return null;
    }, [
      handleClickAddAfter,
      handleClickAddBefore,
      handleClickStopPropagation,
      handleDeleteNode,
      handleOnFucus,
      handleToggleExpand,
      nodeType,
      props,
    ]);

    return renderer;
  }
);

ChapterTopicTreeNode.displayName = "ChapterTopicTreeNode";

type TTopicEditingTreeProps = {
  chapterInfo: TChapterInfo;
  className?: string;
};

export type TTopicEditingTreeHandle = {
  submitForm: () => Promise<void> | void;
};

const TopicEditingTree = React.forwardRef<
  TTopicEditingTreeHandle,
  TTopicEditingTreeProps
>(({ chapterInfo, className }, ref) => {
  const treeRef = React.useRef<TreeApi<TTopicTreeNodeData>>(null);

  const editingMode = React.useMemo<TFormEditingMode>(() => {
    if (chapterInfo?.details?.chapter_topics) {
      return "edit";
    }
    return "add";
  }, [chapterInfo?.details?.chapter_topics]);

  const initTreeData = React.useMemo<TTopicTreeNodeData[]>(() => {
    let initTreeData: TTopicTreeNodeData[] = [];
    if (editingMode === "add") {
      initTreeData = INITIAL_TREE_DATA;
    } else if (editingMode === "edit") {
      const chapterTopicDocs: TChapterTopicDoc[] =
        chapterInfo?.details.chapter_topics.topics ?? [];
      initTreeData = chapterTopicDocs.map((topic) => ({
        id: topic.id,
        name: topic.name,
        abstract: topic.abstract,
        hasPersisted: true,
        nodeType: "topic",
        children: topic.topic_points.map((point) => ({
          id: point.id,
          name: point.point_content,
          hasPersisted: true,
          nodeType: "topicPoint",
        })),
      }));
    }
    return initTreeData;
  }, [chapterInfo?.details?.chapter_topics.topics, editingMode]);

  const initChapterTopicsEditDto = React.useMemo<TChapterTopicsEditDto>(() => {
    if (editingMode === "add") {
      // Convert initTreeData to TChapterTopicsEditDto
      return {
        topics: initTreeData.map((topic, index) => {
          const nameJsonStr = topic.name;
          const nameJsonObj: TNodeNameValue = JSON.parse(nameJsonStr);
          const { name, abstract } = nameJsonObj;
          return {
            id: topic.id,
            name,
            abstract,
            edit_type: "A",
            add_index: index,
            topic_points: topic.children?.map(
              (point, pointIndex) =>
                ({
                  id: point.id,
                  point_content: point.name,
                  edit_type: "A",
                  add_index: pointIndex,
                } as TChapterTopicPointEditDto)
            ),
          };
        }),
      };
    }
    return {
      topics: [],
    };
  }, [editingMode, initTreeData]);

  // Focus on UI component
  const [topicTreeData, setTopicTreeData] =
    React.useState<TTopicTreeNodeData[]>(initTreeData);

  // Focus on data
  const chapterTopicsEditDtoFormRef = React.useRef<TChapterTopicsEditDto>(
    initChapterTopicsEditDto
  );

  const { getClientToken } = useClientToken();
  const { put } = useClientHttp();

  React.useImperativeHandle(
    ref,
    () => ({
      submitForm: async () => {
        const formData = chapterTopicsEditDtoFormRef.current;
        console.log("🚀 ~ formData:", formData);
        await put({
          url: `/chapter/edit/${chapterInfo.chapter_key}/topics`,
          token: await getClientToken(),
          data: formData,
        });
      },
    }),
    [chapterInfo.chapter_key, getClientToken, put]
  );

  const handleTreeNodeCreate = React.useCallback<
    CreateHandler<TTopicTreeNodeData>
  >(
    ({ parentNode, index, type }) => {
      let parent = parentNode;
      if (!parent) {
        parent = treeRef.current?.root!;
      }
      console.log(
        `🚀 ~ handleTreeNodeCreate: 
        index=${index},
        parentNode.id=${parent?.id}, 
        type=${type}
        `
      );

      const updatedTreedata = cloneDeep(topicTreeData);
      let insertData: TTopicTreeNodeData | undefined = undefined;
      let insertInternalIdx = 0;
      let insertLeafIdx = 0;

      const updateState = () => {
        if (type === "internal") {
          // Create internal node (create chapter topic)
          let globalIdx = 0;
          let relativeIdx = 0;
          if (index === -1) {
            relativeIdx = -1;
          } else {
            for (const nodeData of topicTreeData) {
              if (globalIdx === index) {
                break;
              }
              const childrenLen = nodeData.children?.length ?? 0;
              globalIdx += childrenLen + 1;
              relativeIdx++;
            }
          }
          const insertIdx = relativeIdx + 1;
          insertInternalIdx = insertIdx;
          console.log("🚀 ~ internal ~ insertIdx:", insertIdx);
          insertData = generateDefaultTopicTreeData();
          updatedTreedata.splice(insertIdx, 0, insertData);
          console.log("🚀 ~ setTopicTreeData ~ spliced");
          console.log(
            "🚀 ~ setTopicTreeData ~ updatedTreedata:",
            updatedTreedata
          );
        } else {
          // Create leaf node (create chapter topic point)
          const parentId = parent.id;
          let globalParentIdx = 0;
          for (const nodeData of updatedTreedata) {
            if (nodeData.id === parentId) {
              const relativeIndex =
                index === -1 ? -1 : index - globalParentIdx - 1;
              const insertIdx = relativeIndex + 1;
              console.log("🚀 ~ leaf ~ insertIdx:", insertIdx);
              insertData = generateDefaultTopicPointTreeData();
              if (!nodeData.children) {
                nodeData.children = [insertData];
              } else {
                nodeData.children.splice(insertIdx, 0, insertData);
              }
              insertLeafIdx = insertIdx;
              break;
            }
            const childrenLen = nodeData.children?.length ?? 0;
            globalParentIdx += childrenLen + 1;
            insertInternalIdx++;
          }
        }
        setTopicTreeData(updatedTreedata);
        console.log("🚀 ~ insertInternalIdx:", insertInternalIdx);
        console.log("🚀 ~ insertLeafIdx:", insertLeafIdx);
      };

      const updateFormData = () => {
        // Update form data
        const chapterTopicEditDtoList: TChapterTopicEditDto[] = cloneDeep(
          chapterTopicsEditDtoFormRef.current?.topics ?? []
        );
        if (type === "internal") {
          // Create internal node (create chapter topic)
          // insertData.name
          const nodeNameJsonStr = insertData!.name;
          // // Decoding node name
          const nodeNameJsonObj: TNodeNameValue = JSON.parse(nodeNameJsonStr);
          const { name, abstract } = nodeNameJsonObj;
          chapterTopicEditDtoList.push({
            id: insertData!.id,
            name,
            abstract,
            edit_type: "A",
            add_index: insertInternalIdx,
            topic_points: (insertData!.children ?? []).map((item, index) => ({
              id: item.id,
              point_content: item.name,
              edit_type: "A",
              add_index: index,
            })),
          });
        } else {
          // Create leaf node (create chapter topic point)
          const targetTopicData = topicTreeData[insertInternalIdx];
          const targetTopicEditDto: TChapterTopicEditDto | undefined =
            chapterTopicEditDtoList.find(
              (item) => item.id === targetTopicData.id
            );
          // insertData.name
          const nodeNameJsonStr = targetTopicData.name;
          // // Decoding node name
          const nodeNameJsonObj: TNodeNameValue = JSON.parse(nodeNameJsonStr);
          const { name, abstract } = nodeNameJsonObj;
          const insertTopicPoint: TChapterTopicPointEditDto = {
            id: insertData?.id,
            point_content: insertData?.name,
            edit_type: "A",
            add_index: insertLeafIdx,
          };
          if (!targetTopicEditDto) {
            chapterTopicEditDtoList.push({
              id: targetTopicData.id,
              name,
              abstract,
              edit_type: targetTopicData.hasPersisted ? "U" : "A",
              add_index: insertInternalIdx,
              topic_points: [insertTopicPoint],
            });
          } else {
            if (targetTopicEditDto.topic_points) {
              targetTopicEditDto.topic_points.push(insertTopicPoint);
            } else {
              targetTopicEditDto.topic_points = [insertTopicPoint];
            }
          }
        }
        chapterTopicsEditDtoFormRef.current = {
          topics: chapterTopicEditDtoList,
        };
        console.log(
          "🚀 ~ handleTreeNodeCreate ~ chapterTopicsEditDtoFormRef.current:",
          JSON.stringify(chapterTopicsEditDtoFormRef.current)
        );
      };

      updateState();
      updateFormData();
      return null;
    },
    [topicTreeData]
  );

  const handleTreeNodeRename = React.useCallback<
    RenameHandler<TTopicTreeNodeData>
  >(({ name, node }) => {
    const updateFormData = () => {
      console.log("🚀 ~ onRename ~ name:", name, " ~ node:", node);
      const chapterTopicEditDtoList: TChapterTopicEditDto[] = cloneDeep(
        chapterTopicsEditDtoFormRef.current?.topics ?? []
      );
      const nodeId = node.id;
      const nodeType = node.data.nodeType;
      if (nodeType === "topic") {
        // Update chapter topic information
        const nameJsonObj: TNodeNameValue = JSON.parse(name);
        console.log("🚀 ~ nameJsonObj:", nameJsonObj);
        const targetTopicEditDto: TChapterTopicEditDto | undefined =
          chapterTopicEditDtoList.find((topicItem) => topicItem.id === nodeId);
        if (targetTopicEditDto) {
          targetTopicEditDto.name = nameJsonObj.name;
          targetTopicEditDto.abstract = nameJsonObj.abstract;
        } else {
          chapterTopicEditDtoList.push({
            id: nodeId,
            name: nameJsonObj.name,
            abstract: nameJsonObj.abstract,
            edit_type: "U",
          });
        }
      } else {
        // Update chapter topic point information
        const parentNode = node.parent;
        if (!parentNode) {
          return;
        }
        const parentNodeId = parentNode.id;
        let targetTopicEditDto: TChapterTopicEditDto | undefined =
          chapterTopicEditDtoList.find(
            (topicItem) => topicItem.id === parentNodeId
          );
        if (targetTopicEditDto) {
          let targetTopicPointEditDto: TChapterTopicPointEditDto | undefined = (
            targetTopicEditDto.topic_points ?? []
          ).find((topicPointItem) => topicPointItem.id === nodeId);
          if (targetTopicPointEditDto) {
            targetTopicPointEditDto.point_content = name;
          } else {
            targetTopicPointEditDto = {
              id: nodeId,
              point_content: name,
              edit_type: "U",
            };
            if (targetTopicEditDto.topic_points) {
              targetTopicEditDto.topic_points.push(targetTopicPointEditDto);
            } else {
              targetTopicEditDto.topic_points = [targetTopicPointEditDto];
            }
          }
        } else {
          const nameJsonObj: TNodeNameValue = JSON.parse(parentNode.data.name);
          targetTopicEditDto = {
            id: parentNode.id,
            name: nameJsonObj.name,
            abstract: nameJsonObj.abstract,
            edit_type: "U",
            topic_points: [
              {
                id: nodeId,
                point_content: name,
                edit_type: "U",
              },
            ],
          };
          chapterTopicEditDtoList.push(targetTopicEditDto);
        }
      }
      //   Update form data
      chapterTopicsEditDtoFormRef.current = {
        topics: chapterTopicEditDtoList,
      };
      console.log(
        "🚀 ~ handleTreeNodeRename ~ chapterTopicsEditDtoFormRef.current:",
        JSON.stringify(chapterTopicsEditDtoFormRef.current)
      );
    };

    updateFormData();
  }, []);

  const handleTreeNodeDelete = React.useCallback<
    DeleteHandler<TTopicTreeNodeData>
  >(
    ({ nodes }) => {
      console.log("🚀 ~ topicTreeData:", topicTreeData);
      console.log("🚀 ~ handleTreeNodeDelete ~ nodes:", nodes);
      if (!nodes || nodes.length === 0) {
        return;
      }
      const deleteNode = nodes[0];
      const parentNode = deleteNode.parent;

      const nodeType = deleteNode.data.nodeType;
      const deleteNodeId = deleteNode.id;

      const checkDeletion = (): boolean => {
        if (nodeType === "topic") {
          if (topicTreeData.length <= 1) {
            showErrorAlert({
              title: "Deletion Failed",
              text: "At least one topic is required.",
              target: "#topicEditingTree",
            });
            return false;
          }
        } else {
          if (!parentNode) {
            return true;
          }
          if ((parentNode?.data?.children?.length ?? 0) <= 1) {
            showErrorAlert({
              title: "Deletion Failed",
              text: "At least one topic point is required for each topic.",
              target: "#topicEditingTree",
            });
            return false;
          }
        }
        return true;
      };

      const updateState = () => {
        let topicTreeDataClone = cloneDeep(topicTreeData ?? []);
        if (nodeType === "topic") {
          // Remove from topicTreeData
          topicTreeDataClone = topicTreeDataClone.filter(
            (item) => item.id !== deleteNodeId
          );
        } else {
          topicTreeDataClone = topicTreeData.map((item) => {
            if (item.id === parentNode?.id) {
              return {
                ...item,
                children: item.children?.filter(
                  (child) => child.id !== deleteNodeId
                ),
              };
            }
            return item;
          });
        }
        // Update state
        setTopicTreeData(topicTreeDataClone);
      };

      const updateFormData = () => {
        const chapterTopicEditDtoList: TChapterTopicEditDto[] = cloneDeep(
          chapterTopicsEditDtoFormRef.current?.topics ?? []
        );
        if (nodeType === "topic") {
          // Delete chapter topic
          const targetDeleteTopicEditDto: TChapterTopicEditDto | undefined =
            chapterTopicEditDtoList.find(
              (topicItem) => topicItem.id === deleteNodeId
            );
          if (targetDeleteTopicEditDto) {
            if (targetDeleteTopicEditDto.edit_type === "A") {
              // Remove from the chapterTopicEditDtoList
              chapterTopicEditDtoList.splice(
                chapterTopicEditDtoList.indexOf(targetDeleteTopicEditDto),
                1
              );
            } else {
              // Mark as deleted
              targetDeleteTopicEditDto.edit_type = "D";
            }
          } else {
            if (deleteNode.data.hasPersisted) {
              chapterTopicEditDtoList.push({
                id: deleteNodeId,
                edit_type: "D",
              });
            }
          }
        } else {
          // Delete chapter topic point
          const parentNodeId = parentNode?.id;
          const targetTopicEditDto: TChapterTopicEditDto | undefined =
            chapterTopicEditDtoList.find((item) => item.id === parentNodeId);
          const deleteTopicPointEditDto: TChapterTopicPointEditDto = {
            id: deleteNodeId,
            edit_type: "D",
          };
          if (targetTopicEditDto) {
            const targetTopicPointEditDto = (
              targetTopicEditDto.topic_points ?? []
            ).find((item) => item.id === deleteNodeId);
            if (targetTopicPointEditDto) {
              if (targetTopicPointEditDto.edit_type === "A") {
                // Remove from the topic_points
                (targetTopicEditDto.topic_points ?? []).splice(
                  (targetTopicEditDto.topic_points ?? []).indexOf(
                    targetTopicPointEditDto
                  ),
                  1
                );
              } else {
                // Mark as deleted
                targetTopicPointEditDto.edit_type = "D";
              }
            } else {
              if (!targetTopicEditDto.topic_points) {
                targetTopicEditDto.topic_points = [deleteTopicPointEditDto];
              } else {
                targetTopicEditDto.topic_points.push(deleteTopicPointEditDto);
              }
            }
          } else {
            chapterTopicEditDtoList.push({
              id: parentNodeId,
              edit_type: "U",
              topic_points: [deleteTopicPointEditDto],
            });
          }
        }

        //   Update form data
        chapterTopicsEditDtoFormRef.current = {
          topics: chapterTopicEditDtoList,
        };
        console.log(
          "🚀 ~ handleTreeNodeDelete ~ chapterTopicsEditDtoFormRef.current:",
          JSON.stringify(chapterTopicsEditDtoFormRef.current)
        );
      };

      if (checkDeletion()) {
        updateState();
        updateFormData();
      }
    },
    [topicTreeData]
  );

  const treeContainerHeight = React.useMemo(() => {
    let nodeCount = 0;
    topicTreeData.forEach((item) => {
      nodeCount += 1;
      if (item.children) {
        nodeCount += item.children.length;
      }
    });
    return TREE_NODE_HEIGHT * (nodeCount + 1);
  }, [topicTreeData]);

  console.log(
    "🚀 ~ treeContainerHeight ~ treeContainerHeight:",
    treeContainerHeight
  );

  console.log("🚀 ~ TopicEditingDialog:", "rendering...");
  console.log("🚀 ~ topicTreeData:", topicTreeData);

  return (
    <div className={cn("flex justify-center", className)} id="topicEditingTree">
      <Tree
        ref={treeRef}
        data={topicTreeData}
        openByDefault
        width={800}
        height={treeContainerHeight}
        indent={48}
        rowHeight={TREE_NODE_HEIGHT}
        overscanCount={1}
        disableDrag
        disableMultiSelection
        onCreate={handleTreeNodeCreate}
        onRename={handleTreeNodeRename}
        onDelete={handleTreeNodeDelete}
      >
        {ChapterTopicTreeNode}
      </Tree>
    </div>
  );
});

TopicEditingTree.displayName = "TopicEditingTree";

export default React.memo(TopicEditingTree);
