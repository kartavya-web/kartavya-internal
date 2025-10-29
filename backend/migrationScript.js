const mongoose = require("mongoose");
const Students = require("./models/Student");

const runMigration = async () => {

  const dbUri = process.env.MONGO_URI;
  await mongoose.connect(dbUri);

  console.log("connected to the database..");
  const result = await Students.updateMany(
    {
      result: {
        $exists: true,
        $not: { $size: 0 },
        $elemMatch: { $type: "string" }
      }
    },
    [
      {
        $set: {
          result: {
            $map: {
              input: "$result",
              as: "r",
              in: { sessionTerm: "$$r", url: "" } // 🔹 convert string → object
            }
          }
        }
      }
    ]
  );

  console.log("Migration complete!");
  await mongoose.disconnect();
};
runMigration().catch(console.error);


const { BlobServiceClient } = require("@azure/storage-blob");
require("dotenv").config();
const AZURE_CONNECTION_STRING = process.env.AZURE_CONNECTION_STRING;
const AZURE_CONTAINER_NAME = process.env.AZURE_CONTAINER_NAME;

const deleteFromAzureBlob = async (blobUrl) => {
  try {
    if (!blobUrl) {
      throw new Error("No blob URL provided");
    }

    const blobServiceClient = BlobServiceClient.fromConnectionString(
      AZURE_CONNECTION_STRING
    );
    const containerClient =
      blobServiceClient.getContainerClient(AZURE_CONTAINER_NAME);

    const blobName = blobUrl.split(`${AZURE_CONTAINER_NAME}/`)[1];
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.delete();
    return true;
  } catch (error) {
    console.error("Azure Blob Delete Error:", error);
    throw error;
  }
};

// deleteFromAzureBlob("");
