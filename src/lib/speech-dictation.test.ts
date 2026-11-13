import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { mergeDictation, pickDictationLanguage } from "./speech-dictation";

describe("mergeDictation", () => {
  it("appends speech to existing text with a single space and tidies recognizer spacing", () => {
    assert.deepEqual(mergeDictation("An app for dog owners ", "  that   finds walkers ", 500), {
      text: "An app for dog owners that finds walkers",
      truncated: false,
    });
  });

  it("capitalizes speech that starts the field or a new sentence", () => {
    assert.equal(mergeDictation("", "an app for renters", 500).text, "An app for renters");
    assert.equal(mergeDictation("It's for renters.", "they hate moving", 500).text, "It's for renters. They hate moving");
    assert.equal(mergeDictation("It's for renters", "who hate moving", 500).text, "It's for renters who hate moving");
  });

  it("leaves the field untouched until something is heard", () => {
    assert.deepEqual(mergeDictation("Draft idea ", "   ", 500), { text: "Draft idea ", truncated: false });
  });

  it("cuts long speech at a word boundary without eating into the existing text", () => {
    assert.deepEqual(mergeDictation("Pet app", "for busy owners", 20), { text: "Pet app for busy", truncated: true });
    assert.deepEqual(mergeDictation("Twenty chars exactly", "more", 20), {
      text: "Twenty chars exactly",
      truncated: true,
    });
  });
});

describe("pickDictationLanguage", () => {
  it("keeps regional English accents and falls back to US English otherwise", () => {
    assert.equal(pickDictationLanguage("en-IN"), "en-IN");
    assert.equal(pickDictationLanguage("en"), "en");
    assert.equal(pickDictationLanguage("hi-IN"), "en-US");
    assert.equal(pickDictationLanguage(undefined), "en-US");
  });
});
