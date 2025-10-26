/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $CourseViewModel = {
    properties: {
        id: {
            type: 'string',
            format: 'uuid',
        },
        courseCode: {
            type: 'string',
            isNullable: true,
        },
        courseName: {
            type: 'string',
            isNullable: true,
        },
        description: {
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
