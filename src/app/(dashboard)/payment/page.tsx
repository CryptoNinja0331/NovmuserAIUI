import { getPrices } from "@/lib/apiCall/server/getPrices";
import CreatePayment from "@/components/CreatePayment";

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

    let prices = await getPrices();
    const oneTime: SubscriptionPlan[] = prices.data.filter(
        (item: SubscriptionPlan) => item.type !== 'recurring'
    );


    return (
        <div className="pt-[5rem]">
            <h1 className="heading-color mb-6 text-center !text-xl tracking-wider">
                Top Up your account
            </h1>
            <div className="bg-[#010313] w-[70%] mx-auto p-6 rounded-md">
                <div className="grid grid-cols-3 gap-8">

                    {
                        oneTime.map((item: SubscriptionPlan, index: Number) => (
                            <div key={item.id} className="bg-[#160929] flex justify-center text-white py-8 px-6 rounded-sm">
                                <div>
                                    <p className="text-center text-xl font-medium">{item.amount} {""} $</p>

                                    <CreatePayment buttonText={'Top Up'} paymentId={item.id} />
                                </div>
                            </div>
                        ))
                    }

                </div>
            </div>
        </div>
    );
};

export default page;