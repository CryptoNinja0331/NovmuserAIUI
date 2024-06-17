import Image from "next/image";
import successLogo from '../../../assets/undraw_confirmed_re_sef7.svg';
const page = () => {
    return (
        <div>
            <div className="flex justify-center items-center pt-[5rem] mx-auto">
                <div>
                    <div>
                        <Image className="mx-auto" src={successLogo} width={300} height={200} alt="payment-success" />
                    </div>

                    <div className="text-center text-white mt-4">
                        <h1 className="text-2xl front-font-medium mt-3 uppercase">Your Payment is successfull !</h1>
                        <p className="mt-4">Thank for your payment , an automated payment recipt will be sent to your regusterd email.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default page;