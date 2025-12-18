import { Appointment } from '../types/appointment';

export const saveAppointment = (data: Appointment) => {
  localStorage.setItem('latestAppointment', JSON.stringify(data));
};

export const getAppointment = (): Appointment | null => {
  const data = localStorage.getItem('latestAppointment');
  return data ? JSON.parse(data) : null;
};

export const clearAppointment = () => {
  localStorage.removeItem('latestAppointment');
};
