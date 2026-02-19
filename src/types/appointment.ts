export type Appointment = {
  id: string; // Changed from number to string
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
