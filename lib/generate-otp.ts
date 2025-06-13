export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const formatMinutes = (totalMins: number) => {
  const hours = Math.floor(totalMins / 60);
  const mins = totalMins % 60;

  if (hours > 0 && mins > 0) {
    return `${hours}hr ${mins}mins`;
  } else if (hours > 0 && mins === 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  } else {
    return `${mins} mins`;
  }
};

export function extractAndParseRecipe(raw: string) {
  const cleaned = raw
    .replace(/^```json\n/, "")
    .replace(/```$/, "")
    .trim();
  return JSON.parse(cleaned);
}