import { auth } from '@clerk/nextjs/server';

export default async function Home() {
  const { userId, getToken } = auth();

  const token = await getToken()
  return (
    <div className='text-white'>
      {/* {token} */}
    </div>
  );
}
