export const formatDuration = (totalMinutes: number): string => {
  if (totalMinutes <= 0) {
    return "N/A";
  }
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  let result = "";
  if (hours > 0) {
    result += `${hours} hrs `;
  }
  if (minutes > 0) {
    result += `${minutes} mins`;
  }
  return result.trim();
};
