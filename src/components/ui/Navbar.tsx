'use client'

import { useAuth, UserButton } from '@clerk/nextjs';
import { HiCurrencyDollar } from "react-icons/hi2";
const Navbar = () => {
    const { userId } = useAuth()


    return (
        <div className='min-h-[3rem] flex justify-end  items-center'>
            <ul className='mr-4'>
                {
                    userId && (
                        <div className='flex items-center gap-4'>
                            {/* <Link href={'/'}><li>Profile</li></Link> */}

                            <UserButton afterSignOutUrl='/sign-in'>
                                <UserButton.UserProfileLink
                                    label="Subscription"
                                    url="/subscription"
                                    labelIcon={<HiCurrencyDollar className='text-xl' />}
                                />
                            </UserButton>

                        </div>)
                }

            </ul>
        </div>
    );
};

export default Navbar;