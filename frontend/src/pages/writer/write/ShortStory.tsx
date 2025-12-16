import { Button } from "@arco-design/web-react";
import { IconArrowLeft } from "@arco-design/web-react/icon";
import React, { createContext, useContext, useEffect, useReducer, useRef } from "react";
import { keymap } from "prosemirror-keymap";
import { baseKeymap } from "prosemirror-commands";

import { Schema } from 'prosemirror-model';
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Plugin } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";

import './ShortStory.scss'

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

const setupEditor = (el: HTMLElement) => {

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

    // 创建编辑器视图实例，并挂在到 el 上
    const editorView = new EditorView(el, {
        state: editorState
    })

    console.log('editorView', editorView)
    return editorView;
}


// 写短故事
type IEditState = {
    title: string;
}
type IEditAction =
    | { type: 'SET_TITLE'; payload: string }


function editorReducer(state: IEditState, action: IEditAction): IEditState {
    switch (action.type) {
        case "SET_TITLE":
            return {
                ...state,
                title: action.payload.slice(0, 25) // 双保险
            }
        default:
            return state
    }
}

const StateContext = createContext<{
    state: IEditState,
    dispatch: React.Dispatch<IEditAction>
} | null>(null);

const PublishHeader: React.FC = () => {
    const ctx = useContext(StateContext);
    if (!ctx) return;
    return (
        <div style={{
            background: '#fff',
            height: '60px',
            paddingLeft: '20px',
            paddingRight: '20px'
        }} className="flex justify-between">
            <div className="flex items-center">
                <IconArrowLeft />
                <div className="ml-4">
                    <div>{ctx.state.title || '未命名短故事'}</div>
                    <div className="text-gray">已保存 正文字数 19</div>
                </div>
            </div>
            <div className="flex items-center">
                <Button shape="round">存草稿</Button>
                <Button className="ml-6" type="outline" shape="round">下一步</Button>
            </div>


        </div>
    )
}

const Editor: React.FC = () => {
    const ctx = useContext(StateContext);
    const editorRef = useRef<HTMLDivElement | null>(null)
    const viewRef = useRef<EditorView | null>(null);

    useEffect(() => {
        if (!editorRef.current) return
        viewRef.current = setupEditor(editorRef.current)
        return () => {
            viewRef.current?.destroy();
            viewRef.current = null;
        };
    }, [])
    if (!ctx) return;
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

const EditorWrapper: React.FC = () => {
    return (
        <div className="bg-white mx-auto mt-10 serial-card serial-card-normal" style={{
            width: '1000px'
        }}>
            <Editor></Editor>
        </div>
    )
}

const ShortStoryPublish: React.FC = () => {
    const [state, dispatch] = useReducer(editorReducer, {
        title: ""
    })
    return (
        <StateContext.Provider value={{ state, dispatch }}>
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