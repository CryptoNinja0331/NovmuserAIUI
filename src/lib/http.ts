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

const doFetchData = async <T>(
  url: string,
  token?: string,
  params?: Record<string, string>,
  config: HttpConfig = {}
): Promise<T> => {
  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...config.headers,
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

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "An error occurred");
  }

  const data = await response.json();
  return data;
};

// GET method
export const GET = <T>(
  url: string,
  token?: string,
  params?: Record<string, string>,
  config?: HttpConfig
): Promise<T> => {
  return doFetchData<T>(url, token, params, {
    ...config,
    method: "GET",
  });
};

// POST method
export const POST = <T>(
  url: string,
  token?: string,
  params?: Record<string, string>,
  data?: any,
  config?: HttpConfig
): Promise<T> => {
  return doFetchData<T>(url, token, params, {
    ...config,
    method: "POST",
    body: JSON.stringify(data),
  });
};

// PUT method
export const PUT = <T>(
  url: string,
  token?: string,
  params?: Record<string, string>,
  data?: any,
  config?: HttpConfig
): Promise<T> => {
  return doFetchData<T>(url, token, params, {
    ...config,
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// PATCH method
export const PATCH = <T>(
  url: string,
  token?: string,
  params?: Record<string, string>,
  data?: any,
  config?: HttpConfig
): Promise<T> => {
  return doFetchData<T>(url, token, params, {
    ...config,
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

// DELETE method
export const DELETE = <T>(
  url: string,
  token?: string,
  params?: Record<string, string>,
  config?: HttpConfig
): Promise<T> => {
  return doFetchData<T>(url, token, params, {
    ...config,
    method: "DELETE",
  });
};
