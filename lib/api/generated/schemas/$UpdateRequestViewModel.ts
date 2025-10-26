/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $UpdateRequestViewModel = {
    properties: {
        id: {
            type: 'string',
            isRequired: true,
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
    },
} as const;
