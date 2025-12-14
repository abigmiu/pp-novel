import { request } from "@/utils/request";
import * as z from "zod";
export const ZWriterCountStat = z.object({
    /** 小说数量 */
    bookCount: z.number().int().nonnegative(),
    /** 短故事数量 */
    shortStoryCount: z.number().int().nonnegative(),
    /** 小说章节 */
    bookChapterCount: z.number().int().nonnegative(),
    /** 小说总字数 */
    bookCharCount: z.number().int().nonnegative(),
    /** 短故事总字数 */
    shortStoryCharCount: z.number().int().nonnegative(),
})

export type IRWriterCountStatRes = z.infer<typeof ZWriterCountStat>;

/** 获取作者统计数据 */
export function RGetWriterStat() {
    return request.get<IRWriterCountStatRes>('/web/writer/stat')
}