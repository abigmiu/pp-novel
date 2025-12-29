import { ZPageResponse } from "@/apis/novel";
import { request } from "@/utils/request";
import * as z from "zod";

export const ZNotifyTemplateType = z.object({
    label: z.string(),
    value: z.string(),
});

export type IRNotifyTemplateType = z.infer<typeof ZNotifyTemplateType>;

/** 获取消息模板业务类型 */
export function RGetNotifyTemplateTypes() {
    return request.get<IRNotifyTemplateType[]>("/notify/template-type-list");
}

export interface IRCreateNotifyTemplateReq {
    /** 展示名称 */
    name: string;
    /** 业务类型 */
    type: string;
    /** 消息通道 1站内信,2WS,4邮件,8短信，可多选相加 */
    channelMask: number;
    /** 消息标题模板 */
    titleTpl: string;
    /** 消息内容模板 */
    contentTpl: string;
}

/** 创建消息模板 */
export function RCreateNotifyTemplate(data: IRCreateNotifyTemplateReq) {
    return request.post<void>("/notify/create-template", data);
}

export interface IRNotifyListReq {
    /** 页数 */
    page?: number;
    /** 每页量 */
    size?: number;
}

export const ZNotifyMessageItem = z.object({
    id: z.union([z.number(), z.string()]).transform(Number).optional(),
    title: z.string().optional(),
    subject: z.string().optional(),
    summary: z.string().optional(),
    content: z.string().optional(),
    type: z.union([z.string(), z.number()]).optional(),
    channel: z.union([z.string(), z.number()]).optional(),
    read: z.boolean().optional(),
    isRead: z.boolean().optional(),
    readFlag: z.union([z.boolean(), z.number(), z.string()]).optional(),
    readStatus: z.union([z.number(), z.string()]).optional(),
    status: z.union([z.number(), z.string()]).optional(),
    sendTime: z.string().optional(),
    createdAt: z.string().optional(),
    createTime: z.string().optional(),
    gmtCreate: z.string().optional(),
    gmtCreated: z.string().optional(),
    updateTime: z.string().optional(),
}).passthrough();

export type IRNotifyMessage = z.infer<typeof ZNotifyMessageItem>;

export const ZNotifyMessagePage = ZPageResponse(ZNotifyMessageItem);
export type IRNotifyMessagePage = z.infer<typeof ZNotifyMessagePage>;

/** 作者站内信列表 */
export function RGetWriterSiteMessages(data: IRNotifyListReq) {
    return request.post<IRNotifyMessagePage>("/notify/writer-site-message", data);
}

/** 读者站内信列表 */
export function RGetReaderSiteMessages(data: IRNotifyListReq) {
    return request.post<IRNotifyMessagePage>("/notify/reader-site-message", data);
}

export const ZUnreadCount = z.object({
    count: z.union([z.number(), z.string()]).transform((v) => Number(v) || 0),
});

export type IRUnreadCount = z.infer<typeof ZUnreadCount>;

/** 获取作者站内信未读数量 */
export function RGetWriterUnreadCount() {
    return request.get<IRUnreadCount>("/notify/writer-site-unread");
}

/** 获取读者站内信未读数量 */
export function RGetReaderUnreadCount() {
    return request.get<IRUnreadCount>("/notify/reader-site-unread");
}

export interface IRBatchReadReq {
    /** 已读 id 列表 */
    ids: (number | string)[];
}

/** 消息批量已读 */
export function RBatchRead(data: IRBatchReadReq) {
    return request.post<void>("/notify/batch-read", data);
}
