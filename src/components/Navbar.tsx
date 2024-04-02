import Link from 'next/link';
import { auth, UserButton } from '@clerk/nextjs';

const Navbar = async () => {
    const { userId } = await auth()

    return (
        <div>


            <ul className='flex justify-between m-10 items-center'>
                <div>
                    <Link href={'/'}><li>Home</li></Link>
                </div>
                {
                    userId ? (
                        <div className='flex items-center gap-4'>
                            <Link href={'/'}><li>Profile</li></Link>
                            <li><UserButton afterSignOutUrl='/sign-in' /></li>
                        </div>) :
                        (
                            <>
                                <div>
                                    <Link href={'/sign-in'}><li>Login</li></Link>
                                </div>
                                <div>
                                    <Link href={'/sign-up'}><li>sign in</li></Link>
                                </div>
                            </>


                        )
                }


            </ul>
        </div>
    );
};

export default Navbar;