import { useState } from 'react';
import { TODO_DESCRIPTION_MAX_LENGTH } from '../constants';

export function TodoForm({ onCreate }) {
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();

    const value = description.trim();
    if (!value) {
      setError('This field may not be blank.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onCreate(value);
      setDescription('');
    } catch (err) {
      const fieldError = err.fields && err.fields.description;
      setError(fieldError || err.message || 'Could not save todo.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor="todo">ToDo: </label>
        <input
          id="todo"
          name="todo"
          type="text"
          value={description}
          onChange={(event) => {
            setDescription(event.target.value);
            if (error) {
              setError(null);
            }
          }}
          maxLength={TODO_DESCRIPTION_MAX_LENGTH}
          disabled={isSubmitting}
          autoComplete="off"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'todo-error' : undefined}
        />
      </div>
      {error && (
        <p id="todo-error" className="todo-status todo-status-error" role="alert">
          {error}
        </p>
      )}
      <div className="todo-form-actions">
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Adding…' : 'Add ToDo!'}
        </button>
      </div>
    </form>
  );
}
