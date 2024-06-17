import { redirect } from "next/navigation";
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
  onClientRedirect?: (url: string) => void;
};

const doFetchData = async <T>({
  url,
  token,
  params,
  config = {},
  onClientRedirect,
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

  const response = await fetch(`${baseURL}${url}`, {
    ...config,
    headers: defaultHeaders,
  });

  console.log("🚀 ~ response:", response);

  if (!response.ok) {
    console.log("🚀 ~ status:", response.status);
    if (response.status === 401) {
      handleRedirect("/login");
    } else if (response.status === 403) {
      handleRedirect("/subscription");
    } else {
      const error = await response.json();
      throw new Error(error.message || "An error occurred");
    }
  }

  return await response.json();
};

// GET method
export const GET = <T>({
  url,
  token,
  params,
  config = {},
  onClientRedirect,
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
  });
};
