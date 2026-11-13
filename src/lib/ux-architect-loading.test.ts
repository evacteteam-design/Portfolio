import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  LOADING_CREW,
  LOADING_SLOT_MS,
  LONG_WAIT_MS,
  getBoardPlays,
  getLoadingMoment,
  isLongWait,
} from "./ux-architect-loading";

describe("loading scene schedule", () => {
  it("hands the pencil to each crew member in turn, then starts a new round", () => {
    const crewIds = [0, 1, 2, 3, 4, 5].map((tick) => getLoadingMoment(tick).crew.id);
    assert.deepEqual(crewIds, ["persona", "journey", "wireframe", "persona", "journey", "wireframe"]);
  });

  it("gives each crew member a fresh joke every round and wraps after the last one", () => {
    for (const [index, member] of LOADING_CREW.entries()) {
      const seen = member.quips.map(
        (_, round) => getLoadingMoment(index + round * LOADING_CREW.length).quip,
      );
      assert.deepEqual(seen, member.quips);
      const wrapped = getLoadingMoment(index + member.quips.length * LOADING_CREW.length).quip;
      assert.equal(wrapped, member.quips[0]);
    }
  });

  it("starts later generations on a different joke", () => {
    assert.notEqual(getLoadingMoment(0, 0).quip, getLoadingMoment(0, 1).quip);
  });

  it("rebuilds a board exactly when it becomes the active one", () => {
    const plays = (tick: number) => LOADING_CREW.map((_, board) => getBoardPlays(tick, board));
    assert.deepEqual(plays(0), [1, 0, 0]);
    assert.deepEqual(plays(1), [1, 1, 0]);
    assert.deepEqual(plays(2), [1, 1, 1]);
    assert.deepEqual(plays(3), [2, 1, 1]);
    assert.deepEqual(plays(5), [2, 2, 2]);
    assert.deepEqual(plays(6), [3, 2, 2]);
  });

  it("flags a long wait once the generation passes the usual duration", () => {
    const lastQuietTick = Math.ceil(LONG_WAIT_MS / LOADING_SLOT_MS) - 1;
    assert.equal(isLongWait(lastQuietTick), false);
    assert.equal(isLongWait(lastQuietTick + 1), true);
  });
});
