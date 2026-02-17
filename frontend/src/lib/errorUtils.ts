/**
 * Utility functions for handling and formatting errors
 */

/**
 * Type guard to check if a value is an object with a specific property
 */
function hasProperty<K extends string>(obj: unknown, key: K): obj is Record<K, unknown> {
  return typeof obj === 'object' && obj !== null && key in obj;
}

/**
 * Type guard to check if a value is an object with a string property
 */
function hasStringProperty<K extends string>(obj: unknown, key: K): obj is Record<K, string> {
  return hasProperty(obj, key) && typeof (obj as Record<K, unknown>)[key] === 'string';
}

/**
 * Formats error details from API responses into a user-friendly string
 * Handles various error formats including:
 * - String messages
 * - Pydantic validation errors (array of objects)
 * - Error objects with msg/message properties
 */
export function formatErrorMessage(detail: unknown, fallback: string = 'An error occurred'): string {
  if (!detail) {
    return fallback;
  }

  // Handle string detail
  if (typeof detail === 'string') {
    return detail;
  }

  // Handle array of validation errors (Pydantic)
  if (Array.isArray(detail)) {
    return detail
      .map((err: unknown) => {
        if (typeof err === 'string') {
          return err;
        }
        if (hasStringProperty(err, 'msg')) {
          return err.msg;
        }
        if (hasStringProperty(err, 'message')) {
          return err.message;
        }
        return JSON.stringify(err);
      })
      .join(', ');
  }

  // Handle object detail
  if (typeof detail === 'object') {
    if (hasStringProperty(detail, 'msg')) {
      return detail.msg;
    }
    if (hasStringProperty(detail, 'message')) {
      return detail.message;
    }
    // Last resort: stringify the object
    try {
      return JSON.stringify(detail);
    } catch {
      return fallback;
    }
  }

  return fallback;
}

/**
 * Extracts error message from axios error response
 */
export function extractErrorMessage(error: unknown, fallback: string = 'An error occurred'): string {
  // Check if there's a response with detail
  if (hasProperty(error, 'response') && 
      hasProperty(error.response, 'data') && 
      hasProperty(error.response.data, 'detail')) {
    return formatErrorMessage(error.response.data.detail, fallback);
  }

  // Check for other error message locations
  if (hasProperty(error, 'response') && 
      hasProperty(error.response, 'data') && 
      hasProperty(error.response.data, 'message')) {
    return formatErrorMessage(error.response.data.message, fallback);
  }

  // Check for direct error message
  if (hasStringProperty(error, 'message')) {
    return error.message;
  }

  return fallback;
}
