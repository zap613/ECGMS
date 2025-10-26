/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $CreateGroupMemberRoleViewModel = {
    properties: {
        groupMemberId: {
            type: 'string',
            isRequired: true,
            format: 'uuid',
        },
        groupRoleName: {
            type: 'string',
            isRequired: true,
            minLength: 1,
        },
    },
} as const;
