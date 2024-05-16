import { Button } from "@/components/ui/button";
import { FaRegCheckCircle, FaLock } from "react-icons/fa";
import { FaCartPlus } from "react-icons/fa";

const subscriptionPlans = [
    {
        name: "Standard",
        features: [
            "Access to basic novel writing AI assistant",
            "Generate plot outlines, character descriptions",
            "Basic grammar and spelling correction tools",
            "Limited word count (e.g., up to 50,000 words)",
            "Access to a library of writing prompts and exercises",
        ],
    },
    {
        name: "Professional",
        features: [
            "Access to basic novel writing AI assistant",
            "Generate plot outlines, character descriptions",
            "Basic grammar and spelling correction tools",
            "Limited word count (e.g., up to 50,000 words)",
            "Access to a library of writing prompts and exercises",
        ],
        locked: true,
    },
    {
        name: "Ultimate",
        features: [
            "Access to basic novel writing AI assistant",
            "Generate plot outlines, character descriptions",
            "Basic grammar and spelling correction tools",
            "Limited word count (e.g., up to 50,000 words)",
            "Access to a library of writing prompts and exercises",
        ],
        locked: true,
    },
];

const page = () => {
    const maxFeatureLength = 50; // Set the maximum length for feature text

    return (
        <div>
            <h1 className="heading-color mb-4 text-center !text-xl tracking-wider">
                Subscription Plan & Pricing
            </h1>
            <div className="w-[90%] mx-auto bg-[#010313] px-6 py-8 rounded-md">
                <div className="grid grid-cols-3 gap-6">
                    {subscriptionPlans.map((plan, index) => (
                        <div
                            key={index}
                            className={`${plan.locked
                                ? "relative text-white bg-[#120F24] px-4 py-6 rounded-md blur-sm"
                                : "bg-[#120F24] text-white px-4 py-6 rounded-md"
                                }`}
                        >
                            <h1 className="text-xl font-bold mb-4">{plan.name}</h1>
                            <div>
                                {plan.features.map((feature, featureIndex) => (
                                    <div key={featureIndex} className="flex items-start mb-2">
                                        <FaRegCheckCircle className="text-[#FF1E56] mt-1 mr-2 h-5" />
                                        <h1 className=" font-medium">
                                            {feature.length > maxFeatureLength
                                                ? `${feature.substring(0, maxFeatureLength)}...`
                                                : feature}
                                        </h1>
                                    </div>
                                ))}
                            </div>
                            {plan.locked && (
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl text-gray-500">
                                    <FaLock className="text-[4rem]" />
                                </div>
                            )}
                            {!plan.locked && (
                                <div>
                                    <Button
                                        variant="outline"
                                        className="mx-auto flex gap-2 mt-8 uppercase hover:bg-background hover:text-white"
                                    >
                                        <FaCartPlus /> Purchase
                                    </Button>
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