/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $CreateUserViewModel = {
    properties: {
        username: {
            type: 'string',
            isRequired: true,
            minLength: 1,
        },
        password: {
            type: 'string',
            isRequired: true,
            minLength: 6,
        },
        email: {
            type: 'string',
            isRequired: true,
            format: 'email',
            minLength: 1,
        },
        role: {
            type: 'RoleViewModel',
        },
        skillSet: {
            type: 'string',
            isNullable: true,
        },
    },
} as const;
