export function logAction(action, data = {}) {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    action,
    ...data,
  }, null, 2));
}

export function logError(action, error, userId = null) {
  console.error(JSON.stringify({
    timestamp: new Date().toISOString(),
    action,
    error: error.message,
    userId,
  }, null, 2));
}
