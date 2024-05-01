import { createClient, SupabaseClient } from "supabase";
import { getUrlParams } from "../_shared/getUrlParams.ts";
import { getSupabaseClient } from "../_shared/getSupabaseClient.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE",
};

const defaultHeaders = { ...corsHeaders, "Content-Type": "application/json" };

async function getAllCustomers(supabaseClient: SupabaseClient) {
  const { data: customers, error } = await supabaseClient
    .from("customers")
    .select("*");
  if (error) throw error;
  return new Response(JSON.stringify({ customers }), {
    headers: defaultHeaders,
    status: 200,
  });
}

async function getSingleCustomer(
  supabaseClient: SupabaseClient,
  customerId: string,
) {
  const { data: customers, error } = await supabaseClient
    .from("customers")
    .select("*")
    .eq("id", customerId);

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
      urlPattern: "/customers/:id",
      paramsToRetrieve: ["id"],
    });

    const customerId = params && params.length > 0 && params[0];

    // call relevant method based on method and id
    switch (true) {
      case customerId && method === "GET":
        return await getSingleCustomer(supabaseClient, customerId);
      case method === "GET":
        return await getAllCustomers(supabaseClient);
      default:
        return await getAllCustomers(supabaseClient);
    }
  } catch (error) {
    console.error(error);

    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
