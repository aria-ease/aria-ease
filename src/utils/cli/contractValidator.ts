/**
 * Contract schema validator
 * Validates that generated contracts match the expected structure
 */

interface ValidationError {
  path: string;
  message: string;
}

interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

/**
 * Validates a contract JSON object against the expected schema
 * @param contract - The contract object to validate
 * @returns Validation result with errors if any
 */
export function validateContractSchema(contract: unknown): ValidationResult {
  const errors: ValidationError[] = [];

  if (!contract || typeof contract !== 'object') {
    return {
      valid: false,
      errors: [{ path: '$', message: 'Contract must be an object' }]
    };
  }

  const c = contract as Record<string, unknown>;

  // Validate selectors (required)
  if (!c.selectors) {
    errors.push({ path: '$.selectors', message: 'selectors is required' });
  } else if (typeof c.selectors !== 'object' || c.selectors === null || Array.isArray(c.selectors)) {
    errors.push({ path: '$.selectors', message: 'selectors must be an object' });
  } else {
    const selectors = c.selectors as Record<string, unknown>;
    Object.entries(selectors).forEach(([key, value]) => {
      if (typeof value !== 'string') {
        errors.push({ path: `$.selectors['${key}']`, message: 'All selectors must be strings' });
      }
    });
  }

  // Validate static (required)
  if (!Array.isArray(c.static)) {
    errors.push({ path: '$.static', message: 'static must be an array' });
  } else {
    c.static.forEach((item, idx) => {
      if (typeof item !== 'object' || item === null) {
        errors.push({ path: `$.static[${idx}]`, message: 'static item must be an object' });
        return;
      }

      const staticItem = item as Record<string, unknown>;
      if (!Array.isArray(staticItem.assertions)) {
        errors.push({
          path: `$.static[${idx}].assertions`,
          message: 'assertions must be an array'
        });
        return;
      }

      staticItem.assertions.forEach((assertion, assertIdx) => {
        if (typeof assertion !== 'object' || assertion === null) {
          errors.push({
            path: `$.static[${idx}].assertions[${assertIdx}]`,
            message: 'assertion must be an object'
          });
          return;
        }

        const a = assertion as Record<string, unknown>;
        
        // Validate required assertion fields
        if (typeof a.target !== 'string') {
          errors.push({
            path: `$.static[${idx}].assertions[${assertIdx}].target`,
            message: 'target is required and must be a string'
          });
        }

        if (typeof a.attribute !== 'string') {
          errors.push({
            path: `$.static[${idx}].assertions[${assertIdx}].attribute`,
            message: 'attribute is required and must be a string'
          });
        }

        if (typeof a.failureMessage !== 'string') {
          errors.push({
            path: `$.static[${idx}].assertions[${assertIdx}].failureMessage`,
            message: 'failureMessage is required and must be a string'
          });
        }

        // Validate level if present
        if (a.level !== undefined && !['required', 'recommended', 'optional'].includes(a.level as string)) {
          errors.push({
            path: `$.static[${idx}].assertions[${assertIdx}].level`,
            message: 'level must be one of: required, recommended, optional'
          });
        }
      });
    });
  }

  // Validate dynamic (required)
  if (!Array.isArray(c.dynamic)) {
    errors.push({ path: '$.dynamic', message: 'dynamic must be an array' });
  } else {
    c.dynamic.forEach((item, idx) => {
      if (typeof item !== 'object' || item === null) {
        errors.push({ path: `$.dynamic[${idx}]`, message: 'dynamic item must be an object' });
        return;
      }

      const dynamicItem = item as Record<string, unknown>;

      // Validate description
      if (typeof dynamicItem.description !== 'string') {
        errors.push({
          path: `$.dynamic[${idx}].description`,
          message: 'description is required and must be a string'
        });
      }

      // Validate action
      if (!Array.isArray(dynamicItem.action)) {
        errors.push({
          path: `$.dynamic[${idx}].action`,
          message: 'action is required and must be an array'
        });
      } else {
        dynamicItem.action.forEach((action, actIdx) => {
          if (typeof action !== 'object' || action === null) {
            errors.push({
              path: `$.dynamic[${idx}].action[${actIdx}]`,
              message: 'action item must be an object'
            });
            return;
          }

          const a = action as Record<string, unknown>;
          if (typeof a.type !== 'string') {
            errors.push({
              path: `$.dynamic[${idx}].action[${actIdx}].type`,
              message: 'type is required and must be a string'
            });
          }

          if (typeof a.target !== 'string') {
            errors.push({
              path: `$.dynamic[${idx}].action[${actIdx}].target`,
              message: 'target is required and must be a string'
            });
          }
        });
      }

      // Validate assertions
      if (!Array.isArray(dynamicItem.assertions)) {
        errors.push({
          path: `$.dynamic[${idx}].assertions`,
          message: 'assertions is required and must be an array'
        });
      } else {
        dynamicItem.assertions.forEach((assertion, assertIdx) => {
          if (typeof assertion !== 'object' || assertion === null) {
            errors.push({
              path: `$.dynamic[${idx}].assertions[${assertIdx}]`,
              message: 'assertion must be an object'
            });
            return;
          }

          const a = assertion as Record<string, unknown>;
          if (typeof a.target !== 'string') {
            errors.push({
              path: `$.dynamic[${idx}].assertions[${assertIdx}].target`,
              message: 'target is required and must be a string'
            });
          }

          if (typeof a.assertion !== 'string') {
            errors.push({
              path: `$.dynamic[${idx}].assertions[${assertIdx}].assertion`,
              message: 'assertion is required and must be a string'
            });
          }

          // Validate level if present
          if (a.level !== undefined && !['required', 'recommended', 'optional'].includes(a.level as string)) {
            errors.push({
              path: `$.dynamic[${idx}].assertions[${assertIdx}].level`,
              message: 'level must be one of: required, recommended, optional'
            });
          }
        });
      }
    });
  }

  // Validate relationships if present
  if (c.relationships !== undefined) {
    if (!Array.isArray(c.relationships)) {
      errors.push({ path: '$.relationships', message: 'relationships must be an array' });
    } else {
      c.relationships.forEach((rel, idx) => {
        if (typeof rel !== 'object' || rel === null) {
          errors.push({ path: `$.relationships[${idx}]`, message: 'relationship must be an object' });
          return;
        }

        const r = rel as Record<string, unknown>;
        const type = r.type as string;

        if (!['aria-reference', 'contains'].includes(type)) {
          errors.push({
            path: `$.relationships[${idx}].type`,
            message: 'type must be one of: aria-reference, contains'
          });
        }

        if (type === 'aria-reference') {
          if (typeof r.from !== 'string') {
            errors.push({
              path: `$.relationships[${idx}].from`,
              message: 'from is required for aria-reference and must be a string'
            });
          }
          if (typeof r.attribute !== 'string') {
            errors.push({
              path: `$.relationships[${idx}].attribute`,
              message: 'attribute is required for aria-reference and must be a string'
            });
          }
          if (typeof r.to !== 'string') {
            errors.push({
              path: `$.relationships[${idx}].to`,
              message: 'to is required for aria-reference and must be a string'
            });
          }
        } else if (type === 'contains') {
          if (typeof r.parent !== 'string') {
            errors.push({
              path: `$.relationships[${idx}].parent`,
              message: 'parent is required for contains and must be a string'
            });
          }
          if (typeof r.child !== 'string') {
            errors.push({
              path: `$.relationships[${idx}].child`,
              message: 'child is required for contains and must be a string'
            });
          }
        }
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validates relationship references exist in selectors
 * @param contract - The contract object
 * @param selectorKeys - Set of selector keys
 * @returns Validation errors for missing references
 */
export function validateRelationshipReferences(contract: unknown, selectorKeys: Set<string>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!contract || typeof contract !== 'object') {
    return errors;
  }

  const c = contract as Record<string, unknown>;
  const relationships = c.relationships as Array<Record<string, unknown>> | undefined;

  if (!Array.isArray(relationships)) {
    return errors;
  }

  relationships.forEach((rel, idx) => {
    const type = rel.type as string;

    if (type === 'aria-reference') {
      const from = rel.from as string;
      const to = rel.to as string;

      if (from && !selectorKeys.has(from)) {
        errors.push({
          path: `$.relationships[${idx}].from`,
          message: `Selector '${from}' not found in selectors`
        });
      }

      if (to && !selectorKeys.has(to)) {
        errors.push({
          path: `$.relationships[${idx}].to`,
          message: `Selector '${to}' not found in selectors`
        });
      }
    } else if (type === 'contains') {
      const parent = rel.parent as string;
      const child = rel.child as string;

      if (parent && !selectorKeys.has(parent)) {
        errors.push({
          path: `$.relationships[${idx}].parent`,
          message: `Selector '${parent}' not found in selectors`
        });
      }

      if (child && !selectorKeys.has(child)) {
        errors.push({
          path: `$.relationships[${idx}].child`,
          message: `Selector '${child}' not found in selectors`
        });
      }
    }
  });

  return errors;
}

/**
 * Validates that assertion and action targets exist in selectors
 * @param contract - The contract object
 * @param selectorKeys - Set of selector keys
 * @returns Validation errors for missing targets
 */
export function validateTargetReferences(contract: unknown, selectorKeys: Set<string>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!contract || typeof contract !== 'object') {
    return errors;
  }

  const c = contract as Record<string, unknown>;

  // Check static targets
  const staticItems = c.static as Array<Record<string, unknown>> | undefined;
  if (Array.isArray(staticItems)) {
    staticItems.forEach((item, itemIdx) => {
      const assertions = item.assertions as Array<Record<string, unknown>> | undefined;
      if (Array.isArray(assertions)) {
        assertions.forEach((assertion, assertIdx) => {
          const target = assertion.target as string;
          if (target && !selectorKeys.has(target)) {
            errors.push({
              path: `$.static[${itemIdx}].assertions[${assertIdx}].target`,
              message: `Selector '${target}' not found in selectors`
            });
          }
        });
      }
    });
  }

  // Check dynamic actions and assertions
  const dynamicItems = c.dynamic as Array<Record<string, unknown>> | undefined;
  if (Array.isArray(dynamicItems)) {
    dynamicItems.forEach((item, itemIdx) => {
      // Check actions
      const actions = item.action as Array<Record<string, unknown>> | undefined;
      if (Array.isArray(actions)) {
        actions.forEach((action, actIdx) => {
          const target = action.target as string;
          // Actions can reference selectors or special "document"
          if (target && target !== 'document' && !selectorKeys.has(target)) {
            errors.push({
              path: `$.dynamic[${itemIdx}].action[${actIdx}].target`,
              message: `Selector '${target}' not found in selectors (or use 'document')`
            });
          }
        });
      }

      // Check assertions
      const assertions = item.assertions as Array<Record<string, unknown>> | undefined;
      if (Array.isArray(assertions)) {
        assertions.forEach((assertion, assertIdx) => {
          const target = assertion.target as string;
          // Assertions can reference selectors or special "relative"
          if (target && target !== 'relative' && !selectorKeys.has(target)) {
            errors.push({
              path: `$.dynamic[${itemIdx}].assertions[${assertIdx}].target`,
              message: `Selector '${target}' not found in selectors (or use 'relative')`
            });
          }
        });
      }
    });
  }

  return errors;
}