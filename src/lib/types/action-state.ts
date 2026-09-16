export interface ActionState {
  status: "idle" | "success" | "error";
  error?: string;
}

export const idleActionState: ActionState = { status: "idle" };
