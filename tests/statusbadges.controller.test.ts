// import { createStatusBadge } from '../services/status-badges/src/controller';
import { createStatusBadge } from '../services/status-badges/src/controller';

const timeout_timer = 15000;
const event_pipeline = {
    version: '0',
    id: 'be38c0c9-5fbe-a6bf-739c-9f3033d21807',
    'detail-type': 'CodePipeline Pipeline Execution State Change',
    source: 'aws.codepipeline',
    account: '184017940142',
    time: '2019-11-27T13:36:26Z',
    region: 'eu-west-2',
    resources: ['arn:aws:codepipeline:eu-west-2:184017940142:myapp-CodePipeline-ui-dev'],
    detail: {
        pipeline: 'myapp-CodePipeline-ui-dev',
        'execution-id': 'eb26ef1b-44ea-42b6-84d4-7e5f2db42ef2',
        state: 'STARTED',
        version: 4,
    },
};

test(
    'upload badge status - codebuild',
    async () => {
        const my_event = {
            detail: {
                'build-status': 'SUCCEEDED',
                'project-name': 'mg-CodeBuild-api-dev',
            },
        };
        return createStatusBadge(my_event).then(data => {
            expect(data).toBeTruthy();
        });
    },
    timeout_timer,
);

test(
    'upload badge status - pipeline',
    async () => {
        return createStatusBadge(event_pipeline).then(data => {
            expect(data).toBeTruthy();
        });
    },
    timeout_timer,
);
