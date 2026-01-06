import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { loadConfig } from "../../../src/utils/cli/configLoader.js";
import path from "path";
import fs from "fs-extra";
import os from "os";

describe("Config Loader", () => {
  let testDir: string;

  beforeEach(async () => {
    // Create a temporary directory for each test
    testDir = await fs.mkdtemp(path.join(os.tmpdir(), 'aria-ease-config-test-'));
  });

  afterEach(async () => {
    // Clean up
    await fs.remove(testDir);
  });

  // Note: ES module and CJS imports are tested via CLI integration
  // Dynamic imports in test environment have ESM/CJS interop issues

  it("loads valid .json config file", async () => {
    const configContent = {
      audit: {
        urls: ['https://example.com'],
        output: { format: 'html' }
      }
    };
    await fs.writeFile(
      path.join(testDir, 'ariaease.config.json'),
      JSON.stringify(configContent)
    );

    const { config, configPath, errors } = await loadConfig(testDir);

    expect(errors).toEqual([]);
    expect(configPath).toBeTruthy();
    expect(config.audit?.urls).toEqual(['https://example.com']);
  });

  it("returns empty config when no file found", async () => {
    const { config, configPath, errors } = await loadConfig(testDir);

    expect(errors).toEqual([]);
    expect(configPath).toBeNull();
    expect(config).toEqual({});
  });

  it("validates and rejects invalid format", async () => {
    const configContent = {
      audit: {
        urls: ['https://example.com'],
        output: { format: 'invalid-format' }
      }
    };
    await fs.writeFile(
      path.join(testDir, 'ariaease.config.json'),
      JSON.stringify(configContent)
    );

    const { config, configPath, errors } = await loadConfig(testDir);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(e => e.includes('format'))).toBe(true);
    expect(configPath).toBeNull();
    expect(config).toEqual({});
  });

  it("validates and rejects non-array urls", async () => {
    const configContent = {
      audit: {
        urls: 'https://example.com', // Should be an array
      }
    };
    await fs.writeFile(
      path.join(testDir, 'ariaease.config.json'),
      JSON.stringify(configContent)
    );

    const { errors } = await loadConfig(testDir);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(e => e.includes('urls must be an array'))).toBe(true);
  });

  it("handles malformed JSON gracefully", async () => {
    await fs.writeFile(
      path.join(testDir, 'ariaease.config.json'),
      '{ invalid json }'
    );

    const { config, errors } = await loadConfig(testDir);

    expect(errors.length).toBeGreaterThan(0);
    expect(config).toEqual({});
  });

  it("validates test.components structure", async () => {
    const configContent = {
      test: {
        components: [
          { name: 'MyComponent', path: './src/MyComponent' },
          { name: 123 } // Invalid: name should be string, path is missing
        ]
      }
    };
    await fs.writeFile(
      path.join(testDir, 'ariaease.config.json'),
      JSON.stringify(configContent)
    );

    const { errors } = await loadConfig(testDir);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(e => e.includes('test.components'))).toBe(true);
  });
});
