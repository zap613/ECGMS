/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $UpdateCourseViewModel = {
    properties: {
        courseCode: {
            type: 'string',
            isRequired: true,
            minLength: 1,
        },
        courseName: {
            type: 'string',
            isRequired: true,
            minLength: 1,
        },
        description: {
            type: 'string',
            isNullable: true,
        },
    },
} as const;
