import { Storage } from '@google-cloud/storage';

const serviceAccount = JSON.parse(Buffer.from(process.env.GCP_SERVICE_ACCOUNT_KEY, 'base64').toString('utf8'));

// Creating a new Storage instance with project configurations from environment variables
const storage = new Storage({
      projectId: serviceAccount.project_id,
      credentials: {
          client_email: serviceAccount.client_email,
          private_key: serviceAccount.private_key,
      },
  });

// Getting a reference to a specific bucket in Google Cloud Storage
const bucket = storage.bucket(process.env.GCLOUD_BUCKET);

// Function to delete a file from the bucket
const deleteFileFromGCS = async (fileName) => {
      await bucket.file(fileName).delete();
};

export { bucket, deleteFileFromGCS };
