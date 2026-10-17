// Pruebas del panel de confirmación (evento onClick de los botones).
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('../api/api.js', async (original) => ({
  ...(await original()),
  Api: { estadoConfirmacion: vi.fn(), conteo: vi.fn(), confirmar: vi.fn(), cancelar: vi.fn() }
}));
import { Api } from '../api/api.js';
import PanelConfirmacion from '../components/PanelConfirmacion.jsx';

const menu = { id_menu: 7, fecha: '2026-10-13' };

describe('PanelConfirmacion', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Api.estadoConfirmacion.mockResolvedValue({ estado: 'pendiente' });
    Api.conteo.mockResolvedValue({ confirmados: 87, total: 100 });
  });

  test('muestra el estado inicial y el conteo de confirmados', async () => {
    render(<PanelConfirmacion menu={menu} />);
    expect(await screen.findByText('Sin confirmar')).toBeInTheDocument();
    expect(screen.getByText('87 de 100')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '87');
  });

  test('al pulsar "Confirmar" llama a la API con el id del menú y muestra el éxito', async () => {
    Api.confirmar.mockResolvedValue({ mensaje: 'ok' });
    render(<PanelConfirmacion menu={menu} />);
    await screen.findByText('Sin confirmar');
    Api.estadoConfirmacion.mockResolvedValue({ estado: 'confirmado' });
    await userEvent.click(screen.getByRole('button', { name: /Confirmar asistencia/ }));
    expect(Api.confirmar).toHaveBeenCalledWith(7);
    expect(await screen.findByText('Tu asistencia fue registrada exitosamente')).toBeInTheDocument();
    expect(await screen.findByText('Confirmado')).toBeInTheDocument();
  });

  test('al pulsar "No asistiré" llama a cancelar y muestra el aviso', async () => {
    Api.cancelar.mockResolvedValue({ mensaje: 'ok' });
    render(<PanelConfirmacion menu={menu} />);
    await screen.findByText('Sin confirmar');
    await userEvent.click(screen.getByRole('button', { name: 'No asistiré mañana' }));
    expect(Api.cancelar).toHaveBeenCalledWith(7);
    expect(await screen.findByText(/Tu reserva fue cancelada/)).toBeInTheDocument();
  });

  test('el botón Confirmar queda deshabilitado cuando ya está confirmado', async () => {
    Api.estadoConfirmacion.mockResolvedValue({ estado: 'confirmado' });
    render(<PanelConfirmacion menu={menu} />);
    await screen.findByText('Confirmado');
    expect(screen.getByRole('button', { name: /Confirmar asistencia/ })).toBeDisabled();
  });

  test('si la API falla muestra el error', async () => {
    Api.confirmar.mockRejectedValue(new Error('Menú no encontrado'));
    render(<PanelConfirmacion menu={menu} />);
    await screen.findByText('Sin confirmar');
    await userEvent.click(screen.getByRole('button', { name: /Confirmar asistencia/ }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Menú no encontrado');
  });
});
