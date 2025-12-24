import { Button, Cascader, InputNumber, Message, Modal, Popover, Grid, Slider, Upload } from "@arco-design/web-react";
import { IconArrowLeft, IconInfoCircle, IconMinus, IconRotateLeft, IconPlus } from "@arco-design/web-react/icon";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { keymap } from "prosemirror-keymap";
import { baseKeymap } from "prosemirror-commands";

import { Schema } from 'prosemirror-model';
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Plugin } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";
import EasyCropper from 'react-easy-crop';


import './ShortStory.scss';
import { RCreateShortStoryDraft, RGetShortStoryCategoryTree, ZShortStoryCategoryTreeRes, type IRShortStoryCategoryTreeRes } from "@/apis/shortStory";
import { useMount } from "ahooks";
import CoverClip from "./components/CoverClip";
import { RGetShortStoryCoverUploadUrl } from "@/apis/upload";
import type { RequestOptions } from "@arco-design/web-react/es/Upload";
import type { UploadItem } from "@arco-design/web-react/es/Upload/interface";
import * as z from "zod";

function placeholderPlugin(text: string) {
    return new Plugin({
        props: {
            decorations(state) {
                const { doc } = state;

                const isEmpty =
                    doc.childCount === 1 &&
                    doc.firstChild?.isTextblock &&
                    doc.firstChild.content.size === 0;

                if (!isEmpty) return null;

                const deco = Decoration.widget(1, () => {
                    const el = document.createElement("div");
                    el.className = "pm-placeholder";
                    el.textContent = text;
                    return el;
                }, { side: -1 });

                return DecorationSet.create(doc, [deco]);
            }
        }
    });
}

const schema = new Schema({
    nodes: {
        // 整个文档
        doc: {
            // 文档内容规定必须是 block 类型的节点（block 与 HTML 中的 block 概念差不多） `+` 号代表可以有一个或多个（规则类似正则）
            content: 'block+'
        },
        // 文档段落
        paragraph: {
            // 段落内容规定必须是 inline 类型的节点（inline 与 HTML 中 inline 概念差不多）, `*` 号代表可以有 0 个或多个（规则类似正则）
            content: 'inline*',
            // 分组：当前节点所在的分组为 block，意味着它是个 block 节点
            group: 'block',
            // 渲染为 html 时候，使用 p 标签渲染，第二个参数 0 念做 “洞”，类似 vue 中 slot 插槽的概念，
            // 证明它有子节点，以后子节点就填充在 p 标签中
            toDOM: () => {
                return ['p', 0]
            },
            // 从别处复制过来的富文本，如果包含 p 标签，将 p 标签序列化为当前的 p 节点后进行展示
            parseDOM: [{
                tag: 'p'
            }]
        },
        // 段落中的文本
        text: {
            // 当前处于 inline 分株，意味着它是个 inline 节点。代表输入的文本
            group: 'inline'
        },

    },

})

const keymapPlugin = keymap({
    Enter(state, dispatch) {
        const { $from } = state.selection;
        return true;
        if ($from.parent.type.name === "chapter_title") {
            // 跳转到正文段落
            return true;
        }

        return false; // 其他情况走默认
    }
});

const setupEditor = (el: HTMLElement, onDocChange?: (content: string) => void) => {

    // 根据 schema 定义，创建 editorState 数据实例
    const editorState = EditorState.create({
        schema,
        plugins: [
            placeholderPlugin(
                "请输入正文内容\n\n你可以在这里写多段故事"
            ),
            keymap(baseKeymap)
        ]
    })

    let editorView: EditorView;
    // 创建编辑器视图实例，并挂在到 el 上
    editorView = new EditorView(el, {
        state: editorState,
        dispatchTransaction(transaction) {
            const newState = editorView.state.apply(transaction);
            editorView.updateState(newState);
            onDocChange?.(newState.doc.textContent);
        }
    })

    onDocChange?.(editorState.doc.textContent);
    return editorView;
}


// 写短故事
type IEditState = {
    title: string;
    content: string;
    cover: string;
    categoryIds: number[];
    freeRate: number;
}
type IEditAction =
    | { type: 'SET_TITLE'; payload: string }
    | { type: 'SET_CONTENT'; payload: string }
    | { type: 'SET_COVER'; payload: string }
    | { type: 'SET_CATEGORY'; payload: number[] }
    | { type: 'SET_FREE_RATE'; payload: number };


function editorReducer(state: IEditState, action: IEditAction): IEditState {
    switch (action.type) {
        case "SET_TITLE":
            return {
                ...state,
                title: action.payload.slice(0, 25) // 双保险
            }
        case "SET_CONTENT":
            return {
                ...state,
                content: action.payload
            }
        case "SET_COVER":
            return {
                ...state,
                cover: action.payload
            }
        case "SET_CATEGORY":
            return {
                ...state,
                categoryIds: action.payload
            }
        case "SET_FREE_RATE":
            return {
                ...state,
                freeRate: Math.min(100, Math.max(0, action.payload))
            }
        default:
            return state
    }
}

const StateContext = createContext<{
    state: IEditState,
    dispatch: React.Dispatch<IEditAction>,
    submitDraft: () => Promise<void>,
    submitForReview: () => Promise<void>,
    submitting: boolean,
} | null>(null);

const PublishHeader: React.FC = () => {
    const ctx = useContext(StateContext);
    if (!ctx) return null;
    const wordCount = ctx.state.content.trim().length;
    return (
        <div style={{
            background: '#fff',
            height: '60px',
            paddingLeft: '20px',
            paddingRight: '20px',
            position: 'fixed',
            top: 0,
            right: 0,
            left: 0,
        }} className="flex justify-between">
            <div className="flex items-center">
                <IconArrowLeft />
                <div className="ml-4">
                    <div>{ctx.state.title || '未命名短故事'}</div>
                    <div className="text-gray">已保存 正文字数 {wordCount}</div>
                </div>
            </div>
            <div className="flex items-center">
                <Button shape="round" loading={ctx.submitting} onClick={ctx.submitDraft}>存草稿</Button>
                <Button className="ml-6" type="outline" shape="round" loading={ctx.submitting} onClick={ctx.submitForReview}>下一步</Button>
            </div>


        </div>
    )
}

const Editor: React.FC = () => {
    const ctx = useContext(StateContext);
    const editorRef = useRef<HTMLDivElement | null>(null)
    const viewRef = useRef<EditorView | null>(null);
    const dispatch = ctx?.dispatch;

    useEffect(() => {
        if (!editorRef.current || !dispatch) return;
        viewRef.current = setupEditor(editorRef.current, (content) => {
            dispatch({
                type: 'SET_CONTENT',
                payload: content
            })
        })
        return () => {
            viewRef.current?.destroy();
            viewRef.current = null;
        };
    }, [dispatch])
    if (!ctx) return null;
    return (
        <div className=" w-full">
            <div className="flex w-full">
                <input
                    style={{
                        width: '100%',
                        height: '24px',
                        border: 'none',
                        outline: 'none',
                        flex: 1,
                    }}
                    maxLength={25}
                    placeholder="请输入短故事名称"
                    value={ctx.state.title}
                    onChange={e => ctx.dispatch({
                        type: 'SET_TITLE',
                        payload: e.target.value
                    })}
                />
                <span>{ctx.state.title.length} / 25</span>
            </div>


            <div id="editor" style={{
                minHeight: '500px',
                caretColor: '#ff5f00',
                fontSize: '16px',
                lineHeight: 1.5
            }} ref={editorRef}></div>
        </div>
    )
}


interface PixelCrop {
    x: number;
    y: number;
    width: number;
    height: number;
}

async function _getCroppedImg(url: string, pixelCrop: PixelCrop, rotation = 0): Promise<Blob | null> {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => reject(error));
        image.src = url;
    });
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx || !image) {
        return null;
    }

    const imageSize = 2 * ((Math.max(image.width, image.height) / 2) * Math.sqrt(2));
    canvas.width = imageSize;
    canvas.height = imageSize;

    if (rotation) {
        ctx.translate(imageSize / 2, imageSize / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.translate(-imageSize / 2, -imageSize / 2);
    }

    ctx.drawImage(image, imageSize / 2 - image.width / 2, imageSize / 2 - image.height / 2);
    const data = ctx.getImageData(0, 0, imageSize, imageSize);
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    ctx.putImageData(
        data,
        Math.round(0 - imageSize / 2 + image.width * 0.5 - pixelCrop.x),
        Math.round(0 - imageSize / 2 + image.height * 0.5 - pixelCrop.y)
    );
    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            resolve(blob);
        });
    });
} // 裁剪组件

interface CropperProps {
    file: File;
    onOk: (file: File) => void;
    onCancel: () => void;
}

const Cropper: React.FC<CropperProps> = (props) => {
    const { file } = props;
    const [crop, setCrop] = useState({
        x: 0,
        y: 0,
    });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<PixelCrop | null>(null)

    const url = React.useMemo(() => {
        return URL.createObjectURL(file);
    }, [file]);
    return (
        <div>
            <div
                style={{
                    width: '100%',
                    height: 280,
                    position: 'relative',
                }}
            >
                <EasyCropper
                    style={{
                        containerStyle: {
                            width: '100%',
                            height: 280,
                        },
                    }}
                    aspect={4 / 4}
                    image={url}
                    crop={crop}
                    zoom={zoom}
                    rotation={rotation}
                    onRotationChange={setRotation}
                    onCropComplete={(_, croppedAreaPixels) => {
                        setCroppedAreaPixels(croppedAreaPixels)
                    }}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                />
            </div>
            <Grid.Row justify='space-between' style={{ marginTop: 20, marginBottom: 20 }}>
                <Grid.Row
                    style={{
                        flex: 1,
                        marginLeft: 12,
                        marginRight: 12,
                    }}
                >
                    <IconMinus
                        style={{ marginRight: 10 }}
                        onClick={() => {
                            setZoom(Math.max(1, zoom - 0.1));
                        }}
                    />
                    <Slider
                        style={{ flex: 1 }}
                        step={0.1}
                        value={zoom}
                        onChange={(v) => {
                            if (typeof v === 'number') {
                                setZoom(v);
                            }
                        }}
                        min={0.8}
                        max={3}
                    />
                    <IconPlus
                        style={{ marginLeft: 10 }}
                        onClick={() => {
                            setZoom(Math.min(3, zoom + 0.1));
                        }}
                    />
                </Grid.Row>
                <IconRotateLeft
                    onClick={() => {
                        setRotation(rotation - 90);
                    }}
                />
            </Grid.Row>

            <Grid.Row justify='end'>
                <Button onClick={props.onCancel} style={{ marginRight: 20 }}>
                    取消
                </Button>
                <Button
                    type='primary'
                    onClick={async () => {
                        if (!croppedAreaPixels) return;
                        const blob = await _getCroppedImg(url || '', croppedAreaPixels, rotation);

                        if (blob) {
                            const newFile = new File([blob], file.name || 'image', {
                                type: file.type || 'image/*',
                            });
                            props.onOk(newFile);
                        }
                    }}
                >
                    确定
                </Button>
            </Grid.Row>
        </div>
    );
};

async function upload(options: RequestOptions, onUploaded?: (url: string) => void) {
    const { onProgress, onError, onSuccess, file } = options;
    console.log("🚀 ~ upload ~ file:", file);

    const presignedUrl = await RGetShortStoryCoverUploadUrl({
        contentLength: file.size,
        contentType: file.type
    });
    try {
        const response = await window.fetch(presignedUrl.uploadUrl, {
            method: 'PUT',
            body: file,  // 直接上传整个文件

        });
        if (response.ok) {
            onSuccess({ url: presignedUrl.downloadUlr })
            onUploaded?.(presignedUrl.downloadUlr)
        } else {
            onError();
        }

    } catch {
        onError();
    }

}

type TCategoryOption = Omit<IRShortStoryCategoryTreeRes, 'id' | 'children'> & {
    id: string;
    children?: TCategoryOption[];
};

const StoryConfig: React.FC = () => {
    const [categoryOptions, setCategoryOptions] = useState<TCategoryOption[]>([]);
    const ctx = useContext(StateContext);

    const fetchCategory = async () => {
        const res = await RGetShortStoryCategoryTree();
        console.log("🚀 ~ fetchCategory ~ res:", res);
        
        const result = z.array(ZShortStoryCategoryTreeRes).safeParse(res);
        res.forEach(item => {
            item.children = item.children || [];
        })
        if (result.success) {
            const convertIds = (items: IRShortStoryCategoryTreeRes[]): TCategoryOption[] => {
                return items.map(item => ({
                    ...item,
                    id: String(item.id),
                    children: item.children ? convertIds(item.children) : []
                }));
            };
            setCategoryOptions(convertIds(res));
        } else {
            console.error('获取分类失败', result.error);
        }
    }
    useMount(() => {
        fetchCategory();
    })
    if (!ctx) return null;
    const { state, dispatch } = ctx;
    const uploadFileList = useMemo<UploadItem[]>(() => state.cover ? [{
        uid: state.cover,
        name: 'cover',
        status: 'done',
        url: state.cover
    }] : [], [state.cover]);

    const handleUpload = useCallback((options: RequestOptions) => {
        return upload(options, (url) => {
            dispatch({
                type: 'SET_COVER',
                payload: url
            })
        });
    }, [dispatch]);

    const cascaderValue = useMemo<(string | string[])[] | undefined>(() => {
        if (!state.categoryIds.length) {
            return undefined;
        }
        const findPath = (options: TCategoryOption[], targetId: string, path: string[] = []): string[] | null => {
            for (const option of options) {
                const currentPath = [...path, option.id];
                if (option.id === targetId) {
                    return currentPath;
                }
                if (option.children?.length) {
                    const result = findPath(option.children, targetId, currentPath);
                    if (result) {
                        return result;
                    }
                }
            }
            return null;
        };
        const paths = state.categoryIds.map((id) => findPath(categoryOptions, id.toString())).filter((path): path is string[] => Array.isArray(path));
        return paths.length ? paths : undefined;
    }, [state.categoryIds, categoryOptions]);

    const handleCategoryChange = (value: (string | string[])[] | undefined) => {
        const ids = (value ?? []).map((item) => {
            const path = Array.isArray(item) ? item : [item];
            const last = path[path.length - 1];
            const numeric = Number(last);
            return Number.isFinite(numeric) ? numeric : null;
        }).filter((id): id is number => typeof id === 'number' && Number.isFinite(id));
        dispatch({
            type: 'SET_CATEGORY',
            payload: ids
        })
    }

    const handleFreeRateChange = (value: number | string) => {
        const numeric = typeof value === 'number' ? value : Number(value);
        dispatch({
            type: 'SET_FREE_RATE',
            payload: Number.isFinite(numeric) ? Number(numeric) : 0
        })
    }

    return (
        <div>
            <div className="flex items-center">
                <div style={{ width: '140px' }}>
                    封面设置
                    <Popover
                        title="场景示意"
                        content={
                            <div>
                                <div>用于番茄小说推荐场景下的双列展示，如下图</div>
                            </div>

                        }
                    >
                        <IconInfoCircle />
                    </Popover>

                </div>

                <div className="">
                    <Upload
                        listType="picture-card"

                        limit={1}
                        fileList={uploadFileList}
                        customRequest={handleUpload}
                        onRemove={() => {
                            dispatch({
                                type: 'SET_COVER',
                                payload: ''
                            })
                            return true;
                        }}
                        beforeUpload={(file) => {
                            return new Promise((resolve) => {
                                const modal = Modal.confirm({
                                    title: '裁剪图片',
                                    onCancel: () => {
                                        Message.info('取消上传');
                                        resolve(false);
                                        modal.close();
                                    },
                                    simple: false,
                                    content: (<Cropper
                                        file={file}
                                        onOk={(file) => {
                                            resolve(file);
                                            modal.close();
                                        }}
                                        onCancel={() => {
                                            resolve(false);
                                            Message.info('取消上传');
                                            modal.close();
                                        }}
                                    />),
                                    footer: null
                                })
                            })
                        }}
                    ></Upload>
                </div>
            </div>
            <div className="flex items-center" style={{ marginTop: '20px' }}>
                <div style={{ width: '140px' }}>
                    作品分类

                    <IconInfoCircle />

                </div>

                <div className="">
                    <Cascader
                        mode="multiple"
                        placeholder='请选择作品分类'
                        style={{ width: 300, marginBottom: 20 }}
                        options={categoryOptions}
                        value={cascaderValue}
                        fieldNames={{
                            label: 'name',
                            value: 'id',
                            children: 'children'
                        }}
                        onChange={handleCategoryChange}
                    />
                </div>
            </div>
            <div className="flex items-center">
                <div style={{ width: '140px' }}>
                    试读比例
                </div>
                {/* <IconInfoCircle /> */}
                <div className="">
                    <InputNumber
                        min={0}
                        max={100}
                        value={state.freeRate}
                        suffix='%'
                        step={1}
                        style={{ width: 160, margin: '10px 24px 10px 0' }}
                        onChange={handleFreeRateChange}
                    />
                </div>
            </div>
        </div>
    )
}

const EditorWrapper: React.FC = () => {
    return (
        <div className=" bg-white mx-auto mt-10 serial-card serial-card-normal" style={{
            width: '1000px',
            marginTop: '90px'
        }}>
            <Editor></Editor>
            <StoryConfig></StoryConfig>

        </div>
    )
}

const ShortStoryPublish: React.FC = () => {
    const [state, dispatch] = useReducer(editorReducer, {
        title: "",
        content: "",
        cover: "",
        categoryIds: [],
        freeRate: 50,
    })
    const [submitting, setSubmitting] = useState(false);

    // 保存草稿 - 不校验必填项
    const submitDraft = useCallback(async () => {
        if (submitting) return;

        try {
            setSubmitting(true);
            await RCreateShortStoryDraft({
                categoryIds: state.categoryIds,
                content: state.content,
                cover: state.cover,
                toutiaoCover: state.cover,
                freeRate: state.freeRate,
                title: state.title.trim(),
            });
            Message.success('草稿保存成功');
        } catch (error) {
            console.error(error);
            Message.error('保存失败，请稍后重试');
        } finally {
            setSubmitting(false);
        }
    }, [state, submitting]);

    // 下一步/提交审核 - 需要完整校验
    const submitForReview = useCallback(async () => {
        if (submitting) return;

        const title = state.title.trim();
        const content = state.content.trim();

        if (!title) {
            Message.warning('请输入短故事名称');
            return;
        }
        if (!content) {
            Message.warning('请输入故事正文');
            return;
        }
        if (content.length < 100) {
            Message.warning('故事正文至少需要100字');
            return;
        }
        if (!state.cover) {
            Message.warning('请上传封面');
            return;
        }
        if (!state.categoryIds.length) {
            Message.warning('请选择作品分类');
            return;
        }

        // TODO: 调用正式提交的 API
        Message.info('校验通过，准备进入下一步');
    }, [state, submitting]);

    return (
        <StateContext.Provider value={{ state, dispatch, submitDraft, submitForReview, submitting }}>
            <div style={{
                height: '100vh',
                background: '#FCFBFC',
            }} className="flex flex-col">
                <PublishHeader></PublishHeader>

                <EditorWrapper></EditorWrapper>
            </div>
        </StateContext.Provider>
    )

}

export default ShortStoryPublish;
