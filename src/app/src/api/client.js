const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

export class ApiError extends Error {
  constructor(message, { status, fields } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fields = fields || {};
  }
}

export async function readJson(response) {
  try {
    return await response.json();
  } catch (error) {
    return null;
  }
}

export function apiUrl(path) {
  return `${API_BASE_URL}${path}`;
}

export async function parseApiError(response, fallbackMessage) {
  const body = await readJson(response);
  const fields = body && typeof body === 'object' && !Array.isArray(body) ? body : {};
  const message = fields.detail || fields.description || fallbackMessage;
  return new ApiError(message, { status: response.status, fields });
}
