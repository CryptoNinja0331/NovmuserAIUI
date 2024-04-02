import Link from 'next/link';
import { auth, UserButton } from '@clerk/nextjs';

const Navbar = async () => {
    const { userId } = await auth()

    return (
        <div>


            <ul className='flex justify-between m-10 items-center'>
                <h1>header</h1>
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