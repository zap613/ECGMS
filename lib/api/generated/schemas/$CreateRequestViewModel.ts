/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $CreateRequestViewModel = {
    properties: {
        userId: {
            type: 'string',
            isRequired: true,
            format: 'uuid',
        },
        groupId: {
            type: 'string',
            isRequired: true,
            format: 'uuid',
        },
        message: {
            type: 'string',
            isNullable: true,
            maxLength: 255,
        },
    },
} as const;
