import LayoutHeader from "../layout/LayoutHeader";
import Logo from '@/assets/logo.svg';
import LayoutHeaderUserInfo from "@/components/layout/LayoutHeaderUserInfo";
import { Link, Outlet } from "react-router";

function ReaderLayout() {
    return (
        <>
            <LayoutHeader
                left={
                    <div className="flex items-center gap-4">
                        <img src={Logo} alt='logo'></img>
                        <Link to="/" className="text-gray-600 hover:text-[rgb(var(--primary-6))]">书城</Link>
                        <Link to="/wallet" className="text-gray-600 hover:text-[rgb(var(--primary-6))]">钱包</Link>
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
