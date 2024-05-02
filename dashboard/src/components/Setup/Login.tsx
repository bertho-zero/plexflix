import { useEffect, useState } from 'react';

interface LoginProps {
  onComplete: () => void
}

export default function Login({ onComplete }: LoginProps) {
  const [inputValue, setinputValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setinputValue(e.target.value);
  };

  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const response = await fetch('/api/auth', {
      method: 'POST',
      body: JSON.stringify(Object.fromEntries(formData.entries())),
    });

    try {
      const body = await response.json();
      if (!response.ok) return setError(body.error ?? 'Unknown error');
      onComplete();
    } catch (e) {
      console.error(e);
      setError('Unknown error');
    }
  };

  // Check if user is already logged
  useEffect(() => {
    (async () => {
      const response = await fetch('/api/auth');
      if (!response.ok) return;
      const body = await response.json();
      if (body.isLogged) {
        onComplete();
      }
    })();
  }, []);

  return (
    <form style={{ color: 'white' }} onSubmit={login}>
      <label>
        <div>Password</div>
        <input
          name="username"
          type="text"
          autoComplete="username"
          hidden
        />
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          value={inputValue}
          onChange={onChange}
          style={{ color: 'black' }}
        />
        {error ? (
          <div>{error}</div>
        ) : null}
        <button type="submit">
          Submit
        </button>
      </label>
    </form>
  );
}
