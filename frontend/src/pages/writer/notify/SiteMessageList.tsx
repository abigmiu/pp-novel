import React from "react";
import SiteMessageBoard from "@/components/notify/SiteMessageBoard";
import { RBatchRead, RGetWriterSiteMessages, RGetWriterUnreadCount } from "@/apis/notify";

const WriterSiteMessageList: React.FC = () => {
    return (
        <SiteMessageBoard
            title="作者站内信"
            description="查看平台审核提醒、活动通知与系统消息"
            fetcher={RGetWriterSiteMessages}
            unreadFetcher={RGetWriterUnreadCount}
            onBatchRead={RBatchRead}
            emptyHint="暂无作者站内信"
        />
    );
};

export default WriterSiteMessageList;
