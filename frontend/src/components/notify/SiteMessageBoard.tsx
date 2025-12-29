import React, { useEffect, useMemo, useState } from "react";
import {
    Button,
    Badge,
    Empty,
    Message,
    Pagination,
    Radio,
    Space,
    Spin,
    Tag,
    Typography,
} from "@arco-design/web-react";
import dayjs from "dayjs";
import {
    ZNotifyMessagePage,
    ZUnreadCount,
    type IRBatchReadReq,
    type IRNotifyListReq,
    type IRNotifyMessage,
} from "@/apis/notify";
import { useNamespace } from "@/hooks/useNameSpace";
import "./SiteMessageBoard.scss";

type FilterKey = "all" | "unread" | "read";

interface ISiteMessageBoardProps {
    title: string;
    description?: string;
    fetcher: (params: IRNotifyListReq) => Promise<unknown>;
    unreadFetcher?: () => Promise<unknown>;
    onBatchRead?: (data: IRBatchReadReq) => Promise<unknown>;
    emptyHint?: string;
    pageSize?: number;
    className?: string;
}

const { Title, Paragraph, Text } = Typography;
const DEFAULT_PAGE_SIZE = 10;

const getMessageTime = (item: IRNotifyMessage) => {
    const val =
        item.sendTime ||
        item.createdAt ||
        item.createTime ||
        item.gmtCreate ||
        item.gmtCreated ||
        item.updateTime;
    if (!val) return "";
    const parsed = dayjs(val);
    return parsed.isValid() ? parsed.format("YYYY-MM-DD HH:mm") : String(val);
};

const isMessageRead = (item: IRNotifyMessage) => {
    const boolFlag = item.read ?? item.isRead;
    if (typeof boolFlag === "boolean") {
        return boolFlag;
    }
    const numFlag = item.readStatus ?? item.status ?? item.readFlag;
    if (numFlag === undefined || numFlag === null) return false;
    const n = Number(numFlag);
    if (Number.isNaN(n)) return false;
    // 默认 1/2 表示已读，其余视为未读
    return n > 0;
};

const getMessageTitle = (item: IRNotifyMessage) => {
    if (item.title) return item.title;
    if (item.subject) return item.subject;
    if (item.summary) return item.summary;
    if (item.content) return item.content.slice(0, 18);
    return "站内信";
};

const getMessageType = (item: IRNotifyMessage) => {
    const val = item.type ?? item.channel;
    if (val === undefined || val === null) return "系统通知";
    return typeof val === "string" ? val : `类型 ${val}`;
};

const SiteMessageBoard: React.FC<ISiteMessageBoardProps> = ({
    title,
    description,
    fetcher,
    unreadFetcher,
    onBatchRead,
    emptyHint = "暂无站内信",
    pageSize = DEFAULT_PAGE_SIZE,
    className,
}) => {
    const ns = useNamespace("site-msg");
    const [filter, setFilter] = useState<FilterKey>("all");
    const [loading, setLoading] = useState(false);
    const [batchLoading, setBatchLoading] = useState(false);
    const [messages, setMessages] = useState<IRNotifyMessage[]>([]);
    const [pagination, setPagination] = useState({
        page: 1,
        size: pageSize,
        total: 0,
    });
    const [serverUnread, setServerUnread] = useState<number | null>(null);

    const unreadCount = useMemo(
        () => messages.filter((item) => !isMessageRead(item)).length,
        [messages]
    );

    const filteredMessages = useMemo(() => {
        if (filter === "read") return messages.filter((item) => isMessageRead(item));
        if (filter === "unread") return messages.filter((item) => !isMessageRead(item));
        return messages;
    }, [filter, messages]);

    const fetchMessages = async (page = pagination.page, size = pagination.size) => {
        setLoading(true);
        try {
            const res = await fetcher({ page, size });
            const parsed = ZNotifyMessagePage.safeParse(res);
            if (!parsed.success) {
                console.error(parsed.error);
                throw new Error("站内信数据格式异常");
            }
            const data = parsed.data;
            setMessages(data.rows || []);
            setPagination({
                page: Number(data.page) || page,
                size: Number(data.size) || size,
                total: Number(data.total) || 0,
            });
            if (unreadFetcher) {
                loadUnreadCount();
            }
        } catch (error) {
            console.error(error);
            setMessages([]);
            setPagination((prev) => ({ ...prev, total: 0 }));
            Message.error("获取站内信失败，请稍后再试");
        } finally {
            setLoading(false);
        }
    };

    const loadUnreadCount = async () => {
        if (!unreadFetcher) return;
        try {
            const res = await unreadFetcher();
            const parsed = ZUnreadCount.safeParse(res);
            if (!parsed.success) {
                throw new Error("未读数量数据格式异常");
            }
            setServerUnread(parsed.data.count ?? 0);
        } catch (error) {
            console.error(error);
            setServerUnread(null);
        }
    };

    const handleBatchRead = async () => {
        if (!onBatchRead) return;
        const unreadIds = messages
            .filter((item) => !isMessageRead(item) && item.id !== undefined && item.id !== null)
            .map((item) => Number(item.id))
            .filter((id) => !Number.isNaN(id));

        if (!unreadIds.length) {
            Message.info("没有未读消息或缺少可用的消息 ID");
            return;
        }

        setBatchLoading(true);
        try {
            await onBatchRead({ ids: unreadIds });
            Message.success("已标记为已读");
            await Promise.all([fetchMessages(pagination.page, pagination.size), loadUnreadCount()]);
        } catch (error) {
            console.error(error);
            Message.error("标记已读失败，请稍后再试");
        } finally {
            setBatchLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages(1, pageSize);
        loadUnreadCount();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageSize]);

    return (
        <div className={`serial-card serial-card-large ${ns.b("")} ${className || ""}`}>
            <div className={ns.e("header")}>
                <div>
                    <Title heading={4} style={{ margin: 0 }}>
                        {title}
                    </Title>
                    {description && (
                        <Text type="secondary" className={ns.e("desc")}>
                            {description}
                        </Text>
                    )}
                </div>
                <Space size={12}>
                    <Radio.Group
                        type="button"
                        value={filter}
                        onChange={(val) => setFilter(val as FilterKey)}
                    >
                        <Radio value="all">全部</Radio>
                        <Radio value="unread">未读</Radio>
                        <Radio value="read">已读</Radio>
                    </Radio.Group>
                    {onBatchRead && (
                        <Button
                            type="primary"
                            status="success"
                            disabled={!messages.length}
                            loading={batchLoading}
                            onClick={handleBatchRead}
                        >
                            标记当前页未读为已读
                        </Button>
                    )}
                    <Button onClick={() => fetchMessages(pagination.page, pagination.size)}>
                        刷新
                    </Button>
                </Space>
            </div>

            <div className={ns.e("stats")}>
                <Text type="secondary">
                    共 {pagination.total} 条消息，未读 {unreadCount} 条
                </Text>
                {serverUnread !== null && (
                    <Badge count={serverUnread} className={ns.e("server-unread")} />
                )}
            </div>

            <Spin loading={loading} className={ns.e("list")}>
                {filteredMessages.length ? (
                    filteredMessages.map((item) => {
                        const read = isMessageRead(item);
                        const timeText = getMessageTime(item);
                        return (
                            <div key={item.id ?? getMessageTitle(item)} className={ns.e("item")}>
                                <div className={ns.e("item-head")}>
                                    <div className={ns.e("title")}>
                                        <Tag color={read ? "green" : "orangered"}>
                                            {read ? "已读" : "未读"}
                                        </Tag>
                                        <span className={ns.e("title-text")}>
                                            {getMessageTitle(item)}
                                        </span>
                                    </div>
                                    <Text type="secondary">
                                        {timeText || "时间未知"}
                                    </Text>
                                </div>
                                <div className={ns.e("item-meta")}>
                                    <Tag color="arcoblue" bordered={false}>
                                        {getMessageType(item)}
                                    </Tag>
                                    {item.id && (
                                        <Text type="secondary" className={ns.e("item-id")}>
                                            ID: {item.id}
                                        </Text>
                                    )}
                                </div>
                                <Paragraph
                                    className={ns.e("content")}
                                    ellipsis={{
                                        rows: 3,
                                        expandable: true,
                                    }}
                                >
                                    {item.content || item.summary || "暂无内容"}
                                </Paragraph>
                            </div>
                        );
                    })
                ) : (
                    <div className={ns.e("empty")}>
                        <Empty description={emptyHint} />
                    </div>
                )}
            </Spin>

            <div className={ns.e("pagination")}>
                <Pagination
                    current={pagination.page}
                    pageSize={pagination.size}
                    total={pagination.total}
                    showTotal
                    sizeCanChange
                    onChange={(page, size) => {
                        setPagination((prev) => ({
                            ...prev,
                            page,
                            size,
                        }));
                        fetchMessages(page, size);
                    }}
                    onPageSizeChange={(size) => {
                        setPagination((prev) => ({
                            ...prev,
                            page: 1,
                            size,
                        }));
                        fetchMessages(1, size);
                    }}
                />
            </div>
        </div>
    );
};

export default SiteMessageBoard;
