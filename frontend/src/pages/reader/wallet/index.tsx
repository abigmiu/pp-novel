import { useEffect, useMemo, useState } from "react";
import { Button, Card, InputNumber, Message, Result, Table, Tag, Typography } from "@arco-design/web-react";
import { useNamespace } from "@/hooks/useNameSpace";
import { type IBalanceRes, type IWalletTxn, RGetBalance, RGetWalletTxns, RRecharge } from "@/apis/pay";
import './Wallet.scss';
import useUserStore from "@/store/userStore";
import { useNavigate } from "react-router";
import dayjs from "dayjs";
import { ClientBusinessRequestError } from "@/utils/errors";
import { nanoid } from "nanoid";

const quickAmounts = [10, 20, 30, 50, 100, 200];

function WalletPage() {
    const ns = useNamespace('wallet');
    const hasLogin = useUserStore((s) => s.hasLogin);
    const navigate = useNavigate();

    const [balance, setBalance] = useState<IBalanceRes | null>(null);
    const [balanceLoading, setBalanceLoading] = useState(false);
    const [rechargeAmount, setRechargeAmount] = useState<number | undefined>(20);
    const [rechargeLoading, setRechargeLoading] = useState(false);

    const [txnLoading, setTxnLoading] = useState(false);
    const [txns, setTxns] = useState<IWalletTxn[]>([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const amountFormatter = useMemo(() => (val?: number | string | null) => {
        if (val === null || val === undefined) return '--';
        const num = typeof val === 'number' ? val : Number(val);
        if (Number.isNaN(num)) return '--';
        return num.toFixed(2);
    }, []);

    useEffect(() => {
        if (!hasLogin) return;
        fetchBalance();
        fetchTxns(1, pagination.pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasLogin]);

    const handleError = (e: unknown, fallback: string) => {
        if (e instanceof ClientBusinessRequestError) {
            Message.error(e.data.msg || fallback);
        } else {
            console.error(e);
            Message.error(fallback);
        }
    };

    const fetchBalance = async () => {
        setBalanceLoading(true);
        try {
            const res = await RGetBalance();
            setBalance(res);
        } catch (e) {
            handleError(e, '获取余额失败');
        } finally {
            setBalanceLoading(false);
        }
    };

    const fetchTxns = async (page = 1, size = pagination.pageSize) => {
        setTxnLoading(true);
        try {
            const res = await RGetWalletTxns({
                page,
                size,
            });
            setTxns(res.rows || []);
            setPagination({
                current: page,
                pageSize: size,
                total: Number(res.total || 0),
            });
        } catch (e) {
            handleError(e, '获取流水失败');
        } finally {
            setTxnLoading(false);
        }
    };

    const handleRecharge = async () => {
        if (!rechargeAmount || rechargeAmount <= 0) {
            Message.warning('请输入大于 0 的金额');
            return;
        }
        setRechargeLoading(true);
        try {
            await RRecharge({
                amount: rechargeAmount,
                requestId: nanoid(),
            });
            Message.success('充值成功');
            fetchBalance();
            fetchTxns(1, pagination.pageSize);
            setPagination((prev) => ({
                ...prev,
                current: 1,
            }));
        } catch (e) {
            handleError(e, '充值失败');
        } finally {
            setRechargeLoading(false);
        }
    };

    if (!hasLogin) {
        return (
            <div className={ns.b()}>
                <Card>
                    <Result
                        status="403"
                        subTitle="登录后可使用钱包功能"
                        extra={
                            <Button type="primary" onClick={() => navigate('/writer/login?type=login')}>
                                去登录
                            </Button>
                        }
                    />
                </Card>
            </div>
        );
    }

    return (
        <div className={ns.b()}>
            <div className={ns.e('grid')}>
                <Card loading={balanceLoading} className={ns.e('card')} title="可用余额">
                    <Typography.Title heading={2} className={ns.e('balance')}>
                        ￥{amountFormatter(balance?.balance)}
                    </Typography.Title>
                    <div className={ns.e('sub')}>
                        累计充值：￥{amountFormatter(balance?.totalRecharge)} · 累计消费：￥{amountFormatter(balance?.totalConsume)}
                    </div>
                </Card>

                <Card className={ns.e('card')} title="快捷充值">
                    <div className={ns.e('quick')}>
                        {quickAmounts.map((amt) => (
                            <Button
                                key={amt}
                                type={rechargeAmount === amt ? 'primary' : 'secondary'}
                                onClick={() => setRechargeAmount(amt)}
                            >
                                {amt} 元
                            </Button>
                        ))}
                    </div>
                    <div className={ns.e('input')}>
                        <InputNumber
                            min={0.01}
                            precision={2}
                            prefix="￥"
                            placeholder="输入充值金额"
                            value={rechargeAmount}
                            onChange={(val) => setRechargeAmount(val as number | undefined)}
                        />
                        <Button
                            type="primary"
                            long
                            loading={rechargeLoading}
                            onClick={handleRecharge}
                        >
                            立即充值
                        </Button>
                    </div>
                    <div className={ns.e('tips')}>
                        <div>· 目前支持模拟充值，付款后自动到账。</div>
                        <div>· 每次充值会生成唯一请求 ID，重复点击不会重复扣款。</div>
                    </div>
                </Card>
            </div>

            <Card className={ns.e('card')} title="钱包流水" style={{ marginTop: '20px' }}>
                <Table
                    loading={txnLoading}
                    data={txns}
                    rowKey={(record, index) => `${record.requestId || record.bizId || 'txn'}-${index}`}
                    pagination={{
                        current: pagination.current,
                        pageSize: pagination.pageSize,
                        total: pagination.total,
                        showTotal: true,
                        onChange: (page, pageSize) => {
                            fetchTxns(page, pageSize);
                        },
                    }}
                    columns={[
                        {
                            title: '类型',
                            dataIndex: 'type',
                            render: (val) => {
                                if (val === 'RECHARGE') return <Tag color="green">充值</Tag>;
                                if (val === 'CONSUME') return <Tag color="orangered">消费</Tag>;
                                return <Tag>{val || '未知'}</Tag>;
                            }
                        },
                        {
                            title: '方向',
                            dataIndex: 'direction',
                            render: (val) => (
                                <Tag color={val === 'IN' ? 'arcoblue' : 'magenta'}>
                                    {val === 'IN' ? '收入' : '支出'}
                                </Tag>
                            )
                        },
                        {
                            title: '金额（元）',
                            dataIndex: 'amount',
                            render: (val, record) => {
                                const prefix = record.direction === 'IN' ? '+' : '-';
                                return (
                                    <span className={record.direction === 'IN' ? ns.em('amount', 'in') : ns.em('amount', 'out')}>
                                        {prefix}￥{amountFormatter(val)}
                                    </span>
                                );
                            }
                        },
                        {
                            title: '余额',
                            dataIndex: 'balanceAfter',
                            render: (val) => `￥${amountFormatter(val)}`
                        },
                        {
                            title: '备注',
                            dataIndex: 'remark',
                            render: (val) => val || '-'
                        },
                        {
                            title: '时间',
                            dataIndex: 'createdAt',
                            render: (val) => val ? dayjs(val).format('YYYY-MM-DD HH:mm:ss') : '-'
                        },
                    ]}
                />
            </Card>
        </div>
    );
}

export default WalletPage;
