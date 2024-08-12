import multer from 'multer';
import { bucket } from './gcs';

// Setting up multer to store uploaded files in memory
const multerStorage = multer.memoryStorage();

// Configuring multer with memory storage and a file size limit of 1000MB
const upload = multer({
      storage: multerStorage,
      limits: {
            fileSize: 1000 * 1024 * 1024, // 1000MB
      },
});

// Middleware function to upload file to Google Cloud Storage (GCS)
const uploadToGCS = (req, res, next) => {
      // If no file is uploaded, return an error
      if (!req.file) {
            return next(new Error('No file uploaded.'));
      }

      // Create a unique filename and write a steam to CGS
      const blob = bucket.file(Date.now() + '_' + req.file.originalname);
      const blobStream = blob.createWriteStream({
            resumable: false,
            contentType: req.file.mimetype,
            metadata: {
                contentType: req.file.mimetype,
            },
        });
      // Error handling for the write stream
      blobStream.on('error', (err) => {
            next(err);
      });

      // On successful finish of the write stream, set the file URL
      blobStream.on('finish', () => {
            // Generate public URL
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
            
            // Save the object name and public URL
            req.file.cloudStorageObject = blob.name;
            req.file.gcsUrl = publicUrl;

            // Proceed to the next middleware
            next();
      });

      // End the write stream and upload the file
      try {
            blobStream.end(req.file.buffer);
      } catch (error) {
            next(new Error('Invalid file buffer.'));
      }
};

export { upload, uploadToGCS };

