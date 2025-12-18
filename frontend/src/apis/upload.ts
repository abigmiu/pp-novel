import { request } from "@/utils/request";

export function RGetShortStoryCoverUploadUrl(data: {
    contentType: string;
    contentLength: number,
}) {
    return request.post<{
        uploadUrl: string;
        downloadUlr: string;
    }>('/upload/shortStoryCover', data);
}