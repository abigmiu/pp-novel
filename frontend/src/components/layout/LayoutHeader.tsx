import type { ReactNode } from "react";
import { useNamespace } from "@/hooks/useNameSpace";
import './LayoutHeader.scss'

interface ILayoutHeaderProps {
    left: ReactNode,
    right: ReactNode,
}

function LayoutHeader({ left,  right }: ILayoutHeaderProps) {
    const ns = useNamespace('layout-header');
    return (
        <header className={`flex justify-between items-center ${ns.b()}`}>
            {/* left */}
            <div>{ left }</div>
           
            {/* right */}
            <div>{ right }</div>
        </header>
    )

}

export default LayoutHeader;