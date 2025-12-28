import { request } from "@/utils/request";

export interface IRechargeReq {
    /** 充值金额，单位元 */
    amount: number;
    /** 幂等请求 ID */
    requestId: string;
}

export interface IRechargeRes {
    orderNo: string;
    balance: number;
}

export interface IBalanceRes {
    balance: number;
    totalRecharge: number;
    totalConsume: number;
}

export interface IWalletTxn {
    type: string;
    direction: string;
    amount: number;
    balanceAfter: number;
    bizType?: string;
    bizId?: number;
    requestId?: string;
    createdAt?: string;
    remark?: string;
}

export interface IPageResponse<T> {
    page: number;
    size: number;
    total: number;
    rows: T[];
}

export interface IBuyChapterReq {
    /** 幂等请求 ID，可用于防重复扣款 */
    requestId: string;
}

export interface IBuyChapterRes {
    orderNo: string | null;
    granted: boolean;
    balance: number;
}

/** 充值（自动成功） */
export function RRecharge(data: IRechargeReq) {
    return request.post<IRechargeRes>('/web/pay/recharge', data);
}

/** 查询钱包余额 */
export function RGetBalance() {
    return request.get<IBalanceRes>('/web/pay/balance');
}

/** 钱包流水列表 */
export function RGetWalletTxns(params?: { page?: number; size?: number; }) {
    return request.get<IPageResponse<IWalletTxn>>('/web/pay/txns', params);
}

/** 购买章节 */
export function RBuyChapter(chapterId: number, data: IBuyChapterReq) {
    return request.post<IBuyChapterRes>(`/web/pay/chapters/${chapterId}/buy`, data);
}
