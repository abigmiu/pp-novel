import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Input, Message, Radio, Select, Tooltip, Upload, Typography, Spin } from "@arco-design/web-react";
import { IconArrowLeft, IconInfoCircle, IconUpload } from "@arco-design/web-react/icon";
import { useNavigate } from "react-router";
import { useNamespace } from "@/hooks/useNameSpace";
import {
    RCreateNovel,
    RGetNovelCategories,
    type IRCreateNovelReq,
    type IRNovelCategory,
    ZCreateNovelRes,
    ZNovelCategory
} from "@/apis/novel";
import { RGetShortStoryCoverUploadUrl } from "@/apis/upload";
import type { RequestOptions } from "@arco-design/web-react/es/Upload/interface";
import * as z from "zod";
import "./CreateNovel.scss";

const { TextArea } = Input;
const { Text } = Typography;

type TReaderType = 1 | 2;

type FieldRowProps = {
    label: string;
    required?: boolean;
    children: React.ReactNode;
    extra?: React.ReactNode;
    ns: ReturnType<typeof useNamespace>;
};

const FieldRow: React.FC<FieldRowProps> = ({ label, required, children, extra, ns }) => {
    return (
        <div className={ns.e("row")}>
            <div className={ns.e("label")}>
                {required && <span className={ns.e("required")}>*</span>}
                <span>{label}</span>
                {extra}
            </div>
            <div className={ns.e("field")}>{children}</div>
        </div>
    );
};

const CreateNovel: React.FC = () => {
    const ns = useNamespace("create-novel");
    const navigate = useNavigate();

    const [title, setTitle] = useState<string>("");
    const [readerType, setReaderType] = useState<TReaderType>(1);
    const [categories, setCategories] = useState<IRNovelCategory[]>([]);
    const [categoryLoading, setCategoryLoading] = useState<boolean>(false);
    const [mainCategoryId, setMainCategoryId] = useState<number | undefined>(undefined);
    const [themeIds, setThemeIds] = useState<number[]>([]);
    const [roleIds, setRoleIds] = useState<number[]>([]);
    const [plotIds, setPlotIds] = useState<number[]>([]);
    const [protagonist1, setProtagonist1] = useState<string>("");
    const [protagonist2, setProtagonist2] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [cover, setCover] = useState<string>("");
    const [uploadingCover, setUploadingCover] = useState<boolean>(false);
    const [submitting, setSubmitting] = useState<boolean>(false);

    const groupedCategory = useMemo(() => {
        const group = {
            main: [] as IRNovelCategory[],
            theme: [] as IRNovelCategory[],
            role: [] as IRNovelCategory[],
            plot: [] as IRNovelCategory[],
        };

        categories.forEach((item) => {
            switch (item.parentId) {
                case 1:
                    group.main.push(item);
                    break;
                case 2:
                    group.theme.push(item);
                    break;
                case 3:
                    group.role.push(item);
                    break;
                case 4:
                    group.plot.push(item);
                    break;
                default:
                    break;
            }
        });
        return group;
    }, [categories]);

    const fetchCategories = useCallback(async (type: number) => {
        setCategoryLoading(true);
        try {
            const res = await RGetNovelCategories(type);
            const parsed = z.array(ZNovelCategory).safeParse(res);
            if (!parsed.success) {
                throw new Error("分类数据格式异常");
            }
            setCategories(parsed.data);
        } catch (error) {
            console.error(error);
            setCategories([]);
            Message.error("获取作品标签失败，请稍后重试");
        } finally {
            setCategoryLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories(readerType);
        setMainCategoryId(undefined);
        setThemeIds([]);
        setRoleIds([]);
        setPlotIds([]);
    }, [fetchCategories, readerType]);

    const handleUpload = async (options: RequestOptions) => {
        const { file, onError, onSuccess } = options;
        if (!file) return;
        setUploadingCover(true);
        try {
            const presignedUrl = await RGetShortStoryCoverUploadUrl({
                contentLength: file.size,
                contentType: file.type || "image/*"
            });
            const response = await window.fetch(presignedUrl.uploadUrl, {
                method: "PUT",
                body: file as Blob,
            });
            if (!response.ok) {
                throw new Error("上传失败");
            }
            onSuccess?.({ url: presignedUrl.downloadUlr });
            setCover(presignedUrl.downloadUlr);
            Message.success("封面上传成功");
        } catch (error) {
            console.error(error);
            onError?.(error as Error);
            Message.error("封面上传失败，请稍后重试");
        } finally {
            setUploadingCover(false);
        }
    };

    const handleCreate = async () => {
        if (!title.trim()) {
            Message.warning("请输入书本名称");
            return;
        }
        const desc = description.trim();

        const payload: IRCreateNovelReq = {
            title: title.trim(),
            type: readerType,
            ...(mainCategoryId ? { categoryIds: [mainCategoryId] } : {}),
            ...(themeIds.length ? { themeIds } : {}),
            ...(roleIds.length ? { roleIds } : {}),
            ...(plotIds.length ? { plotIds } : {}),
            ...(cover ? { cover } : {}),
            protagonist1: protagonist1.trim() || undefined,
            protagonist2: protagonist2.trim() || undefined,
            description: desc || undefined,
        };

        setSubmitting(true);
        try {
            const res = await RCreateNovel(payload);
            const parsed = ZCreateNovelRes.safeParse(res);
            const novelId = parsed.success ? parsed.data.novelId : undefined;
            Message.success(`作品创建成功${novelId ? `（ID: ${novelId}）` : ""}`);
        } catch (error) {
            console.error(error);
            Message.error("创建失败，请稍后再试");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={ns.b("")}>
            <div className="serial-card serial-card-large">
                <div className={ns.e("header")}>
                    <div className="flex items-center">
                        <Button
                            type="text"
                            icon={<IconArrowLeft />}
                            className={ns.e("back")}
                            onClick={() => navigate(-1)}
                        >
                            创建作品
                        </Button>
                    </div>
                    <div className={ns.e("audit")}>
                        <Tooltip content="请遵守平台创作规范，避免违规内容">
                            <span className="flex items-center">
                                审核规则
                                <IconInfoCircle style={{ marginLeft: 4 }} />
                            </span>
                        </Tooltip>
                    </div>
                </div>

                <div className={ns.e("body")}>
                    <div className={ns.e("cover")}>
                        <Upload
                            showUploadList={false}
                            accept="image/*"
                            customRequest={handleUpload}
                            limit={1}
                        >
                            <div className={ns.e("cover-box")}>
                                <Spin loading={uploadingCover} dot>
                                    {cover ? (
                                        <img src={cover} alt="作品封面" className={ns.e("cover-img")} />
                                    ) : (
                                        <div className={ns.e("cover-placeholder")}>
                                            <div className={ns.e("cover-title")}>书本名称</div>
                                            <div className={ns.e("cover-subtitle")}>作者</div>
                                        </div>
                                    )}
                                </Spin>
                            </div>
                            <Button type="outline" long icon={<IconUpload />} style={{ marginTop: 12 }}>
                                选择封面
                            </Button>
                        </Upload>
                    </div>

                    <div className={ns.e("form")}>
                        <FieldRow label="书本名称" required ns={ns}>
                            <div className={ns.e("input-wrap")}>
                                <Input
                                    placeholder="请输入作品名称"
                                    maxLength={15}
                                    value={title}
                                    onChange={setTitle}
                                    allowClear
                                />
                                <span className={ns.e("limit")}>{title.length}/15</span>
                            </div>
                        </FieldRow>

                        <FieldRow
                            label="目标读者"
                            extra={
                                <Tooltip content="选择作品主要面向的读者">
                                    <IconInfoCircle className="text-gray-500" />
                                </Tooltip>
                            }
                            ns={ns}
                        >
                            <Radio.Group
                                type="button"
                                value={readerType}
                                onChange={(val) => setReaderType(val as TReaderType)}
                            >
                                <Radio value={1}>男频</Radio>
                                <Radio value={2}>女频</Radio>
                            </Radio.Group>
                        </FieldRow>

                        <FieldRow label="作品标签" ns={ns}>
                            <Spin loading={categoryLoading}>
                                <div className={ns.e("tags")}>
                                    <Select
                                        placeholder="选择主分类"
                                        value={mainCategoryId}
                                        allowClear
                                        style={{ width: 200 }}
                                        onChange={(val) => setMainCategoryId(val as number | undefined)}
                                    >
                                        {groupedCategory.main.map((item) => (
                                            <Select.Option key={item.id} value={item.id}>
                                                {item.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                    <Select
                                        placeholder="选择主题"
                                        mode="multiple"
                                        maxTagCount={2}
                                        allowClear
                                        value={themeIds}
                                        style={{ width: 200 }}
                                        onChange={(vals) =>
                                            setThemeIds((vals as (string | number)[]).map((v) => Number(v)))
                                        }
                                    >
                                        {groupedCategory.theme.map((item) => (
                                            <Select.Option key={item.id} value={item.id}>
                                                {item.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                    <Select
                                        placeholder="角色标签"
                                        mode="multiple"
                                        maxTagCount={2}
                                        allowClear
                                        value={roleIds}
                                        style={{ width: 200 }}
                                        onChange={(vals) =>
                                            setRoleIds((vals as (string | number)[]).map((v) => Number(v)))
                                        }
                                    >
                                        {groupedCategory.role.map((item) => (
                                            <Select.Option key={item.id} value={item.id}>
                                                {item.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                    <Select
                                        placeholder="情节标签"
                                        mode="multiple"
                                        maxTagCount={2}
                                        allowClear
                                        value={plotIds}
                                        style={{ width: 200 }}
                                        onChange={(vals) =>
                                            setPlotIds((vals as (string | number)[]).map((v) => Number(v)))
                                        }
                                    >
                                        {groupedCategory.plot.map((item) => (
                                            <Select.Option key={item.id} value={item.id}>
                                                {item.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </div>
                            </Spin>
                        </FieldRow>

                        <FieldRow label="主角名" ns={ns}>
                            <div className={ns.e("protagonist-row")}>
                                <div className={ns.e("input-wrap")}>
                                    <Input
                                        placeholder="请输入主角名1"
                                        maxLength={5}
                                        value={protagonist1}
                                        onChange={setProtagonist1}
                                    />
                                    <span className={ns.e("limit")}>{protagonist1.length}/5</span>
                                </div>
                                <div className={ns.e("input-wrap")}>
                                    <Input
                                        placeholder="请输入主角名2"
                                        maxLength={5}
                                        value={protagonist2}
                                        onChange={setProtagonist2}
                                    />
                                    <span className={ns.e("limit")}>{protagonist2.length}/5</span>
                                </div>
                            </div>
                        </FieldRow>

                        <FieldRow label="作品简介" ns={ns}>
                            <div className={ns.e("textarea-wrap")}>
                                <TextArea
                                    placeholder="请输入50-500字以内的作品简介，不可出现低俗、暴力、血腥等不符合法律法规的内容"
                                    autoSize={{ minRows: 5, maxRows: 6 }}
                                    value={description}
                                    maxLength={500}
                                    showWordLimit
                                    onChange={setDescription}
                                />
                                <Text type="secondary" className={ns.e("textarea-tip")}>
                                    请认真填写作品简介，便于审核与推荐
                                </Text>
                            </div>
                        </FieldRow>
                    </div>
                </div>

                <div className={ns.e("footer")}>
                    <Button onClick={() => navigate(-1)}>取消</Button>
                    <Button type="primary" onClick={handleCreate} loading={submitting}>
                        立即创建
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CreateNovel;
