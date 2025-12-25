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

/** 创建小说 */
export function RCreateNovel(data: IRCreateNovelReq) {
    return request.post<IRCreateNovelRes>("/writer-novel/create", data);
}
