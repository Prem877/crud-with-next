// pages/api/update-user.ts
import { supabase } from "@/utils/supabase/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId, data } = req.body;
  await supabase.from("User").update(data).eq("id", userId);
  res.status(200).json({ message: "User updated" });
}
