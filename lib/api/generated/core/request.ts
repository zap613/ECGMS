// lib/api/request.ts
// Wrapper request function to include auth token from localStorage
import type { ApiRequestOptions } from './generated/core/ApiRequestOptions';
import type { CancelablePromise } from './generated/core/CancelablePromise';
import { OpenAPI } from './generated/core/OpenAPI';
import { request as baseRequest } from './generated/core/request';

export function request<T>(options: ApiRequestOptions): CancelablePromise<T> {
    // Lấy token từ localStorage (nếu có)
    const token = localStorage.getItem('token');
    if (token && OpenAPI.TOKEN !== token) {
        OpenAPI.TOKEN = token;
    }
    return baseRequest(options);
}