import ReaderLayout from "@/components/reader/ReaderLayout";
import ReaderIndex from "@/pages/reader";
import WalletPage from "@/pages/reader/wallet";
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
            },
            {
                path: '/reader',
                Component: ReaderIndex,
            },
            {
                path: '/wallet',
                Component: WalletPage,
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
