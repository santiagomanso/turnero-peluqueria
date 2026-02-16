import { Appointment } from "@/types/appointment";
import React from "react";
import { toast } from "sonner";
import { getAppointmentsByPhoneAction } from "../_actions/get-appointment";

export default function useSearchAppointment() {
  const [phone, setPhone] = React.useState("");
  const [isSearching, setIsSearching] = React.useState(false);
  const [hasSearched, setHasSearched] = React.useState(false);
  const [appointments, setAppointments] = React.useState<Appointment[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (phone.length < 9) {
      toast.error("Por favor ingresa un número válido");
      return;
    }

    setIsSearching(true);
    setHasSearched(false);

    try {
      const response = await getAppointmentsByPhoneAction(phone);

      if (response.success && response.data) {
        setAppointments(response.data);
        setHasSearched(true);

        if (response.data.length === 0) {
          toast.info("No se encontraron turnos para este número");
        }
      } else {
        toast.error(response.error ?? "Error al buscar turnos");
        setAppointments([]);
        setHasSearched(true);
      }
    } catch (error) {
      console.error("Error searching appointments:", error);
      toast.error("Error inesperado al buscar turnos");
      setAppointments([]);
      setHasSearched(true);
    } finally {
      setIsSearching(false);
    }
  };

  return {
    phone,
    setPhone,
    isSearching,
    hasSearched,
    appointments,
    handleSearch,
  };
}
