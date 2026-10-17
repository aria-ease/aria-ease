import { Locator } from "playwright";
import type { ComponentContract } from "Types";

export class TargetScope {
  constructor(
    private root: Locator,
    private selectors: ComponentContract["selectors"],
    private popupLocatorValue: Locator
  ) {}

  locator(key: string, selector?: string): Locator {
    const value = selector ?? this.selectors[key as keyof typeof this.selectors];
    if (!value) throw new Error(`Selector for target ${key} not found.`);

    if (key === "main" || key === "input") return this.root;
    if (key === "popup") return this.popupLocatorValue;
    if (key === "relative") return this.popupLocatorValue.locator(value);
    if (key === "options") return this.popupLocatorValue.locator(value).first();
    if (key === "button") return this.root.locator("xpath=..").locator(value).first();
    return this.root.locator(value).first();
  }

  async resolveRelative(selector: string, relative: string | number): Promise<Locator | null> {
    const items = await this.locator("relative", selector).all();
    if (typeof relative === "number") return items[relative - 1] ?? null;
    if (relative === "first") return items[0] ?? null;
    if (relative === "second") return items[1] ?? null;
    if (relative === "last") return items[items.length - 1] ?? null;

    const activeIndex = await Promise.all(items.map(async (item) =>
      await item.evaluate((element) => element === document.activeElement)
    )).then((active) => active.findIndex(Boolean));
    if (items.length === 0) return null;
    if (relative === "next") return items[(activeIndex + 1 + items.length) % items.length] ?? null;
    if (relative === "previous") return items[(activeIndex - 1 + items.length) % items.length] ?? null;
    return null;
  }

  popup(): Locator {
    return this.popupLocatorValue;
  }
}
