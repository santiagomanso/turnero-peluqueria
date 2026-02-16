export type Appointment = {
  id: number;
  date: Date;
  time: string;
  telephone: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AppointmentFormData = {
  date: Date;
  time: string;
  telephone: string;
};
