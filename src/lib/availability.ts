/**
 * Horario de Pepitos House 251:
 * Jueves a Lunes: 3:00 PM (15:00) a 10:00 PM (22:00)
 * Martes y Miércoles: CERRADO
 * Zona horaria: America/Caracas (UTC-4)
 */

export interface ScheduleStatus {
  isOpen: boolean;
  currentDayName: string;
  currentTimeFormatted: string;
  message: string;
  nextOpeningMessage: string;
}

const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;
const DAY_NAMES_ES = {
  sun: 'Domingo',
  mon: 'Lunes',
  tue: 'Martes',
  wed: 'Miércoles',
  thu: 'Jueves',
  fri: 'Viernes',
  sat: 'Sábado'
};

export const OPEN_DAYS: string[] = ['thu', 'fri', 'sat', 'sun', 'mon'];
export const OPEN_HOUR = 15; // 3:00 PM
export const CLOSE_HOUR = 22; // 10:00 PM

export function checkRestaurantOpen(date: Date = new Date()): ScheduleStatus {
  // Ajuste a la hora de Venezuela (UTC-4)
  // En Node/Browser podemos usar Intl o UTC offset
  const venezuelaTimeStr = date.toLocaleString('en-US', { timeZone: 'America/Caracas' });
  const vzDate = new Date(venezuelaTimeStr);

  const dayIndex = vzDate.getDay();
  const dayKey = DAY_KEYS[dayIndex];
  const hour = vzDate.getHours();
  const minute = vzDate.getMinutes();
  const currentMinutes = hour * 60 + minute;

  const openMinutes = OPEN_HOUR * 60; // 15:00 = 900 min
  const closeMinutes = CLOSE_HOUR * 60; // 22:00 = 1320 min

  const isDayOpen = OPEN_DAYS.includes(dayKey);
  const isHourOpen = currentMinutes >= openMinutes && currentMinutes < closeMinutes;

  const isOpen = isDayOpen && isHourOpen;

  const timeDisplay = vzDate.toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', hour12: true });
  const dayDisplay = DAY_NAMES_ES[dayKey];

  let message = '';
  let nextOpeningMessage = '';

  if (isOpen) {
    message = '¡Estamos abiertos! Hoy cerramos a las 10:00 PM.';
  } else {
    if (!isDayOpen) {
      message = `Hoy ${dayDisplay} estamos descansando.`;
      nextOpeningMessage = 'Abrimos este Jueves a las 3:00 PM.';
    } else if (currentMinutes < openMinutes) {
      message = `Aún no abrimos hoy ${dayDisplay}.`;
      nextOpeningMessage = 'Abrimos a las 3:00 PM.';
    } else {
      message = `Ya cerramos por hoy ${dayDisplay}.`;
      nextOpeningMessage = 'Abrimos en la próxima jornada a las 3:00 PM.';
    }
  }

  return {
    isOpen,
    currentDayName: dayDisplay,
    currentTimeFormatted: timeDisplay,
    message,
    nextOpeningMessage
  };
}

export function isItemAvailableToday(itemAvailableDays: string[] = OPEN_DAYS, date: Date = new Date()): boolean {
  const venezuelaTimeStr = date.toLocaleString('en-US', { timeZone: 'America/Caracas' });
  const vzDate = new Date(venezuelaTimeStr);
  const dayKey = DAY_KEYS[vzDate.getDay()];
  return itemAvailableDays.includes(dayKey);
}
