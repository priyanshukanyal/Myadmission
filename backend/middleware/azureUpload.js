import { BlobServiceClient } from "@azure/storage-blob";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

dotenv.config();

const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);
const containerClient = blobServiceClient.getContainerClient(
  process.env.AZURE_STORAGE_CONTAINER_NAME
);

// Configure Multer to accept only PDFs
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed!"), false);
    }
    cb(null, true);
  },
});

const uploadToAzure = async (file) => {
  const blobName = `${uuidv4()}-${file.originalname}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.uploadData(file.buffer, {
    blobHTTPHeaders: { blobContentType: file.mimetype },
  });

  return blockBlobClient.url; // Return the file URL
};

export { upload, uploadToAzure };
