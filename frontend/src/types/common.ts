export interface IApiResponse<T = any> {
    code: number;
    data: T;
    msg: string;
    success: boolean;
}