/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $CreateGroupMemberViewModel = {
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
    },
} as const;
