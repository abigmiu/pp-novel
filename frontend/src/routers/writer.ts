import WriterLayout from "@/components/writer/WriterLayout";
import WriteHomePage from "@/pages/writer/home/WriteHome";
import type { RouteObject } from "react-router";

const writerRoutes: RouteObject[] = [
    {
        path: '/writer',
        Component: WriterLayout,
        children: [
            {
                path: 'home',
                Component: WriteHomePage,
            }
        ]
    }
]

export default writerRoutes;