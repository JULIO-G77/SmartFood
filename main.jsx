// Pruebas de integración de la aplicación: sesión, navegación y cierre de sesión.
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('../api/api.js', async (original) => ({
  ...(await original()),
  Api: {
    login: vi.fn(), menuHoy: vi.fn(), menuManana: vi.fn(), menuSemana: vi.fn(), historial: vi.fn(),
    notificaciones: vi.fn(), noLeidas: vi.fn(), marcarLeidas: vi.fn()
  }
}));
import { Api } from '../api/api.js';
import App from '../App.jsx';

const menu = { id_menu: 1, fecha: '2026-10-13', entrada: 'Sopa', plato_principal: 'Arroz con pollo', bebida: 'Jugo', postre: 'Fruta' };
const usuario = { id: 2, nombre: 'Sofía Martínez', rol: 'estudiante' };

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    Api.menuHoy.mockResolvedValue(menu);
    Api.menuManana.mockResolvedValue(menu);
    Api.menuSemana.mockResolvedValue([menu]);
    Api.historial.mockResolvedValue([{ id_confirmacion: 1, estado: 'confirmado', Menu: menu }]);
    Api.notificaciones.mockResolvedValue([{ id_notificacion: 1, titulo: 'Menú publicado', mensaje: 'Confirma tu asistencia', leida: 0 }]);
    Api.noLeidas.mockResolvedValue({ count: 3 });
    Api.marcarLeidas.mockResolvedValue({});
  });

  test('sin sesión muestra el formulario de ingreso', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Iniciar sesión' })).toBeInTheDocument();
  });

  test('con sesión guardada muestra el inicio, el nombre y el contador de avisos', async () => {
    localStorage.setItem('sf_token', 't'); localStorage.setItem('sf_usuario', JSON.stringify(usuario));
    render(<App />);
    expect(await screen.findByText('Sofía Martínez')).toBeInTheDocument();
    expect(await screen.findByText('Menú de mañana')).toBeInTheDocument();
    expect(await screen.findByText('3')).toBeInTheDocument();
  });

  test('el menú lateral cambia de pantalla', async () => {
    localStorage.setItem('sf_token', 't'); localStorage.setItem('sf_usuario', JSON.stringify(usuario));
    render(<App />);
    await screen.findByText('Menú de mañana');
    await userEvent.click(screen.getByRole('button', { name: 'Mi historial' }));
    expect(await screen.findByRole('heading', { name: 'Mi historial' })).toBeInTheDocument();
    expect(screen.getByText('Arroz con pollo')).toBeInTheDocument();
  });

  test('abrir notificaciones las marca como leídas y quita el contador', async () => {
    localStorage.setItem('sf_token', 't'); localStorage.setItem('sf_usuario', JSON.stringify(usuario));
    render(<App />);
    await screen.findByText('3');
    await userEvent.click(screen.getByRole('button', { name: /Notificaciones: 3 sin leer/ }));
    expect(await screen.findByText('Confirma tu asistencia')).toBeInTheDocument();
    expect(Api.marcarLeidas).toHaveBeenCalled();
    expect(await screen.findByRole('button', { name: 'Notificaciones: 0 sin leer' })).toBeInTheDocument();
  });

  test('Salir borra la sesión y vuelve al ingreso', async () => {
    localStorage.setItem('sf_token', 't'); localStorage.setItem('sf_usuario', JSON.stringify(usuario));
    render(<App />);
    await screen.findByText('Menú de mañana');
    await userEvent.click(screen.getByRole('button', { name: 'Salir' }));
    expect(screen.getByRole('heading', { name: 'Iniciar sesión' })).toBeInTheDocument();
    expect(localStorage.getItem('sf_token')).toBeNull();
  });
});
