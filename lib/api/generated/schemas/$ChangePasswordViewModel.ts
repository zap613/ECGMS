/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ChangePasswordViewModel = {
    properties: {
        oldPassword: {
            type: 'string',
            isRequired: true,
            minLength: 1,
        },
        newPassword: {
            type: 'string',
            isRequired: true,
            minLength: 6,
        },
        confirmPassword: {
            type: 'string',
            isRequired: true,
            minLength: 1,
        },
    },
} as const;
