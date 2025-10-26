/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $UpdateUserViewModel = {
    properties: {
        username: {
            type: 'string',
            isRequired: true,
            minLength: 1,
        },
        email: {
            type: 'string',
            isNullable: true,
            format: 'email',
        },
        skillSet: {
            type: 'string',
            isNullable: true,
        },
    },
} as const;
