export const ALLOWED_STATUSES = [
  "Published",
  "Draft",
  "Pending Confirmation",
] as const;

export type ProjectStatus = (typeof ALLOWED_STATUSES)[number];

export function isProjectStatus(value: unknown): value is ProjectStatus {
  return typeof value === "string" && (ALLOWED_STATUSES as readonly string[]).includes(value);
}

// Length and boundary constraints
export const PROJECT_LIMITS = {
  MIN_TITLE_LENGTH: 2,
  MAX_TITLE_LENGTH: 200,
  MIN_SLUG_LENGTH: 2,
  MAX_SLUG_LENGTH: 100,
  MAX_CATEGORY_LENGTH: 100,
  MAX_SUMMARY_LENGTH: 1000,
  MAX_CTA_LABEL_LENGTH: 100,
  MAX_IMAGE_PATH_LENGTH: 500,
  MAX_IMAGE_ALT_LENGTH: 200,
  MAX_IMAGE_ASPECT_LENGTH: 50,
  MAX_IMAGE_POSITION_LENGTH: 50,
  MAX_ARRAY_ITEM_LENGTH: 500,
  MAX_ARRAY_ITEMS: 50,
} as const;

/**
 * Normalizes an arbitrary text string into a URL-safe lowercase slug.
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // remove non-alphanumeric chars (preserving hyphens/spaces)
    .replace(/[\s_-]+/g, "-") // collapse spaces and underscores into single hyphen
    .replace(/^-+|-+$/g, ""); // trim leading/trailing hyphens
}

/**
 * Validates that a normalized slug meets URL safety and length criteria.
 */
export function isValidSlug(slug: string): boolean {
  return (
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) &&
    slug.length >= PROJECT_LIMITS.MIN_SLUG_LENGTH &&
    slug.length <= PROJECT_LIMITS.MAX_SLUG_LENGTH
  );
}

/**
 * Validates an order value strictly as a non-negative integer.
 * Rejects malformed values (floats, negative numbers, non-digit strings).
 */
export function validateOrder(
  orderRaw: unknown
): { valid: true; value: number } | { valid: false; error: string } {
  if (orderRaw === undefined || orderRaw === null) {
    return { valid: false, error: "Order is required." };
  }
  const str = String(orderRaw).trim();
  if (!str) {
    return { valid: false, error: "Order cannot be empty." };
  }
  if (!/^\d+$/.test(str)) {
    return {
      valid: false,
      error: "Order must be a non-negative whole integer (e.g. 0, 1, 2).",
    };
  }
  const num = Number(str);
  if (!Number.isSafeInteger(num) || num < 0) {
    return { valid: false, error: "Order must be a valid non-negative integer." };
  }
  return { valid: true, value: num };
}

/**
 * Validates project ID format.
 */
export function validateProjectId(
  id: unknown
): { valid: true; id: string } | { valid: false; error: string } {
  if (typeof id !== "string" || !id.trim()) {
    return { valid: false, error: "A valid project ID is required." };
  }
  const trimmed = id.trim();
  if (trimmed.length < 1 || trimmed.length > 100) {
    return { valid: false, error: "Invalid project ID length." };
  }
  return { valid: true, id: trimmed };
}

export type ParseArrayResult =
  | { success: true; data: string[] }
  | { success: false; error: string };

/**
 * Safely extracts an array of strings from FormData without silent corruption.
 * Supports:
 * 1. Multiple entries with the same name (`formData.getAll(name)`)
 * 2. Array-bracket notation (`formData.getAll(`${name}[]`)`)
 * 3. JSON serialized array string (`"[\"item 1\", \"item 2\"]"`)
 * 4. Newline-delimited text from textareas
 */
export function parseStringArray(
  formData: FormData,
  fieldName: string
): ParseArrayResult {
  const standardEntries = formData.getAll(fieldName);
  const bracketEntries = formData.getAll(`${fieldName}[]`);
  const rawList = standardEntries.length > 0 ? standardEntries : bracketEntries;

  // Case 1: Multiple values submitted
  if (rawList.length > 1) {
    const items: string[] = [];
    for (let i = 0; i < rawList.length; i++) {
      const entry = rawList[i];
      if (typeof entry !== "string") {
        return {
          success: false,
          error: `Item ${i + 1} in ${fieldName} must be text.`,
        };
      }
      const trimmed = entry.trim();
      if (trimmed.length > 0) {
        if (trimmed.length > PROJECT_LIMITS.MAX_ARRAY_ITEM_LENGTH) {
          return {
            success: false,
            error: `Each item in ${fieldName} must not exceed ${PROJECT_LIMITS.MAX_ARRAY_ITEM_LENGTH} characters.`,
          };
        }
        items.push(trimmed);
      }
    }
    if (items.length > PROJECT_LIMITS.MAX_ARRAY_ITEMS) {
      return {
        success: false,
        error: `${fieldName} cannot exceed ${PROJECT_LIMITS.MAX_ARRAY_ITEMS} items.`,
      };
    }
    return { success: true, data: items };
  }

  // Case 2: Single value submitted (may be empty, JSON, or newline-delimited)
  const singleValue =
    formData.get(fieldName)?.toString() ??
    formData.get(`${fieldName}[]`)?.toString();

  if (singleValue === undefined || singleValue === null) {
    return { success: true, data: [] };
  }

  const trimmed = singleValue.trim();
  if (!trimmed) {
    return { success: true, data: [] };
  }

  // Attempt JSON parsing if it appears to be JSON
  if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (!Array.isArray(parsed)) {
        return {
          success: false,
          error: `${fieldName} must be an array of text strings.`,
        };
      }
      const items: string[] = [];
      for (let i = 0; i < parsed.length; i++) {
        const item = parsed[i];
        if (typeof item !== "string") {
          return {
            success: false,
            error: `Item ${i + 1} in ${fieldName} must be a string.`,
          };
        }
        const clean = item.trim();
        if (clean.length > 0) {
          if (clean.length > PROJECT_LIMITS.MAX_ARRAY_ITEM_LENGTH) {
            return {
              success: false,
              error: `Each item in ${fieldName} must not exceed ${PROJECT_LIMITS.MAX_ARRAY_ITEM_LENGTH} characters.`,
            };
          }
          items.push(clean);
        }
      }
      if (items.length > PROJECT_LIMITS.MAX_ARRAY_ITEMS) {
        return {
          success: false,
          error: `${fieldName} cannot exceed ${PROJECT_LIMITS.MAX_ARRAY_ITEMS} items.`,
        };
      }
      return { success: true, data: items };
    } catch {
      return {
        success: false,
        error: `Malformed JSON provided for ${fieldName}.`,
      };
    }
  }

  // Fallback: newline-delimited lines (standard textarea submission)
  const lines = trimmed.split("\n");
  const items: string[] = [];
  for (const line of lines) {
    const clean = line.trim();
    if (clean.length > 0) {
      if (clean.length > PROJECT_LIMITS.MAX_ARRAY_ITEM_LENGTH) {
        return {
          success: false,
          error: `Each item in ${fieldName} must not exceed ${PROJECT_LIMITS.MAX_ARRAY_ITEM_LENGTH} characters.`,
        };
      }
      items.push(clean);
    }
  }
  if (items.length > PROJECT_LIMITS.MAX_ARRAY_ITEMS) {
    return {
      success: false,
      error: `${fieldName} cannot exceed ${PROJECT_LIMITS.MAX_ARRAY_ITEMS} items.`,
    };
  }
  return { success: true, data: items };
}
