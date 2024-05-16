import { Button } from "@/components/ui/button";
import { HiOutlineUpload } from "react-icons/hi";

const page = () => {
    return (
        <div className="pt-[5rem]">
            <div className="bg-[#010313] w-[70%] mx-auto p-6 rounded-md">
                <div className="grid grid-cols-3 gap-8">
                    <div className="bg-[#160929] flex justify-center text-white py-8 px-6 rounded-sm">
                        <div>
                            <p className="text-center text-xl font-medium">2000</p>
                            <Button variant="outline" className="mx-auto flex gap-2 mt-8 hover:bg-background hover:text-white" >
                                <HiOutlineUpload className='text-xl' />

                                Top Up
                            </Button>
                        </div>
                    </div>
                    <div className="bg-[#160929] flex justify-center text-white p-4 rounded-sm py-8 px-6">
                        <div>
                            <p className="text-center text-xl font-medium">5000</p>
                            <Button variant="outline" className="mx-auto flex gap-2 mt-8 hover:bg-background hover:text-white" >
                                <HiOutlineUpload className='text-xl' />

                                Top Up
                            </Button>
                        </div>
                    </div>
                    <div className="bg-[#160929] flex justify-center text-white p-4 rounded-sm py-8 px-6">
                        <div>
                            <p className="text-center text-xl font-medium">10,000</p>
                            <Button variant="outline" className="mx-auto flex gap-2 mt-8 hover:bg-background hover:text-white" >
                                <HiOutlineUpload className='text-xl' />

                                Top Up
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default page;