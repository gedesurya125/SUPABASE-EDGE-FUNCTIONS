import { defaultHeaders } from "./defaultHeaders.ts";

// TODO: reuse this function to all response

export const createResponse = ({
  message,
  data,
  status,
}: {
  message: string;
  // deno-lint-ignore no-explicit-any
  data: any;
  status: number;
}) => {
  return new Response(JSON.stringify({ message, data }), {
    headers: defaultHeaders,
    status,
  });
};
