import CreatePayment from "@/components/CreatePayment";
import { getPrices } from "@/lib/apiCall/server/getPrices";
import { FaLock } from "react-icons/fa";

interface SubscriptionPlan {
    price_name: string;
    price_description: string;
    amount: string;
    currency: string;
    stripe_price_id: string;
    type: string;
    interval: string;
    id: string;
}

const page = async () => {
    const maxFeatureLength = 50; // Set the maximum length for feature text
    let prices = await getPrices();
    const subscriptionArray: SubscriptionPlan[] = prices.data.filter(
        (item: SubscriptionPlan) => item.type === 'recurring'
    );








    return (
        <div>
            <h1 className="heading-color mb-4 text-center !text-xl tracking-wider">
                Subscription Plan & Pricing
            </h1>
            <div className="w-[90%] mx-auto bg-[#010313] px-6 py-8 rounded-md">
                <div className="grid grid-cols-3 gap-6">
                    {subscriptionArray.map((item: SubscriptionPlan, index: number) => (
                        <div
                            key={index}
                            className={`${item.price_name.includes('Professional') ||
                                item.price_name.includes('Ultimate')
                                ? 'relative text-white bg-[#120F24] px-4 py-6 rounded-md blur-sm'
                                : 'bg-[#120F24] text-white px-4 py-6 rounded-md'
                                }`}
                        >
                            <h1 className="text-xl font-bold mb-4">{item.price_name}</h1>
                            <h1 className="font-medium ">Price {''}:{''} {item.amount} $</h1>
                            {(item.price_name.includes('Professional') ||
                                item.price_name.includes('Ultimate')) && (
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl text-gray-500">
                                        <FaLock className="text-[4rem]" />
                                    </div>
                                )}
                            {!(
                                item.price_name.includes('Professional') ||
                                item.price_name.includes('Ultimate')
                            ) && (
                                    <div>
                                        <CreatePayment buttonText={' Purchase'} paymentId={item.id} />
                                    </div>
                                )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default page;