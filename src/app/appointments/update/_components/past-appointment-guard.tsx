"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function PastAppointmentGuard() {
  const router = useRouter();

  useEffect(() => {
    toast.error("No se puede modificar un turno pasado.");
    router.replace("/admin/appointments");
  }, [router]);

  return null;
}
