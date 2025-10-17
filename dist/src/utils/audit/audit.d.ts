import * as axe_core from 'axe-core';

declare function runAudit(url: string): Promise<axe_core.AxeResults>;

export { runAudit };
