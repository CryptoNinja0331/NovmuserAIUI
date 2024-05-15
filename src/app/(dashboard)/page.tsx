import { auth } from "@clerk/nextjs";

const { getToken } = auth();



async function getData() {
  const userId = await getToken({ template: 'UserToken' });
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/novel/page?page_number=1&page_size=10`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userId}`,
    },
  })
  console.log(res);
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json()
}

export default async function Home() {
  // const userId = await getToken();
  // // console.log(userId);
  // let data = await getData()
  // console.log(data);
  return (
    <div className='text-white m-10'>

    </div>
  );
}
