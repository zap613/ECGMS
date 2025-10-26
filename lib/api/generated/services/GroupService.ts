/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GroupCreateModel } from '../models/GroupCreateModel';
import type { UpdateGroupViewModel } from '../models/UpdateGroupViewModel';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class GroupService {
    /**
     * @param courseName
     * @param formData
     * @returns any Success
     * @throws ApiError
     */
    public static postApiGroupImportGroups(
        courseName?: string,
        formData?: {
            file?: Blob;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Group/import-groups',
            query: {
                'courseName': courseName,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }
    /**
     * @returns any Success
     * @throws ApiError
     */
    public static getApiGroup(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Group',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static postApiGroup(
        requestBody?: GroupCreateModel,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Group',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any Success
     * @throws ApiError
     */
    public static getApiGroup1(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Group/{id}',
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
    public static putApiGroup(
        id: string,
        requestBody?: UpdateGroupViewModel,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/Group/{id}',
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
    public static deleteApiGroup(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/Group/{id}',
            path: {
                'id': id,
            },
        });
    }
}
