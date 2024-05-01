import { SupabaseClient } from "supabase";
import { getUrlParams } from "../_shared/getUrlParams.ts";
import { getSupabaseClient } from "../_shared/getSupabaseClient.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE",
};

const defaultHeaders = { ...corsHeaders, "Content-Type": "application/json" };

async function getAllRewards(supabaseClient: SupabaseClient) {
  const { data: customers, error } = await supabaseClient
    .from("purchased_rewards")
    .select("*");
  if (error) throw error;
  return new Response(JSON.stringify({ customers }), {
    headers: defaultHeaders,
    status: 200,
  });
}

async function getSingleRewardByRewardId(
  supabaseClient: SupabaseClient,
  rewardId: string,
) {
  const { data: customers, error } = await supabaseClient
    .from("purchased_rewards")
    .select("*")
    .eq("id", rewardId);

  if (error) throw error;

  return new Response(JSON.stringify({ customers }), {
    headers: defaultHeaders,
    status: 200,
  });
}

Deno.serve(async (req) => {
  const { url, method } = req;

  try {
    const supabaseClient = getSupabaseClient(req);

    const params = getUrlParams({
      url,
      urlPattern: "/rewards-records/:id",
      paramsToRetrieve: ["id"],
    });

    const rewardId = params && params.length > 0 && params[0];

    // call relevant method based on method and id
    switch (true) {
      case rewardId && method === "GET":
        return await getSingleRewardByRewardId(supabaseClient, rewardId);
      case method === "GET":
        return await getAllRewards(supabaseClient);
      default:
        return await getAllRewards(supabaseClient);
    }
  } catch (error) {
    console.error(error);

    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
