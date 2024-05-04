import NovelInitForm from "./novelInitForm";
const Sidebar = () => {
  return (
    <div className="bg-gradient-to-t to-[#101e2a08] from-[#101C27]  text-white z-20 p-8 pr-6 border-r border-border gird-row">
      <div
        className="text-xl block font-semibold text-center "
      >
        Logo
      </div>

      {/* <div className="text-center mt-6">
        <Button className="button-gradient-2 z-[49] relative ">
          <Link href={'/add-novel'}>
            Add Novel
          </Link>
        </Button>
      </div> */}

      <NovelInitForm />
    </div>
  );
};

export default Sidebar;
