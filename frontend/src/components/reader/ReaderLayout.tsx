import { useEffect, useState } from "react";
import { Badge } from "@arco-design/web-react";
import LayoutHeader from "../layout/LayoutHeader";
import Logo from '@/assets/logo.svg';
import LayoutHeaderUserInfo from "@/components/layout/LayoutHeaderUserInfo";
import { Link, Outlet } from "react-router";
import { RGetReaderUnreadCount, ZUnreadCount } from "@/apis/notify";

function ReaderLayout() {
    const [unreadCount, setUnreadCount] = useState<number>(0);

    const fetchUnread = async () => {
        try {
            const res = await RGetReaderUnreadCount();
            const parsed = ZUnreadCount.safeParse(res);
            setUnreadCount(parsed.success ? parsed.data.count : 0);
        } catch (error) {
            console.error(error);
            setUnreadCount(0);
        }
    };

    useEffect(() => {
        fetchUnread();
    }, []);

    return (
        <>
            <LayoutHeader
                left={
                    <div className="flex items-center gap-4">
                        <img src={Logo} alt='logo'></img>
                        <Link to="/" className="text-gray-600 hover:text-[rgb(var(--primary-6))]">书城</Link>
                        <Link to="/wallet" className="text-gray-600 hover:text-[rgb(var(--primary-6))]">钱包</Link>
                        <Badge count={unreadCount} maxCount={99}>
                            <Link to="/reader/messages" className="text-gray-600 hover:text-[rgb(var(--primary-6))]">消息</Link>
                        </Badge>
                    </div>
                }
                right={
                    <div>
                        <LayoutHeaderUserInfo></LayoutHeaderUserInfo>
                    </div>
                }
            >

            </LayoutHeader>

            <div
                className="container mx-auto"
                style={{
                    paddingTop: '100px',
                    paddingBottom: '40px'
                }}
            >
                <Outlet />
            </div>

        </>
    )
}

export default ReaderLayout;
