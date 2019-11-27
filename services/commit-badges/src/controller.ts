import { LambdaEvent } from '../../shared/src/interfaces';
import { createBadge } from '../../shared/src/controller';
const CodePipeline = require('aws-sdk/clients/codepipeline');
let svgTemplate = `
<svg xmlns="http://www.w3.org/2000/svg" width="80" height="16" viewport="0 0 60 55">
  <text x="0" y="16" style="font: 16px arial;padding:1">CommitId</text>
</svg>
`

function getRevisionId(data: { [x: string]: { [x: string]: { [x: string]: any; }[]; }; }): any {
    // get commit id
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

export function createCommitIdBadge(event: LambdaEvent) {
    if (getPipelineParams(event)) {
        const params = getPipelineParams(event);
        const project = event.detail.pipeline;
        const codepipeline = new CodePipeline({ apiVersion: '2015-07-09' });
        const codepipeline_promise = new Promise(function (resolve, reject) {
            codepipeline.getPipelineExecution(params, function (err: any, data: any) {
                if (err || !getRevisionId(data)) {
                    const errMessage = `Error: ${JSON.stringify(err)}`;
                    reject(Error(errMessage));
                } else {
                    let key: string, body: Buffer;
                    const commitId = getRevisionId(data); // successful response
                    const commitIdText = commitId.substring(0, 8);
                    const textBody = svgTemplate.replace("CommitId", commitIdText);
                    body = Buffer.from(textBody);
                    key = `${project}-commitId.svg`;
                    resolve(createBadge(key, body));
                }
            });
        });
        return codepipeline_promise.then(function (data) {
            return 'Success';
        }).catch(function (err) {
            return `Failed to upload SVG to S3: ${err}`;
        });
    } else {
        return new Promise(function (data) {
            // throw new Error('Failed to get Commit Id');
            return 'Not CodePipeline';
        });
    }
}

export { LambdaEvent } from '../../shared/src/interfaces';