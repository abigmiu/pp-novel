import { Button, Dropdown, Empty, Menu, Message, Pagination, Popconfirm, Spin } from "@arco-design/web-react";
import { IconArrowLeft, IconDelete, IconDown, IconEdit } from "@arco-design/web-react/icon";
import dayjs from "dayjs";
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { RDeleteShortStoryDraft, RGetShortStoryDraftPage, ZShortStoryDraftPageRes, type IRShortStoryDraftItem } from "@/apis/shortStory";

const Cover: React.FC<{ url?: string | null }> = ({ url }) => {
    if (url) {
        return (
            <div
                style={{
                    width: 120,
                    height: 140,
                    borderRadius: 8,
                    overflow: "hidden",
                    background: "#f5f5f5",
                }}
            >
                <img
                    src={url}
                    alt="封面"
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                    }}
                />
            </div>
        );
    }

    return (
        <div
            className="flex items-center justify-center"
            style={{
                width: 120,
                height: 140,
                borderRadius: 8,
                background: "#f5f5f5",
            }}
        >
            <Spin loading />
        </div>
    );
};

const DraftItem: React.FC<{
    data: IRShortStoryDraftItem;
    onEdit: (id: number) => void;
    onDelete: (id: number) => Promise<void>;
}> = ({ data, onEdit, onDelete }) => {
    const categoryMenu = useMemo(() => {
        if (!data.categories.length) return null;
        return (
            <Menu>
                {data.categories.map((category) => (
                    <Menu.Item key={category.id}>{category.name}</Menu.Item>
                ))}
            </Menu>
        );
    }, [data.categories]);

    const dateText = useMemo(() => {
        const time = data.updatedAt || data.createdAt;
        return dayjs(time).format("YYYY-MM-DD HH:mm");
    }, [data.createdAt, data.updatedAt]);

    return (
        <div className="flex items-center py-5" style={{ width: "100%" }}>
            <Cover url={data.cover} />
            <div className="flex-1 ml-6">
                <div className="flex items-center justify-between">
                    <div className="font-500 text-16px">{data.title || "未命名草稿"}</div>

                    <div className="flex items-center text-18px color-#7a7a7a">
                        <Button type="text" icon={<IconEdit />} onClick={() => onEdit(data.id)} />
                        <Popconfirm
                            focusLock
                            title="确认删除草稿吗？"
                            okText="删除"
                            cancelText="取消"
                            onOk={() => onDelete(data.id)}
                        >
                            <Button type="text" icon={<IconDelete />} />
                        </Popconfirm>
                    </div>
                </div>

                <div className="mt-3">
                    {data.categories.length ? (
                        <Dropdown droplist={categoryMenu} trigger="click">
                            <Button type="secondary" size="mini" icon={<IconDown />} iconPosition="right">
                                {data.categories[0].name}
                            </Button>
                        </Dropdown>
                    ) : (
                        <Button size="mini" disabled>
                            未分类
                        </Button>
                    )}
                </div>

                <div className="mt-3 text-13px color-#9a9a9a">
                    <span>0阅读</span>
                    <span className="mx-3">|</span>
                    <span>{data.contentLength || 0}字</span>
                    <span className="mx-3">|</span>
                    <span>{dateText}</span>
                </div>
            </div>
        </div>
    );
};

const DraftList: React.FC = () => {
    const navigate = useNavigate();
    const [list, setList] = useState<IRShortStoryDraftItem[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [sortDesc, setSortDesc] = useState(true);
    const [loading, setLoading] = useState(false);

    const sortMenu = (
        <Menu
            onClickMenuItem={(key) => {
                setSortDesc(key === "desc");
                setPage(1);
            }}
        >
            <Menu.Item key="desc">时间从近到远</Menu.Item>
            <Menu.Item key="asc">时间从远到近</Menu.Item>
        </Menu>
    );

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await RGetShortStoryDraftPage({
                page,
                size: pageSize,
                dataSortDesc: sortDesc,
            });
            const parsed = ZShortStoryDraftPageRes.safeParse(res);
            if (!parsed.success) {
                Message.error("草稿列表数据异常");
                console.error('草稿列表数据异常', parsed.error)
                return;
            }
            setList(parsed.data.rows || []);
            setTotal(Number(parsed.data.total || 0));
            if (parsed.data.size) {
                setPageSize(Number(parsed.data.size));
            }
        } catch (error) {
            Message.error("加载草稿列表失败");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await RDeleteShortStoryDraft(id);
            Message.success("删除成功");
            fetchData();
        } catch (error) {
            Message.error("删除失败，请稍后重试");
        }
    };

    const handleEdit = (id: number) => {
        navigate(`/writer/publish-short?draftId=${id}`);
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, pageSize, sortDesc]);

    const sortText = sortDesc ? "时间从近到远" : "时间从远到近";

    return (
        <div className="serial-card serial-card-large" style={{ minHeight: "calc(100vh - 120px)" }}>
            <div className="flex items-center mb-4">
                <div className="flex items-center cursor-pointer" onClick={() => navigate(-1)}>
                    <IconArrowLeft />
                    <div className="font-500 text-18px ml-2">短故事草稿箱 ({total})</div>
                </div>
            </div>

            <div className="mb-4">
                <Dropdown droplist={sortMenu} trigger="click" position="bl">
                    <Button icon={<IconDown />} iconPosition="right">
                        {sortText}
                    </Button>
                </Dropdown>
            </div>

            <Spin loading={loading} className="w-full">
                {list.length === 0 ? (
                    <Empty description="暂无草稿" />
                ) : (
                    list.map((item) => (
                        <DraftItem key={item.id} data={item} onEdit={handleEdit} onDelete={handleDelete} />
                    ))
                )}
            </Spin>

            {list.length > 0 && (
                <div className="mt-6 flex justify-end">
                    <Pagination
                        current={page}
                        pageSize={pageSize}
                        total={total}
                        showTotal
                        onChange={(current, size) => {
                            setPage(current);
                            setPageSize(size);
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default DraftList;
