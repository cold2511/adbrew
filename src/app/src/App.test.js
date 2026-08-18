import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from './App';

function jsonResponse(data, { ok = true, status = 200 } = {}) {
  return {
    ok,
    status,
    json: async () => data,
  };
}

afterEach(() => {
  jest.restoreAllMocks();
});

test('renders todos from the API', async () => {
  jest.spyOn(global, 'fetch').mockResolvedValue(
    jsonResponse([
      { id: '1', description: 'Learn Docker', created_at: null },
      { id: '2', description: 'Learn React', created_at: null },
    ])
  );

  render(<App />);

  expect(screen.getByText(/loading todos/i)).toBeInTheDocument();
  expect(await screen.findByText('Learn Docker')).toBeInTheDocument();
  expect(screen.getByText('Learn React')).toBeInTheDocument();
});

test('submitting the form creates a todo and refreshes the list', async () => {
  let todos = [{ id: '1', description: 'Learn Docker', created_at: null }];

  jest.spyOn(global, 'fetch').mockImplementation((url, options = {}) => {
    if (options.method === 'POST') {
      const created = { id: '2', description: 'Learn Hooks', created_at: null };
      todos = todos.concat(created);
      return Promise.resolve(jsonResponse(created, { ok: true, status: 201 }));
    }
    return Promise.resolve(jsonResponse(todos));
  });

  render(<App />);
  expect(await screen.findByText('Learn Docker')).toBeInTheDocument();

  fireEvent.change(screen.getByLabelText(/todo/i), {
    target: { value: 'Learn Hooks' },
  });
  fireEvent.click(screen.getByRole('button', { name: /add todo/i }));

  expect(await screen.findByText('Learn Hooks')).toBeInTheDocument();

  await waitFor(() => {
    const postCall = global.fetch.mock.calls.find(
      ([, options]) => options && options.method === 'POST'
    );
    expect(postCall).toBeTruthy();
    expect(postCall[1].body).toBe(JSON.stringify({ description: 'Learn Hooks' }));
  });
});

test('submitting a blank todo shows a validation error', async () => {
  jest.spyOn(global, 'fetch').mockResolvedValue(jsonResponse([]));

  render(<App />);
  expect(await screen.findByText(/no todos yet/i)).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /add todo/i }));

  expect(await screen.findByText(/may not be blank/i)).toBeInTheDocument();
  const postCall = global.fetch.mock.calls.find(
    ([, options]) => options && options.method === 'POST'
  );
  expect(postCall).toBeUndefined();
});
