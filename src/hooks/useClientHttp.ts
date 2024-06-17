import { useCallback } from "react";
import { GET, POST, PUT, PATCH, DELETE, TDoFetchDataProps } from "@/lib/http";
import useClientRedirect from "@/hooks/useClientRedirect";

const useClientHttp = () => {
  const onClientRedirect = useClientRedirect();

  const get = useCallback(
    async <T>(props: Omit<TDoFetchDataProps, "onClientRedirect">) => {
      return GET<T>({ ...props, onClientRedirect });
    },
    [onClientRedirect]
  );

  const post = useCallback(
    async <T>(props: Omit<TDoFetchDataProps, "onClientRedirect">) => {
      return POST<T>({ ...props, onClientRedirect });
    },
    [onClientRedirect]
  );

  const put = useCallback(
    async <T>(props: Omit<TDoFetchDataProps, "onClientRedirect">) => {
      return PUT<T>({ ...props, onClientRedirect });
    },
    [onClientRedirect]
  );

  const patch = useCallback(
    async <T>(props: Omit<TDoFetchDataProps, "onClientRedirect">) => {
      return PATCH<T>({ ...props, onClientRedirect });
    },
    [onClientRedirect]
  );

  const del = useCallback(
    async <T>(props: Omit<TDoFetchDataProps, "onClientRedirect">) => {
      return DELETE<T>({ ...props, onClientRedirect });
    },
    [onClientRedirect]
  );

  return { get, post, put, patch, del };
};

export default useClientHttp;
