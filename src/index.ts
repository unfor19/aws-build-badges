// import { createStatusBadge, createTimestampBadge } from './controller';
import { createStatusBadge } from './controller';
exports.handler = (event, context, callback) => {
    // createTimestampBadge(event);
    createStatusBadge(event);
};
