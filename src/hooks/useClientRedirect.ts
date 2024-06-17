import { useRouter } from "next/navigation";
import { useCallback } from "react";

const useClientRedirect = () => {
  const router = useRouter();

  const onClientRedirect = useCallback(
    (url: string) => {
      router.push(url);
    },
    [router]
  );

  return onClientRedirect;
};

export default useClientRedirect;
