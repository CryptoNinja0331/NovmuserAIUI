import { Button } from "./button";

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
        <Button className="button-gradient-2 z-[9999]  relative">
          Add Novel
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
