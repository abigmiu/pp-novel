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
    coverUrl: z.string().url().optional(), // 如果必须是合法的 URL
    /** 子结构 */
    children: z.array(z.lazy(() => ZShortStoryCategoryTreeRes)).optional(),
});


/** 短故事分类 - 获取树型数据 */
export function RGetShortStoryCategoryTree() {
    return request.get<IRShortStoryCategoryTreeRes[]>('/shortStoryCategory/tree')
}

