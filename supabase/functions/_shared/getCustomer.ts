import { SupabaseClient } from "supabase";

type Customer = {
  erp_customer_id: string;
  reward_points: number;
};

type GetCustomerReturnType = Promise<Customer | null>;

// todo reuse this function in get customer api

export const getCustomer = async (
  supabaseClient: SupabaseClient,
  customerId: number,
): GetCustomerReturnType => {
  const { data: customers, error } = await supabaseClient
    .from("customers")
    .select("*")
    .eq("id", customerId);
  if (error) throw error;
  if (customers.length > 0) return customers[0];
  return null;
};
