import ReaderLayout from "@/components/reader/ReaderLayout";
import ReaderIndex from "@/pages/reader";
import WriterLoginPage from "@/pages/writer/login";
import { createBrowserRouter } from "react-router";
import writerRoutes from "./writer";

const router = createBrowserRouter([
    {
        // path: '/',
        Component: ReaderLayout,
        children: [
            {
                path: '/',
                Component: ReaderIndex,
            }
        ]
    },
    {
        path: '/writer/login',
        Component: WriterLoginPage,
    },
    ...writerRoutes,
])

export default router;