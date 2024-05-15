import { auth } from "@clerk/nextjs";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { RiDeleteBin6Line } from "react-icons/ri";
import Swal from "sweetalert2";


const { getToken } = auth();
async function getAllNovels(pageNumber: any) {
    const userId = await getToken({ template: 'UserToken' });

    let params = new URLSearchParams();

    params.append("page_number", pageNumber);
    params.append("page_size", '7');

    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/novel/page?${params.toString()}`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userId}`,
        },
    })
    if (!res.ok) {
        throw new Error('Failed to fetch data')
    }
    return res.json()
}




const page = async ({ searchParams }: { searchParams: any }) => {

    let currentPage = Number(searchParams.page ? searchParams.page : 1);

    let response = await getAllNovels(currentPage)

    const totalPages = response?.data?.total_pages
    const commonClasses =
        "inline-flex text-white items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50 h-10 w-10";






    const handleDeleteNovel = async () => {
        'use server'
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    icon: "success"
                });


            }
        });
    }








    return (
        <div>

            <div className="bg-[#010313] w-[70%] mx-auto p-6 rounded-md">
                <div className="div space-y-6 px-4 ">
                    {response?.data?.records?.map((item: any) => (

                        <div key={item.id} className="text-[#817691]  font-medium capitalize cursor-pointer p-4 bg-[#160929] rounded-lg">
                            <Link href={`/${item.id}`} className="flex justify-between items-center">
                                <h1 className="heading-color font-medium">    {item.metadata.name}</h1>
                                <form>
                                    <button type="submit">
                                        <RiDeleteBin6Line className="mr-8 text-2xl text-[#FF453A] cursor-pointer" />
                                    </button>
                                </form>

                            </Link>

                        </div>


                    ))}
                </div>
            </div>


            {
                response?.data?.total_records > 10 && <Pagination className="mt-4">
                    <PaginationContent>
                        <PaginationItem>
                            {currentPage > 1 &&
                                <Link href={`?page=${currentPage - 1}`}>

                                    <Button variant="outline" className="text-white hover:bg-background hover:text-white">Previous</Button>
                                </Link>

                            }
                        </PaginationItem>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                            <PaginationItem key={pageNum}>
                                <Link
                                    className={`${commonClasses} ${currentPage === pageNum ? "border-2 border-input" : ""}`}
                                    href={`?page=${pageNum}`}
                                >
                                    {pageNum}
                                </Link>
                            </PaginationItem>
                        ))}



                        <PaginationItem>
                            {currentPage < totalPages &&
                                <Link href={`?page=${currentPage + 1}`}>

                                    <Button variant="outline" className="text-white hover:bg-background hover:text-white">Next</Button>
                                </Link>

                            }
                        </PaginationItem>



                    </PaginationContent>
                </Pagination>
            }


        </div>
    );
};

export default page;