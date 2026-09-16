"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { PlatformIcon } from "@/components/platform/platform-icon";
import { idleActionState } from "@/lib/types/action-state";
import { saveNetworkProfile } from "./actions";
import type { PlatformIdDb } from "@/types/database";

const platformOptions: PlatformIdDb[] = ["x", "linkedin", "medium", "substack"];

export interface OwnListing {
  displayName: string;
  category: string;
  platforms: string[];
  audienceSize: number | null;
  bio: string;
  contactUrl: string;
  isVisible: boolean;
}

export function ListingForm({ listing }: { listing: OwnListing | null }) {
  const [state, formAction, isPending] = useActionState(saveNetworkProfile, idleActionState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="displayName">Name</Label>
        <Input id="displayName" name="displayName" defaultValue={listing?.displayName} required />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="category">Category</Label>
        <Select id="category" name="category" defaultValue={listing?.category ?? "creator"}>
          <option value="influencer">Influencer</option>
          <option value="creator">Creator</option>
          <option value="community">Community</option>
        </Select>
      </div>
      <div>
        <Label>Platforms</Label>
        <div className="mt-2 flex flex-wrap gap-2">
          {platformOptions.map((platform) => (
            <label
              key={platform}
              className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-foreground"
            >
              <input
                type="checkbox"
                name="platforms"
                value={platform}
                defaultChecked={listing?.platforms?.includes(platform)}
                className="size-3.5 rounded border-input"
              />
              <PlatformIcon platform={platform} className="size-3.5" />
              {platform}
            </label>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="audienceSize">Audience size (approx.)</Label>
        <Input id="audienceSize" name="audienceSize" type="number" min={0} defaultValue={listing?.audienceSize ?? undefined} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" name="bio" rows={3} defaultValue={listing?.bio} maxLength={400} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="contactUrl">Contact URL</Label>
        <Input id="contactUrl" name="contactUrl" type="url" defaultValue={listing?.contactUrl} placeholder="https://" />
      </div>
      <label className="flex items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          name="isVisible"
          defaultChecked={listing?.isVisible ?? false}
          className="size-4 rounded border-input"
        />
        List me publicly in the network directory
      </label>

      {state.status === "error" && <p className="text-sm text-destructive">{state.error}</p>}
      {state.status === "success" && <p className="text-sm text-success">Saved.</p>}
      <Button type="submit" loading={isPending} className="self-start">
        Save listing
      </Button>
    </form>
  );
}
