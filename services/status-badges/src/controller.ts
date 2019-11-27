import { createBadge, isPipelineBool } from '../../shared/src/controller';
import { LambdaEvent } from '../../shared/src/interfaces';
import { readFileSync } from 'fs';

export function createStatusBadge(event: LambdaEvent) {
    const isPipeline = isPipelineBool(event);
    const project = isPipeline ? event.detail.pipeline : event.detail['project-name'];
    const status = isPipeline ? event.detail.state : event.detail['build-status'];
    let file_name = `${isPipeline ? 'pipeline' : 'build'}-${status}.svg`;
    const image_path = process.env.IMAGEPATH ? `./services/status-badges/src/badges/${file_name}` : file_name;
    let body: Buffer, key: string;
    try {
        body = readFileSync(image_path);
    } catch (e1) {
        throw new Error(`File doesn't exist - ${image_path}\n${e1}`);
    }
    body = readFileSync(image_path);
    key = `${project}.svg`;
    return createBadge(key, body);
}

export { LambdaEvent } from '../../shared/src/interfaces';
