// import { createStatusBadge, createTimestampBadge } from './controller';
import { createStatusBadge } from './controller';
const timeout_timer = 30000;
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
        const my_event = {
            detail: {
                pipeline: 'mg-CodePipeline-api-dev',
                state: 'STARTED',
            },
        };
        return createStatusBadge(my_event).then(data => {
            expect(data).toBeTruthy();
        });
    },
    timeout_timer,
);

// test(
//     'upload badge timestamp - codebuild',
//     () => {
//         const my_event = {
//             detail: {
//                 'build-status': 'SUCCEEDED',
//                 'project-name': 'mg-CodeBuild-api-dev',
//             },
//         };
//         return createTimestampBadge(my_event).then(data => {
//             expect(data).toBeTruthy();
//         });
//     },
//     timeout_timer,
// );

// test(
//     'upload badge timestamp - pipeline',
//     async () => {
//         const my_event = {
//             detail: {
//                 pipeline: 'mg-CodePipeline-api-dev',
//                 state: 'STARTED',
//             },
//         };
//         return createTimestampBadge(my_event).then(data => {
//             expect(data).toBeTruthy();
//         });
//     },
//     timeout_timer,
// );
