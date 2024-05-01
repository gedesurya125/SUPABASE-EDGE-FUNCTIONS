import { SupabaseClient } from "supabase";
import { getUrlParams } from "../_shared/getUrlParams.ts";
import { getSupabaseClient } from "../_shared/getSupabaseClient.ts";
import { getCustomer } from "../_shared/getCustomer.ts";
import { recordCustomerRewards } from "../_shared/recordCustomerRewards.ts";
import { updateSingleCustomerPoints } from "../_shared/updateSingleCustomerPoints.ts";
import {
  defaultCorsHeaders,
  defaultHeaders,
} from "../_shared/defaultHeaders.ts";
import { createResponse } from "../_shared/createResponse.ts";
import { Rewards } from "../_shared/recordCustomerRewards.ts";

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

async function createMultipleRewardsForCustomer(
  supabaseClient: SupabaseClient,
  customerId: string,
  req: Request,
) {
  const customerIdAsNumber = Number(customerId);
  if (isNaN(customerIdAsNumber)) {
    return createResponse({
      message: "Customer id Should be a Number",
      data: null,
      status: 200,
    });
  }

  const rewards: Rewards[] = await req.json().then((data) => data?.rewards);

  const currentCustomer = await getCustomer(supabaseClient, customerIdAsNumber);

  if (!currentCustomer) throw new Error("Customer Not Found");

  const customerPoints = currentCustomer.reward_points;
  const totalRewardPoints = rewards.reduce((acc, cur) => {
    return acc + cur.point_spent;
  }, 0);

  const isPointSufficient = customerPoints >= totalRewardPoints;

  if (!isPointSufficient) {
    return new Response(
      JSON.stringify({ message: "Insufficient Customer Points" }),
      {
        headers: defaultHeaders,
        status: 200,
      },
    );
  }

  const rewardsData = await recordCustomerRewards(
    supabaseClient,
    rewards,
    customerIdAsNumber,
  );
  const customersData = await updateSingleCustomerPoints(
    supabaseClient,
    customerIdAsNumber,
    customerPoints - totalRewardPoints,
  );

  return createResponse({
    message: "Reward Purchase Recorded",
    data: {
      rewards: rewardsData,
      customer: customersData,
    },
    status: 200,
  });
}

Deno.serve(async (req) => {
  const { url, method } = req;

  try {
    const supabaseClient = getSupabaseClient(req);

    const params = getUrlParams({
      url,
      urlPattern: "/rewards-records/:id(\\d+)",
      paramsToRetrieve: ["id"],
    });

    const rewardId = params && params.length > 0 && params[0];

    const paramsOfCreateMultipleRewardForCustomer = getUrlParams({
      url,
      urlPattern: "/rewards-records/customer/:customerId(\\d+)",
      paramsToRetrieve: ["customerId"],
    });
    const customerId = paramsOfCreateMultipleRewardForCustomer &&
      paramsOfCreateMultipleRewardForCustomer.length > 0 &&
      paramsOfCreateMultipleRewardForCustomer[0];

    // call relevant method based on method and id
    switch (true) {
      case customerId && method === "POST":
        return await createMultipleRewardsForCustomer(
          supabaseClient,
          customerId,
          req,
        );
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
      headers: { ...defaultCorsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
