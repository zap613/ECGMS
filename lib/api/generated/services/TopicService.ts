/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TopicCreateModel } from '../models/TopicCreateModel';
import type { TopicViewModel } from '../models/TopicViewModel';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TopicService {
    /**
     * @returns any Success
     * @throws ApiError
     */
    public static getApiTopic(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Topic',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static postApiTopic(
        requestBody?: TopicCreateModel,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Topic',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any Success
     * @throws ApiError
     */
    public static getApiTopic1(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Topic/{id}',
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
    public static putApiTopic(
        id: string,
        requestBody?: TopicViewModel,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/Topic/{id}',
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
    public static deleteApiTopic(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/Topic/{id}',
            path: {
                'id': id,
            },
        });
    }
}
