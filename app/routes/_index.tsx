import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { findById, User } from "~/models/user";
import { getUserId } from "~/services/auth";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request);
  if (!userId) return redirect("login", 302);
  return json(await findById(userId));
};

export default function Route() {
  const { name } = useLoaderData<User>();
  return <h1>Hi {name}</h1>;
}
