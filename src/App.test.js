import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { MONTH_THEMES } from './pages/Booking';

jest.mock('./firebase', () => ({
  signIn: jest.fn(),
  getLastPoolBookList: jest.fn(),
  addPoolBookList: jest.fn(),
}));

test('yönetici giriş ekranını gösterir', () => {
  render(
    <MemoryRouter initialEntries={['/login']}>
      <App />
    </MemoryRouter>
  );

  expect(screen.getByRole('heading', { name: /yönetici girişi/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /^giriş yap$/i })).toBeInTheDocument();
});

test('yılın her ayı için ayrı bir görünüm tanımlar', () => {
  expect(MONTH_THEMES).toHaveLength(12);
  expect(new Set(MONTH_THEMES.map(({ id }) => id)).size).toBe(12);
});
