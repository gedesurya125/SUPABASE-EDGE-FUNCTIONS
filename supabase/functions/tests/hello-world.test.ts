// Import required libraries and modules
import {
  assert,
  assertEquals,
  assertExists,
} from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { delay } from "https://deno.land/x/delay@v0.2.0/mod.ts";
import { getTestSupabaseClient } from "./_shared/getTestSupabaseClient.ts";

const testHelloWorld = async () => {
  // var client: SupabaseClient = createClient(supabaseUrl, supabaseKey, options);
  var client: SupabaseClient = getTestSupabaseClient();

  // Invoke the 'hello-world' function with a parameter
  const { data: func_data, error: func_error } = await client.functions.invoke(
    "hello-world",
    {
      body: { name: "bar" },
    },
  );

  // Check for errors from the function invocation
  if (func_error) {
    throw new Error("Invalid response: " + func_error.message);
  }

  // Log the response from the function
  console.log(JSON.stringify(func_data, null, 2));

  // Assert that the function returned the expected result
  assertEquals(func_data.message, "Hello bar!");
};

// Register and run the tests
Deno.test("Hello-world Function Test", testHelloWorld);
