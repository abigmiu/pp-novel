import { request } from "@/utils/request";
import * as z from "zod";

export interface IUserInfoRes {
    /**
     * 头像
     */
    avatar: string;
    /**
     * 简介
     */
    desc?: string;
    /**
     * 脱敏邮箱
     */
    email: string;
    /**
     * 经验
     */
    exp: number;
    /**
     * 等级
     */
    level: number;
    /**
     * 笔名
     */
    pseudonym: string;
    /**
     * 脱敏qq
     */
    qq?: string;
    /**
     * 用户 uid
     */
    uid: number;
    /**
     * 创建时间
     */
    createdDate: string;
}



export const ZUserFansFollowStatRes = z.object({
    /** 粉丝总数 */
    fansCount: z.number().int().nonnegative(),
    /** 关注总数 */
    followCount: z.number().int().nonnegative(),
})

export type IUserFansFollowStatRes = z.infer<typeof ZUserFansFollowStatRes>;

/** 获取用户信息 */
export function RGetUserInfo() {
    return request.get<IUserInfoRes>('/web/user/self')
}

/** 获取用户粉丝关注统计数据 */
export function RGetUserFansFollowStat() {
    return request.get<IUserFansFollowStatRes>('/web/user/self-fans-follow')
}
