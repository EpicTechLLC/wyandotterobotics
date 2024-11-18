import fs from 'fs';
import path from 'path';

// Path to the albums folder
const albumsDir = path.join(process.cwd(), 'src/content/albums/');

// Function to sanitize folder names (convert spaces to hyphens and ensure valid characters)
const sanitizeFolderName = (name) => name.trim().replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-_]/g, '');

// Function to generate album data from folder structure
const generateAlbumsFromFolders = () => {
  // Read all subfolders in the albums directory
  const folders = fs.readdirSync(albumsDir, { withFileTypes: true }).filter((dirent) => dirent.isDirectory());

  const albums = folders.map((folder) => {
    let folderName = folder.name;

    // Validate and sanitize folder name
    const sanitizedFolderName = sanitizeFolderName(folderName);

    if (sanitizedFolderName !== folderName) {
      // Rename the folder to the sanitized version
      const oldPath = path.join(albumsDir, folderName);
      const newPath = path.join(albumsDir, sanitizedFolderName);
      fs.renameSync(oldPath, newPath);
      console.log(`Renamed folder: "${folderName}" -> "${sanitizedFolderName}"`);
      folderName = sanitizedFolderName;
    }

    const folderPath = path.join(albumsDir, folderName);

    // Look for the first image file in the folder
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const coverFile = fs
      .readdirSync(folderPath)
      .find((file) => imageExtensions.includes(path.extname(file).toLowerCase()));

    // Replace spaces with hyphens in the cover file name
    const sanitizedCoverFile = coverFile ? coverFile.replace(/\s+/g, '-') : null;

    // Ensure relative path with ./ for the cover file
    const cover = sanitizedCoverFile ? `./${sanitizedCoverFile}` : null;

    // Default album data
    const defaultAlbumData = {
      id: folderName, // Keep hyphens in the ID
      title: folderName.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()), // Format title nicely
      description: '', // Always set to an empty string if missing
      subtitle: '', // Always set to an empty string if missing
      cover, // Set to the sanitized relative path or null
    };

    const jsonFilePath = path.join(folderPath, 'album.json');
    if (fs.existsSync(jsonFilePath)) {
      try {
        // Read existing album.json and preserve its content
        const existingData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
        return {
          folderPath,
          albumData: {
            ...defaultAlbumData,
            ...existingData, // Merge existing data to preserve description and subtitle
          },
        };
      } catch (err) {
        console.error(`Error reading ${jsonFilePath}:`, err);
      }
    }

    return { folderPath, albumData: defaultAlbumData };
  });

  return albums;
};

// Generate JSON files inside each folder
const generateJsonFiles = (albums) => {
  albums.forEach(({ folderPath, albumData }) => {
    const filePath = path.join(folderPath, 'album.json'); // JSON file name
    fs.writeFileSync(filePath, JSON.stringify(albumData, null, 2), 'utf8');
    console.log(`Generated: ${filePath}`);
  });
};

// Ensure the albums directory exists
if (!fs.existsSync(albumsDir)) {
  console.error(`Error: Directory ${albumsDir} does not exist.`);
  process.exit(1);
}

// Generate album data and write JSON files
const albums = generateAlbumsFromFolders();
generateJsonFiles(albums);

console.log('Album JSON files updated successfully.');
