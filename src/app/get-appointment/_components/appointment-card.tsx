import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, Clock, Phone, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Appointment = {
  id: number;
  date: Date;
  time: string;
  telephone: string;
};

type Props = {
  appointment: Appointment;
};

export default function AppointmentCard({ appointment }: Props) {
  const handleEdit = () => {
    // TODO: Implement edit functionality
    console.log("Edit appointment:", appointment.id);
  };

  const handleCancel = () => {
    // TODO: Implement cancel functionality
    console.log("Cancel appointment:", appointment.id);
  };

  return (
    <div className="shadow-lg shadow-fuchsia-950 bg-white/5 rounded-lg p-3 border border-white/20 hover:bg-white/15 transition-colors">
      <div className="space-y-3">
        {/* Date and Time */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-white/70" />
            <div>
              <p className="text-white/70 text-xs">Fecha</p>
              <p className="text-white font-semibold">
                {format(appointment.date, "d 'de' MMMM", { locale: es })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-white/70" />
            <div>
              <p className="text-white/70 text-xs">Hora</p>
              <p className="text-white font-semibold">{appointment.time}</p>
            </div>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-2">
          <Phone className="w-5 h-5 text-white/70" />
          <div>
            <p className="text-white/70 text-xs">Teléfono</p>
            <p className="text-white font-semibold">{appointment.telephone}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <Button
            onClick={handleEdit}
            variant="default"
            className="px-4 py-3 font-semibold transition-all bg-black/20 border border-white/30 text-white hover:bg-white/30"
          >
            <Edit className="w-4 h-4 mr-2" />
            Modificar
          </Button>
          <Button
            onClick={handleCancel}
            className="border-white/30 bg-linear-to-br from-red-400/80 via-pink-800 to-rose-950 border"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}
