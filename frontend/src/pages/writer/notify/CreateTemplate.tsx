import React, { useEffect, useMemo, useState } from "react";
import {
    Button,
    Checkbox,
    Divider,
    Form,
    Input,
    Message,
    Select,
    Space,
    Typography,
} from "@arco-design/web-react";
import { IconArrowLeft, IconInfoCircle } from "@arco-design/web-react/icon";
import { useNavigate } from "react-router";
import * as z from "zod";
import {
    RCreateNotifyTemplate,
    RGetNotifyTemplateTypes,
    type IRCreateNotifyTemplateReq,
    type IRNotifyTemplateType,
    ZNotifyTemplateType,
} from "@/apis/notify";
import { useNamespace } from "@/hooks/useNameSpace";
import { ClientBusinessRequestError } from "@/utils/errors";
import "./CreateTemplate.scss";

const { TextArea } = Input;
const { Text } = Typography;

const channelOptions = [
    { label: "站内信", value: 1, hint: "登录后在站内通知中心展示" },
    { label: "WS", value: 2, hint: "实时 WebSocket 推送" },
    { label: "邮件", value: 4, hint: "通过用户邮箱发送通知" },
    { label: "短信", value: 8, hint: "通过短信触达用户" },
];

const CreateTemplatePage: React.FC = () => {
    const ns = useNamespace("notify-template");
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const [typeOptions, setTypeOptions] = useState<IRNotifyTemplateType[]>([]);
    const [typeLoading, setTypeLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [selectedChannels, setSelectedChannels] = useState<number[]>([]);

    const channelMask = useMemo(
        () => selectedChannels.reduce((sum, item) => sum + Number(item || 0), 0),
        [selectedChannels]
    );

    useEffect(() => {
        form.setFieldsValue({ channels: [] });
        fetchTemplateTypes();
    }, []);

    const fetchTemplateTypes = async () => {
        setTypeLoading(true);
        try {
            const res = await RGetNotifyTemplateTypes();
            const parsed = z.array(ZNotifyTemplateType).safeParse(res);
            if (!parsed.success) {
                throw new Error("模板类型数据格式异常");
            }
            setTypeOptions(parsed.data);
        } catch (error) {
            console.error(error);
            Message.error("获取模板类型失败，请稍后重试");
            setTypeOptions([]);
        } finally {
            setTypeLoading(false);
        }
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validate();
            if (!selectedChannels.length) {
                Message.warning("请选择至少一个消息通道");
                return;
            }
            const payload: IRCreateNotifyTemplateReq = {
                name: values.name.trim(),
                type: values.type,
                channelMask,
                titleTpl: values.titleTpl.trim(),
                contentTpl: values.contentTpl.trim(),
            };

            setSubmitting(true);
            await RCreateNotifyTemplate(payload);
            Message.success("模板创建成功");
            setSelectedChannels([]);
            form.resetFields();
        } catch (error) {
            if (error instanceof ClientBusinessRequestError) {
                Message.error(error.message || "创建失败");
            } else if (error instanceof Error && error.message) {
                Message.error(error.message);
            } else {
                console.error(error);
                Message.error("创建失败，请稍后再试");
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={ns.b("")}>
            <div className="serial-card serial-card-large">
                <div className={ns.e("header")}>
                    <div className="flex items-center">
                        <Button type="text" icon={<IconArrowLeft />} onClick={() => navigate(-1)}>
                            返回
                        </Button>
                        <div className={ns.e("title")}>创建消息通知模板</div>
                    </div>
                    <Text type="secondary">根据业务类型配置多通道消息模板</Text>
                </div>

                <Divider style={{ margin: "16px 0 24px" }} />

                <Form
                    layout="vertical"
                    form={form}
                    className={ns.e("form")}
                    initialValues={{
                        name: "",
                        type: undefined,
                        titleTpl: "",
                        contentTpl: "",
                        channels: [],
                    }}
                >
                    <Form.Item
                        label="展示名称"
                        field="name"
                        rules={[{ required: true, message: "请输入展示名称" }]}
                    >
                        <Input placeholder="例如：章节更新提醒" allowClear />
                    </Form.Item>

                    <Form.Item
                        label="业务类型"
                        field="type"
                        rules={[{ required: true, message: "请选择业务类型" }]}
                    >
                        <Select
                            allowClear
                            placeholder="选择模板对应的业务"
                            loading={typeLoading}
                        >
                            {typeOptions.map((item) => (
                                <Select.Option key={item.value} value={item.value}>
                                    {item.label}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label={
                            <div className="flex items-center">
                                <span>消息通道</span>
                                <IconInfoCircle style={{ marginLeft: 6 }} />
                            </div>
                        }
                        field="channels"
                        rules={[
                            {
                                validator: (value, callback) => {
                                    if ((value as number[] | undefined)?.length) {
                                        callback();
                                    } else {
                                        callback("请选择至少一个消息通道");
                                    }
                                },
                            },
                        ]}
                    >
                        <Checkbox.Group
                            value={selectedChannels}
                            onChange={(vals) => {
                                const arr = (vals as (string | number)[]).map((v) => Number(v));
                                setSelectedChannels(arr);
                                form.setFieldValue("channels", arr);
                            }}
                        >
                            <Space direction="vertical" size={12} className={ns.e("channels")}>
                                {channelOptions.map((item) => (
                                    <div key={item.value} className={ns.e("channel-item")}>
                                        <Checkbox value={item.value}>
                                            <div className={ns.e("channel-label")}>{item.label}</div>
                                            <Text type="secondary">{item.hint}</Text>
                                        </Checkbox>
                                        <Text type="secondary" className={ns.e("channel-code")}>
                                            通道码 {item.value}
                                        </Text>
                                    </div>
                                ))}
                            </Space>
                        </Checkbox.Group>
                        <Text type="secondary" className={ns.e("mask-tip")}>
                            已选择通道码：{channelMask || "未选择"}（多选相加为 channelMask）
                        </Text>
                    </Form.Item>

                    <Form.Item
                        label="标题模板"
                        field="titleTpl"
                        rules={[{ required: true, message: "请输入标题模板" }]}
                    >
                        <Input placeholder="例如：{user}，你的作品有新章节啦" allowClear />
                    </Form.Item>

                    <Form.Item
                        label={
                            <div className="flex items-center">
                                <span>内容模板</span>
                                <Text type="secondary" style={{ marginLeft: 8 }}>
                                    可使用占位符，例如 {`{bookName}`}、{`{chapterTitle}`}
                                </Text>
                            </div>
                        }
                        field="contentTpl"
                        rules={[{ required: true, message: "请输入内容模板" }]}
                    >
                        <TextArea
                            placeholder="尊敬的{user}，您的作品《{bookName}》有新章节《{chapterTitle}》，点击查看"
                            autoSize={{ minRows: 4, maxRows: 8 }}
                            maxLength={500}
                            showWordLimit
                        />
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button onClick={() => navigate(-1)}>取消</Button>
                            <Button type="primary" loading={submitting} onClick={handleSubmit}>
                                创建模板
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default CreateTemplatePage;
