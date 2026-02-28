import {login} from "@/actions/auth";
import {Button} from "./Button";
import Link from "next/link";

export const FormLogin = () => {
  return (
    <form action={login} className="space-y-4">
      <div className="space-y-4">
        <input
          name="email" // <--- Agregado name
          type="email"
          placeholder="PLLI Email"
          className="w-full p-4 rounded-2xl bg-white/60 border-none outline-none focus:ring-2 focus:ring-pink-300"
          required
        />
        <input
          name="password" // <--- Agregado name
          type="password"
          placeholder="Password"
          className="w-full p-4 rounded-2xl bg-white/60 border-none outline-none focus:ring-2 focus:ring-pink-300"
          required
        />
        <Button
          text="LOG IN TO ASTERUM"
          variant="primary"
          className="w-full"
          type="submit"
        />
        <p className="text-center text-sm text-slate-600 mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-pink-600 font-bold hover:underline"
          >
            Sign up here
          </Link>
        </p>
      </div>
    </form>
  );
};
