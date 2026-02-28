"use client";

import {signup} from "@/actions/auth";
import {Button} from "@/components/Button";
import {GlassCard} from "@/components/GlassCard";
import {ToastListener} from "@/components/ToastListener";
import {zodResolver} from "@hookform/resolvers/zod";
import {Suspense} from "react";
import {useForm} from "react-hook-form";
import z from "zod";
import {sileo} from "sileo";

const registerSchema = z.object({
  username: z
    .string()
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
  bias: z.string().min(1, "Por favor, selecciona tu bias"),
  email: z.string().email("Introduce un correo electrónico válido"),
  password: z
    .string()
    .min(8, "Mínimo 8 caracteres")
    .regex(/[A-Z]/, "Debe incluir una mayúscula")
    .regex(/[0-9]/, "Debe incluir un número")
    .regex(/[^A-Za-z0-9]/, "Debe incluir un símbolo"),
});

// Extraemos el tipo de datos del esquema
type RegisterValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const members = ["Yejun", "Noah", "Bamby", "Eunho", "Hamin"];

  // 2. Inicializamos React Hook Form
  const {
    register,
    handleSubmit,
    watch,
    formState: {errors, isSubmitting},
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const passwordValue = watch("password", "");

  const onSubmit = async (data: RegisterValues) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => formData.append(key, value));

    try {
      await signup(formData);
    } catch {
      sileo.error({
        title: "Error inesperado",
        description: "El registro falló. Por favor, inténtalo de nuevo.",
      });
    }
  };

  // Ayudante visual para la fuerza de la contraseña
  const passwordChecks = [
    {label: "8+ chars", met: passwordValue.length >= 8},
    {label: "Mayúscula", met: /[A-Z]/.test(passwordValue)},
    {label: "Número", met: /[0-9]/.test(passwordValue)},
    {label: "Símbolo", met: /[^A-Za-z0-9]/.test(passwordValue)},
  ];

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4">
      <Suspense fallback={null}>
        <ToastListener />
      </Suspense>
      <GlassCard className="p-10 w-full max-w-md">
        <h1 className="text-3xl font-black text-slate-800 text-center mb-2">
          JOIN ASTERUM
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* USERNAME */}
          <div>
            <input
              {...register("username")}
              placeholder="Username"
              className={`w-full p-4 rounded-2xl bg-white/60 border-none outline-none focus:ring-2 transition-all ${
                errors.username ? "focus:ring-red-300" : "focus:ring-pink-300"
              }`}
            />
            {errors.username && (
              <p className="text-[10px] text-red-500 font-bold mt-1 ml-2">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* BIAS SELECT */}
          <div className="space-y-2">
            <select
              {...register("bias")}
              className="w-full p-4 rounded-2xl bg-white/60 border-none outline-none focus:ring-2 focus:ring-pink-300 text-slate-700 appearance-none cursor-pointer"
            >
              <option value="">Select your Bias...</option>
              {members.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            {errors.bias && (
              <p className="text-[10px] text-red-500 font-bold mt-1 ml-2">
                {errors.bias.message}
              </p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <input
              {...register("email")}
              type="email"
              placeholder="Your Email"
              className="w-full p-4 rounded-2xl bg-white/60 border-none outline-none focus:ring-2 focus:ring-pink-300"
            />
            {errors.email && (
              <p className="text-[10px] text-red-500 font-bold mt-1 ml-2">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* PASSWORD */}
          <div className="space-y-3">
            <input
              {...register("password")}
              type="password"
              placeholder="Password"
              className="w-full p-4 rounded-2xl bg-white/60 border-none outline-none focus:ring-2 focus:ring-pink-300"
            />

            {/* Indicadores de fuerza visual */}
            <div className="grid grid-cols-2 gap-2 px-2">
              {passwordChecks.map((check) => (
                <div key={check.label} className="flex items-center gap-2">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${check.met ? "bg-emerald-500" : "bg-slate-300"}`}
                  />
                  <span
                    className={`text-[9px] font-black uppercase ${check.met ? "text-emerald-600" : "text-slate-400"}`}
                  >
                    {check.label}
                  </span>
                </div>
              ))}
            </div>
            {errors.password && (
              <p className="text-[10px] text-red-500 font-bold mt-1 ml-2">
                {errors.password.message}
              </p>
            )}
          </div>
          <Button
            text={isSubmitting ? "CREATING..." : "CREATE ACCOUNT"}
            variant="primary"
            className="w-full mt-4"
            type="submit"
            disabled={isSubmitting}
          />

          <p className="text-center text-slate-600 text-sm mt-4">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-bold text-slate-800 hover:underline transition-colors"
            >
              Log in
            </a>
          </p>
        </form>
      </GlassCard>
    </div>
  );
}
