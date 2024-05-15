import { auth } from "@clerk/nextjs";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import Link from "next/link";
import { Button } from "@/components/ui/button";



const { getToken } = auth();



async function getAllNovels(pageNumber: any) {
    const userId = await getToken({ template: 'UserToken' });

    let params = new URLSearchParams();

    params.append("page_number", pageNumber);
    params.append("page_size", '10');

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




const page = async ({ searchParams }) => {

    let currentPage = Number(searchParams.page ? searchParams.page : 1);

    let response = await getAllNovels(currentPage)

    const totalPages = response?.data?.total_pages
    const commonClasses =
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50 h-10 w-10";

    return (
        <div>
            <div className="div space-y-3 px-4">
                {response?.data?.records?.map((item: any) => (
                    <div key={item.id} className="text-[#817691] font-medium capitalize cursor-pointer p-3 bg-[#231B2C] rounded-lg">{item.metadata.name}</div>
                ))}
            </div>

            {
                response?.data?.total_records > 10 && <Pagination >
                    <PaginationContent>
                        <PaginationItem>
                            {currentPage > 1 ? (
                                <Link href={`?page=${currentPage - 1}`}>
                                    {" "}
                                    <PaginationPrevious />
                                </Link>
                            ) : (
                                <Button variant="ghost">Previous</Button>
                            )}
                        </PaginationItem>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                            <PaginationItem key={pageNum}>
                                <Link
                                    className={`${commonClasses} ${currentPage === pageNum ? "border-2 border-blue-500" : ""}`}
                                    href={`?page=${pageNum}`}
                                >
                                    {pageNum}
                                </Link>
                            </PaginationItem>
                        ))}



                        <PaginationItem>
                            {currentPage < totalPages ? (
                                <Link href={`?page=${currentPage + 1}`}>
                                    {" "}
                                    <PaginationNext />
                                </Link>
                            ) : (
                                <Button variant="ghost">Next</Button>
                            )}
                        </PaginationItem>



                    </PaginationContent>
                </Pagination>
            }


        </div>
    );
};

export default page;