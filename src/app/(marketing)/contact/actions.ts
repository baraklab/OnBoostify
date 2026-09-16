"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { contactSchema } from "@/lib/validation/contact";

export interface ContactFormState {
  status: "idle" | "success" | "error";
  error?: string;
}

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { status: "error", error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("contact_messages").insert(parsed.data);

  if (error) {
    return { status: "error", error: "Something went wrong. Please try again." };
  }

  return { status: "success" };
}
