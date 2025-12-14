import LayoutHeader from "@/components/layout/LayoutHeader";
import { useNamespace } from "@/hooks/useNameSpace";
import WhiteLogo from '@/assets/logo-light.png';
import './login.scss';
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { Input, Form, Checkbox, Button, Message } from "@arco-design/web-react";
import { RGetRegisterCode, RLogin, RRegister } from "@/apis/auth";
import { ClientBusinessRequestError } from "@/utils/errors";
import useUserStore from "@/store/userStore";
import { useNavigate, useSearchParams } from "react-router";

function HeaderLeft() {
    return (
        <div className="flex items-center text-white">
            <img src={WhiteLogo} alt='logo' style={{ width: '130px' }}></img>
            <span style={{
                marginLeft: '20px',
                height: '16px',
                width: '1px',
                backgroundColor: '#ffffff',
            }}></span>
            <span className="text-white ml-4">
                作家专区
            </span>
        </div>
    )
}

function HeaderRight() {
    return (
        <div className="flex items-center text-white">
            <span>番茄小说网</span>
            <span className="ml-10">作家课堂</span>
            <span className="ml-10">作家福利</span>
        </div>
    )
}

function AccountLogin() {
    const ns = useNamespace('writer-login');
    const [searchParams] = useSearchParams();

    let type = searchParams.get('type');

    const [currentType, setCurrentType] = useState<'login' | 'register'>(type === 'register' ? 'register' : 'login');

    const [isRequestCode, setIsRequestCode] = useState<boolean>(false);
    const [isCountdown, setIsCountDown] = useState<boolean>(false);
    const [countdown, setCountDown] = useState<number>(60);

    const [checked, setChecked] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [form] = Form.useForm();

    const userStore = useUserStore();
    const navigate = useNavigate();


    let timerRef = useRef<number | undefined>(undefined);

    const clearCountdown = () => {
        setIsCountDown(false);
        setCountDown(60);
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

    }

    useEffect(() => {
        if (!isCountdown) return;
        if (countdown <= 0) {
            clearCountdown();
            return;
        }

        const timer = setTimeout(() => {
            setCountDown(c => c - 1);
        }, 1000);

        // 清理定时器（防止内存泄漏）
        return () => clearTimeout(timer);
    }, [isCountdown, countdown])

    // TODO: 表单校验
    const onCodeClick = async () => {
        const formData = form.getFieldsValue();
        if (isCountdown || isRequestCode) return;
        setIsRequestCode(true);

        try {
            await RGetRegisterCode({
                email: formData.email,
            })

            setIsCountDown(true);
        } catch (e) {
            if (e instanceof ClientBusinessRequestError) {
                Message.error(e.data.msg);
            } else {
                Message.error('请求错误');
            }
        } finally {
            setIsRequestCode(false);
        }

    }

    const GetCodeEl = () => {
        return (
            <span
                className={
                    clsx(
                        isRequestCode || isCountdown && ns.em('code', 'disabled'),
                        ns.e('code')
                    )
                }
                onClick={onCodeClick}
            >
                {
                    isCountdown ? `${countdown}s后获取` : '获取验证码'
                }
            </span>
        )
    }

    // TODO: 表单校验
    const onLogin = async () => {
        const formData = form.getFieldsValue();
        setLoading(true);
        try {
            const res = await RLogin({
                email: formData.email,
                password: formData.password,
            })


            userStore.setToken(res.token);
            await userStore.getUserInfo();
            // await userStore.getUserFansFollowStat();
            navigate('/', { replace: true });
        } catch (e) {
            console.log(e);
            if (e instanceof ClientBusinessRequestError) {
                Message.error(e.data.msg);
            } else {
                Message.error('请求错误');
            }
            setLoading(false);
        }
    }

    // TODO: 表单校验
    const onRegister = async () => {
        const formData = form.getFieldsValue();
        setLoading(true);
        try {
            const res = await RRegister({
                email: formData.email,
                password: formData.password,
                code: formData.code,
            })
            userStore.setToken(res.token);

            navigate('/', { replace: true });
        } catch (e) {
            if (e instanceof ClientBusinessRequestError) {
                Message.error(e.data.msg);
            } else {
                Message.error('请求错误')
            }
            setLoading(false);
        }
    }

    return (
        <div>
            {
                currentType === 'login' && (
                    <Form
                        form={form}
                        autoComplete='off'
                        layout='vertical'
                    >

                        <Form.Item field='email'>
                            <Input
                                style={{
                                    height: '48px'
                                }}
                                size="large"
                                placeholder="邮箱"
                            ></Input>

                        </Form.Item>
                        <Form.Item field='password'>
                            <Input
                                style={{
                                    height: '48px'
                                }}
                                size="large"
                                placeholder="请输入密码"

                            ></Input>
                        </Form.Item>

                        <Form.Item>
                            <Checkbox checked={checked} onChange={(checked) => {
                                setChecked(checked);
                            }}>我已阅读并同意 用户协议 和 隐私政策</Checkbox>
                        </Form.Item>

                        <Form.Item>
                            <Button
                                size='large'
                                type="primary"
                                long
                                onClick={onLogin}
                                loading={loading}
                            >登录</Button>
                        </Form.Item>
                        <Form.Item>
                            <Button
                                size='large'
                                long
                                onClick={() => setCurrentType('register')}
                            >注册</Button>
                        </Form.Item>
                    </Form>
                )
            }
            {
                currentType === 'register' && (
                    <Form
                        autoComplete='off'
                        layout='vertical'
                        form={form}
                    >

                        <Form.Item field='email'>
                            <Input
                                style={{
                                    height: '48px'
                                }}
                                size="large"
                                placeholder="邮箱"
                            ></Input>

                        </Form.Item>
                        <Form.Item field='password'>
                            <Input
                                style={{
                                    height: '48px'
                                }}
                                size="large"
                                placeholder="请输入密码"

                            ></Input>
                        </Form.Item>
                        <Form.Item field='code'>
                            <Input
                                style={{
                                    height: '48px'
                                }}
                                size="large"
                                placeholder="请输入验证码"
                                suffix={<GetCodeEl />}
                            ></Input>
                        </Form.Item>

                        <Form.Item>
                            <Checkbox checked={checked} onChange={(checked) => {
                                setChecked(checked);
                            }}>我已阅读并同意 用户协议 和 隐私政策</Checkbox>
                        </Form.Item>

                        <Form.Item>
                            <Button
                                size='large'
                                type="primary"
                                long
                                loading={loading}
                                onClick={() => onRegister()}
                            >注册</Button>
                        </Form.Item>

                        <Form.Item>
                            <Button
                                size='large'
                                long
                                onClick={() => setCurrentType('login')}
                            >登录</Button>
                        </Form.Item>
                    </Form>
                )
            }
        </div>
    )
}

function QrcodeLogin() {
    return (
        <div >
            <img style={{
                display: 'block',
                height: '200px',
                width: '200px',
                margin: '50px auto'
            }} src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgo8cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2ZmZmZmZiIvPgo8ZGVmcz4KPHJlY3QgaWQ9InAiIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMiIgLz4KPC9kZWZzPgo8Zz4KPHVzZSB4PSIyNCIgeT0iMjQiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjM2IiB5PSIyNCIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iNDgiIHk9IjI0IiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSI2MCIgeT0iMjQiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjcyIiB5PSIyNCIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iODQiIHk9IjI0IiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSI5NiIgeT0iMjQiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjEyMCIgeT0iMjQiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjE1NiIgeT0iMjQiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjE2OCIgeT0iMjQiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjE5MiIgeT0iMjQiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjIwNCIgeT0iMjQiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjIxNiIgeT0iMjQiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjIyOCIgeT0iMjQiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjI0MCIgeT0iMjQiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjI1MiIgeT0iMjQiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjI2NCIgeT0iMjQiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjI0IiB5PSIzNiIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iOTYiIHk9IjM2IiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIxMjAiIHk9IjM2IiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIxMzIiIHk9IjM2IiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIxNTYiIHk9IjM2IiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIxOTIiIHk9IjM2IiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIyNjQiIHk9IjM2IiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIyNCIgeT0iNDgiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjQ4IiB5PSI0OCIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iNjAiIHk9IjQ4IiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSI3MiIgeT0iNDgiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9Ijk2IiB5PSI0OCIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iMTIwIiB5PSI0OCIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iMTY4IiB5PSI0OCIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iMTkyIiB5PSI0OCIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iMjE2IiB5PSI0OCIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iMjI4IiB5PSI0OCIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iMjQwIiB5PSI0OCIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iMjY0IiB5PSI0OCIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iMjQiIHk9IjYwIiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSI0OCIgeT0iNjAiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjYwIiB5PSI2MCIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iNzIiIHk9IjYwIiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSI5NiIgeT0iNjAiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjEyMCIgeT0iNjAiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjEzMiIgeT0iNjAiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjE1NiIgeT0iNjAiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjE2OCIgeT0iNjAiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjE5MiIgeT0iNjAiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjIxNiIgeT0iNjAiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjIyOCIgeT0iNjAiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjI0MCIgeT0iNjAiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjI2NCIgeT0iNjAiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjI0IiB5PSI3MiIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iNDgiIHk9IjcyIiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSI2MCIgeT0iNzIiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjcyIiB5PSI3MiIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iOTYiIHk9IjcyIiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIxMjAiIHk9IjcyIiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIxMzIiIHk9IjcyIiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIxNDQiIHk9IjcyIiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIxNTYiIHk9IjcyIiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIxOTIiIHk9IjcyIiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIyMTYiIHk9IjcyIiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIyMjgiIHk9IjcyIiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIyNDAiIHk9IjcyIiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIyNjQiIHk9IjcyIiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIyNCIgeT0iODQiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9Ijk2IiB5PSI4NCIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iMTQ0IiB5PSI4NCIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iMTU2IiB5PSI4NCIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iMTY4IiB5PSI4NCIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iMTkyIiB5PSI4NCIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iMjY0IiB5PSI4NCIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iMjQiIHk9Ijk2IiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIzNiIgeT0iOTYiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjQ4IiB5PSI5NiIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iNjAiIHk9Ijk2IiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSI3MiIgeT0iOTYiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9Ijg0IiB5PSI5NiIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iOTYiIHk9Ijk2IiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIxMjAiIHk9Ijk2IiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIxNDQiIHk9Ijk2IiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIxNjgiIHk9Ijk2IiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIxOTIiIHk9Ijk2IiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIyMDQiIHk9Ijk2IiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIyMTYiIHk9Ijk2IiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIyMjgiIHk9Ijk2IiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIyNDAiIHk9Ijk2IiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIyNTIiIHk9Ijk2IiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIyNjQiIHk9Ijk2IiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIxMjAiIHk9IjEwOCIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iMTMyIiB5PSIxMDgiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjM2IiB5PSIxMjAiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjQ4IiB5PSIxMjAiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjcyIiB5PSIxMjAiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9Ijk2IiB5PSIxMjAiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjEwOCIgeT0iMTIwIiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIxMzIiIHk9IjEyMCIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iMTU2IiB5PSIxMjAiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjE2OCIgeT0iMTIwIiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIxOTIiIHk9IjEyMCIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iMjE2IiB5PSIxMjAiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjIyOCIgeT0iMTIwIiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIyNDAiIHk9IjEyMCIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iMjUyIiB5PSIxMjAiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjI2NCIgeT0iMTIwIiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIyNCIgeT0iMTMyIiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIzNiIgeT0iMTMyIiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSI3MiIgeT0iMTMyIiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIxMjAiIHk9IjEzMiIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iMTQ0IiB5PSIxMzIiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjE2OCIgeT0iMTMyIiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIxODAiIHk9IjEzMiIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iMjA0IiB5PSIxMzIiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjIyOCIgeT0iMTMyIiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIyNjQiIHk9IjEzMiIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iMjQiIHk9IjE0NCIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iNzIiIHk9IjE0NCIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iODQiIHk9IjE0NCIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iOTYiIHk9IjE0NCIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iMTQ0IiB5PSIxNDQiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjE1NiIgeT0iMTQ0IiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIxNjgiIHk9IjE0NCIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iMTgwIiB5PSIxNDQiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjE5MiIgeT0iMTQ0IiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIyMDQiIHk9IjE0NCIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iMjQiIHk9IjE1NiIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iNzIiIHk9IjE1NiIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iODQiIHk9IjE1NiIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iMTA4IiB5PSIxNTYiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjE0NCIgeT0iMTU2IiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIxNTYiIHk9IjE1NiIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iMTgwIiB5PSIxNTYiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjIwNCIgeT0iMTU2IiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIyMTYiIHk9IjE1NiIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iMjI4IiB5PSIxNTYiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjI0MCIgeT0iMTU2IiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIyNTIiIHk9IjE1NiIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iMjY0IiB5PSIxNTYiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjI0IiB5PSIxNjgiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjYwIiB5PSIxNjgiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9Ijg0IiB5PSIxNjgiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9Ijk2IiB5PSIxNjgiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjEwOCIgeT0iMTY4IiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIxNjgiIHk9IjE2OCIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iMTgwIiB5PSIxNjgiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjE5MiIgeT0iMTY4IiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIyMDQiIHk9IjE2OCIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iMjUyIiB5PSIxNjgiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjI2NCIgeT0iMTY4IiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIxMjAiIHk9IjE4MCIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iMTMyIiB5PSIxODAiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjE0NCIgeT0iMTgwIiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIxNjgiIHk9IjE4MCIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iMTkyIiB5PSIxODAiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjIwNCIgeT0iMTgwIiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIyMjgiIHk9IjE4MCIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iMjUyIiB5PSIxODAiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjI2NCIgeT0iMTgwIiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIyNCIgeT0iMTkyIiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIzNiIgeT0iMTkyIiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSI0OCIgeT0iMTkyIiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSI2MCIgeT0iMTkyIiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSI3MiIgeT0iMTkyIiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSI4NCIgeT0iMTkyIiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSI5NiIgeT0iMTkyIiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIxMjAiIHk9IjE5MiIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iMTMyIiB5PSIxOTIiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjE1NiIgeT0iMTkyIiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIxNjgiIHk9IjE5MiIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iMjE2IiB5PSIxOTIiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjIyOCIgeT0iMTkyIiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIyNDAiIHk9IjE5MiIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iMjUyIiB5PSIxOTIiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjI0IiB5PSIyMDQiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9Ijk2IiB5PSIyMDQiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjE0NCIgeT0iMjA0IiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIxOTIiIHk9IjIwNCIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iMjA0IiB5PSIyMDQiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjIxNiIgeT0iMjA0IiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIyNDAiIHk9IjIwNCIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iMjUyIiB5PSIyMDQiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjI2NCIgeT0iMjA0IiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIyNCIgeT0iMjE2IiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSI0OCIgeT0iMjE2IiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSI2MCIgeT0iMjE2IiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSI3MiIgeT0iMjE2IiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSI5NiIgeT0iMjE2IiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIxMjAiIHk9IjIxNiIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iMTMyIiB5PSIyMTYiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjE0NCIgeT0iMjE2IiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIxNjgiIHk9IjIxNiIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iMTkyIiB5PSIyMTYiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjI1MiIgeT0iMjE2IiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIyNjQiIHk9IjIxNiIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iMjQiIHk9IjIyOCIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iNDgiIHk9IjIyOCIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iNjAiIHk9IjIyOCIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iNzIiIHk9IjIyOCIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iOTYiIHk9IjIyOCIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iMTMyIiB5PSIyMjgiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjE0NCIgeT0iMjI4IiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIxNTYiIHk9IjIyOCIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iMTgwIiB5PSIyMjgiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjI1MiIgeT0iMjI4IiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIyNCIgeT0iMjQwIiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSI0OCIgeT0iMjQwIiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSI2MCIgeT0iMjQwIiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSI3MiIgeT0iMjQwIiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSI5NiIgeT0iMjQwIiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIxMjAiIHk9IjI0MCIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iMTMyIiB5PSIyNDAiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjE1NiIgeT0iMjQwIiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIxODAiIHk9IjI0MCIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iMTkyIiB5PSIyNDAiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjIyOCIgeT0iMjQwIiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIyNDAiIHk9IjI0MCIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iMjY0IiB5PSIyNDAiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjI0IiB5PSIyNTIiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9Ijk2IiB5PSIyNTIiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjEyMCIgeT0iMjUyIiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIxMzIiIHk9IjI1MiIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iMTQ0IiB5PSIyNTIiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjE1NiIgeT0iMjUyIiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIxNjgiIHk9IjI1MiIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iMTgwIiB5PSIyNTIiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjIyOCIgeT0iMjUyIiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIyNDAiIHk9IjI1MiIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iMjUyIiB5PSIyNTIiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjI0IiB5PSIyNjQiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjM2IiB5PSIyNjQiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjQ4IiB5PSIyNjQiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjYwIiB5PSIyNjQiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjcyIiB5PSIyNjQiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9Ijg0IiB5PSIyNjQiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9Ijk2IiB5PSIyNjQiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjE0NCIgeT0iMjY0IiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIxNTYiIHk9IjI2NCIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iMTgwIiB5PSIyNjQiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjE5MiIgeT0iMjY0IiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIyMTYiIHk9IjI2NCIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+Cjx1c2UgeD0iMjQwIiB5PSIyNjQiIHhsaW5rOmhyZWY9IiNwIiBmaWxsPSIjMDAwMDAwIiAvPgo8dXNlIHg9IjI1MiIgeT0iMjY0IiB4bGluazpocmVmPSIjcCIgZmlsbD0iIzAwMDAwMCIgLz4KPHVzZSB4PSIyNjQiIHk9IjI2NCIgeGxpbms6aHJlZj0iI3AiIGZpbGw9IiMwMDAwMDAiIC8+CjwvZz4KPC9zdmc+" />
        </div>
    )
}

function MainSection() {
    const ns = useNamespace('writer-login');
    type ITab = 'account' | 'qrcode';
    const [selectedTab, setSelectedTab] = useState<ITab>('account');


    return (
        <main className="absolute top-0 left-0 right-0 bottom-0 flex justify-end items-center">
            <div className={`${ns.e('form-wrapper')} bg-white `}>
                <div className={`${ns.e('tab-wrapper')}`}>
                    <span
                        onClick={() => setSelectedTab('account')}
                        className={
                            clsx(
                                ns.e('tab'),
                                selectedTab === 'account' && ns.em('tab', 'active'))
                        }>账号密码登录</span>
                    <span
                        onClick={() => setSelectedTab('qrcode')}
                        className={
                            clsx(
                                ns.e('tab'),
                                selectedTab === 'qrcode' && ns.em('tab', 'active'))
                        }>扫码登录</span>
                </div>

                {
                    selectedTab === 'account'
                    && <AccountLogin></AccountLogin>
                }

                {
                    selectedTab === 'qrcode'
                    && <QrcodeLogin></QrcodeLogin>
                }
            </div>
        </main>
    )
}

function WriterLoginPage() {
    const ns = useNamespace('writer-login');
    return (
        <div className={`h-100vh relative ${ns.b()}`}>
            <div className="absolute top-0 left-0 right-0 bottom-0 index-0">
                <video
                    loop={true}
                    muted
                    autoPlay
                    className="h-full w-full object-cover"
                    src="http://qiniu.deffun.top/videos/welcome.mp4"
                ></video>
            </div>

            <div className="absolute top-0 left-0 right-0 w-900px mx-auto">
                <LayoutHeader
                    left={
                        <HeaderLeft />
                    }
                    right={
                        <HeaderRight />
                    }
                ></LayoutHeader>


            </div>

            <MainSection></MainSection>

            <footer className="absolute left-0 right-0 bottom-20px text-size-12px text-center text-white">
                © 2025 xxx有限公司
            </footer>

        </div>
    );

}

export default WriterLoginPage;