"use client";
import { FC, useState } from "react";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { Input } from "./ui/input";
import { handleNovelNameChange } from "@/lib/actions/novelNameChange";
import { useFormState, useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";

import { clientApi } from "@/lib/apiCall/client/clientAPi";
import React from "react";

const SubmitButton: FC = () => {
  const { pending } = useFormStatus();
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (!pending) {
      dispatch(clientApi.util.invalidateTags(["novelData"]));
    }
  }, [pending, dispatch]);

  console.log("🚀 ~ SubmitButton ~ SubmitButton:", "rendering");

  return (
    <Button
      disabled={pending}
      type="submit"
      variant="outline"
      className="flex gap-2  hover:bg-background hover:text-white"
    >
      {pending ? (
        <>
          <Loader2 className=" h-4 w-4 animate-spin" />
          Saving
        </>
      ) : (
        <>
          <FaSave className=" cursor-pointer" />
          Save
        </>
      )}
    </Button>
  );
};

const NovelName = ({ novelData }: { novelData: any }) => {
  const [isEditing, setIsEditing] = useState(false);

  const initialState = {
    message: "",
    data: novelData,
  };
  const [state, formAction] = useFormState(handleNovelNameChange, initialState);

  console.log("🚀 ~ NovelName ~ NovelName:", "rendering");

  return (
    <div className="border-b text-white flex gap-4 px-2 items-center border-input pb-2 font-semibold capitalize text-[1.1rem]">
      {isEditing ? (
        <div className="w-1/2 ">
          <form action={formAction} className="flex items-center gap-4 w-full">
            <div className="relative w-full">
              <Input
                type="text"
                defaultValue={novelData.metadata?.name}
                name="novelName"
                className="bg-transparent text-white outline-none "
              />
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-white top-[7px] absolute right-[10px] hover:text-gray-300 p-1"
              >
                <FaTimes className="text-sm" />
              </button>
            </div>
            <SubmitButton />
          </form>
        </div>
      ) : (
        <>
          <p className="text-white">{novelData.metadata?.name}</p>
          <FaEdit
            onClick={() => setIsEditing(true)}
            className="text-sm cursor-pointer"
          />
        </>
      )}
    </div>
  );
};

export default React.memo(NovelName);
