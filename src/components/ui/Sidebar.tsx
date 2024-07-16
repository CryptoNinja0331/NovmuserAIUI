import ExpandSidebar from "../../app/(dashboard)/novel/[novelId]/_components/ExpandSidebar";
const Sidebar = () => {
  return (
    <div
      className={`min-h-screen text-white z-20 transition-all duration-300 ease-in-out`}
    >
      <ExpandSidebar />
    </div>
  );
};

export default Sidebar;
