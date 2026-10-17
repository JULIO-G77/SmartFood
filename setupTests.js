// Pruebas de la pantalla de perfil: guardado de datos y cambio de contraseña.
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('../api/api.js', async (original) => ({
  ...(await original()),
  Api: { perfil: vi.fn(), actualizarPerfil: vi.fn(), cambiarPassword: vi.fn() }
}));
import { Api } from '../api/api.js';
import Perfil from '../components/Perfil.jsx';

describe('Perfil', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Api.perfil.mockResolvedValue({ nombre: 'Sofía Martínez', perfil: { curso: '11°A', ciudad: 'San Juan', alergias: 'Ninguna', preferencias: 'ninguna' } });
  });

  test('carga los datos actuales en el formulario', async () => {
    render(<Perfil />);
    expect(await screen.findByDisplayValue('Sofía Martínez')).toBeInTheDocument();
    expect(screen.getByDisplayValue('San Juan')).toBeInTheDocument();
  });

  test('al guardar envía los datos editados a la API', async () => {
    Api.actualizarPerfil.mockResolvedValue({ mensaje: 'ok' });
    render(<Perfil />);
    const alergias = await screen.findByLabelText('Alergias');
    await userEvent.clear(alergias);
    await userEvent.type(alergias, 'Lactosa');
    await userEvent.selectOptions(screen.getByLabelText('Preferencias'), 'vegetariano');
    await userEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }));
    expect(Api.actualizarPerfil).toHaveBeenCalledWith(expect.objectContaining({ alergias: 'Lactosa', preferencias: 'vegetariano' }));
    expect(await screen.findByText('Perfil actualizado correctamente.')).toBeInTheDocument();
  });

  test('rechaza una contraseña nueva de menos de 6 caracteres sin llamar a la API', async () => {
    render(<Perfil />);
    await userEvent.type(screen.getByLabelText('Contraseña actual'), 'est123');
    await userEvent.type(screen.getByLabelText('Contraseña nueva'), '123');
    await userEvent.type(screen.getByLabelText('Repetir contraseña nueva'), '123');
    await userEvent.click(screen.getByRole('button', { name: 'Actualizar contraseña' }));
    expect(await screen.findByText(/mínimo 6 caracteres/)).toBeInTheDocument();
    expect(Api.cambiarPassword).not.toHaveBeenCalled();
  });

  test('rechaza contraseñas que no coinciden', async () => {
    render(<Perfil />);
    await userEvent.type(screen.getByLabelText('Contraseña actual'), 'est123');
    await userEvent.type(screen.getByLabelText('Contraseña nueva'), 'Nueva123');
    await userEvent.type(screen.getByLabelText('Repetir contraseña nueva'), 'Otra1234');
    await userEvent.click(screen.getByRole('button', { name: 'Actualizar contraseña' }));
    expect(await screen.findByText('Las nuevas contraseñas no coinciden')).toBeInTheDocument();
    expect(Api.cambiarPassword).not.toHaveBeenCalled();
  });

  test('con datos correctos cambia la contraseña y limpia el formulario', async () => {
    Api.cambiarPassword.mockResolvedValue({ mensaje: 'ok' });
    render(<Perfil />);
    await userEvent.type(screen.getByLabelText('Contraseña actual'), 'est123');
    await userEvent.type(screen.getByLabelText('Contraseña nueva'), 'Nueva123');
    await userEvent.type(screen.getByLabelText('Repetir contraseña nueva'), 'Nueva123');
    await userEvent.click(screen.getByRole('button', { name: 'Actualizar contraseña' }));
    expect(Api.cambiarPassword).toHaveBeenCalledWith('est123', 'Nueva123');
    expect(await screen.findByText('Contraseña actualizada exitosamente')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña actual')).toHaveValue('');
  });
});
