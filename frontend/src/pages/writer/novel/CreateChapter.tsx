import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, Input, InputNumber, Message, Tooltip, Typography } from "@arco-design/web-react";
import {
    IconArrowLeft,
    IconInfoCircle,
    IconRedo,
    IconSave,
    IconUndo,
    IconRobot,
    IconThunderbolt,
    IconBulb
} from "@arco-design/web-react/icon";
import { useNavigate, useSearchParams } from "react-router";
import { useNamespace } from "@/hooks/useNameSpace";
import { RCreateChapter, type IRCreateChapterReq } from "@/apis/novel";
import "./CreateChapter.scss";
import { keymap } from "prosemirror-keymap";
import { baseKeymap } from "prosemirror-commands";
import { Schema } from "prosemirror-model";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Plugin } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";

const { TextArea } = Input;
const { Text } = Typography;

function placeholderPlugin(text: string) {
    return new Plugin({
        props: {
            decorations(state) {
                const { doc } = state;
                const isEmpty = doc.childCount === 1 && doc.firstChild?.isTextblock && doc.firstChild.content.size === 0;
                if (!isEmpty) return null;
                const deco = Decoration.widget(
                    1,
                    () => {
                        const el = document.createElement("div");
                        el.className = "pm-placeholder";
                        el.textContent = text;
                        return el;
                    },
                    { side: -1 }
                );
                return DecorationSet.create(doc, [deco]);
            }
        }
    });
}

const schema = new Schema({
    nodes: {
        doc: {
            content: "block+"
        },
        paragraph: {
            content: "inline*",
            group: "block",
            toDOM: () => ["p", 0],
            parseDOM: [{ tag: "p" }]
        },
        text: {
            group: "inline"
        }
    }
});

const setupEditor = (el: HTMLElement, onDocChange?: (content: string) => void, initialContent?: string) => {
    const editorState = EditorState.create({
        schema,
        plugins: [
            placeholderPlugin("请输入正文内容\n\n你可以在这里写多段内容"),
            keymap(baseKeymap)
        ]
    });

    const editorView = new EditorView(el, {
        state: editorState,
        dispatchTransaction(transaction) {
            const newState = editorView.state.apply(transaction);
            editorView.updateState(newState);
            onDocChange?.(newState.doc.textContent);
        }
    });

    if (initialContent?.trim()) {
        editorView.dispatch(editorView.state.tr.insertText(initialContent));
    }
    onDocChange?.(editorState.doc.textContent);
    return editorView;
};

type TEditorProps = {
    value: string;
    onChange: (val: string) => void;
};

const ChapterEditor: React.FC<TEditorProps> = ({ value, onChange }) => {
    const editorRef = useRef<HTMLDivElement | null>(null);
    const viewRef = useRef<EditorView | null>(null);
    const initialValueRef = useRef(value);

    useEffect(() => {
        if (!editorRef.current) return;
        viewRef.current = setupEditor(editorRef.current, onChange, initialValueRef.current);
        return () => {
            viewRef.current?.destroy();
            viewRef.current = null;
        };
    }, [onChange]);

    useEffect(() => {
        const view = viewRef.current;
        if (!view) return;
        const current = view.state.doc.textContent;
        if (value === current) return;
        const tr = view.state.tr;
        tr.delete(0, view.state.doc.content.size);
        view.dispatch(tr);
        view.dispatch(view.state.tr.insertText(value));
    }, [value]);

    return (
        <div className="pm-editor" ref={editorRef}></div>
    );
};

const CreateChapter: React.FC = () => {
    const ns = useNamespace("create-chapter");
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const initialBookId = useMemo(() => {
        const id = Number(searchParams.get("bookId"));
        return Number.isFinite(id) ? id : undefined;
    }, [searchParams]);

    const initialChapterIdx = useMemo(() => {
        const idx = Number(searchParams.get("chapterIdx"));
        return Number.isFinite(idx) && idx > 0 ? idx : 1;
    }, [searchParams]);

    const [bookId, setBookId] = useState<number | undefined>(initialBookId);
    const [chapterIdx, setChapterIdx] = useState<number>(initialChapterIdx);
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [authorRemark, setAuthorRemark] = useState<string>("");
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [saving, setSaving] = useState<boolean>(false);
    const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

    const bookTitle = searchParams.get("bookTitle") || "未命名作品";
    const volumeTitle = searchParams.get("volume") || "第一卷·默认";

    const draftKey = useMemo(() => `chapter_draft_${bookId || "new"}`, [bookId]);
    const wordCount = useMemo(() => content.trim().length, [content]);

    useEffect(() => {
        const raw = localStorage.getItem(draftKey);
        if (!raw) return;
        try {
            const parsed: Partial<IRCreateChapterReq> & { savedAt?: string } = JSON.parse(raw);
            if (typeof parsed.bookId === "number") setBookId(parsed.bookId);
            if (typeof parsed.chapterIdx === "number") setChapterIdx(parsed.chapterIdx);
            if (typeof parsed.title === "string") setTitle(parsed.title);
            if (typeof parsed.content === "string") setContent(parsed.content);
            if (typeof parsed.authorRemark === "string") setAuthorRemark(parsed.authorRemark);
            if (typeof parsed.savedAt === "string") setLastSavedAt(parsed.savedAt);
        } catch (error) {
            console.warn("failed to parse chapter draft", error);
        }
    }, [draftKey]);

    const handleSaveDraft = useCallback(() => {
        setSaving(true);
        const savedAt = new Date().toLocaleString();
        const payload = {
            bookId,
            chapterIdx,
            title,
            content,
            authorRemark,
            savedAt,
        };
        try {
            localStorage.setItem(draftKey, JSON.stringify(payload));
            setLastSavedAt(savedAt);
            Message.success("已保存草稿");
        } catch (error) {
            console.error(error);
            Message.error("保存草稿失败，请稍后重试");
        } finally {
            setSaving(false);
        }
    }, [authorRemark, bookId, chapterIdx, content, draftKey, title]);

    const handleSubmit = async () => {
        if (!bookId) {
            Message.warning("缺少书本ID，请从作品入口进入");
            return;
        }
        if (!title.trim()) {
            Message.warning("请输入章节标题");
            return;
        }
        if (!chapterIdx || chapterIdx <= 0) {
            Message.warning("请输入章节序号");
            return;
        }

        const payload: IRCreateChapterReq = {
            title: title.trim(),
            chapterIdx: Math.max(1, Math.floor(chapterIdx)),
            ...(content.trim() ? { content: content.trim() } : {}),
            ...(authorRemark.trim() ? { authorRemark: authorRemark.trim() } : {}),
            bookId,
        };

        setSubmitting(true);
        try {
            await RCreateChapter(payload);
            Message.success("章节创建成功");
            localStorage.removeItem(draftKey);
            navigate(-1);
        } catch (error) {
            console.error(error);
            Message.error("创建章节失败，请稍后再试");
        } finally {
            setSubmitting(false);
        }
    };

    const handleClearContent = () => {
        setContent("");
        setAuthorRemark("");
    };

    const handleAiAction = (label: string) => {
        Message.info(`${label} 功能暂未开放，敬请期待`);
    };

    return (
        <div className={ns.b("")}>
            <div className={ns.e("sheet")}>
                <div className={ns.e("header")}>
                    <div className={ns.e("breadcrumb")}>
                        <Button
                            type="text"
                            icon={<IconArrowLeft />}
                            className={ns.e("back")}
                            onClick={() => navigate(-1)}
                        >
                            返回
                        </Button>
                        <span className={ns.e("book-title")}>{bookTitle}</span>
                        <span className={ns.e("volume-tag")}>{volumeTitle}</span>
                        {bookId && <span className={ns.e("id-tag")}>ID: {bookId}</span>}
                    </div>
                    <div className={ns.e("header-actions")}>
                        <Text type="secondary">已保存 正文字数 {wordCount}</Text>
                        {lastSavedAt && <Text type="secondary">最近保存：{lastSavedAt}</Text>}
                        <Tooltip content="清空正文与有话说">
                            <Button type="text" icon={<IconUndo />} onClick={handleClearContent} />
                        </Tooltip>
                        <Tooltip content="重做（暂未实现）">
                            <Button type="text" icon={<IconRedo />} />
                        </Tooltip>
                        <Tooltip content="复制章节内容（暂未实现）">
                            <Button type="text" icon={<IconSave />} />
                        </Tooltip>
                        <Button onClick={handleSaveDraft} loading={saving}>
                            存草稿
                        </Button>
                        <Button type="primary" onClick={handleSubmit} loading={submitting}>
                            下一步
                        </Button>
                    </div>
                </div>

                <div className={ns.e("body")}>
                    <div className={ns.e("editor-panel")}>
                        <div className={ns.e("title-row")}>
                            <span className={ns.e("chapter-label")}>第</span>
                            <InputNumber
                                min={1}
                                max={9999}
                                value={chapterIdx}
                                onChange={(val) => setChapterIdx(typeof val === "number" ? val : 1)}
                                className={ns.e("chapter-input")}
                            />
                            <span className={ns.e("chapter-label")}>章</span>
                            <Input
                                placeholder="请输入标题"
                                value={title}
                                onChange={setTitle}
                                allowClear
                                className={ns.e("title-input")}
                            />
                        </div>
                        <div className={ns.e("hint")}>
                            <IconInfoCircle />
                            开新书没思路？尝试AI开书灵感，帮你生成大纲
                        </div>
                        <div className={ns.e("content")}>
                            <ChapterEditor value={content} onChange={setContent} />
                        </div>
                    </div>

                    <div className={ns.e("aside")}>
                        <Tooltip content="角色设定">
                            <Button
                                type="outline"
                                className={ns.e("aside-btn")}
                                icon={<IconInfoCircle className={ns.e("aside-btn-icon")} />}
                                onClick={() => handleAiAction("角色设定")}
                            >
                                角色
                            </Button>
                        </Tooltip>
                        <Tooltip content="AI 灵感">
                            <Button
                                type="outline"
                                className={ns.e("aside-btn")}
                                icon={<IconBulb className={ns.e("aside-btn-icon")} />}
                                onClick={() => handleAiAction("AI 灵感")}
                            >
                                灵感
                            </Button>
                        </Tooltip>
                        <Tooltip content="AI 续写">
                            <Button
                                type="outline"
                                className={ns.e("aside-btn")}
                                icon={<IconRobot className={ns.e("aside-btn-icon")} />}
                                onClick={() => handleAiAction("AI 续写")}
                            >
                                续写
                            </Button>
                        </Tooltip>
                        <Tooltip content="AI 起名">
                            <Button
                                type="outline"
                                className={ns.e("aside-btn")}
                                icon={<IconThunderbolt className={ns.e("aside-btn-icon")} />}
                                onClick={() => handleAiAction("AI 起名")}
                            >
                                起名
                            </Button>
                        </Tooltip>
                    </div>
                </div>

                <div className={ns.e("remark-card")}>
                    <div className={ns.e("remark-header")}>
                        <div className="flex items-center gap-2">
                            <span>作者有话说</span>
                            <Tooltip content="看话说发布时间可决定，含恶意节奏时段发布，不会提前公开">
                                <IconInfoCircle />
                            </Tooltip>
                        </div>
                        <Button
                            type="outline"
                            size="small"
                            onClick={() => {
                                if (!authorRemark) {
                                    setAuthorRemark("感谢大家的支持，欢迎留言互动！");
                                }
                            }}
                        >
                            添加
                        </Button>
                    </div>
                    <TextArea
                        placeholder="有话说将展示在章节末尾，提前与读者交流或预告更新安排"
                        autoSize={{ minRows: 3, maxRows: 6 }}
                        value={authorRemark}
                        onChange={setAuthorRemark}
                        maxLength={200}
                        showWordLimit
                    />
                    <Text type="secondary" className={ns.e("remark-tip")}>
                        有话说内容可用于章节预告、致谢或互动引导，避免出现违规内容。
                    </Text>
                </div>
            </div>
        </div>
    );
};

export default CreateChapter;
