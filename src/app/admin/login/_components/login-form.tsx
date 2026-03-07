"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { verifyAdminPasswordAction } from "../../_actions/verify-admin-password";

export default function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setAuthError(false);

    const result = await verifyAdminPasswordAction(password);

    if (result.success) {
      router.push("/admin");
    } else {
      setAuthError(true);
      setPassword("");
    }
    setIsVerifying(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-border-subtle dark:border-zinc-700 shadow-sm p-8 w-full max-w-xs">
        <div className="flex flex-col items-center gap-1 mb-6">
          <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center mb-1">
            <Lock className="w-5 h-5 text-gold" />
          </div>
          <h2 className="text-lg font-bold text-content dark:text-zinc-100">
            Área admin
          </h2>
          <p className="text-xs text-content-tertiary dark:text-zinc-500">
            Ingresá tu contraseña
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={authError ? "border-red-400 pr-10" : "pr-10"}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-content-tertiary dark:text-zinc-500 hover:text-content dark:hover:text-zinc-100 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          {authError && (
            <p className="text-xs text-red-500 text-center">
              Contraseña incorrecta
            </p>
          )}

          <Button
            type="submit"
            disabled={password.length < 1 || isVerifying}
            className="w-full bg-gold text-white font-semibold hover:bg-gold/90"
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Verificando...
              </>
            ) : (
              "Ingresar"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
