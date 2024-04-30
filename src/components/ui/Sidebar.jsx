import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Sidebar = () => {
  return (
    <div className="bg-background text-white z-20 p-8 pr-6 border-r border-border gird-row">
      <div
        style={{ margin: "1.5rem" }}
        className="text-xl font-semibold text-center m-5 inline-block"
      >
        Logo
      </div>

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
          <DialogContent className="sm:max-w-[425px] bg-[#110630] border-css">
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                this is sumon bala
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Sidebar;
