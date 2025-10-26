/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MajorCodeUpdateModel } from '../models/MajorCodeUpdateModel';
import type { UserProfileUpdateModel } from '../models/UserProfileUpdateModel';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserProfileService {
    /**
     * @returns any Success
     * @throws ApiError
     */
    public static getApiUserProfile(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/UserProfile',
        });
    }
    /**
     * @param id
     * @returns any Success
     * @throws ApiError
     */
    public static getApiUserProfile1(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/UserProfile/{id}',
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
    public static putApiUserProfile(
        id: string,
        requestBody?: UserProfileUpdateModel,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/UserProfile/{id}',
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
    public static deleteApiUserProfile(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/UserProfile/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param userId
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public static patchApiUserProfileMajor(
        userId: string,
        requestBody?: MajorCodeUpdateModel,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/UserProfile/{userId}/major',
            path: {
                'userId': userId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
