import Loader from "@/components/ui/shared/Loader";
import { useVerifAccount } from "@/lib/react-query/querie";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const VerifEmail = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');
    const secret = urlParams.get('secret');
    const navigate = useNavigate();
    const { mutateAsync: verifAccount, isPending: isVerifing } = useVerifAccount();

    useEffect(() => {
        const verificationTimeout = setTimeout(() => {
            navigate("/sign-in", { replace: true });
        }, 6000); // 6 seconds timeout

        handleVerifEmail();

        return () => clearTimeout(verificationTimeout);
    }, []);

    async function handleVerifEmail() {
        try {
            if (userId && secret) {
                const response = await verifAccount({ userId, secret });
                const isEmailVerified = localStorage.getItem('emailVerified');
                if (response && isEmailVerified) {
                    navigate("/sign-in", { replace: true });
                }
            } else {
                console.error("userId or secret is null");
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className='sm:w420 flex-center flex-col gap-3'>
            <img src="/assets/images/LensLegacy.png" alt="logo" width={170} height={36} className="sm:w-48" />
            <h3 className="text-light-2 h3-bold md:h3-bold">Please Check Your email </h3>
            {isVerifing && <Loader />}
        </div>
    )
}

export default VerifEmail;
