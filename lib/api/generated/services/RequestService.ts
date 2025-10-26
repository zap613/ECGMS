/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateRequestViewModel } from '../models/CreateRequestViewModel';
import type { RequestViewModel } from '../models/RequestViewModel';
import type { UpdateRequestViewModel } from '../models/UpdateRequestViewModel';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RequestService {
    /**
     * @returns RequestViewModel Success
     * @throws ApiError
     */
    public static getApiRequest(): CancelablePromise<Array<RequestViewModel>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Request',
        });
    }
    /**
     * @param requestBody
     * @returns RequestViewModel Success
     * @throws ApiError
     */
    public static postApiRequest(
        requestBody?: CreateRequestViewModel,
    ): CancelablePromise<RequestViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Request',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns RequestViewModel Success
     * @throws ApiError
     */
    public static getApiRequest1(
        id: string,
    ): CancelablePromise<RequestViewModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Request/{id}',
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
    public static putApiRequest(
        id: string,
        requestBody?: UpdateRequestViewModel,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/Request/{id}',
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
    public static deleteApiRequest(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/Request/{id}',
            path: {
                'id': id,
            },
        });
    }
}
