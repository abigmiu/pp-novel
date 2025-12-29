import React from "react";
import SiteMessageBoard from "@/components/notify/SiteMessageBoard";
import { RBatchRead, RGetReaderSiteMessages, RGetReaderUnreadCount } from "@/apis/notify";

const ReaderMessagesPage: React.FC = () => {
    return (
        <div style={{ maxWidth: 940, margin: "0 auto" }}>
            <SiteMessageBoard
                title="站内信中心"
                description="查看平台为读者推送的系统通知、更新提醒等消息"
                fetcher={RGetReaderSiteMessages}
                unreadFetcher={RGetReaderUnreadCount}
                onBatchRead={RBatchRead}
                emptyHint="暂无站内信"
            />
        </div>
    );
};

export default ReaderMessagesPage;
