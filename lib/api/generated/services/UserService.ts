/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChangePasswordViewModel } from '../models/ChangePasswordViewModel';
import type { CreateUserViewModel } from '../models/CreateUserViewModel';
import type { UpdateUserViewModel } from '../models/UpdateUserViewModel';
import type { UserViewModel } from '../models/UserViewModel';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserService {
    /**
     * @param keyword
     * @param roleName
     * @param pageNumber
     * @param pageSize
     * @returns UserViewModel Success
     * @throws ApiError
     */
    public static getApiUser(
        keyword?: string,
        roleName?: string,
        pageNumber?: number,
        pageSize?: number,
    ): CancelablePromise<Array<UserViewModel>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/User',
            query: {
                'Keyword': keyword,
                'RoleName': roleName,
                'PageNumber': pageNumber,
                'PageSize': pageSize,
            },
        });
    }
    /**
     * @param requestBody
     * @returns UserViewModel Success
     * @throws ApiError
     */
    public static postApiUser(
        requestBody?: CreateUserViewModel,
    ): CancelablePromise<UserViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/User',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns UserViewModel Success
     * @throws ApiError
     */
    public static getApiUser1(
        id: string,
    ): CancelablePromise<UserViewModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/User/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns UserViewModel Success
     * @throws ApiError
     */
    public static putApiUser(
        id: string,
        requestBody?: UpdateUserViewModel,
    ): CancelablePromise<UserViewModel> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/User/{id}',
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
    public static deleteApiUser(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/User/{id}',
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
    public static postApiUserChangePassword(
        id: string,
        requestBody?: ChangePasswordViewModel,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/User/ChangePassword/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param formData
     * @returns any Success
     * @throws ApiError
     */
    public static postApiUserImportStudents(
        formData?: {
            file?: Blob;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/User/import-students',
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }
}
