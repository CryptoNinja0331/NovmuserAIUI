import React from "react";
import { FaRegEdit } from "react-icons/fa";
import { FormGroup } from "../ui/form-group";
import { TWsMsgDto } from "@/lib/types/api/websocket";
import { TEditStatus } from "./agentCard";

interface WorldViewUiProps {
  novelMsg: TWsMsgDto;
  editStatus: TEditStatus;
}

const WorldViewUi: React.FC<WorldViewUiProps> = ({ novelMsg }) => {
  const {
    novel_type,
    novel_style,
    point_of_view,
    geography,
    politics,
    economy,
    culture,
    history,
  } = novelMsg.msg;

  return (
    <div>
      <div className="flex items-center justify-between my-4 border-b-2 pb-2 border-dashed border-[#eaaaff33]">
        <h1 className="text-violet-gradient text-xl mb-2 font-semibold ">
          World View
        </h1>
        <FaRegEdit className="text-[#B997E3] text-xl cursor-pointer" />
      </div>

      <div className="flex gap-8 justify-between items-center w-full mt-5">
        <div className="w-1/2">
          <FormGroup label="Novel Type" value={novel_type} className="mb-4" />
        </div>
        <div className="w-1/2">
          <FormGroup label="Novel Style" value={novel_style} className="mb-4" />
        </div>
      </div>

      <div className="mt-4">
        <FormGroup
          label="Point Of View"
          value={point_of_view}
          className="mb-4"
        />
      </div>

      <div className="my-8 border-b-2 pb-2 border-dashed border-[#eaaaff33]"></div>

      <div className="flex gap-8 justify-between items-center w-full mt-5">
        <div className="w-1/2">
          <FormGroup label="Geography" value={geography} className="mb-4" />
        </div>
        <div className="w-1/2">
          <FormGroup label="Politics" value={politics} className="mb-4" />
        </div>
      </div>

      <div className="mt-4">
        <FormGroup label="Economy" value={economy} className="mb-4" />
      </div>

      <div className="flex gap-8 justify-between items-center w-full mt-5">
        <div className="w-1/2">
          <FormGroup label="Culture" value={culture} className="mb-4" />
        </div>
        <div className="w-1/2">
          <FormGroup label="History" value={history} className="mb-4" />
        </div>
      </div>
    </div>
  );
};

export default WorldViewUi;
