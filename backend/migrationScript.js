require("dotenv").config();
const mongoose = require("mongoose");
const Students = require("./models/Student");

const runTestMigration = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI);
    console.log("Connected to DB");

    const updatedDoc = await Students.findOneAndUpdate(
      { "result.sessionTerm": { $exists: true } },
      [
        {
          $set: {
            result: {
              $map: {
                input: "$result",
                as: "res",
                in: {
                  $mergeObjects: [
                    "$$res",
                    {
                      session: {
                        $arrayElemAt: [
                          { $split: ["$$res.sessionTerm", " "] },
                          -1,
                        ],
                      },
                    },
                  ],
                },
              },
            },
          },
        },
        {
          $set: {
            result: {
              $map: {
                input: "$result",
                as: "res",
                in: {
                  $arrayToObject: {
                    $filter: {
                      input: { $objectToArray: "$$res" },
                      as: "field",
                      cond: { $ne: ["$$field.k", "sessionTerm"] },
                    },
                  },
                },
              },
            },
          },
        },
      ],
      { new: true }, // returns updated document
    );

    console.log("Updated Document:\n", JSON.stringify(updatedDoc, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

runTestMigration();

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
      AZURE_CONNECTION_STRING,
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
