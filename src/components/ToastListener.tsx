"use client";

import {useEffect} from "react";
import {useSearchParams} from "next/navigation";
import {sileo} from "sileo";

export const ToastListener = () => {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  useEffect(() => {
    if (!message) return;

    switch (message) {
      case "check-email":
        sileo.success({
          title: "¡Registro casi listo!",
          description:
            "Revisa tu correo para confirmar tu cuenta antes de entrar.",
        });
        break;
      case "unconfirmed":
        sileo.warning({
          title: "Correo no verificado",
          description: "Revisa tu bandeja de entrada para confirmar tu correo.",
        });
        break;
      case "invalid-credentials":
        sileo.error({
          title: "Credenciales incorrectas",
          description:
            "El correo o la contraseña son incorrectos. Inténtalo de nuevo.",
        });
        break;
      case "error":
        sileo.error({
          title: "Error inesperado",
          description: "Ocurrió un error inesperado. Inténtalo de nuevo.",
        });
        break;
    }
  }, [message]);

  return null;
};
