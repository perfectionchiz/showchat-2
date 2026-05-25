export function extractNameFromEmail(email: string) {
  if (!email) return "";
  return email.split("@")[0] || "";
}
