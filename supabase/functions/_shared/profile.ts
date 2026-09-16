import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

/** Used to be created automatically by a trigger on auth.users insert (see the dropped
 *  handle_new_user() in 0007_custom_auth.sql). Auth is no longer Supabase's, so every place
 *  that creates a verified user now creates its profile row explicitly right here instead. */
export async function ensureProfile(
  supabase: SupabaseClient,
  userId: number,
  fullName: string | null,
): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .upsert({ id: userId, full_name: fullName }, { onConflict: "id", ignoreDuplicates: true });
  if (error) {
    console.error("ensureProfile: upsert failed", error);
  }
}
