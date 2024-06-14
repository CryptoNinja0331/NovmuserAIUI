export type TSubscriptionPlan = {
  price_name: string;
  price_description: string;
  amount: string;
  currency: string;
  stripe_price_id: string;
  type: string;
  interval: string;
  id: string;
  services: string[];
  in_active: boolean;
};

export type TSubscriptionInfo = {
  id: string;
  order_id: string;
  price_id: string;
  sub_id: string;
  cancel_at_period_end: boolean;
  start_time: string;
  end_time: string;
  status: string;
};
