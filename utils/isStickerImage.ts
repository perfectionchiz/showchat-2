export const isStickerMessage = (text: string) => {
  if (!text) return false;
  const imageRegex = /\.(jpeg|jpg|gif|png|webp|svg)$/i;
  const giphyRegex = /giphy\.com\/media|giphy\.com\/stickers/i;
  return (
    imageRegex.test(text) || (text.startsWith("http") && giphyRegex.test(text))
  );
};
