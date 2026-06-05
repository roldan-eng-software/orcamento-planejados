export function generateProtocol(date = new Date(), sequence = Math.floor(Math.random() * 9000) + 1000) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `ORC-${yyyy}${mm}${dd}-${String(sequence).padStart(4, "0")}`;
}
