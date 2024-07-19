"use client";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  handleInitNovel,
  THandleInitNovelState,
} from "@/lib/actions/novel.init";
import { useFormState, useFormStatus } from "react-dom";
import { Button } from "../../../components/ui/button";
import { Textarea } from "../../../components/ui/textarea";

import { TNovel } from "@/lib/types/api/novel";
import React from "react";

export function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="button-gradient-2" disabled={pending}>
      Save Changes
    </Button>
  );
}

const initialState: THandleInitNovelState = {
  validatedForm: true,
  message: "",
};

const NovelInitForm = ({
  setNovel,
}: {
  setNovel: (novel?: TNovel | undefined) => void;
}) => {
  const [state, formAction] = useFormState<THandleInitNovelState, FormData>(
    handleInitNovel,
    initialState
  );

  React.useEffect(() => {
    if (state.novel) {
      setNovel(state.novel);
    }
  }, [setNovel, state]);

  console.log("🚀 ~ NovelInitForm ~ state:", state);

  return (
    <div className="min-w-[50%] mx-auto mt-[5rem]">
      <form action={formAction}>
        <DialogHeader style={{ marginBottom: "1rem" }}>
          <h1 className="text-xl font-medium">Please Fill Input</h1>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="name" className="text-right mb-4 inline-block">
              Novel Name
            </Label>
            <Input id="name" name="name" className="col-span-3" />
          </div>
          <div>
            <Label htmlFor="username" className="text-right mb-4 inline-block">
              Idea/Requirement
            </Label>
            <Textarea
              className="min-h-[130px]"
              name="requirements"
              placeholder="Type your message here."
            />
            <p aria-live="polite" className="block mt-2 text-base text-red-500">
              {!state?.validatedForm ? state?.message : ""}
            </p>
          </div>
        </div>
        <DialogFooter className="">
          <SubmitButton />
        </DialogFooter>
      </form>
    </div>
  );
};

export default React.memo(NovelInitForm);
