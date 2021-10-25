import { base64toFile } from '@dito-utils/to-base-64';
import { Buckets } from '@textile/hub';
import { TextileBucketMetadata } from './model';

const keyInfo = {
  key: process.env.REACT_APP_PUBLIC_TEXTILE_KEY,
  secret: process.env.REACT_APP_PUBLIC_TEXTILE_SECRET,
};

export async function uploadImageToTextileBucket(content: ArrayBuffer) {
  const buckets = await Buckets.withKeyInfo(keyInfo);
  const { root } = await buckets.getOrCreate(process.env.REACT_APP_PUBLIC_BUCKET_NAME);
  if (!root) throw new Error('bucket not created');
  const path = `profile.png`;
  const links = await buckets.pushPath(root.key, path, content);
  return `https://hub.textile.io${links.path.path}`;
}

export const generateTextileBucketUrl = async (metadata: TextileBucketMetadata) => {
  const buckets = await Buckets.withKeyInfo(keyInfo);
  const { root } = await buckets.getOrCreate(process.env.REACT_APP_PUBLIC_BUCKET_NAME);
  if (!root) throw new Error('bucket not created');

  if (metadata.image) {
    const file = base64toFile(metadata.image, 'avatar');
    const arrayBuffer = await file.arrayBuffer();
    metadata.image = await uploadImageToTextileBucket(arrayBuffer);
  }

  const buf = Buffer.from(JSON.stringify(metadata, null, 2));
  const path = 'metadata.json';
  const links = await buckets.pushPath(root.key, path, buf);
  return `https://hub.textile.io${links.path.path}`;
};
