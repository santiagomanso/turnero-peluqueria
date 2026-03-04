"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { verifyAdminPasswordAction } from "../../_actions/verify-admin-password";

export default function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

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
      <div className="bg-white rounded-2xl border border-border-subtle shadow-sm p-8 w-full max-w-xs">
        <div className="flex flex-col items-center gap-1 mb-6">
          <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center mb-1">
            <Lock className="w-5 h-5 text-gold" />
          </div>
          <h2 className="text-lg font-bold text-content">Área admin</h2>
          <p className="text-xs text-content-tertiary">Ingresá tu contraseña</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`bg-white text-content border ${
              authError ? "border-red-400" : "border-border-soft"
            }`}
          />
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
