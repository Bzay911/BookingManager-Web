export default function getTimeSlotRange(
  scheduledAt: string,
  durationMinutes: number,
) {
  const slotStart = new Date(scheduledAt);

  if (Number.isNaN(slotStart.getTime())) return "Slot time unavailable";

  const roundUpToSlot = (mins: number) => Math.ceil(mins / 30) * 30;
  const roundedServiceTime = roundUpToSlot(durationMinutes);
  const slotEnd = new Date(
    slotStart.getTime() + roundedServiceTime * 60 * 1000,
  );

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });

  return `${formatTime(slotStart)} - ${formatTime(slotEnd)}`;
}