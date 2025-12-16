import { Button } from "@arco-design/web-react";
import type React from "react";

const EmptyBlock: React.FC = () => {
    return <div
        className="flex flex-col items-center justify-center"
        style={{
            height: '600px'
        }}>
        <div>
            <img
                style={{
                    width: '120px'
                }}
                src="https://lf3-static.bytednsdoc.com/obj/eden-cn/8172eh7uhfps/serial_author/empty.png" alt="" />
        </div>
        <span className="text-gray">还没有创建作品</span>
        <Button type='primary' shape='round' className="mt-2">&nbsp;&nbsp;去写作&nbsp;&nbsp;</Button>
    </div>
}

const MyShortStory: React.FC = () => {
    return (
        <div className="serial-card serial-card-small">
            <h3>我的短故事</h3>

            <EmptyBlock></EmptyBlock>
        </div>
    );
}

export default MyShortStory;