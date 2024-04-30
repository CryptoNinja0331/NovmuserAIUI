import Link from 'next/link';
import { auth, UserButton } from '@clerk/nextjs';

const Navbar = async () => {
    const { userId } = await auth()

    return (
        <div className='border-border border-b'>
            <ul className='flex justify-between m-6 items-center'>
                <h1 className='text-white'>header</h1>
                {
                    userId && (
                        <div className='flex items-center gap-4'>
                            <Link href={'/'}><li>Profile</li></Link>
                            <li><UserButton afterSignOutUrl='/sign-in' /></li>
                        </div>)
                }

            </ul>
        </div>
    );
};

export default Navbar;