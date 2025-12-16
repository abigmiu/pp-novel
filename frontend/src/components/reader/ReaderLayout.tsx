import LayoutHeader from "../layout/LayoutHeader";
import Logo from '@/assets/logo.svg';
import LayoutHeaderUserInfo from "@/components/layout/LayoutHeaderUserInfo";
function ReaderLayout() {
    return (
        <>
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

            <div className="container mx-auto">

            </div>

        </>
    )
}

export default ReaderLayout;