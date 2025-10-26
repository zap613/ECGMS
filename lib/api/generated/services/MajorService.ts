/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MajorCreateModel } from '../models/MajorCreateModel';
import type { MajorUpdateModel } from '../models/MajorUpdateModel';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MajorService {
    /**
     * @param majorCode
     * @param name
     * @returns any Success
     * @throws ApiError
     */
    public static getApiMajor(
        majorCode?: string,
        name?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Major',
            query: {
                'majorCode': majorCode,
                'name': name,
            },
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static postApiMajor(
        requestBody?: MajorCreateModel,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Major',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any Success
     * @throws ApiError
     */
    public static getApiMajor1(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Major/{id}',
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
    public static putApiMajor(
        id: string,
        requestBody?: MajorUpdateModel,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/Major/{id}',
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
    public static deleteApiMajor(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/Major/{id}',
            path: {
                'id': id,
            },
        });
    }
}
