export const extractTokenFromUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    return parsed.searchParams.get("token");
  } catch (e) {
    return null;
  }
};
