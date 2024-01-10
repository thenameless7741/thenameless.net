const baseUrl = process.env.NEXT_PUBLIC_CF_IMAGES_BASE_URL;

export const resolveImage = (imageId: string, variantName = 'public') => {
  return `${baseUrl}/${imageId}/${variantName}`;
};
