// Pruebas del formulario de inicio de sesión (eventos onChange y onSubmit).
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('../api/api.js', async (original) => ({ ...(await original()), Api: { login: vi.fn() } }));
import { Api } from '../api/api.js';
import LoginForm from '../components/LoginForm.jsx';

describe('LoginForm', () => {
  beforeEach(() => { vi.clearAllMocks(); localStorage.clear(); });

  test('si faltan datos muestra un aviso y no llama a la API', async () => {
    render(<LoginForm onIngreso={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Escribe tu correo y tu contraseña');
    expect(Api.login).not.toHaveBeenCalled();
  });

  test('con datos válidos llama a la API, guarda la sesión y avisa al padre', async () => {
    const usuario = { id: 2, nombre: 'Sofía', rol: 'estudiante' };
    Api.login.mockResolvedValue({ token: 'abc', usuario });
    const alIngresar = vi.fn();
    render(<LoginForm onIngreso={alIngresar} />);
    await userEvent.type(screen.getByLabelText('Correo electrónico'), 'sofia@smartfood.co');
    await userEvent.type(screen.getByLabelText('Contraseña'), 'est123');
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
    expect(Api.login).toHaveBeenCalledWith('sofia@smartfood.co', 'est123');
    expect(alIngresar).toHaveBeenCalledWith(usuario);
    expect(localStorage.getItem('sf_token')).toBe('abc');
  });

  test('si la API rechaza las credenciales muestra el mensaje de error', async () => {
    Api.login.mockRejectedValue(new Error('Credenciales incorrectas'));
    const alIngresar = vi.fn();
    render(<LoginForm onIngreso={alIngresar} />);
    await userEvent.type(screen.getByLabelText('Correo electrónico'), 'x@y.co');
    await userEvent.type(screen.getByLabelText('Contraseña'), 'mala');
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Credenciales incorrectas');
    expect(alIngresar).not.toHaveBeenCalled();
  });
});
