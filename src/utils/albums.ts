export async function getAlbumImages(albumId: string) {
  // 1. List all album files from collections path
  let images = import.meta.glob<{ default: ImageMetadata }>('/src/content/albums/**/*.{jpeg,jpg,png}');

  // 2. Filter images by albumId
  images = Object.fromEntries(Object.entries(images).filter(([key]) => key.includes(albumId)));
  return Object.keys(images).map((image) => image); // "."+ image.split('src')[1]);

}
