import { BaseS3Object } from '../services/shared/src/model';
import { readFileSync } from 'fs';
import { parseXml } from 'libxmljs';
const s3_bucket_for_test = process.env.BUCKET_TESTING ? process.env.BUCKET_TESTING : 'mg-bucket-for-testing';
const timeoutTimer = 30000;
const valid_bucket_name = 'my-app-is-great';
const valid_buffer = Buffer.alloc(1, 'my buffer');
test('valid bucket name', () => {
    let obj = new BaseS3Object(valid_bucket_name, '123', valid_buffer);
    expect(() => {
        obj.Bucket !== undefined && typeof obj.Bucket == 'string';
    }).toBeTruthy();
});

test('invalid bucket name - dots', () => {
    const bucketName = 'my..app-is-great';
    expect(() => {
        new BaseS3Object(bucketName, '123', valid_buffer);
    }).toThrow();
});

test('invalid bucket name - uppercase', () => {
    const bucketName = 'my.App-is-great';
    expect(() => {
        new BaseS3Object(bucketName, '123', valid_buffer);
    }).toThrow();
});

test('valid buffer - image', () => {
    const buffer = readFileSync(`services/status-badges/src/badges/pipeline-SUCCEEDED.svg`);
    const xmlDoc = parseXml(buffer);
    const obj = new BaseS3Object(valid_bucket_name, '123', buffer);
    expect(() => {
        obj.Body && xmlDoc.root();
    }).toBeTruthy();
});

test(
    'upload svg image to S3',
    async () => {
        const buffer = readFileSync(`services/status-badges/src/badges/pipeline-SUCCEEDED.svg`);
        const obj = new BaseS3Object(s3_bucket_for_test, 'valid-svg-image-SUCCEEDED.svg', buffer);
        const data = await obj.uploadObject();
        expect(data).toBeTruthy();
    },
    timeoutTimer,
);