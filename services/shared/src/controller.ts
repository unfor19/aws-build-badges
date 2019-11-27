import { BaseS3Object } from './model';
import { LambdaEvent } from './interfaces';

export function isPipelineBool(event: LambdaEvent): boolean {
    return typeof event.detail.pipeline !== 'undefined';
}

export function isBucketNameValid(bucketName: any) {
    const bucketname_regexp = RegExp('(?!^(d{1,3}.){3}d{1,3}$)(^[a-z0-9]([a-z0-9-]*(.[a-z0-9])?)*$)');
    if (typeof bucketName !== 'undefined' && bucketname_regexp.test(bucketName)) {
        return bucketName.toString();
    } else {
        return false;
    }
}

export function createBadge(key: string, body: Buffer) {
    const bucket_name = isBucketNameValid(process.env.BUCKET_BADGES);
    if (!bucket_name) {
        throw new Error('Invalid bucket name');
    }
    return new BaseS3Object(bucket_name, key, body).uploadObject();
}
