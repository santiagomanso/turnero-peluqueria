"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminAppointments } from "../_hooks/use-admin-appointments";
import { AppointmentCalendar } from "./appointment-calendar";
import { ThemeToggleButton } from "./theme-toggle-button";
import AdminCreateAppointment from "./admin-create-appointment";

/**
 * Inline controls shown in the desktop header for the Appointments page.
 * Contains: create (+), refresh, theme toggle, calendar popover.
 */
export function AppointmentsDesktopControls() {
  const vm = useAdminAppointments();
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <>
      <AdminCreateAppointment open={createOpen} onOpenChange={setCreateOpen} />

      <Button
        variant="outline"
        size="icon"
        onClick={() => setCreateOpen(true)}
        className="h-9 w-9 shadow-sm text-content dark:text-zinc-300 hover:text-content dark:hover:text-zinc-100"
      >
        <span className="text-lg leading-none">+</span>
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={vm.handleRefresh}
        disabled={vm.isLoading}
        className="h-9 w-9 shadow-sm text-content dark:text-zinc-300 hover:text-content dark:hover:text-zinc-100"
      >
        <RefreshCw
          className={`w-4 h-4 ${vm.isLoading ? "animate-spin" : ""}`}
        />
      </Button>

      <ThemeToggleButton />

      <AppointmentCalendar />
    </>
  );
}
