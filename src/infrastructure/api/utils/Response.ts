import { Response } from 'express';

export interface PaginationMeta {
    total: number;
    totalPages: number;
    totalItems: number;
    page: number;
}

export interface ApiResponse<T = unknown> {
    success: boolean;
    message?: string;
    data?: T;
    pagination?: PaginationMeta;
    timestamp: string;
}

export interface ApiErrorResponse {
    error: {
        code: string;
        message: string;
    };
}

export class ResponseUtil {
    /**
     * ส่ง response สำเร็จ
     */
    static success<T>(
        res: Response,
        data?: T,
        message?: string,
        statusCode: number = 200
    ): Response {
        const response: ApiResponse<T> = {
            success: true,
            message: message || 'Operation successful',
            data,
            timestamp: new Date().toISOString(),
        };

        return res.status(statusCode).json(response);
    }

    /**
     * ส่ง response สำเร็จพร้อม pagination
     */
    static successWithPagination<T>(
        res: Response,
        data: T[],
        pagination: {
            page: number;
            limit: number;
            totalItems: number;
            totalPages: number;
        },
        message?: string,
        statusCode: number = 200
    ): Response {
        const response: ApiResponse<T[]> = {
            success: true,
            message: message || 'Operation successful',
            data,
            pagination: {
                total: pagination.totalItems,
                totalPages: pagination.totalPages,
                totalItems: pagination.totalItems,
                page: pagination.page,
            },
            timestamp: new Date().toISOString(),
        };

        return res.status(statusCode).json(response);
    }

    /**
     * ส่ง response สำเร็จสำหรับการสร้างข้อมูล
     */
    static created<T>(
        res: Response,
        data?: T,
        message: string = 'Resource created successfully'
    ): Response {
        return this.success(res, data, message, 201);
    }

    /**
     * ส่ง response error
     */
    static error(
        res: Response,
        message: string,
        statusCode: number = 500,
        errorCode: string = 'INTERNAL_ERROR'
    ): Response {
        const response: ApiErrorResponse = {
            error: {
                code: errorCode,
                message,
            },
        };

        return res.status(statusCode).json(response);
    }

    /**
     * ส่ง response สำหรับ Bad Request (400)
     */
    static badRequest(
        res: Response,
        message: string = 'Bad request',
        errorCode: string = 'BAD_REQUEST'
    ): Response {
        return this.error(res, message, 400, errorCode);
    }

    /**
     * ส่ง response สำหรับ Unauthorized (401)
     */
    static unauthorized(
        res: Response,
        message: string = 'Unauthorized',
        errorCode: string = 'UNAUTHORIZED'
    ): Response {
        return this.error(res, message, 401, errorCode);
    }

    /**
     * ส่ง response สำหรับ Forbidden (403)
     */
    static forbidden(
        res: Response,
        message: string = 'Forbidden',
        errorCode: string = 'FORBIDDEN'
    ): Response {
        return this.error(res, message, 403, errorCode);
    }

    /**
     * ส่ง response สำหรับ Not Found (404)
     */
    static notFound(
        res: Response,
        message: string = 'Resource not found',
        errorCode: string = 'NOT_FOUND'
    ): Response {
        return this.error(res, message, 404, errorCode);
    }

    /**
     * ส่ง response สำหรับ Conflict (409)
     */
    static conflict(
        res: Response,
        message: string = 'Resource already exists',
        errorCode: string = 'CONFLICT'
    ): Response {
        return this.error(res, message, 409, errorCode);
    }

    /**
     * ส่ง response สำหรับ Validation Error (422)
     */
    static validationError(
        res: Response,
        message: string = 'Validation failed',
        errorCode: string = 'VALIDATION_ERROR'
    ): Response {
        return this.error(res, message, 422, errorCode);
    }

    /**
     * ส่ง response สำหรับ Internal Server Error (500)
     */
    static internalError(
        res: Response,
        message: string = 'Internal server error',
        errorCode: string = 'INTERNAL_ERROR'
    ): Response {
        return this.error(res, message, 500, errorCode);
    }
}
