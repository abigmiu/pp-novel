/**
 * 头部用户组件，分为未登录和登录两部分
 */

import useUserStore from "@/store/userStore"
import { Avatar, Divider, Popover, } from "@arco-design/web-react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { IconCaretDown, IconExport, IconSettings } from '@arco-design/web-react/icon';
import { useNamespace } from "@/hooks/useNameSpace";
import './LayoutHeaderUserInfo.scss';
import { useMount } from "ahooks";


function UnLoginCmp() {
    const navigate = useNavigate();
    const jumpPage = (type: 'login' | 'register') => {
        navigate(`/writer/login?type=${type}`);
    }

    return (
        <>
            <span className="ml-5 cursor-pointer" onClick={() => jumpPage('login')}>登录</span>
            <span className="ml-5 cursor-pointer" onClick={() => jumpPage('register')}>注册</span>
        </>
    )
}

function LoginedCmp() {
    const userInfo = useUserStore((s) => s.userInfo)!;
    const logout = useUserStore((s) => s.logout);
    const ns = useNamespace('layout-header-userinfo')
    return (
        <Popover
            title={''}
            position="br"
            content={
                <div className={ ns.e('popover') } style={{
                    fontSize: '16px'
                }}>
                    <div className="mb-2 cursor-pointer">
                        <IconSettings />
                        <span className="ml-2">账号设置</span>
                    </div>
                    <div className="cursor-pointer" onClick={logout}>
                        <IconExport></IconExport>
                        <span className="ml-2">退出登录</span>
                    </div>
                </div>

            }
        >
            <div className="flex items-center cursor-pointer">
                <Avatar>
                    <img
                        className="object-fill"
                        src={userInfo.avatar}
                    ></img>
                </Avatar>

                <span className="ml-2 mr-2 font-18px font-">{userInfo.pseudonym}</span>

                <IconCaretDown />
            </div>
        </Popover>


    )
}

function LayoutHeaderUserInfo() {
    const hasLogin = useUserStore((s) => s.hasLogin);
    const getUserInfo = useUserStore((s) => s.getUserInfo);
    const ranRef = useRef(false);
    useMount(() => {
        if (ranRef.current) return;
        ranRef.current = true
        if (hasLogin) {
            getUserInfo();
        }
    })
    return (
        <div className="flex items-center">
            {/* <span className="mr-2" style={{ height: '16px', width: '1px', 'background': '#000000' }}></span> */}
            <div>
                {hasLogin ? <LoginedCmp /> : <UnLoginCmp />}
            </div>
        </div>

    );
}

export default LayoutHeaderUserInfo;