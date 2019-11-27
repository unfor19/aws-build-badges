const S3 = require('aws-sdk/clients/s3');
const s3 = new S3({ apiVersion: '2006-03-01', region: process.env.AWS_REGION });
import { isBucketNameValid } from './controller';

export class BaseS3Object {
    private _Bucket: string;
    private _Key: string;
    private _Body: Buffer;
    ETag: any;
    Expires: Date;
    ACL: string;
    ContentType: string;
    CacheControl: string;

    get Body(): Buffer {
        return this._Body;
    }

    set Body(buffer: Buffer) {
        this._Body = buffer;
    }

    get Bucket(): string {
        return this._Bucket;
    }

    set Bucket(bucketName: string) {
        if (isBucketNameValid(bucketName)) {
            this._Bucket = bucketName;
        } else {
            throw new Error('Invalid bucket name');
        }
    }

    get Key(): string {
        return this._Key;
    }

    set Key(key: string) {
        this._Key = key;
    }

    constructor(bucketName: string, key: string, body: Buffer) {
        this.Bucket = bucketName;
        this.Key = key;
        this.Body = body;
        this.Expires = new Date('Mon, 01 Jan 1990 00:00:00 GMT');
        this.ACL = 'public-read';
        this.ContentType = 'image/svg+xml';
        this.CacheControl = 'no-cache, no-store';
    }

    private serialize() {
        return {
            Key: this.Key,
            Bucket: this.Bucket,
            Body: this.Body,
            Expires: this.Expires,
            ACL: this.ACL,
            ContentType: this.ContentType,
            CacheControl: this.CacheControl,
        };
    }

    public async uploadObject() {
        let my_obj = this;
        const params = my_obj.serialize();
        var putObjectPromise = s3.putObject(params).promise();
        return putObjectPromise
            .then(function (data: { ETag: any; }) {
                // console.log('Success', data);
                my_obj.ETag = data.ETag;
                return data.ETag;
            })
            .catch(function (err: any) {
                const errorMessage = `Failed to upload SVG to S3: ${err}`;
                // console.log(errorMessage);
                return errorMessage;
            });
    }
}
