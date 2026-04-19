export type CapabilityContext = { capabilities: string[] };
export type SetupStrategy = { when: string[]; steps: (ctx?: CapabilityContext) => unknown[] };

export function hasCapabilities(ctx: CapabilityContext, requiredCaps: string[]): boolean {
  return requiredCaps.some(cap => ctx.capabilities.includes(cap));
}

export function resolveSetup( setup: SetupStrategy[] | unknown[], ctx: CapabilityContext ): unknown[] {
  // Backward compatibility: if setup is a plain array, treat as default strategy
  if (Array.isArray(setup) && setup.length && !(setup[0] as SetupStrategy).when) {
    setup = [{ when: ["keyboard"], steps: () => setup }];
  }
  for (const strat of setup as SetupStrategy[]) {
    if (hasCapabilities(ctx, strat.when)) {
      return strat.steps(ctx);
    }
  }
  throw new Error(
    `No setup strategy matches capabilities: ${ctx.capabilities.join(", ")}`
  );
}