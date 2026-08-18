export function TodoList({ todos, isLoading, error, onRetry }) {
  if (isLoading && todos.length === 0) {
    return <p className="todo-status">Loading todos…</p>;
  }

  if (error && todos.length === 0) {
    return (
      <div className="todo-status todo-status-error" role="alert">
        <p>{error}</p>
        {onRetry && (
          <button type="button" onClick={() => onRetry()}>
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="todo-status todo-status-error" role="alert">
          <p>{error}</p>
          {onRetry && (
            <button type="button" onClick={() => onRetry()}>
              Retry
            </button>
          )}
        </div>
      )}
      {todos.length === 0 ? (
        <p className="todo-status">No todos yet.</p>
      ) : (
        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo.id}>{todo.description}</li>
          ))}
        </ul>
      )}
    </>
  );
}
