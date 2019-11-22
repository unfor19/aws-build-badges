interface Detail {
    'project-name'?: string;
    'build-status'?: string;
    pipeline?: any;
    state?: string;
}

export interface LambdaEvent {
    detail: Detail;
}
