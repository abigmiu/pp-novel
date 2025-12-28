import { request } from "@/utils/request";
import * as z from "zod";

export const ZNovelCategory = z.object({
    id: z.number().int(),
    name: z.string(),
    description: z.string().nullable().optional(),
    cover: z.string().nullable().optional(),
    parentId: z.number().int().nullable().optional(),
    parentName: z.string().nullable().optional(),
    type: z.number().int().nullable().optional(),
});

export type IRNovelCategory = z.infer<typeof ZNovelCategory>;

/** 获取小说分类（type: 1=男频，2=女频） */
export function RGetNovelCategories(type: number) {
    return request.get<IRNovelCategory[]>("/novel-common/category", { type });
}

export interface IRCreateNovelReq {
    title: string;
    type: number;
    categoryIds?: number[];
    themeIds?: number[];
    roleIds?: number[];
    plotIds?: number[];
    cover?: string;
    protagonist1?: string;
    protagonist2?: string;
    description?: string;
}

export const ZCreateNovelRes = z.object({
    novelId: z.number().int(),
});

export type IRCreateNovelRes = z.infer<typeof ZCreateNovelRes>;

export const ZNewestChapter = z.object({
    /** 章节标题 */
    title: z.string(),
    /** 章节 ID */
    id: z.number().int(),
    /** 章节索引（第几章） */
    idx: z.number().int()
});

export const ZWriterSelfNovelListItem = z.object({
    /** 作品 ID */
    id: z.number().int(),
    /** 作品名称 */
    title: z.string(),
    /** 封面 */
    cover: z.string().nullable().optional(),
    /** 总字数 */
    totalWordCount: z.number().int(),
    /** 状态：0=待审核/草稿，1=连载中，2=已完结 等 */
    status: z.number().int(),
    /** 总章节数 */
    totalChapterCount: z.number().int(),
    /** 最新章节信息 */
    newestChapter: ZNewestChapter.nullable().optional(),
});

export type IRWriterSelfNovelListItem = z.infer<typeof ZWriterSelfNovelListItem>;

/** 创建小说 */
export function RCreateNovel(data: IRCreateNovelReq) {
    return request.post<IRCreateNovelRes>("/writer-novel/create", data);
}

export interface IRCreateChapterReq {
    /** 标题 */
    title: string;
    /** 章节索引（第几章） */
    chapterIdx: number;
    /** 章节内容 */
    content?: string;
    /** 作者有话说 */
    authorRemark?: string;
    /** 价格，单位元，0 为免费 */
    price?: number;
    /** 书本 ID */
    bookId?: number;
}

/** 创建小说章节 */
export function RCreateChapter(data: IRCreateChapterReq) {
    return request.post<void>("/writer-novel/chapter-create", data);
}

/** 作家书本列表 */
export function RGetWriterNovelList() {
    return request.get<IRWriterSelfNovelListItem[]>("/writer-novel/list");
}

/** 小说最新章节信息（读者端列表） */
export const ZNovelPageNewestChapter = z.object({
    title: z.string(),
    date: z.string(),
    idx: z.number().int(),
});

/** 小说分页列表条目（读者端） */
export const ZNovelPageListItem = z.object({
    cover: z.string().nullable().optional(),
    title: z.string(),
    author: z.string(),
    status: z.number().int(),
    totalWordCount: z.union([z.number(), z.string()]),
    description: z.string().nullable().optional(),
    newestChapter: ZNovelPageNewestChapter.nullable().optional(),
});

export type IRNovelPageListItem = z.infer<typeof ZNovelPageListItem>;

export interface IRNovelPageListReq {
    page?: number;
    size?: number;
    category?: number;
    wordCount?: number;
    status?: number;
}

export const ZPageResponse = <T extends z.ZodTypeAny>(schema: T) => z.object({
    page: z.union([z.number(), z.string()]).transform(Number),
    size: z.union([z.number(), z.string()]).transform(Number),
    total: z.union([z.number(), z.string()]).transform(Number),
    rows: z.array(schema),
});

export const ZNovelPageListResponse = ZPageResponse(ZNovelPageListItem);
export type IRNovelPageListRes = z.infer<typeof ZNovelPageListResponse>;

/** 获取小说分页数据（读者端） */
export function RGetNovelPageList(data: IRNovelPageListReq) {
    return request.post<IRNovelPageListRes>("/novel-common/page-list", data);
}
