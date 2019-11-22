import { BaseS3Object } from './model';
import { readFileSync } from 'fs';
// import { loadSync } from 'text-to-svg';
import { parseXml } from 'libxmljs';
const valid_bucket_name = 'my-app-is-great';
const valid_buffer = Buffer.alloc(1, 'my buffer');
const s3_bucket_for_test = process.env.BUCKET_TESTING ? process.env.BUCKET_TESTING : 'mg-bucket-for-testing';
const timeoutTimer = 30000;
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
    const buffer = readFileSync(`src/badges/pipeline-SUCCEEDED.svg`);
    const xmlDoc = parseXml(buffer);
    const obj = new BaseS3Object(valid_bucket_name, '123', buffer);
    expect(() => {
        obj.Body && xmlDoc.root();
    }).toBeTruthy();
});

// test('valid buffer - timestamp', () => {
//     const textToSVG = loadSync();
//     const attributes = { fill: 'black', stroke: 'black' };
//     const options = { x: 0, y: 0, fontSize: 16, anchor: 'top', attributes: attributes };
//     const mytext = new Date().toISOString();
//     const buffer = textToSVG.getSVG(mytext, options);
//     const xmlDoc = parseXml(buffer);
//     const obj = new BaseS3Object(valid_bucket_name, '123', buffer);
//     expect(() => {
//         obj.Body && xmlDoc.root();
//     }).toBeTruthy();
// });

test(
    'upload svg image to S3',
    async () => {
        const buffer = readFileSync(`src/badges/pipeline-SUCCEEDED.svg`);
        const obj = new BaseS3Object(s3_bucket_for_test, 'valid-svg-image-SUCCEEDED.svg', buffer);
        const data = await obj.uploadObject();
        expect(data).toBeTruthy();
    },
    timeoutTimer,
);
