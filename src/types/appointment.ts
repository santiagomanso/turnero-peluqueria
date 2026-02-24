export type AppointmentStatus = "PENDING" | "PAID";

export type Appointment = {
  id: string;
  date: Date;
  time: string;
  telephone: string;
  paymentId: string | null;
  status: AppointmentStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type AppointmentFormData = {
  date: Date;
  time: string;
  telephone: string;
};
