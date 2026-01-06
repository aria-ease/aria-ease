import path from "path";
import fs from "fs-extra";
/**
 * Validates the structure of an AriaEase config object
 * @param config - The config object to validate
 * @returns Validation result with errors if any
 */
function validateConfig(config) {
    const errors = [];
    if (!config || typeof config !== 'object') {
        errors.push('Config must be an object');
        return { valid: false, errors };
    }
    const cfg = config;
    // Validate audit config if present
    if (cfg.audit !== undefined) {
        if (typeof cfg.audit !== 'object' || cfg.audit === null) {
            errors.push('audit must be an object');
        }
        else {
            // Validate urls
            if (cfg.audit.urls !== undefined) {
                if (!Array.isArray(cfg.audit.urls)) {
                    errors.push('audit.urls must be an array');
                }
                else if (cfg.audit.urls.some(url => typeof url !== 'string')) {
                    errors.push('audit.urls must contain only strings');
                }
            }
            // Validate output format
            if (cfg.audit.output !== undefined) {
                if (typeof cfg.audit.output !== 'object') {
                    errors.push('audit.output must be an object');
                }
                else {
                    const output = cfg.audit.output;
                    if (output.format !== undefined) {
                        if (!['json', 'csv', 'html', 'all'].includes(output.format)) {
                            errors.push('audit.output.format must be one of: json, csv, html, all');
                        }
                    }
                    if (output.out !== undefined && typeof output.out !== 'string') {
                        errors.push('audit.output.out must be a string');
                    }
                }
            }
        }
    }
    // Validate test config if present
    if (cfg.test !== undefined) {
        if (typeof cfg.test !== 'object' || cfg.test === null) {
            errors.push('test must be an object');
        }
        else {
            if (cfg.test.components !== undefined) {
                if (!Array.isArray(cfg.test.components)) {
                    errors.push('test.components must be an array');
                }
                else {
                    cfg.test.components.forEach((comp, idx) => {
                        if (typeof comp !== 'object' || comp === null) {
                            errors.push(`test.components[${idx}] must be an object`);
                        }
                        else {
                            if (typeof comp.name !== 'string') {
                                errors.push(`test.components[${idx}].name must be a string`);
                            }
                            if (typeof comp.path !== 'string') {
                                errors.push(`test.components[${idx}].path must be a string`);
                            }
                        }
                    });
                }
            }
        }
    }
    return { valid: errors.length === 0, errors };
}
/**
 * Attempts to load and parse a config file
 * @param filePath - Absolute path to the config file
 * @returns The parsed config or null if loading fails
 */
async function loadConfigFile(filePath) {
    try {
        const ext = path.extname(filePath);
        if (ext === '.json') {
            // Load JSON file
            const content = await fs.readFile(filePath, 'utf-8');
            return JSON.parse(content);
        }
        else if (['.js', '.mjs', '.cjs', '.ts'].includes(ext)) {
            // Dynamic import for JS/TS modules
            const imported = await import(filePath);
            // Handle both default export and named exports
            return imported.default || imported;
        }
        return null;
    }
    catch {
        // Return null on any error - caller will handle
        return null;
    }
}
/**
 * Searches for and loads an AriaEase config file
 * Checks for config files in this order:
 * - ariaease.config.js
 * - ariaease.config.mjs
 * - ariaease.config.cjs
 * - ariaease.config.json
 * - ariaease.config.ts
 *
 * @param cwd - Current working directory to search in
 * @returns Object containing the config and any errors
 */
export async function loadConfig(cwd = process.cwd()) {
    const configNames = [
        'ariaease.config.js',
        'ariaease.config.mjs',
        'ariaease.config.cjs',
        'ariaease.config.json',
        'ariaease.config.ts'
    ];
    let loadedConfig = null;
    let foundPath = null;
    const errors = [];
    // Try to find and load config
    for (const name of configNames) {
        const configPath = path.resolve(cwd, name);
        if (await fs.pathExists(configPath)) {
            foundPath = configPath;
            loadedConfig = await loadConfigFile(configPath);
            if (loadedConfig === null) {
                errors.push(`Found config at ${name} but failed to load it. Check for syntax errors.`);
                continue;
            }
            // Validate the loaded config
            const validation = validateConfig(loadedConfig);
            if (!validation.valid) {
                errors.push(`Config validation failed in ${name}:`);
                errors.push(...validation.errors.map(err => `  - ${err}`));
                loadedConfig = null;
                continue;
            }
            // Successfully loaded and validated
            break;
        }
    }
    return {
        config: loadedConfig || {},
        configPath: loadedConfig ? foundPath : null,
        errors
    };
}
