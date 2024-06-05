import CreatePayment from "@/components/CreatePayment";
import { TSubscriptionPlan, getPrices } from "@/lib/apiCall/server/getPrices";
import {
  TSubscriptionInfo,
  getUserSubscriptionList,
} from "@/lib/apiCall/server/getUserSubscriptionList";
import { FC } from "react";
import { FaLock } from "react-icons/fa";
import { TiTick } from "react-icons/ti";
import { BiSolidCrown } from "react-icons/bi";

const SubscriptionServiceItem: FC<{
  svc: string;
}> = ({ svc }) => {
  return (
    <div>
      <div className="text-l flex justify-start items-center gap-2">
        <TiTick />
        <span>{svc}</span>
      </div>
    </div>
  );
};

const page = async () => {
  const maxFeatureLength = 50; // Set the maximum length for feature text
  //   let prices = await getPrices();

  const [prices, userSubscriptionList] = await Promise.all([
    getPrices(),
    getUserSubscriptionList(),
  ]);

  const priceIdUserSubscriptionRecord: Record<string, TSubscriptionInfo> =
    userSubscriptionList?.data?.reduce(
      (acc: Record<string, TSubscriptionInfo>, item: TSubscriptionInfo) => {
        acc[item.price_id] = item;
        return acc;
      },
      {}
    ) ?? {};

  const subscriptionArray: TSubscriptionPlan[] =
    prices.data?.filter(
      (item: TSubscriptionPlan) => item.type === "recurring"
    ) ?? [];

  return (
    <div>
      <h1 className="heading-color mb-4 text-center !text-xl tracking-wider">
        Subscription Plan & Pricing
      </h1>
      <div className="w-[90%] mx-auto bg-[#010313] px-6 py-8 rounded-md">
        <div className="grid grid-cols-3 gap-6">
          {subscriptionArray.map(
            (subscriptionPriceItem: TSubscriptionPlan, index: number) => (
              // Add a blur effect for inactived subscriptions
              <div
                key={index}
                className={`${
                  !subscriptionPriceItem.in_active
                    ? "relative text-white bg-[#120F24] px-4 py-6 rounded-md blur-sm"
                    : "bg-[#120F24] text-white px-4 py-6 rounded-md"
                }`}
              >
                <div className="flex flex-row items-baseline gap-2">
                  <BiSolidCrown />
                  <h1 className="flew flex-col text-xl font-bold mb-4">
                    {subscriptionPriceItem.price_name}
                  </h1>
                </div>
                <h1 className="font-medium ">
                  Price {""}:{""}{" "}
                  {subscriptionPriceItem.currency?.toUpperCase()} $
                  {subscriptionPriceItem.amount}/
                  {subscriptionPriceItem.interval}
                </h1>
                {/* Show a lock icon for inactived subscriptions */}
                {!subscriptionPriceItem.in_active && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl text-gray-500">
                    <FaLock className="text-[4rem]" />
                  </div>
                )}
                {subscriptionPriceItem.in_active && (
                  <div className="mt-6">
                    {subscriptionPriceItem.services?.map((svc, idx) => {
                      return <SubscriptionServiceItem key={idx} svc={svc} />;
                    })}
                    <div>
                      <CreatePayment
                        buttonText={"Purchase"}
                        priceId={subscriptionPriceItem.id}
                        disable={
                          priceIdUserSubscriptionRecord[
                            subscriptionPriceItem.id
                          ] !== undefined
                        }
                        disableButtonText={"Current Subscription"}
                      />
                    </div>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
