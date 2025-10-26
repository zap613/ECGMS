/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CourseViewModel } from '../models/CourseViewModel';
import type { CourseViewModelPaginatedResultViewModel } from '../models/CourseViewModelPaginatedResultViewModel';
import type { CreateCourseViewModel } from '../models/CreateCourseViewModel';
import type { UpdateCourseViewModel } from '../models/UpdateCourseViewModel';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CourseService {
    /**
     * @param keyword
     * @param pageNumber
     * @param pageSize
     * @returns CourseViewModelPaginatedResultViewModel Success
     * @throws ApiError
     */
    public static getApiCourse(
        keyword?: string,
        pageNumber?: number,
        pageSize?: number,
    ): CancelablePromise<CourseViewModelPaginatedResultViewModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Course',
            query: {
                'Keyword': keyword,
                'PageNumber': pageNumber,
                'PageSize': pageSize,
            },
        });
    }
    /**
     * @param requestBody
     * @returns CourseViewModel Success
     * @throws ApiError
     */
    public static postApiCourse(
        requestBody?: CreateCourseViewModel,
    ): CancelablePromise<CourseViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Course',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns CourseViewModel Success
     * @throws ApiError
     */
    public static getApiCourse1(
        id: string,
    ): CancelablePromise<CourseViewModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Course/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static putApiCourse(
        id: string,
        requestBody?: UpdateCourseViewModel,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/Course/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any Success
     * @throws ApiError
     */
    public static deleteApiCourse(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/Course/{id}',
            path: {
                'id': id,
            },
        });
    }
}
