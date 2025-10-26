/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $GroupMemberViewModel = {
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
        username: {
            type: 'string',
            isNullable: true,
        },
        email: {
            type: 'string',
            isNullable: true,
        },
        groupId: {
            type: 'string',
            isNullable: true,
            format: 'uuid',
        },
        groupName: {
            type: 'string',
            isNullable: true,
        },
        joinAt: {
            type: 'string',
            isNullable: true,
            format: 'date-time',
        },
        roles: {
            type: 'array',
            contains: {
                type: 'GroupMemberRoleViewModel',
            },
            isNullable: true,
        },
    },
} as const;
