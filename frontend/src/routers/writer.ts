import WriterLayout from "@/components/writer/WriterLayout";
import WriteHomePage from "@/pages/writer/home/WriteHome";
import MyShortStory from "@/pages/writer/shortStory/MyShortStory";
import DraftList from "@/pages/writer/shortStory/DraftList";
import ShortStoryPublish from "@/pages/writer/write/ShortStory";
import type { RouteObject } from "react-router";

const writerRoutes: RouteObject[] = [
    {
        path: '/writer',
        Component: WriterLayout,
        children: [
            {
                path: 'home',
                Component: WriteHomePage,
            },
            {
                path: 'short-manage',
                Component: MyShortStory,
            },
            {
                path: 'short-draft',
                Component: DraftList,
            }
        ]
    },
    {
        path: '/writer/publish-short',
        Component: ShortStoryPublish,
    }
]

export default writerRoutes;
