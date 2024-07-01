import { redirect } from "next/navigation";
import useUserInfoStore from "./store/user/userInfoStore";
import emitter from "./emitters";
export interface HttpConfig extends RequestInit {
  headers?: { [key: string]: string };
}

const baseURL = process.env.NEXT_PUBLIC_SERVER_URL || "";

export type TResponseDto<T> = {
  success: boolean;
  message?: string;
  data?: T;
  code: number;
  business_code?: string;
};

export type TDoFetchDataProps = {
  url: string;
  token?: string | null | undefined;
  params?: Record<string, string>;
  data?: any;
  config?: HttpConfig;
  next?: NextFetchRequestConfig | undefined;
  onClientRedirect?: (url: string) => void;
};

const doFetchData = async <T>({
  url,
  token,
  params,
  config = {},
  onClientRedirect,
  ...rest
}: TDoFetchDataProps): Promise<T> => {
  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...config.headers,
  };

  const handleRedirect = (url: string): void => {
    if (typeof window !== "undefined" && onClientRedirect) {
      // For client component
      console.log("🚀 ~ handleRedirect", "client redirect");
      onClientRedirect(url);
    } else {
      // For server component
      console.log("🚀 ~ handleRedirect", "server redirect");
      redirect(url);
    }
  };

  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  if (params) {
    const queryString = new URLSearchParams(params).toString();
    url = `${url}?${queryString}`;
  }

  const fetchUrl = `${baseURL}${url}`;

  console.log("🚀 ~ fetchUrl:", fetchUrl);

  try {
    const response = await fetch(fetchUrl, {
      ...config,
      headers: defaultHeaders,
      ...rest,
    });

    if (!response.ok) {
      console.log("🚀 ~ status:", response.status);
      if (response.status === 401) {
        handleRedirect("/login");
      } else if (response.status === 402) {
        emitter.emit("402-error", "Credits not enough");
        console.log("🚀 ~ emitter.emit 402 error");
      } else if (response.status === 403) {
        handleRedirect("/subscription");
      } else {
        const error = await response.json();
        throw new Error(error.message || "An error occurred", {
          cause: response.status,
        });
      }
    }

    const headers = response.headers;
    console.log("🚀 ~ headers:", JSON.stringify(headers));
    // TODO 2024-06-20 Create a general handler to handle custom headers
    const costs = headers.get("X-Costs") ?? "0";
    if (Number(costs) > 0) {
      console.log("🚀 ~ 💰💰💰 costs:", costs);
      useUserInfoStore.getState().decrementCredit(Number(costs));
    }

    return await response.json();
  } catch (error) {
    console.log("🚀 ~ doFetchData ~ error:", error);
    throw error;
  }
};

// GET method
export const GET = <T>({
  url,
  token,
  params,
  config = {},
  onClientRedirect,
  ...rest
}: TDoFetchDataProps): Promise<T> => {
  return doFetchData<T>({
    url,
    token,
    params,
    config: {
      ...config,
      method: "GET",
    },
    onClientRedirect,
    ...rest,
  });
};

// POST method
export const POST = <T>({
  url,
  token,
  params,
  data,
  config,
  onClientRedirect,
  ...rest
}: TDoFetchDataProps): Promise<T> => {
  return doFetchData<T>({
    url,
    token,
    params,
    config: {
      ...config,
      method: "POST",
      body: data && JSON.stringify(data),
    },
    onClientRedirect,
    ...rest,
  });
};

// PUT method
export const PUT = <T>({
  url,
  token,
  params,
  data,
  config,
  onClientRedirect,
  ...rest
}: TDoFetchDataProps): Promise<T> => {
  return doFetchData<T>({
    url,
    token,
    params,
    config: {
      ...config,
      method: "PUT",
      body: data && JSON.stringify(data),
    },
    onClientRedirect,
    ...rest,
  });
};

// PATCH method
export const PATCH = <T>({
  url,
  token,
  params,
  data,
  config,
  onClientRedirect,
  ...rest
}: TDoFetchDataProps): Promise<T> => {
  return doFetchData<T>({
    url,
    token,
    params,
    config: {
      ...config,
      method: "PATCH",
      body: data && JSON.stringify(data),
    },
    onClientRedirect,
    ...rest,
  });
};

// DELETE method
export const DELETE = <T>({
  url,
  token,
  params,
  data,
  config,
  onClientRedirect,
  ...rest
}: TDoFetchDataProps): Promise<T> => {
  return doFetchData<T>({
    url,
    token,
    params,
    config: {
      ...config,
      method: "DELETE",
      body: data && JSON.stringify(data),
    },
    onClientRedirect,
    ...rest,
  });
};
