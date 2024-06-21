export type TPriceInfo = {
  price_name: string;
  price_description: string;
  amount: string;
  currency: string;
  stripe_price_id: string;
  credit_amount?: string;
  type: string;
  interval: string;
  id: string;
  services: string[];
  in_active: boolean;
};

export type TSubscriptionPlan = TPriceInfo;
