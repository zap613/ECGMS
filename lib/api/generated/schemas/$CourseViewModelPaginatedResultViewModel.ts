/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $CourseViewModelPaginatedResultViewModel = {
    properties: {
        items: {
            type: 'array',
            contains: {
                type: 'CourseViewModel',
            },
            isNullable: true,
        },
        totalCount: {
            type: 'number',
            format: 'int32',
        },
        pageNumber: {
            type: 'number',
            format: 'int32',
        },
        pageSize: {
            type: 'number',
            format: 'int32',
        },
        totalPages: {
            type: 'number',
            isReadOnly: true,
            format: 'int32',
        },
    },
} as const;
