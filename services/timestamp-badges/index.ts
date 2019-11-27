import { createTimestampBadge } from './controller';

exports.handler = (event, context, callback) => {
    createTimestampBadge(event);
};
