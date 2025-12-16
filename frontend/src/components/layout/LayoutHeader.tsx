import type { ReactNode } from "react";
import { useNamespace } from "@/hooks/useNameSpace";
import './LayoutHeader.scss'

interface ILayoutHeaderProps {
    left: ReactNode,
    right: ReactNode,
}

function LayoutHeader({ left, right }: ILayoutHeaderProps) {
    const ns = useNamespace('layout-header');
    return (
        <div className={`${ns.b()}`}>
            <div className={`${ns.e('wrapper')}`}>
                <header className={`container mx-auto  flex justify-between items-center h-full`}>
                    {/* left */}
                    <div>{left}</div>

                    {/* right */}
                    <div>{right}</div>
                </header>
            </div>
        </div>


    )

}

export default LayoutHeader;