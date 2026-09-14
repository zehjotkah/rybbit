import crypto from "crypto";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Fork-only coverage for the multi-domain `origin` carried in the GSC OAuth
// state. Kept separate from upstream's utils.test.ts to avoid merge conflicts.

const TEST_SECRET = "test-better-auth-secret-0123456789";

const state = vi.hoisted(() => ({ secret: undefined as string | undefined }));

vi.mock("../../lib/const.js", async importOriginal => {
  const actual = await importOriginal<typeof import("../../lib/const.js")>();
  return {
    ...actual,
    get SECRET() {
      return state.secret;
    },
  };
});

vi.mock("../../db/postgres/postgres.js", () => ({ db: {} }));

import { signGSCState, verifyGSCState } from "./utils.js";

function signedState(payload: unknown): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${crypto.createHmac("sha256", TEST_SECRET).update(body).digest("base64url")}`;
}

beforeEach(() => {
  state.secret = TEST_SECRET;
});

describe("GSC state origin (multi-domain)", () => {
  it("round-trips the initiating origin", () => {
    const verified = verifyGSCState(signGSCState(42, "user_abc", "https://analytics.example.com"));

    expect(verified).toMatchObject({ siteId: 42, userId: "user_abc", origin: "https://analytics.example.com" });
  });

  it("omits origin when none is given", () => {
    const verified = verifyGSCState(signGSCState(42, "user_abc"));

    expect(verified).not.toBeNull();
    expect(verified!.origin).toBeUndefined();
  });

  it("rejects an origin swapped in while keeping the original signature", () => {
    const [, signature] = signGSCState(1, "user_abc", "https://analytics.example.com").split(".");
    const attackerBody = Buffer.from(
      JSON.stringify({ siteId: 1, userId: "user_abc", origin: "https://evil.example", ts: Date.now() })
    ).toString("base64url");

    expect(verifyGSCState(`${attackerBody}.${signature}`)).toBeNull();
  });

  it("rejects a correctly signed payload whose origin is not a string", () => {
    const now = Date.now();

    expect(verifyGSCState(signedState({ siteId: 1, userId: "user_abc", origin: 7, ts: now }))).toBeNull();
    expect(verifyGSCState(signedState({ siteId: 1, userId: "user_abc", origin: null, ts: now }))).toBeNull();
    expect(verifyGSCState(signedState({ siteId: 1, userId: "user_abc", origin: {}, ts: now }))).toBeNull();
  });
});
