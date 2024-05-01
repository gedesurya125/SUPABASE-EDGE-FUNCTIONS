import { SupabaseClient } from "supabase";

export const updateSingleCustomerPoints = async (
  supabaseClient: SupabaseClient,
  customerId: number,
  newPoints: number,
) => {
  const { data, error } = await supabaseClient
    .from("customers")
    .update({ reward_points: newPoints })
    .eq("id", customerId)
    .select("*");

  if (error) throw error;

  return data;
};
