import { auth, UserButton } from '@clerk/nextjs';

const Navbar = async () => {
    const { userId } = await auth()

    return (
        <div className='min-h-[3rem] flex justify-end  items-center'>
            <ul className='mr-4'>
                {
                    userId && (
                        <div className='flex items-center gap-4'>
                            {/* <Link href={'/'}><li>Profile</li></Link> */}
                            <li><UserButton afterSignOutUrl='/sign-in' /></li>
                        </div>)
                }

            </ul>
        </div>
    );
};

export default Navbar;