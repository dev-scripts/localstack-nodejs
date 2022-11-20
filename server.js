"use strict";

const express = require("express");
const AWS = require("aws-sdk");
const crypto = require("crypto");
AWS.config.loadFromPath("./config.json");

// Constants
const PORT = 8081;
const HOST = "0.0.0.0";
const BUCKET_NAME = "localstack-test-bucket-" + crypto.randomUUID();
const SLEEP_TIME = 3000;

/**
 *   Create S3 service object
 */
const S3 = new AWS.S3({
  endpoint: "http://localstack:4566",
  s3ForcePathStyle: true,
});

/**
 *  Utility function to for async & wait
 */
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 *  Create bucket
 */
function create(bucketName, s3) {
  s3.createBucket({ Bucket: bucketName }, function (err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Bucket Location", data.Location);
    }
  });
}

/**
 *  List the bucket names
 */
function lists(s3) {
  s3.listBuckets(function (err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Buckets Lists", data.Buckets);
    }
  });
}

/**
 *  Upload file object
 */
function uploadObject(bucketName, s3, filePath, keyName) {
  var fs = require("fs");
  // Read the file
  const file = fs.readFileSync(filePath);

  // Setting up S3 upload parameters
  const uploadParams = {
    Bucket: bucketName,
    Key: keyName, // custome file name that your want save as.
    Body: file,
  };

  s3.upload(uploadParams, function (err, data) {
    if (err) {
      console.log("Error", err);
    }
    if (data) {
      console.log("Upload Success", data.Location);
    }
  });
}

/**
 * Main function
 */
async function main() {
  console.log("----------------------STARTED--------------------------- \n\n");

  await sleep(SLEEP_TIME);

  console.log("Creating Bucket...");
  create(BUCKET_NAME, S3);
  await sleep(SLEEP_TIME);

  console.log("Listing Buckets...");
  lists(S3);
  await sleep(SLEEP_TIME);

  console.log("Uploading File object to bucket...");
  uploadObject(
    BUCKET_NAME,
    S3,
    "./static/localstack.png",
    "localstack-feature-image.png"
  );
  await sleep(SLEEP_TIME);

  console.log("----------------------END--------------------------- \n\n");
}

/**
 * calling main function
 */
main();

/**
 * App
 */
const app = express();
app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});
