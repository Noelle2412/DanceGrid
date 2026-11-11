import { getChoreo } from "@/api/choreos";
import useChoreoSettings from "./useChoreoSettings";
import useCouples from "./useCouples";
import usePictures from "./usePictures";

/**
 * Cross-store orchestration. The three stores never import each other; this
 * module is the only place that knows about all of them.
 */

let latestLoad = 0;

/**
 * Fetches the choreography ONCE and fills all three stores.
 * Skips the request if this choreography is already loaded (or loading),
 * e.g. right after it was created in this session.
 */
export async function loadChoreo(id: string, { force = false } = {}) {
  const current = useChoreoSettings.getState();
  if (
    !force &&
    current.choreoId === id &&
    (current.isLoaded || current.isLoading)
  ) {
    return;
  }

  const requestId = ++latestLoad;
  useChoreoSettings.getState().beginLoad(id);
  useCouples.getState().beginLoad(id);
  usePictures.getState().beginLoad(id);

  try {
    const choreo = await getChoreo(id);
    if (requestId !== latestLoad) return; // superseded by a newer load or a reset
    useChoreoSettings.getState().hydrate(choreo);
    useCouples.getState().hydrate(choreo);
    usePictures.getState().hydrate(choreo);
  } catch (err: any) {
    if (requestId !== latestLoad) return;
    console.error("Failed to load choreography:", err);
    const message = err?.message || "Failed to load";
    useChoreoSettings.getState().failLoad(message);
    useCouples.getState().failLoad(message);
    usePictures.getState().failLoad(message);
  }
}

/**
 * Renumbers a couple in the couples store AND in every picture, so the
 * dancer keeps its positions. Throws (before changing anything) if the new
 * number is invalid or already taken.
 */
export function renumberCouple(number: number, newNumber: number) {
  useCouples.getState().updateCouple(number, newNumber); // validates first
  usePictures.getState().renumberCouple(number, newNumber);
}

/** Deletes a couple and its positions in every picture. */
export function deleteCouple(number: number) {
  useCouples.getState().deleteCouple(number);
  usePictures.getState().removeCouple(number);
}

/** Clears all three stores and cancels any load that is still in flight. */
export function resetChoreo() {
  latestLoad += 1;
  useChoreoSettings.getState().resetSettings();
  useCouples.getState().resetCouples();
  usePictures.getState().resetPictures();
}

export type SaveStatus =
  /** Settings and couples are on the backend. */
  | "saved"
  /** Logged out and not yet created: nothing was sent, local state only. */
  | "local"
  /** A request failed; local state is kept and the stores are flagged unsaved. */
  | "failed";

/**
 * Saves the settings and the couples together.
 *  - No id yet and logged in: creates the choreography, hands the new id to
 *    the other two stores, then saves the couples.
 *  - Has an id: updates the settings, then saves the couples.
 *  - No id and logged out: does nothing and returns "local".
 * Never throws; failures are visible via saveError / isDirty on the stores.
 */
export async function saveSettingsAndCouples({
  userId,
}: {
  userId?: string | null;
}): Promise<{ id: string | null; created: boolean; status: SaveStatus }> {
  const settingsStore = useChoreoSettings.getState();

  if (!settingsStore.choreoId && !userId) {
    return { id: null, created: false, status: "local" };
  }

  const settingsResult = await settingsStore.saveSettings({ userId });
  if (!settingsResult.ok) {
    return {
      id: settingsResult.id,
      created: settingsResult.created,
      status: "failed",
    };
  }

  // The id may be new: make sure the other stores know it.
  useCouples.getState().setChoreoId(settingsResult.id);
  usePictures.getState().setChoreoId(settingsResult.id);

  const couplesOk = await useCouples.getState().saveCouples();
  return {
    id: settingsResult.id,
    created: settingsResult.created,
    status: couplesOk ? "saved" : "failed",
  };
}
