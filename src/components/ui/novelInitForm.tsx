'use client';
import { Button } from "./button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "./textarea";
import { useFormState } from "react-dom";
import { handleInitNovel } from "@/lib/actions/novel.init";
import { useFormStatus } from 'react-dom';

const initialState = {
    message: '',
}
const NovelInitForm = () => {
    const [state, formAction] = useFormState(handleInitNovel, initialState)



    return (
        <div
            style={{ marginTop: "2rem" }}
            className=" mx-auto text-center relative"
        >
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="button-gradient-2 z-[49]  relative">
                        Add Novel
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] bg-[#110630] border-css border-gradient-rounded text-white">
                    <form action={formAction}>
                        <DialogHeader style={{ marginBottom: "1rem" }}>
                            <h1 className="text-xl font-medium">Please Fill Input</h1>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div>
                                <Label htmlFor="name" className="text-right mb-4  inline-block" >
                                    Novel Name
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    className="col-span-3"
                                />
                            </div>
                            <div
                            >
                                <Label htmlFor="username" className="text-right mb-4 inline-block" >
                                    Idea/Requirement
                                </Label>
                                <Textarea name="requirements" placeholder="Type your message here." />
                                <p aria-live="polite" className="block mt-2 text-sm">
                                    {state?.message}
                                </p>
                            </div>
                        </div>
                        <DialogFooter className="">

                            <SubmitButton />
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default NovelInitForm;






export function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <Button type="submit" disabled={pending}>
            Save Changes
        </Button>
    )
}