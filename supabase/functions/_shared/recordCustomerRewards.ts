import { SupabaseClient } from "supabase";

export type Rewards = {
  erp_item_id: string;
  supabase_customer_id?: number;
  point_spent: number;
};

export const recordCustomerRewards = async (
  supabaseClient: SupabaseClient,
  rewards: Rewards[],
  customerId: number,
) => {
  const { data, error } = await supabaseClient
    .from("purchased_rewards")
    .insert(
      rewards.map((data) => ({
        erp_item_id: data?.erp_item_id,
        supabase_customer_id: customerId,
        point_spent: data?.point_spent,
      })),
    )
    .select("*");

  if (error) throw error;

  return data;
};
