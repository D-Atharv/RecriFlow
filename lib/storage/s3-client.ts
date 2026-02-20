import { S3Client } from "@aws-sdk/client-s3";

import { getS3StorageConfig, type S3StorageConfig } from "@/lib/storage/s3-config";

let cachedClient: S3Client | null = null;
let cachedConfigKey = "";

function toConfigKey(config: S3StorageConfig): string {
  return [
    config.region,
    config.bucket,
    config.accessKeyId,
    config.secretAccessKey,
    config.endpoint ?? "",
    config.forcePathStyle ? "1" : "0",
  ].join("|");
}

export function getS3Client(): S3Client | null {
  const config = getS3StorageConfig();
  if (!config) {
    return null;
  }

  const nextKey = toConfigKey(config);
  if (cachedClient && cachedConfigKey === nextKey) {
    return cachedClient;
  }

  cachedClient = new S3Client({
    region: config.region,
    endpoint: config.endpoint,
    forcePathStyle: config.forcePathStyle,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });
  cachedConfigKey = nextKey;

  return cachedClient;
}
