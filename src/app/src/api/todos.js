import { apiUrl, parseApiError, readJson } from './client';

export async function fetchTodos({ signal } = {}) {
  let response;
  try {
    response = await fetch(apiUrl('/todos/'), { signal });
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error;
    }
    throw new Error('Could not reach the API. Is the backend running?');
  }

  if (!response.ok) {
    throw await parseApiError(
      response,
      `Failed to load todos (${response.status})`
    );
  }

  const body = await readJson(response);
  if (!Array.isArray(body)) {
    throw new Error('Unexpected response from server');
  }

  return body;
}

export async function createTodo(description) {
  let response;
  try {
    response = await fetch(apiUrl('/todos/'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description }),
    });
  } catch (error) {
    throw new Error('Could not reach the API. Is the backend running?');
  }

  if (!response.ok) {
    throw await parseApiError(
      response,
      `Failed to create todo (${response.status})`
    );
  }

  return readJson(response);
}
