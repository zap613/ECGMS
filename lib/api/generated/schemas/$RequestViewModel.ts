/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $RequestViewModel = {
    properties: {
        id: {
            type: 'string',
            format: 'uuid',
        },
        userId: {
            type: 'string',
            isNullable: true,
            format: 'uuid',
        },
        groupId: {
            type: 'string',
            isNullable: true,
            format: 'uuid',
        },
        status: {
            type: 'string',
            isNullable: true,
        },
        message: {
            type: 'string',
            isNullable: true,
        },
        createdAt: {
            type: 'string',
            isNullable: true,
            format: 'date-time',
        },
        updatedAt: {
            type: 'string',
            isNullable: true,
            format: 'date-time',
        },
    },
} as const;
