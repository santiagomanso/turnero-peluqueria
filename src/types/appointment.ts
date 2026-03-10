export type AppointmentStatus = "PENDING" | "PAID" | "CANCELLED";

export type Payment = {
  id: string;
  appointmentId: string;
  mercadopagoId: string;
  amount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Appointment = {
  id: string;
  date: Date;
  time: string;
  telephone: string;
  price: number;
  status: AppointmentStatus;
  payerName: string | null;
  payerEmail: string | null;
  payment?: Payment;
  createdAt: Date;
  updatedAt: Date;
};

export type AppointmentFormData = {
  date: Date;
  time: string;
  telephone: string;
};
