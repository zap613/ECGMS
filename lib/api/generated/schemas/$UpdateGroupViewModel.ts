/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $UpdateGroupViewModel = {
    properties: {
        name: {
            type: 'string',
            isNullable: true,
        },
        courseId: {
            type: 'string',
            isNullable: true,
            format: 'uuid',
        },
        topicId: {
            type: 'string',
            isNullable: true,
            format: 'uuid',
        },
        maxMembers: {
            type: 'number',
            isNullable: true,
            format: 'int32',
        },
        startDate: {
            type: 'string',
            isNullable: true,
            format: 'date-time',
        },
        endDate: {
            type: 'string',
            isNullable: true,
            format: 'date-time',
        },
    },
} as const;
