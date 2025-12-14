import LayoutHeader from "../layout/LayoutHeader";
import Logo from '@/assets/logo.svg';
import LayoutHeaderUserInfo from "@/components/layout/LayoutHeaderUserInfo";
function ReaderLayout() {
    return (
        <div className="container mx-auto">
            <LayoutHeader
                left={
                    <img src={Logo} alt='logo'></img>
                }
                right={
                    <div>
                        <LayoutHeaderUserInfo></LayoutHeaderUserInfo>
                    </div>
                }
            >

            </LayoutHeader>
        </div>
    )
}

export default ReaderLayout;