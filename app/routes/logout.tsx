import { LoaderFunctionArgs } from "@remix-run/node";
import { logout } from "~/services/auth";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return await logout(request);
};
