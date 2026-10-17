import { useCallback, useEffect, useState } from 'react';

/**
 * Hook personalizado: ejecuta una función asíncrona al montar el componente y
 * entrega el resultado junto con los estados de carga y error.
 * @param {() => Promise<any>} funcionCarga - Debe ser estable (función de módulo o useCallback).
 * @returns {{datos: any, cargando: boolean, error: string, recargar: () => void}}
 */
export function useCargar(funcionCarga) {
  const [estado, setEstado] = useState({ datos: null, cargando: true, error: '' });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let activo = true; // Evita actualizar el estado si el componente ya se desmontó.
    funcionCarga()
      .then((datos) => activo && setEstado({ datos, cargando: false, error: '' }))
      .catch((err) => activo && setEstado({ datos: null, cargando: false, error: err.message }));
    return () => { activo = false; };
  }, [funcionCarga, version]);

  /** Vuelve a pedir los datos a la API. */
  const recargar = useCallback(() => {
    setEstado((e) => ({ ...e, cargando: true, error: '' }));
    setVersion((v) => v + 1);
  }, []);

  return { ...estado, recargar };
}
