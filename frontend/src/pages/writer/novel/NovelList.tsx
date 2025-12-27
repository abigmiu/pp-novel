import React, { useEffect, useMemo, useState } from "react";
import { Button, Divider, Message, Spin, Tag } from "@arco-design/web-react";
import { IconDown, IconPlus, IconExclamationCircle } from "@arco-design/web-react/icon";
import { useNavigate } from "react-router";
import { useNamespace } from "@/hooks/useNameSpace";
import {
    RGetWriterNovelList,
    ZWriterSelfNovelListItem,
    type IRWriterSelfNovelListItem
} from "@/apis/novel";
import * as z from "zod";
import "./NovelList.scss";

type StatusInfo = {
    text: string;
    color: string;
};

const STATUS_MAP: Record<number, StatusInfo> = {
    0: { text: "待审核", color: "#f59e0b" },
    1: { text: "连载中", color: "#22c55e" },
    2: { text: "已完结", color: "#fb923c" },
};

const EmptyBlock: React.FC<{ onCreate: () => void }> = ({ onCreate }) => {
    return (
        <div className="flex flex-col items-center justify-center" style={{ minHeight: 360 }}>
            <div>
                <img
                    style={{ width: 140 }}
                    src="https://lf3-static.bytednsdoc.com/obj/eden-cn/8172eh7uhfps/serial_author/empty.png"
                    alt="empty"
                />
            </div>
            <span className="text-gray mt-2">还没有创建作品</span>
            <Button type="primary" shape="round" className="mt-3" onClick={onCreate}>
                <IconPlus /> 创建新书
            </Button>
        </div>
    );
};

const NovelList: React.FC = () => {
    const ns = useNamespace("novel-list");
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [novels, setNovels] = useState<IRWriterSelfNovelListItem[]>([]);

    const fetchNovels = async () => {
        setLoading(true);
        try {
            const res = await RGetWriterNovelList();
            const parsed = z.array(ZWriterSelfNovelListItem).safeParse(res);
            if (!parsed.success) {
                console.error("返回数据格式异常", parsed.error);
                throw new Error("返回数据格式异常");
            }
            setNovels(parsed.data);
        } catch (error) {
            console.error(error);
            Message.error("获取作品列表失败，请稍后重试");
            setNovels([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNovels();
    }, []);

    const statusMap = useMemo(() => STATUS_MAP, []);

    const renderStatusTag = (status: number) => {
        const info = statusMap[status] || { text: "未知状态", color: "#9ca3af" };
        return (
            <Tag color={info.color} style={{ borderRadius: 12, padding: "0 10px" }}>
                {info.text}
            </Tag>
        );
    };

    const renderNewest = (item: IRWriterSelfNovelListItem) => {
        if (!item.newestChapter) return "暂无发布章节";
        const { idx, title } = item.newestChapter;
        return `第${idx}章 ${title}`;
    };

    const handleCreateChapter = (item: IRWriterSelfNovelListItem) => {
        const chapterIdx = Math.max((item.totalChapterCount || 0) + 1, 1);
        navigate(`/writer/novel/chapter/create?bookId=${item.id}&bookTitle=${encodeURIComponent(item.title)}&chapterIdx=${chapterIdx}`);
    };

    const handleComingSoon = () => {
        Message.info("该功能暂未开放，敬请期待");
    };

    return (
        <div className={ns.b("")}>
            <div className="serial-card serial-card-large">
                <div className={ns.e("header")}>
                    <h3 className="m-0">我的小说</h3>
                    <div className={ns.e("header-actions")}>
                        <Button type="text" size="small">征文活动</Button>
                        <Divider type="vertical" />
                        <Button type="text" size="small">创建新书</Button>
                        <Button type="primary" shape="round" size="small" onClick={() => navigate("/writer/novel/create")}>
                            <IconPlus /> 创建新书
                        </Button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center" style={{ minHeight: 260 }}>
                        <Spin tip="加载中..." />
                    </div>
                ) : novels.length === 0 ? (
                    <EmptyBlock onCreate={() => navigate("/writer/novel/create")} />
                ) : (
                    <div className={ns.e("list")}>
                        {novels.map((item) => (
                            <div key={item.id} className={ns.e("item")}>
                                <div className={ns.e("cover")}>
                                    {item.cover ? (
                                        <img src={item.cover} alt={item.title} className={ns.e("cover-img")} />
                                    ) : (
                                        <div className={ns.e("cover-placeholder")}>
                                            <span className={ns.e("cover-title")}>{item.title}</span>
                                            <span className={ns.e("cover-sub")}>暂无封面</span>
                                        </div>
                                    )}
                                </div>
                                <div className={ns.e("content")}>
                                    <div className={ns.e("top")}>
                                        <div>
                                            <div className={ns.e("title")}>{item.title}</div>
                                            <div className={ns.e("meta")}>最近更新：{renderNewest(item)}</div>
                                        </div>
                                        <div className={ns.e("actions")}>
                                            <Button shape="round" type="secondary" size="small" icon={<IconDown />} iconOnly={false} onClick={handleComingSoon}>
                                                作品相关
                                            </Button>
                                            <Button shape="round" type="secondary" size="small" onClick={handleComingSoon}>
                                                章节管理
                                            </Button>
                                            <Button shape="round" type="primary" size="small" onClick={() => handleCreateChapter(item)}>
                                                创建章节
                                            </Button>
                                        </div>
                                    </div>
                                    <div className={ns.e("stats")}>
                                        <span>{item.totalChapterCount} 章</span>
                                        <Divider type="vertical" />
                                        <span>{item.totalWordCount.toLocaleString()} 字</span>
                                        <Divider type="vertical" />
                                        <span className={ns.e("status")}>{renderStatusTag(item.status)}</span>
                                    </div>

                                    {item.totalChapterCount === 0 && (
                                        <div className={ns.e("tips")}>
                                            <div className="flex items-start">
                                                <IconExclamationCircle style={{ color: "#f97316", marginRight: 8 }} />
                                                <div className={ns.e("tips-main")}>
                                                    <div className={ns.e("tips-title")}>作品小贴士：</div>
                                                    <div className={ns.e("tips-desc")}>
                                                        未发布章节的作品，作品信息不会进入审核，点击「创建章节」发布章节内容吧，期待你的好作品
                                                    </div>
                                                    <div className={ns.e("steps")}>
                                                        <span>创建作品</span>
                                                        <span className={ns.e("dot")} />
                                                        <span>发布章节</span>
                                                        <span className={ns.e("dot")} />
                                                        <span>作品可搜</span>
                                                        <span className={ns.e("dot")} />
                                                        <span>作品签约</span>
                                                        <span className={ns.e("dot")} />
                                                        <span>作品推荐</span>
                                                        <span className={ns.e("dot")} />
                                                        <span>作品完结</span>
                                                    </div>
                                                </div>
                                                <div className={ns.e("collapse")} onClick={handleComingSoon}>收起 ^</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NovelList;
