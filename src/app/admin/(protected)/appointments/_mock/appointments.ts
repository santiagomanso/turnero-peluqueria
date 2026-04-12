import type { Appointment } from "@/types/appointment";

// ─── Toggle ────────────────────────────────────────────────────────────────────
// Para activar el mock en appointments-view.tsx:
//   1. Cambiar MOCK_ENABLED a true
//   2. Importar { getMockAppointments, MOCK_ENABLED } en appointments-view.tsx
//   3. Reemplazar `vm.appointments` por:
//        const displayAppointments = MOCK_ENABLED ? getMockAppointments(vm.selectedDate) : vm.appointments;
//      y usar displayAppointments en todo el render
export const MOCK_ENABLED = true;

// ─── Data ──────────────────────────────────────────────────────────────────────

const PEOPLE = [
  {
    name: "Valentina López",
    email: "valen.lopez@gmail.com",
    phone: "5491145230891",
  },
  {
    name: "Camila Rodríguez",
    email: "cami.rodriguez@hotmail.com",
    phone: "5493514821047",
  },
  {
    name: "Luciana Martínez",
    email: "lu.martinez@gmail.com",
    phone: "5493794800312",
  },
  {
    name: "Sofía García",
    email: "sofi.garcia@gmail.com",
    phone: "5492614950123",
  },
  {
    name: "Florencia Gómez",
    email: "flor.gomez@yahoo.com.ar",
    phone: "5492994712389",
  },
  {
    name: "Agustina Sánchez",
    email: "agus.sanchez@gmail.com",
    phone: "5491167340982",
  },
  {
    name: "Micaela Torres",
    email: "mica.torres@hotmail.com",
    phone: "5493815690034",
  },
  {
    name: "Julieta Díaz",
    email: "juli.diaz@gmail.com",
    phone: "5492234801256",
  },
  {
    name: "Natalia Fernández",
    email: "nati.fernandez@gmail.com",
    phone: "5493434920871",
  },
  {
    name: "Carolina Morales",
    email: "caro.morales@outlook.com",
    phone: "5491134560293",
  },
  {
    name: "Daniela Ruiz",
    email: "dani.ruiz@gmail.com",
    phone: "5493514723819",
  },
  {
    name: "Paula Herrera",
    email: "pau.herrera@gmail.com",
    phone: "5492614831204",
  },
  {
    name: "Verónica Romero",
    email: "vero.romero@hotmail.com",
    phone: "5491178920345",
  },
  {
    name: "Silvana Acosta",
    email: "silvi.acosta@gmail.com",
    phone: "5493794810567",
  },
  {
    name: "Jimena Castro",
    email: "jime.castro@gmail.com",
    phone: "5492994603218",
  },
  {
    name: "Mariana Pereyra",
    email: "mari.pereyra@gmail.com",
    phone: "5491156789012",
  },
  {
    name: "Gabriela Villalba",
    email: "gabi.villalba@hotmail.com",
    phone: "5493514890234",
  },
  {
    name: "Roxana Medina",
    email: "roxi.medina@gmail.com",
    phone: "5492614712890",
  },
  {
    name: "Vanesa Ibáñez",
    email: "vane.ibanez@yahoo.com.ar",
    phone: "5491189023456",
  },
  {
    name: "Alejandra Núñez",
    email: "ale.nunez@gmail.com",
    phone: "5493794823901",
  },
];

const TIMES = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
];

const STATUSES: Appointment["status"][] = [
  "PAID",
  "PAID",
  "PAID",
  "PAID",
  "PAID",
  "PAID",
  "PAID",
  "PAID",
  "PAID",
  "PAID",
  "PENDING",
  "PENDING",
  "PENDING",
  "PENDING",
  "PENDING",
  "PENDING",
  "CANCELLED",
  "CANCELLED",
  "CANCELLED",
  "CANCELLED",
];

export function getMockAppointments(date: Date): Appointment[] {
  const now = new Date();
  return PEOPLE.map((person, i) => ({
    id: `mock_${i}_${person.phone.slice(-6)}`,
    date,
    time: TIMES[i],
    telephone: person.phone,
    price: 8500,
    status: STATUSES[i],
    payerName: person.name,
    payerEmail: person.email,
    isTest: false,
    paymentUrl: null,
    payment: undefined,
    createdAt: now,
    updatedAt: now,
  }));
}
