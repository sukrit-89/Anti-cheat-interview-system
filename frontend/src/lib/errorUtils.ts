function hasProperty<K extends string>(obj: unknown, key: K): obj is Record<K, unknown> {
  return typeof obj === 'object' && obj !== null && key in obj;
}

function hasStringProperty<K extends string>(obj: unknown, key: K): obj is Record<K, string> {
  return hasProperty(obj, key) && typeof (obj as Record<K, unknown>)[key] === 'string';
}

export function formatErrorMessage(detail: unknown, fallback: string = 'An error occurred'): string {
  if (!detail) {
    return fallback;
  }

  if (typeof detail === 'string') {
    return detail;
  }

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

  if (typeof detail === 'object') {
    if (hasStringProperty(detail, 'msg')) {
      return detail.msg;
    }
    if (hasStringProperty(detail, 'message')) {
      return detail.message;
    }
    try {
      return JSON.stringify(detail);
    } catch {
      return fallback;
    }
  }

  return fallback;
}

export function extractErrorMessage(error: unknown, fallback: string = 'An error occurred'): string {
  if (hasProperty(error, 'response') && 
      hasProperty(error.response, 'data') && 
      hasProperty(error.response.data, 'detail')) {
    return formatErrorMessage(error.response.data.detail, fallback);
  }

  if (hasProperty(error, 'response') && 
      hasProperty(error.response, 'data') && 
      hasProperty(error.response.data, 'message')) {
    return formatErrorMessage(error.response.data.message, fallback);
  }

  if (hasStringProperty(error, 'message')) {
    return error.message;
  }

  return fallback;
}
