"use client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  handleInitNovel,
  THandleInitNovelState,
} from "@/lib/actions/novel.init";
import { useFormState, useFormStatus } from "react-dom";
import { Button } from "./button";
import { Textarea } from "./textarea";

import React from "react";
import PrepareNovel from "../PrepareNovel";

const initialState: THandleInitNovelState = {
  validatedForm: true,
  message: "",
};

const NovelInitForm = () => {
  const [isDialogOpen, setIsDialogOpen] = React.useState<boolean>(false);
  const [state, formAction] = useFormState<THandleInitNovelState, FormData>(
    handleInitNovel,
    initialState
  );

  React.useEffect(() => {
    if (!isDialogOpen) {
      console.log("🚀 ~ Close dialog ~ NovelInitForm ~ state:", state);
      // Reset novel state when the dialog closes
      state.validatedForm = initialState.validatedForm;
      state.novel = initialState.novel;
      state.message = initialState.message;
    }
  }, [isDialogOpen, state]);

  console.log("🚀 ~ NovelInitForm ~ state:", state);

  return (
    <div className=" mx-auto text-center relative mt-1">
      <Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
        <DialogTrigger asChild>
          <Button className="button-gradient-2 z-[49] relative hover:scale-105 hover:opacity-60 text-sm">
            Add Novel
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[100vw] min-h-[100vh] bg-[#110630] border-css border-gradient-rounded text-white">
          {state?.novel ? (
            <PrepareNovel novelId={state?.novel.id} />
          ) : (
            <div className="min-w-[50%] mx-auto mt-[5rem]">
              <form action={formAction}>
                <DialogHeader style={{ marginBottom: "1rem" }}>
                  <h1 className="text-xl font-medium">Please Fill Input</h1>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <Label
                      htmlFor="name"
                      className="text-right mb-4 inline-block"
                    >
                      Novel Name
                    </Label>
                    <Input id="name" name="name" className="col-span-3" />
                  </div>
                  <div>
                    <Label
                      htmlFor="username"
                      className="text-right mb-4 inline-block"
                    >
                      Idea/Requirement
                    </Label>
                    <Textarea
                      className="min-h-[130px]"
                      name="requirements"
                      placeholder="Type your message here."
                    />
                    <p
                      aria-live="polite"
                      className="block mt-2 text-base text-red-500"
                    >
                      {!state?.validatedForm ? state?.message : ""}
                    </p>
                  </div>
                </div>
                <DialogFooter className="">
                  <SubmitButton />
                </DialogFooter>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default React.memo(NovelInitForm);

export function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="button-gradient-2" disabled={pending}>
      Save Changes
    </Button>
  );
}
