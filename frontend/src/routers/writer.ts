import WriterLayout from "@/components/writer/WriterLayout";
import WriteHomePage from "@/pages/writer/home/WriteHome";
import CreateNovel from "@/pages/writer/novel/CreateNovel";
import CreateChapter from "@/pages/writer/novel/CreateChapter";
import NovelList from "@/pages/writer/novel/NovelList";
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
            },
            {
                path: 'novel/create',
                Component: CreateNovel,
            },
            {
                path: 'novel/list',
                Component: NovelList,
            },
            {
                path: 'novel/chapter/create',
                Component: CreateChapter,
            }
        ]
    },
    {
        path: '/writer/publish-short',
        Component: ShortStoryPublish,
    }
]

export default writerRoutes;
