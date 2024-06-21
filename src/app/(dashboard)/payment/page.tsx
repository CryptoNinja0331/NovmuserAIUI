import { getPrices } from "@/lib/apiCall/server/getPrices";
import CreatePayment from "@/components/CreatePayment";
import { TPriceInfo } from "@/lib/types/api/payment";

const page = async () => {
  let prices = await getPrices();
  const oneTime: TPriceInfo[] =
    prices.data
      ?.filter((item: TPriceInfo) => item.type !== "recurring")
      .sort((item1, item2) => Number(item1.amount) - Number(item2.amount)) ??
    [];

  return (
    <div className="pt-[5rem]">
      <h1 className="heading-color mb-6 text-center !text-xl tracking-wider">
        Top Up your account
      </h1>
      <div className="bg-[#010313] w-[70%] mx-auto p-6 rounded-md">
        <div className="grid grid-cols-3 gap-8">
          {oneTime.map((item: TPriceInfo) => (
            <div
              key={item.id}
              className="bg-[#160929] flex justify-center text-white py-8 px-6 rounded-sm"
            >
              <div className="flex flex-col justify-center items-center">
                <p className="my-4 text-3xl font-bold">
                  {item.credit_amount} <span className="text-sm">Credits</span>
                </p>
                <p className="flex flex-row items-center justify-center gap-2 text-center text-lg font-medium">
                  {`${item.currency?.toUpperCase()} $ ${item.amount}`}
                </p>
                <CreatePayment buttonText={"Top Up"} priceId={item.id} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;
