import { saveFileToCloudinary } from "./saveFileToCloudinary.js";
import { saveFileToUploadDir } from "./saveFileToUploadDir.js";

export const saveFile = async (file) => {
  return process.env("ENABLE_CLOUDINARY") === "true"
    ? await saveFileToCloudinary(file)
    : await saveFileToUploadDir(file);
};
