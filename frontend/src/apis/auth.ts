import { request } from "@/utils/request";

export interface IRLoginReq {
    /**
     * 邮箱
     */
    email: string;
    /**
     * 密码
     */
    password: string;
}

export interface IRLoginRes {
    /**
     * token
     */
    token: string;
}

export function RLogin(data: IRLoginReq) {
    return request.post<IRLoginRes>('/web/auth/login', data);
}

export interface IRGetRegisterCodeReq {
    /**
     * 邮箱
     */
    email: string;
}

export function RGetRegisterCode(data: IRGetRegisterCodeReq) {
    return request.post<void>('/email/registerCode', data);
}

export interface IRRegisterReq {
    /**
     * 验证码
     */
    code: string;
    /**
     * 邮箱
     */
    email: string;
    /**
     * 密码，密码为 8 - 20 字母数字组合
     */
    password: string;
}

export interface IRRegisterRes {
    /**
     * token
     */
    token: string;
}

export function RRegister(data: IRRegisterReq) {
    return request.post<IRRegisterRes>('/web/auth/register', data);
}



export function RLogout() {
    return request.post<void>('/web/auth/logout')
}