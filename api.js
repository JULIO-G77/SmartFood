// Pruebas de las utilidades de formato.
import { describe, expect, test } from 'vitest';
import { ETIQUETA_ESTADO, fechaLarga, porcentaje } from '../utils/formato.js';

describe('fechaLarga', () => {
  test('convierte AAAA-MM-DD a texto largo en español', () => {
    expect(fechaLarga('2026-10-13')).toMatch(/martes.*13.*octubre.*2026/i);
  });
  test('acepta fechas ISO con hora', () => {
    expect(fechaLarga('2026-10-13T18:20:00.000Z')).toMatch(/13.*octubre/i);
  });
  test('devuelve cadena vacía si la fecha falta o no es válida', () => {
    expect(fechaLarga('')).toBe('');
    expect(fechaLarga('no-es-fecha')).toBe('');
  });
});

describe('porcentaje', () => {
  test('calcula el porcentaje redondeado', () => expect(porcentaje(87, 100)).toBe(87));
  test('no divide por cero', () => expect(porcentaje(5, 0)).toBe(0));
  test('nunca supera 100', () => expect(porcentaje(120, 100)).toBe(100));
});

test('ETIQUETA_ESTADO traduce los tres estados', () => {
  expect(ETIQUETA_ESTADO).toEqual({ confirmado: 'Confirmado', cancelado: 'Cancelado', pendiente: 'Sin confirmar' });
});
