import { BaseS3Object } from './model';
import { readFileSync, existsSync } from 'fs';
// import { loadSync } from 'text-to-svg';
import { LambdaEvent } from './interfaces';

export function isBucketNameValid(bucketName: any) {
    const bucketname_regexp = RegExp('(?!^(d{1,3}.){3}d{1,3}$)(^[a-z0-9]([a-z0-9-]*(.[a-z0-9])?)*$)');
    if (typeof bucketName !== 'undefined' && bucketname_regexp.test(bucketName)) {
        return bucketName.toString();
    } else {
        return false;
    }
}

function createBadge(event: LambdaEvent, badge_type: string) {
    const bucket_name = isBucketNameValid(process.env.BUCKET_BADGES);
    if (!bucket_name) {
        throw new Error('Invalid bucket name');
    }
    const isPipeline = typeof event.detail.pipeline !== 'undefined';
    const project = isPipeline ? event.detail.pipeline : event.detail['project-name'];
    let body: Buffer, key: string;
    if (badge_type === 'status') {
        const status = isPipeline ? event.detail.state : event.detail['build-status'];
        let image_path = `badges/${isPipeline ? 'pipeline' : 'build'}-${status}.svg`;
        if (!existsSync(image_path)) {
            if (existsSync(`src/${image_path}`)) {
                image_path = `src/${image_path}`;
            } else {
                throw new Error(`File doesn't exist - ${image_path}`);
            }
        }
        body = readFileSync(image_path);
        key = `${project}.svg`;
    }
    // else if (badge_type === 'timestamp') {
    //     const textToSVG = loadSync();
    //     const attributes = { fill: 'black' };
    //     const options = { x: 0, y: 0, fontSize: 16, anchor: 'top', attributes: attributes };
    //     const timestampText = new Date().toISOString();
    //     body = textToSVG.getSVG(timestampText, options);
    //     key = `${project}-timeStamp.svg`;
    // }
    else {
        throw new Error('Unknown badge type');
    }
    return new BaseS3Object(bucket_name, key, body).uploadObject();
}

// export function createTimestampBadge(event: LambdaEvent) {
//     return createBadge(event, 'timestamp');
// }

export function createStatusBadge(event: LambdaEvent) {
    return createBadge(event, 'status');
}
