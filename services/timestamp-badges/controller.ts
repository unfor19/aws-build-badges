import { BaseS3Object } from '../shared/model';
import { readFileSync, existsSync } from 'fs';
import { loadSync } from 'text-to-svg';
import { LambdaEvent } from '../shared/interfaces';
import { CodePipeline } from 'aws-sdk';

function isPipelineBool(event: LambdaEvent): boolean {
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

function createBadge(event: LambdaEvent, badge_type: string, commitId?: any) {
    const bucket_name = isBucketNameValid(process.env.BUCKET_BADGES);
    if (!bucket_name) {
        throw new Error('Invalid bucket name');
    }
    const isPipeline = isPipelineBool(event);
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
    } else if (badge_type === 'commitId' && typeof commitId === 'string') {
        try {
            const textToSVG = loadSync();
            const attributes = { fill: 'black' };
            const options = { x: 0, y: 0, fontSize: 16, anchor: 'top', attributes: attributes };
            const commitIdText = commitId.substring(0, 8);
            body = textToSVG.getSVG(commitIdText, options);
            key = `${project}-commitId.svg`;
        } catch (e) {
            throw new Error(e);
        }
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

function getRevisionId(data): any {
    // get commit it
    try {
        return data['pipelineExecution']['artifactRevisions'][0]['revisionId'];
    } catch (e) {
        return false;
    }
}

function getPipelineParams(event: LambdaEvent): any {
    try {
        return {
            pipelineExecutionId: event['detail']['execution-id'] /* required */,
            pipelineName: event['detail']['pipeline'] /* required */,
        };
    } catch (e) {
        throw new Error('Pipeline is invalid');
    }
}

export async function createCommitIdBadge(event: LambdaEvent) {
    if (isPipelineBool(event) && getPipelineParams(event)) {
        const params = getPipelineParams(event);
        const codepipeline = new CodePipeline({ apiVersion: '2015-07-09' });
        const codepipeline_promise = new Promise(function(resolve, reject) {
            codepipeline.getPipelineExecution(params, function(err, data) {
                if (err && !getRevisionId(data)) {
                    const errMessage = `Error: ${JSON.stringify(err)}`;
                    reject(Error(errMessage));
                } else {
                    const commitId = getRevisionId(data); // successful response
                    resolve(createBadge(event, 'commitId', commitId));
                }
            });
        });
        try {
            return await codepipeline_promise;
        } catch (err) {
            const errorMessage = `Failed to upload SVG to S3: ${err}`;
            return errorMessage;
        }
    } else {
        return new Promise(function(data) {
            // throw new Error('Failed to get Commit Id');
            return 'Not CodePipeline';
        });
    }
}
