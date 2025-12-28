import { useEffect, useMemo, useState } from "react";
import { Button, Empty, Message, Spin, Tag, Tooltip } from "@arco-design/web-react";
import { IconBook, IconGift, IconHeart, IconLock, IconRight } from "@arco-design/web-react/icon";
import dayjs from "dayjs";
import { Link, useParams } from "react-router";
import { useNamespace } from "@/hooks/useNameSpace";
import {
    RGetNovelCatalog,
    RGetNovelDetail,
    ZNovelCatalogItem,
    ZNovelDetail,
    type IRNovelCatalogItem,
    type IRNovelDetail
} from "@/apis/novel";
import * as z from "zod";
import "./index.scss";

const NovelDetailPage = () => {
    const ns = useNamespace("novel-detail");
    const params = useParams();

    const novelId = useMemo(() => Number(params.id), [params.id]);
    const [detail, setDetail] = useState<IRNovelDetail | null>(null);
    const [catalog, setCatalog] = useState<IRNovelCatalogItem[]>([]);
    const [detailLoading, setDetailLoading] = useState(false);
    const [catalogLoading, setCatalogLoading] = useState(false);

    useEffect(() => {
        if (!params.id || Number.isNaN(novelId)) {
            Message.error("无效的作品 ID");
            return;
        }
        fetchDetail(novelId);
        fetchCatalog(novelId);
    }, [params.id, novelId]);

    const fetchDetail = async (id: number) => {
        setDetailLoading(true);
        try {
            const res = await RGetNovelDetail(id);
            const parsed = ZNovelDetail.safeParse(res);
            if (!parsed.success) {
                console.error("小说详情数据格式异常", parsed.error);
                throw new Error("小说详情数据格式异常");
            }
            setDetail(parsed.data);
        } catch (error) {
            console.error(error);
            Message.error("获取小说详情失败，请稍后再试");
            setDetail(null);
        } finally {
            setDetailLoading(false);
        }
    };

    const fetchCatalog = async (id: number) => {
        setCatalogLoading(true);
        try {
            const res = await RGetNovelCatalog(id);
            const parsed = z.array(ZNovelCatalogItem).safeParse(res);
            if (!parsed.success) {
                console.error("目录数据格式异常", parsed.error);
                throw new Error("目录数据格式异常");
            }
            setCatalog(parsed.data);
        } catch (error) {
            console.error(error);
            Message.error("获取目录失败，请稍后再试");
            setCatalog([]);
        } finally {
            setCatalogLoading(false);
        }
    };

    const formatUpdateTime = (val?: string | null) => {
        if (!val) return "";
        const d = dayjs(val);
        return d.isValid() ? d.format("YYYY-MM-DD HH:mm") : val;
    };

    const handlePrimaryAction = () => {
        Message.info("阅读功能暂未开放，敬请期待");
    };

    const handleSecondaryAction = (text: string) => {
        Message.info(text);
    };

    const renderCover = () => {
        if (detail?.cover) {
            return <img src={detail.cover} alt={detail.title} />;
        }
        const fallback = detail?.title?.slice(0, 2) || "书籍";
        return (
            <div className={ns.e("cover-placeholder")}>
                <span>{fallback}</span>
            </div>
        );
    };

    const renderCatalog = () => {
        if (catalogLoading) {
            return (
                <div className={ns.e("catalog-loading")}>
                    <Spin tip="目录加载中..." />
                </div>
            );
        }

        if (!catalog.length) {
            return (
                <div className={ns.e("catalog-empty")}>
                    <Empty description="暂无目录，敬请期待章节更新" />
                </div>
            );
        }

        return (
            <div className={ns.e("catalog-grid")}>
                {catalog.map((item) => (
                    <div className={ns.e("catalog-item")} key={item.chapterId}>
                        <div className={ns.e("catalog-idx")}>第{String(item.idx).padStart(3, "0")}章</div>
                        <div className={ns.e("catalog-title")}>{item.title}</div>
                        {item.feeable && !item.paied && (
                            <Tooltip content="付费章节">
                                <IconLock className={ns.e("catalog-lock")} />
                            </Tooltip>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    if (!detail && !detailLoading) {
        return (
            <div className={ns.b()}>
                <div className="serial-card serial-card-large">
                    <Empty description="未找到作品信息" />
                </div>
            </div>
        );
    }

    return (
        <div className={ns.b()}>
            <Spin loading={detailLoading} tip="加载详情...">
                {detail ? (
                    <>
                        <div className={`${ns.e("hero")} serial-card serial-card-large`}>
                            <div className={ns.e("breadcrumb")}>
                                <Link to="/">首页</Link>
                                <IconRight />
                                <span>{detail.title}</span>
                            </div>
                            <div className={ns.e("hero-body")}>
                                <div className={ns.e("cover")}>{renderCover()}</div>
                                <div className={ns.e("hero-main")}>
                                    <div className={ns.e("title-row")}>
                                        <div className={ns.e("title")}>{detail.title}</div>
                                        <Tag color="orange" className={ns.e("status")}>
                                            连载中
                                        </Tag>
                                    </div>
                                    <div className={ns.e("tags")}>
                                        {detail.categoryItems.map((item) => (
                                            <Tag key={item.id} color="arcoblue" bordered={false}>
                                                {item.title}
                                            </Tag>
                                        ))}
                                    </div>
                                    <div className={ns.e("stat-line")}>
                                        <span className={ns.e("stat")}>
                                            <IconBook />
                                            <span>{catalog.length ? `${catalog.length} 章` : "章节整理中"}</span>
                                        </span>
                                        <span className={ns.e("dot")} />
                                        <span className={ns.e("stat")}>
                                            <IconHeart />
                                            <span>口碑不错</span>
                                        </span>
                                    </div>
                                    <div className={ns.e("update")}>
                                        最新更新：
                                        {detail.newestChapter ? (
                                            <>
                                                <span className={ns.e("update-title")}>
                                                    第{detail.newestChapter.idx}章 {detail.newestChapter.title}
                                                </span>
                                                <span className={ns.e("update-time")}>
                                                    {formatUpdateTime(detail.newestChapter.date)}
                                                </span>
                                            </>
                                        ) : (
                                            "暂无更新"
                                        )}
                                    </div>
                                    <div className={ns.e("actions")}>
                                        <Button type="primary" shape="round" size="large" onClick={handlePrimaryAction}>
                                            开始阅读
                                        </Button>
                                        <Button shape="round" size="large" onClick={() => handleSecondaryAction("已加入书架")}>
                                            加入书架
                                        </Button>
                                        <Button
                                            shape="round"
                                            size="large"
                                            icon={<IconGift />}
                                            onClick={() => handleSecondaryAction("感谢支持，功能即将上线")}
                                        >
                                            赠
                                        </Button>
                                    </div>
                                </div>
                                <div className={ns.e("hero-author")}>
                                    <div className={ns.e("author-avatar")}>{detail.author.slice(0, 1)}</div>
                                    <div className={ns.e("author-name")}>{detail.author}</div>
                                    <div className={ns.e("author-label")}>作者</div>
                                    <Button
                                        size="small"
                                        type="text"
                                        onClick={() => handleSecondaryAction("关注作者功能即将上线")}
                                    >
                                        关注作者
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className={`${ns.e("section")} serial-card serial-card-large`}>
                            <div className={ns.e("section-header")}>
                                <div className={ns.e("section-title")}>作品简介</div>
                            </div>
                            <div className={ns.e("description")}>
                                {detail.description || "暂无简介，作者正在赶来撰写中..."}
                            </div>
                        </div>

                        <div className={`${ns.e("section")} serial-card serial-card-large`}>
                            <div className={ns.e("section-header")}>
                                <div className={ns.e("section-title")}>目录 · {catalog.length} 章</div>
                                <div className={ns.e("section-sub")}>按章节顺序展示，可直接跳转到最新章节</div>
                            </div>
                            {renderCatalog()}
                        </div>
                    </>
                ) : (
                    <div className="serial-card serial-card-large">
                        <div className={ns.e("loading-placeholder")}>
                            <Spin />
                        </div>
                    </div>
                )}
            </Spin>
        </div>
    );
};

export default NovelDetailPage;
