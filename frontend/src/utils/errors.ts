import type { IApiResponse } from "@/types/common";

export class ClientBusinessRequestError extends Error {
    data: IApiResponse;

    constructor(source: IApiResponse) {
        super();
        this.name = 'ClientBusinessRequestError';
        if (source.msg) {
            this.message = source.msg;
        }
        this.data = source;
    }
}