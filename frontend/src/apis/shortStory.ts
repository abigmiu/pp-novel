import { request } from "@/utils/request";
import * as z from "zod";

export interface IRShortStoryCategoryTreeRes {
  id: number;
  name: string;
  coverUrl?: string;
  children?: IRShortStoryCategoryTreeRes[];
}

export const ZShortStoryCategoryTreeRes: z.ZodType = z.object({
    /** id */
    id: z.number().int().nonnegative(), // 如果 id 不能为负数
    /** 名称 */
    name: z.string().min(1), // 确保非空字符串
    /** 封面图 */
    coverUrl: z.string().url().optional().nullable()    , // 如果必须是合法的 URL
    /** 子结构 */
    children: z.array(z.lazy(() => ZShortStoryCategoryTreeRes)).optional().nullable(),
});


/** 短故事分类 - 获取树型数据 */
export function RGetShortStoryCategoryTree() {
    return request.get<IRShortStoryCategoryTreeRes[]>('/shortStoryCategory/tree')
}

export interface IRCreateShortStoryDraftReq {
    /**
     * 作品分类
     */
    categoryIds: number[];
    /**
     * 内容， 100 - 30万字
     */
    content: string;
    /**
     * 推荐封面
     */
    cover: string;
    /**
     * 试读段落数，配合试读比例一起使用
     */
    freeParagraph?: number;
    /**
     * 试读比例，根据段落分割
     */
    freeRate?: number;
    /**
     * 推荐标题 - 该标题仅用于短故事在头条推荐分发使用
     */
    recommendTitle?: string;
    /**
     * 标题-25字以内
     */
    title?: string;
    /**
     * 头条封面
     */
    toutiaoCover: string;
    /** 草稿箱id */
    draftId?: number
}

export const ZCreateShortStoryDraftReq: z.ZodType<IRCreateShortStoryDraftReq> = z.object({
    /** 作品分类 */
    categoryIds: z.array(z.number().int().nonnegative()),
    /** 内容， 100 - 30万字 */
    content: z.string().min(100).max(300000),
    /** 推荐封面 */
    cover: z.string().min(1),
    /** 试读段落数，配合试读比例一起使用 */
    freeParagraph: z.number().int().nonnegative().optional(),
    /** 试读比例，根据段落分割 */
    freeRate: z.number().min(0).max(1).optional(),
    /** 推荐标题 - 该标题仅用于短故事在头条推荐分发使用 */
    recommendTitle: z.string().min(1).optional(),
    /** 标题-25字以内 */
    title: z.string().max(25).optional(),
    /** 头条封面 */
    toutiaoCover: z.string().min(1),
});

/** 创建短故事草稿 */
export function RCreateShortStoryDraft(data: IRCreateShortStoryDraftReq) {
    return request.post<void>('/shortStory/draft', data)
}