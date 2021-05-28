import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const { readJSON, writeJSON, writeFile, createReadStream } = fs;
// export const currentPdf = join(
//   dirname(fileURLToPath(import.meta.url)),
//   "./mypdf.pdf"
// );

const poster = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../public/image/poster"
);
const mediaPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../database/media.json"
);

// const authorsAvatarFolder = join(
//   dirname(fileURLToPath(import.meta.url)),
//   "../../public/images/authorAvatars"
// );

const reviewPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../database/reviews.json"
);

export const getMedia = async () => await readJSON(mediaPath);
export const writeMedia = async (content) =>
  await writeJSON(mediaPath, content);
export const getReviews = async () => await readJSON(reviewPath);
export const writeReviews = async (content) =>
  await writeJSON(reviewPath, content);

export const writeBlogCovers = async (fileName, content) =>
  await writeFile(join(poster, fileName), content);

// export const writeBlogCovers = async (fileName, content) =>
//   await writeFile(join(blogCoversFolder, fileName), content);
// export const writeAuthorAvatars = async (fileName, content) =>
//   await writeFile(join(authorsAvatarFolder, fileName), content);
// export const getReadStreamCsv = () => createReadStream(authorsFile);
