/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateGroupMemberRoleViewModel } from '../models/CreateGroupMemberRoleViewModel';
import type { GroupMemberRoleViewModel } from '../models/GroupMemberRoleViewModel';
import type { UpdateGroupMemberRoleViewModel } from '../models/UpdateGroupMemberRoleViewModel';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class GroupMemberRoleService {
    /**
     * @param groupMemberId
     * @param keyword
     * @param pageNumber
     * @param pageSize
     * @returns GroupMemberRoleViewModel Success
     * @throws ApiError
     */
    public static getApiGroupMemberRole(
        groupMemberId?: string,
        keyword?: string,
        pageNumber?: number,
        pageSize?: number,
    ): CancelablePromise<Array<GroupMemberRoleViewModel>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/GroupMemberRole',
            query: {
                'GroupMemberId': groupMemberId,
                'Keyword': keyword,
                'PageNumber': pageNumber,
                'PageSize': pageSize,
            },
        });
    }
    /**
     * @param requestBody
     * @returns GroupMemberRoleViewModel Success
     * @throws ApiError
     */
    public static postApiGroupMemberRole(
        requestBody?: CreateGroupMemberRoleViewModel,
    ): CancelablePromise<GroupMemberRoleViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/GroupMemberRole',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns GroupMemberRoleViewModel Success
     * @throws ApiError
     */
    public static getApiGroupMemberRole1(
        id: string,
    ): CancelablePromise<GroupMemberRoleViewModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/GroupMemberRole/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns GroupMemberRoleViewModel Success
     * @throws ApiError
     */
    public static putApiGroupMemberRole(
        id: string,
        requestBody?: UpdateGroupMemberRoleViewModel,
    ): CancelablePromise<GroupMemberRoleViewModel> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/GroupMemberRole/{id}',
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
    public static deleteApiGroupMemberRole(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/GroupMemberRole/{id}',
            path: {
                'id': id,
            },
        });
    }
}
