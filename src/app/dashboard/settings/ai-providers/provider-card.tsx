"use client";

import * as React from "react";
import { useActionState } from "react";
import { CheckCircle2, XCircle, Star, Trash2, KeyRound, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { idleActionState } from "@/lib/types/action-state";
import {
  saveAIProvider,
  testAIProviderConnection,
  deleteAIProvider,
  setDefaultAIProvider,
  testStoredAIProviderConnection,
  type TestConnectionState,
} from "./actions";
import type { AIProviderDefinition } from "@/lib/ai/types";

interface ConfiguredProvider {
  id: string;
  defaultModel: string;
  isDefault: boolean;
  lastTestStatus: "success" | "failed" | null;
  maskedKey: string;
}

const testInitial: TestConnectionState = { status: "idle" };

export function ProviderCard({
  definition,
  configured,
}: {
  definition: AIProviderDefinition;
  configured: ConfiguredProvider | null;
}) {
  const [editing, setEditing] = React.useState(!configured);
  const [isPending, startTransition] = React.useTransition();
  const [saveState, saveAction, isSaving] = useActionState(saveAIProvider, idleActionState);
  const [testState, testAction, isTesting] = useActionState(testAIProviderConnection, testInitial);
  const [storedTestState, setStoredTestState] = React.useState<TestConnectionState>(testInitial);
  const [storedTesting, startStoredTest] = React.useTransition();

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading text-[15px] font-semibold text-foreground">{definition.name}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{definition.docsUrl.replace("https://", "")}</p>
        </div>
        {configured && (
          <div className="flex items-center gap-1.5">
            {configured.isDefault && <Badge variant="accent">Default</Badge>}
            {configured.lastTestStatus === "success" && <Badge variant="success">Verified</Badge>}
            {configured.lastTestStatus === "failed" && <Badge variant="destructive">Failing</Badge>}
          </div>
        )}
      </div>

      {configured && !editing ? (
        <div className="mt-4 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <KeyRound className="size-3.5" />
            <span className="font-mono-tech">{configured.maskedKey}</span>
          </div>
          <p className="text-sm text-foreground">Model: {configured.defaultModel}</p>

          {storedTestState.status === "error" && (
            <p className="text-xs text-destructive">{storedTestState.error}</p>
          )}

          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={storedTesting}
              onClick={() =>
                startStoredTest(async () => {
                  const result = await testStoredAIProviderConnection(configured.id);
                  setStoredTestState(result);
                })
              }
            >
              {storedTesting ? <Loader2 className="size-3.5 animate-spin" /> : null}
              Test connection
            </Button>
            {!configured.isDefault && (
              <Button
                size="sm"
                variant="outline"
                disabled={isPending}
                onClick={() => startTransition(() => setDefaultAIProvider(configured.id))}
              >
                <Star className="size-3.5" />
                Make default
              </Button>
            )}
            <Button size="sm" variant="ghost" onClick={() => setEditing(true)}>
              Update key
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-destructive hover:bg-destructive-soft"
              disabled={isPending}
              onClick={() => startTransition(() => deleteAIProvider(configured.id))}
            >
              <Trash2 className="size-3.5" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <form action={saveAction} className="mt-4 flex flex-col gap-3">
          <input type="hidden" name="provider" value={definition.id} />
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${definition.id}-apiKey`}>API key</Label>
            <Input
              id={`${definition.id}-apiKey`}
              name="apiKey"
              type="password"
              placeholder={definition.apiKeyPlaceholder}
              required
              autoComplete="off"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${definition.id}-model`}>Default model</Label>
            <Select id={`${definition.id}-model`} name="defaultModel" defaultValue={definition.defaultModel}>
              {definition.models.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </Select>
          </div>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              name="isDefault"
              defaultChecked={configured?.isDefault ?? false}
              className="size-4 rounded border-input"
            />
            Use as default AI provider
          </label>

          {testState.status === "success" && (
            <p className="flex items-center gap-1.5 text-xs text-success">
              <CheckCircle2 className="size-3.5" /> Connection works.
            </p>
          )}
          {testState.status === "error" && (
            <p className="flex items-center gap-1.5 text-xs text-destructive">
              <XCircle className="size-3.5" /> {testState.error}
            </p>
          )}
          {saveState.status === "error" && <p className="text-xs text-destructive">{saveState.error}</p>}

          <div className="flex flex-wrap gap-2">
            <Button type="submit" size="sm" loading={isSaving}>
              Save
            </Button>
            <Button type="submit" size="sm" variant="outline" formAction={testAction} loading={isTesting}>
              Test connection
            </Button>
            {configured && (
              <Button type="button" size="sm" variant="ghost" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
