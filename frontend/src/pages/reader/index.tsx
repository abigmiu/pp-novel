import { useCallback, useEffect, useMemo, useState } from "react";
import { Empty, Message, Pagination, Spin } from "@arco-design/web-react";
import dayjs from "dayjs";
import { useNamespace } from "@/hooks/useNameSpace";
import {
    RGetNovelCategories,
    RGetNovelPageList,
    type IRNovelCategory,
    type IRNovelPageListItem,
    type IRNovelPageListReq,
    ZNovelCategory,
    ZNovelPageListResponse
} from "@/apis/novel";
import * as z from "zod";
import "./index.scss";

type ReaderType = 1 | 2;
type SortKey = "hot" | "newest" | "words";
type CategoryTab = "all" | "theme" | "role" | "plot";

type FilterOption<T> = {
    label: string;
    value?: T;
};

const readerOptions: FilterOption<ReaderType | undefined>[] = [
    { label: "全部", value: undefined },
    { label: "男生", value: 1 },
    { label: "女生", value: 2 },
];

const statusOptions: FilterOption<number>[] = [
    { label: "全部", value: undefined },
    { label: "连载中", value: 1 },
    { label: "已完结", value: 2 },
];

const wordCountOptions: FilterOption<number | undefined>[] = [
    { label: "全部", value: undefined },
    { label: "30万字+", value: 300000 },
    { label: "50万字+", value: 500000 },
    { label: "100万字+", value: 1000000 },
    { label: "200万字+", value: 2000000 },
];

const sortTabs: { key: SortKey; label: string }[] = [
    { key: "hot", label: "最热" },
    { key: "newest", label: "最新" },
    { key: "words", label: "字数" },
];

const PAGE_SIZE = 12;

const categoryTabs: {
    key: CategoryTab;
    label: string;
    queryValue?: number;
    parentId?: number;
}[] = [
    { key: "all", label: "全部" },
    { key: "theme", label: "主题", queryValue: 1, parentId: 2 },
    { key: "role", label: "角色", queryValue: 2, parentId: 3 },
    { key: "plot", label: "情节", queryValue: 3, parentId: 4 },
];

const ReaderIndex = () => {
    const ns = useNamespace("reader-index");

    const [readerType, setReaderType] = useState<ReaderType | undefined>(undefined);
    const [categories, setCategories] = useState<IRNovelCategory[]>([]);
    const [categoryLoading, setCategoryLoading] = useState(false);

    const [categoryTab, setCategoryTab] = useState<CategoryTab>("all");
    const [categoryId, setCategoryId] = useState<number | undefined>();
    const [status, setStatus] = useState<number | undefined>();
    const [wordCount, setWordCount] = useState<number | undefined>();
    const [sortKey, setSortKey] = useState<SortKey>("hot");

    const [loading, setLoading] = useState(false);
    const [novels, setNovels] = useState<IRNovelPageListItem[]>([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: PAGE_SIZE,
        total: 0,
    });

    const categoryMap = useMemo(() => {
        const group: Record<number, IRNovelCategory[]> = {};
        categories.forEach((c) => {
            if (!c.parentId) return;
            group[c.parentId] = group[c.parentId] ? [...group[c.parentId], c] : [c];
        });
        return group;
    }, [categories]);

    useEffect(() => {
        fetchCategories(readerType === 2 ? 2 : 1);
        setCategoryId(undefined);
    }, [readerType]);

    const fetchCategories = async (type: ReaderType | undefined) => {
        setCategoryLoading(true);
        try {
            const res = await RGetNovelCategories(type ?? 1);
            const parsed = z.array(ZNovelCategory).safeParse(res);
            if (!parsed.success) {
                console.error("分类数据格式异常", parsed.error);
                throw new Error("分类数据格式异常");
            }
            setCategories(parsed.data);
        } catch (error) {
            console.error(error);
            setCategories([]);
            Message.error("获取分类失败，请稍后再试");
        } finally {
            setCategoryLoading(false);
        }
    };

    const categoryParam = useMemo(() => {
        const tab = categoryTabs.find((t) => t.key === categoryTab);
        return categoryId ?? tab?.queryValue;
    }, [categoryId, categoryTab]);

    const fetchNovels = useCallback(
        async (page = pagination.current, size = pagination.pageSize) => {
            const payload: IRNovelPageListReq = {
                page,
                size,
                category: categoryParam,
                status,
                wordCount,
            };
            setLoading(true);
            try {
                const res = await RGetNovelPageList(payload);
                const parsed = ZNovelPageListResponse.safeParse(res);
                if (!parsed.success) {
                    console.error("作品列表数据格式异常", parsed.error);
                    throw new Error("作品列表数据格式异常");
                }
                setNovels(parsed.data.rows as IRNovelPageListItem[]);
                setPagination({
                    current: Number(page),
                    pageSize: size,
                    total: Number(parsed.data.total || 0),
                });
            } catch (error) {
                console.error(error);
                setNovels([]);
                setPagination((prev) => ({ ...prev, total: 0 }));
                Message.error("获取作品列表失败，请稍后再试");
            } finally {
                setLoading(false);
            }
        },
        [categoryParam, pagination.current, pagination.pageSize, status, wordCount]
    );

    useEffect(() => {
        fetchNovels(1, pagination.pageSize);
    }, [fetchNovels, pagination.pageSize, readerType]);

    const normalizeWordCount = (value?: number | string | null) => {
        if (value === null || value === undefined) return 0;
        if (typeof value === "number") return value;
        const strVal = value as string;
        const numeric = Number(strVal.replace(/[^\d.]/g, ""));
        if (Number.isNaN(numeric)) return 0;
        return strVal.includes("万") ? numeric * 10000 : numeric;
    };

    const formatWordCount = (value?: number | string | null) => {
        const num = normalizeWordCount(value);
        if (num >= 10000) {
            const wan = num / 10000;
            return `${wan >= 100 ? wan.toFixed(0) : wan.toFixed(1)} 万字`;
        }
        return `${num.toLocaleString()} 字`;
    };

    const parseWordCountNumber = (value?: number | string | null) => {
        return normalizeWordCount(value);
    };

    const formatStatus = (val?: number | null) => {
        if (val === 2) return "已完结";
        if (val === 1) return "连载中";
        return "未知";
    };

    const getUpdateTimestamp = (item: IRNovelPageListItem) => {
        const val = item.newestChapter?.date;
        if (!val) return 0;
        const d = dayjs(val);
        return d.isValid() ? d.valueOf() : 0;
    };

    const formatUpdateTime = (val?: string | null) => {
        if (!val) return "暂无更新";
        const d = dayjs(val);
        return d.isValid() ? d.format("YYYY-MM-DD HH:mm") : val;
    };

    const sortedNovels = useMemo(() => {
        const data = [...novels];
        switch (sortKey) {
            case "newest":
                return data.sort((a, b) => getUpdateTimestamp(b) - getUpdateTimestamp(a));
            case "words":
                return data.sort(
                    (a, b) =>
                        parseWordCountNumber(b.totalWordCount) -
                        parseWordCountNumber(a.totalWordCount)
                );
            default:
                return data;
        }
    }, [novels, sortKey]);

    const renderFilterRow = <T,>(
        label: string,
        options: FilterOption<T>[],
        value: T | undefined,
        onChange: (val: T | undefined) => void
    ) => (
        <div className={ns.e("filter-row")}>
            <div className={ns.e("filter-label")}>{label}</div>
            <div className={ns.e("filter-options")}>
                {options.map((opt) => {
                    const active = value === opt.value || (!value && opt.value === undefined);
                    return (
                        <button
                            key={opt.label}
                            type="button"
                            className={`${ns.e("chip")} ${active ? "is-active" : ""}`}
                            onClick={() => onChange(opt.value)}
                        >
                            {opt.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );

    const renderCategoryTabs = () => {
        return (
            <div className={ns.e("filter-row")}>
                <div className={ns.e("filter-label")}>分类：</div>
                <div className={ns.e("filter-options")}>
                    {categoryTabs.map((tab) => {
                        const active = categoryTab === tab.key;
                        return (
                            <button
                                key={tab.key}
                                type="button"
                                className={`${ns.e("chip")} ${active ? "is-active" : ""}`}
                                onClick={() => {
                                    setCategoryTab(tab.key);
                                    setCategoryId(undefined);
                                    setPagination((prev) => ({ ...prev, current: 1 }));
                                }}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderCategoryChips = () => {
        const tab = categoryTabs.find((t) => t.key === categoryTab);
        if (!tab?.parentId) return null;
        const list = categoryMap[tab.parentId] || [];
        if (!list.length) return null;
        return (
            <div className={ns.e("category-panel")}>
                {list.map((item) => {
                    const active = categoryId === item.id;
                    return (
                        <div
                            key={item.id}
                            className={`${ns.e("category-chip")} ${active ? "is-active" : ""}`}
                            onClick={() => {
                                const nextId = active ? undefined : item.id;
                                setCategoryId(nextId);
                                setPagination((prev) => ({ ...prev, current: 1 }));
                            }}
                        >
                            <span className={ns.e("category-icon")}></span>
                            <span className={ns.e("category-text")}>{item.name}</span>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className={ns.b()}>
            <div className="serial-card serial-card-large">
            <div className={ns.e("filters")}>
                    {renderFilterRow<ReaderType | undefined>(
                        "读者：",
                        readerOptions,
                        readerType,
                        (val) => {
                            setReaderType(val as ReaderType | undefined);
                            setPagination((prev) => ({ ...prev, current: 1 }));
                        }
                    )}
                    {renderCategoryTabs()}
                    {renderCategoryChips()}
                    {renderFilterRow<number | undefined>("状态：", statusOptions, status, (val) => {
                        setStatus(val);
                        setPagination((prev) => ({ ...prev, current: 1 }));
                    })}
                    {renderFilterRow<number | undefined>("字数：", wordCountOptions, wordCount, (val) => {
                        setWordCount(val);
                        setPagination((prev) => ({ ...prev, current: 1 }));
                    })}
                </div>

                <div className={ns.e("tabs")}>
                    {sortTabs.map((tab) => (
                        <div
                            key={tab.key}
                            className={`${ns.e("tab")} ${sortKey === tab.key ? "is-active" : ""}`}
                            onClick={() => setSortKey(tab.key)}
                        >
                            {tab.label}
                        </div>
                    ))}
                </div>

                <Spin loading={loading || categoryLoading} tip="加载中...">
                    {sortedNovels.length === 0 ? (
                        <div className={ns.e("empty")}>
                            <Empty description="暂无作品，换个条件试试" />
                        </div>
                    ) : (
                        <div className={ns.e("list")}>
                            {sortedNovels.map((item, idx) => (
                                <div className={ns.e("card")} key={`${item.title}-${idx}`}>
                                    <div className={ns.e("cover")}>
                                        {item.cover ? (
                                            <img src={item.cover} alt={item.title} />
                                        ) : (
                                            <div className={ns.e("cover-placeholder")}>
                                                <span>{item.title.slice(0, 2)}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className={ns.e("content")}>
                                        <div className={ns.e("title-row")}>
                                            <div className={ns.e("title")}>{item.title}</div>
                                            <div className={ns.e("status")}>{formatStatus(item.status)}</div>
                                        </div>
                                        <div className={ns.e("meta")}>
                                            <span>作者：{item.author}</span>
                                            <span>字数：{formatWordCount(item.totalWordCount)}</span>
                                            <span>更新时间：{formatUpdateTime(item.newestChapter?.date || null)}</span>
                                        </div>
                                        {item.newestChapter && (
                                            <div className={ns.e("latest")}>
                                                最新：第{item.newestChapter.idx}章 {item.newestChapter.title}
                                            </div>
                                        )}
                                        <div className={ns.e("desc")}>
                                            {item.description || "暂无简介"}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Spin>

                <div className={ns.e("pagination")}>
                    <Pagination
                        total={pagination.total}
                        current={pagination.current}
                        pageSize={pagination.pageSize}
                        showTotal
                        onChange={(page, pageSize) => {
                            setPagination({
                                current: page,
                                pageSize,
                                total: pagination.total,
                            });
                            fetchNovels(page, pageSize);
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ReaderIndex;
