import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';
import { vi } from 'vitest';

test('renders Button with label', () => {
  render(<Button label="Click me" onClick={() => {}} />);
  expect(screen.getByText(/click me/i)).toBeInTheDocument();
});

test('calls onClick when clicked', async () => {
  const onClick = vi.fn();
  render(<Button label="Click me" onClick={onClick} />);

  const button = screen.getByText(/click me/i);
  await userEvent.click(button);

  expect(onClick).toHaveBeenCalledTimes(1);
});
