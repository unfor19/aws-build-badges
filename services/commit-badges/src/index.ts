import { createCommitIdBadge, LambdaEvent } from './controller';
exports.handler = (event: LambdaEvent, context: any, callback: any) => {
    return new Promise(function () {
        return createCommitIdBadge(event);
    }).then(function (response) {
        console.log(response);
        return response;
    }).catch(function (err) {
        console.log(err);
        return err;
    });
};
