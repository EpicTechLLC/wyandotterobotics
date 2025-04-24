export function getAlbumImages(albumId: string): string[] {
	// 1. Grab the file paths only (no import, no optimisation step)
	const match = import.meta.glob('/src/content/albums/**/*.{jpeg,jpg,png}', { eager: false });
  
	// 2. Filter by album and strip the leading "/src/content/" part
	return Object.keys(match)
	  .filter((path) => path.includes(albumId))
	  .map((path) => path.replace('/src/content/', ''));   //  -> albums/2024/dog.jpg
  }