import { DefaultLocalizationService } from "../DefaultLocalizationService";

jest.mock("../inv.json", () => ({ "language-test-string": "test" }));

describe("translate()", () => {
  // TODO
  it("fetches a translated string from a language file", () => {
    const service = new DefaultLocalizationService();

    const translated = service.translate("language-test-string");

    expect(translated).toBe("test");
  });
});
