import LayoutHeader from "../layout/LayoutHeader";
import Logo from '@/assets/logo.svg';
import LayoutHeaderUserInfo from "@/components/layout/LayoutHeaderUserInfo";
import { useNamespace } from "@/hooks/useNameSpace";
import { Divider } from "@arco-design/web-react";
import type { ReactNode } from "react";
import type React from "react";
import { Link, Outlet, useNavigate } from "react-router";
import './WriteLayout.scss';
import { IconUp } from "@arco-design/web-react/icon";

const LayoutMenu: React.FC = () => {
    // 这里应该是通过icon + 数组渲染， 懒得做
    const ns = useNamespace('writer-layout')

    const navigate = useNavigate()


    return (
        <div className={`serial-card serial-card-small `} style={{ width: '240px', marginRight: '20px', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto', 'scrollbarWidth': 'none', position: 'fixed' }}>
            <div className={`${ns.e('menu-item')}`} onClick={() => navigate('/writer/home')}>
                <div className={`${ns.e('menu-item-icon')}`}>
                    <img src="data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTg0OS4yMzcgMTM2LjUzM2M0OC4yNiAwIDg3LjM4MiAzOS4xOTMgODcuMzgyIDg3LjU0djQ1Ni44NWMwIDQ4LjM0Ni0zOS4xMjIgODcuNTQtODcuMzgyIDg3LjU0bC0zMDcuMi0uMDAydjYxLjU1M2gyNDcuMTI2djYwLjE4M0gyMzQuODM3di02MC4xODNoMjQ3LjEyNlY3NjguNDZsLTMwNy4yLjAwMWMtNDguMjYgMC04Ny4zODItMzkuMTkzLTg3LjM4Mi04Ny41NFYyMjQuMDczYzAtNDguMzQ3IDM5LjEyMi04Ny41NCA4Ny4zODItODcuNTRoNjc0LjQ3NHptMCA2MC4xODRIMTc0Ljc2M2MtMTUuMDgxIDAtMjcuMzA3IDEyLjI0OC0yNy4zMDcgMjcuMzU2djQ1Ni44NWMwIDE1LjEwOCAxMi4yMjYgMjcuMzU1IDI3LjMwNyAyNy4zNTVoNjc0LjQ3NGMxNS4wODEgMCAyNy4zMDctMTIuMjQ3IDI3LjMwNy0yNy4zNTZWMjI0LjA3M2MwLTE1LjEwOC0xMi4yMjYtMjcuMzU2LTI3LjMwNy0yNy4zNTZ6TTcxNi44IDM0OS41MjVsNDIuNDggNDIuNTU3TDY0NS44NzUgNTA1LjY5Yy0zNy4zMjQgMzcuMzkyLTk3LjgzNyAzNy4zOTItMTM1LjE2IDBsLTUyLjcyNy01Mi44MjFjLTEzLjg2My0xMy44ODktMzYuMzQtMTMuODg5LTUwLjIwMyAwbC0xMDMuMTYzIDEwMy4zNS00Mi40NzktNDIuNTU2IDEwMy4xNjMtMTAzLjM1YzM3LjMyNC0zNy4zOTIgOTcuODM3LTM3LjM5MiAxMzUuMTYxIDBsNTIuNzI2IDUyLjgyMWMxMy44NjMgMTMuODg4IDM2LjM0IDEzLjg4OCA1MC4yMDMgMEw3MTYuOCAzNDkuNTI1eiIgZmlsbD0iIzcwNzA3MCIvPjwvc3ZnPg==" alt="" />

                </div>
                <div className={`${ns.e('menu-item-label')}`}>工作台</div>
            </div>
            <div className={`${ns.e('menu-item')}`}>
                <div className={`${ns.e('menu-item-icon')}`}>
                    <img src="data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTgzMiA3Njh2NjRhNjQgNjQgMCAwIDEtNjQgNjRIMjU2YTY0IDY0IDAgMCAxIDAtMTI4aDU3Nm02NC02NEgyNTZhMTI4IDEyOCAwIDAgMCAwIDI1Nmg1MTJhMTI4IDEyOCAwIDAgMCAxMjgtMTI4VjcwNHoiIGZpbGw9IiM3MDcwNzAiLz48cGF0aCBkPSJNNzE1LjMwNyA2NEgzMDguNjkzQzIwOC45MDcgNjQgMTI4IDEzNi4zNzMgMTI4IDIyNS42djYwMS4wNjdsNjQtMzEuNDY3VjIyNS42YzAtNTMuODEzIDUyLjM3My05Ny42IDExNi42OTMtOTcuNmg0MDYuNjE0Qzc3OS42MjcgMTI4IDgzMiAxNzEuNzg3IDgzMiAyMjUuNnY1NDUuNDkzaDY0VjIyNS42Qzg5NiAxMzYuMzczIDgxNS4wOTMgNjQgNzE1LjMwNyA2NHoiIGZpbGw9IiM3MDcwNzAiLz48L3N2Zz4=" alt="" />
                </div>
                <div className={`${ns.e('menu-item-label')}`}>作品管理</div>


                <IconUp className={`${ns.e('menu-item-arrow')}`}></IconUp>
            </div>

            <div className={`${ns.e('sub-menu')}`}>
                <div className={`${ns.e('menu-item')}`} onClick={() => navigate('/writer/novel/list')}>
                    <div className={`${ns.e('menu-item-icon')}`}>
                        {/* <img src="data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTgzMiA3Njh2NjRhNjQgNjQgMCAwIDEtNjQgNjRIMjU2YTY0IDY0IDAgMCAxIDAtMTI4aDU3Nm02NC02NEgyNTZhMTI4IDEyOCAwIDAgMCAwIDI1Nmg1MTJhMTI4IDEyOCAwIDAgMCAxMjgtMTI4VjcwNHoiIGZpbGw9IiM3MDcwNzAiLz48cGF0aCBkPSJNNzE1LjMwNyA2NEgzMDguNjkzQzIwOC45MDcgNjQgMTI4IDEzNi4zNzMgMTI4IDIyNS42djYwMS4wNjdsNjQtMzEuNDY3VjIyNS42YzAtNTMuODEzIDUyLjM3My05Ny42IDExNi42OTMtOTcuNmg0MDYuNjE0Qzc3OS42MjcgMTI4IDgzMiAxNzEuNzg3IDgzMiAyMjUuNnY1NDUuNDkzaDY0VjIyNS42Qzg5NiAxMzYuMzczIDgxNS4wOTMgNjQgNzE1LjMwNyA2NHoiIGZpbGw9IiM3MDcwNzAiLz48L3N2Zz4=" alt="" /> */}
                    </div>
                    <div className={`${ns.e('menu-item-label')}`}>小说</div>
                </div>

                <div className={`${ns.e('menu-item')}`} onClick={() => navigate('/writer/short-manage')}>
                    <div className={`${ns.e('menu-item-icon')}`}>
                        {/* <img src="data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTgzMiA3Njh2NjRhNjQgNjQgMCAwIDEtNjQgNjRIMjU2YTY0IDY0IDAgMCAxIDAtMTI4aDU3Nm02NC02NEgyNTZhMTI4IDEyOCAwIDAgMCAwIDI1Nmg1MTJhMTI4IDEyOCAwIDAgMCAxMjgtMTI4VjcwNHoiIGZpbGw9IiM3MDcwNzAiLz48cGF0aCBkPSJNNzE1LjMwNyA2NEgzMDguNjkzQzIwOC45MDcgNjQgMTI4IDEzNi4zNzMgMTI4IDIyNS42djYwMS4wNjdsNjQtMzEuNDY3VjIyNS42YzAtNTMuODEzIDUyLjM3My05Ny42IDExNi42OTMtOTcuNmg0MDYuNjE0Qzc3OS42MjcgMTI4IDgzMiAxNzEuNzg3IDgzMiAyMjUuNnY1NDUuNDkzaDY0VjIyNS42Qzg5NiAxMzYuMzczIDgxNS4wOTMgNjQgNzE1LjMwNyA2NHoiIGZpbGw9IiM3MDcwNzAiLz48L3N2Zz4=" alt="" /> */}
                    </div>
                    <div className={`${ns.e('menu-item-label')}`}>短故事</div>
                </div>
            </div>


            <div className={`${ns.e('menu-item')}`}>
                <div className={`${ns.e('menu-item-icon')}`}>
                    <img src="data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTI4OCAzODguMmMtMTcuNyAwLTMyIDE0LjMtMzIgMzJ2MTI3YzAgMTcuNyAxNC4zIDMyIDMyIDMyczMyLTE0LjMgMzItMzJ2LTEyN2MwLTE3LjctMTQuMy0zMi0zMi0zMnptNDQ5LTY3Yy0xNy43IDAtMzIgMTQuMy0zMiAzMnYxOTRjMCAxNy43IDE0LjMgMzIgMzIgMzJzMzItMTQuMyAzMi0zMnYtMTk0YzAtMTcuNy0xNC4zLTMyLTMyLTMyem0tMjI2LTY0LjVjLTE3LjcgMC0zMiAxNC4zLTMyIDMydjI1OC41YzAgMTcuNyAxNC4zIDMyIDMyIDMyczMyLTE0LjMgMzItMzJWMjg4LjdjMC0xNy43LTE0LjMtMzItMzItMzJ6IiBmaWxsPSIjNzA3MDcwIi8+PHBhdGggZD0iTTk1NC4yIDY1LjhINjcuN0MzMC40IDY1LjggMCA5Ni4xIDAgMTMzLjV2NTUyLjZjMCAzNy4zIDMwLjMgNjcuNyA2Ny43IDY3LjdoMjgzLjRsLTk0LjMgMTU5LjRjLTkgMTUuMi00IDM0LjggMTEuMiA0My44czM0LjggNCA0My44LTExLjJsMTA5LjQtMTg0LjljMS40LTIuMyAyLjQtNC43IDMuMS03LjFoMTczLjRjLjcgMi40IDEuNyA0LjcgMy4xIDdsMTA5LjQgMTg0LjljOSAxNS4zIDI4LjYgMjAuMyA0My44IDExLjNzMjAuMi0yOC42IDExLjItNDMuOGwtOTQuMy0xNTkuNGgyODMuNGMzNy4zIDAgNjcuNy0zMC40IDY3LjYtNjcuOFYxMzMuNWMwLTM3LjMtMzAuMy02Ny43LTY3LjctNjcuN3ptMy43IDYyMC4yYzAgMi0xLjYgMy43LTMuNyAzLjdINjcuN2MtMiAwLTMuNy0xLjYtMy43LTMuN1YxMzMuNWMwLTIgMS42LTMuNyAzLjctMy43aDg4Ni41YzIgMCAzLjcgMS42IDMuNyAzLjdWNjg2eiIgZmlsbD0iIzcwNzA3MCIvPjwvc3ZnPg==" alt="" />
                </div>
                <div className={`${ns.e('menu-item-label')}`}>数据中心</div>

                <IconUp className={`${ns.e('menu-item-arrow')}`}></IconUp>
            </div>
            <div className={`${ns.e('sub-menu')}`}>
                <div className={`${ns.e('menu-item')}`}>
                    <div className={`${ns.e('menu-item-icon')}`}>
                        {/* <img src="data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTgzMiA3Njh2NjRhNjQgNjQgMCAwIDEtNjQgNjRIMjU2YTY0IDY0IDAgMCAxIDAtMTI4aDU3Nm02NC02NEgyNTZhMTI4IDEyOCAwIDAgMCAwIDI1Nmg1MTJhMTI4IDEyOCAwIDAgMCAxMjgtMTI4VjcwNHoiIGZpbGw9IiM3MDcwNzAiLz48cGF0aCBkPSJNNzE1LjMwNyA2NEgzMDguNjkzQzIwOC45MDcgNjQgMTI4IDEzNi4zNzMgMTI4IDIyNS42djYwMS4wNjdsNjQtMzEuNDY3VjIyNS42YzAtNTMuODEzIDUyLjM3My05Ny42IDExNi42OTMtOTcuNmg0MDYuNjE0Qzc3OS42MjcgMTI4IDgzMiAxNzEuNzg3IDgzMiAyMjUuNnY1NDUuNDkzaDY0VjIyNS42Qzg5NiAxMzYuMzczIDgxNS4wOTMgNjQgNzE1LjMwNyA2NHoiIGZpbGw9IiM3MDcwNzAiLz48L3N2Zz4=" alt="" /> */}
                    </div>
                    <div className={`${ns.e('menu-item-label')}`}>小说数据</div>
                </div>
                <div className={`${ns.e('menu-item')}`}>
                    <div className={`${ns.e('menu-item-icon')}`}>
                        {/* <img src="data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTgzMiA3Njh2NjRhNjQgNjQgMCAwIDEtNjQgNjRIMjU2YTY0IDY0IDAgMCAxIDAtMTI4aDU3Nm02NC02NEgyNTZhMTI4IDEyOCAwIDAgMCAwIDI1Nmg1MTJhMTI4IDEyOCAwIDAgMCAxMjgtMTI4VjcwNHoiIGZpbGw9IiM3MDcwNzAiLz48cGF0aCBkPSJNNzE1LjMwNyA2NEgzMDguNjkzQzIwOC45MDcgNjQgMTI4IDEzNi4zNzMgMTI4IDIyNS42djYwMS4wNjdsNjQtMzEuNDY3VjIyNS42YzAtNTMuODEzIDUyLjM3My05Ny42IDExNi42OTMtOTcuNmg0MDYuNjE0Qzc3OS42MjcgMTI4IDgzMiAxNzEuNzg3IDgzMiAyMjUuNnY1NDUuNDkzaDY0VjIyNS42Qzg5NiAxMzYuMzczIDgxNS4wOTMgNjQgNzE1LjMwNyA2NHoiIGZpbGw9IiM3MDcwNzAiLz48L3N2Zz4=" alt="" /> */}
                    </div>
                    <div className={`${ns.e('menu-item-label')}`}>短故事刷数据</div>
                </div>
            </div>
            <div className={`${ns.e('menu-item')}`}>
                <div className={`${ns.e('menu-item-icon')}`}>
                    <img src="data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTY5My45MzcgMjcxLjkzMmMyMC43NjMtMjcuMDU3IDMyLjg1LTU2Ljg1NyAzMi44NS04NC45NjMgMC00NS44NDQtMjcuOTM4LTEyMi43NDgtMjE1LjAwNC0xMjIuNzQ4LTgwLjMxNiAwLTIxNS4wMyAxNS45NDctMjE1LjAzIDEyMi43NDggMCAyOC4xMDYgMTIuMDg2IDU3LjkwNiAzMi44NSA4NC45NjMtMTM3LjEgOTAuMTgzLTIyOS4wNyAyNjMuMDQzLTIyOS4wNyAzNjYuMzYyIDAgMTk1LjEyNSAxNjEuNDE0IDMyMS4yMzQgNDExLjI1IDMyMS4yMzQgMjQ5LjgxMSAwIDQxMS4yMjYtMTI2LjEwOSA0MTEuMjI2LTMyMS4yMzQtLjAwMi0xMDMuMzItOTEuOTczLTI3Ni4yMDItMjI5LjA3Mi0zNjYuMzYyek01MTEuNzgyIDg5OC4yMTNjLTE5My4yOSAwLTM0OS45NjEtODMuMDMzLTM0OS45NjEtMjU5LjkyIDAtMTAxLjAwNyAxMjAuOTg1LTMwMy43ODQgMjc5LjgwMi0zNTIuODkyLTQ4LjU2MS0yMy44NjMtODMuNTgtNjcuNTYtODMuNTgtOTguNDMyIDAtNDQuNDEyIDY4LjgyNC02MS40MzQgMTUzLjc0LTYxLjQzNCA4NC44OSAwIDE1My43MTQgMTcuMDIgMTUzLjcxNCA2MS40MzQgMCAzMC44NzEtMzQuOTk0IDc0LjU3LTgzLjU4IDk4LjQzMiAxNTguODE4IDQ5LjEwOSAyNzkuODAxIDI1MS44ODUgMjc5LjgwMSAzNTIuODkyIDAgMTc2Ljg4Ny0xNTYuNjc0IDI1OS45Mi0zNDkuOTM2IDI1OS45MnptOTcuMDQ5LTMyMy41YzE2LjkyNSAwIDMwLjYzNi0xMy43MzEgMzAuNjM2LTMwLjY1NiAwLTE2LjkwMi0xMy43MS0zMC42MzUtMzAuNjM2LTMwLjYzNWgtNDIuMjY3bDQ2Ljk2NS00Ni45NjRjMTEuOTY1LTExLjk2NyAxMS45NjUtMzEuMzcyIDAtNDMuMzQtMTEuOTctMTEuOTY3LTMxLjM3NC0xMS45NjctNDMuMzQxIDBsLTU4LjA1IDU4LjA0OS01OC4wNDgtNTguMDQ4Yy0xMS45NjgtMTEuOTY4LTMxLjM1LTExLjk2OC00My4zNCAwLTExLjk2OCAxMS45NjYtMTEuOTY4IDMxLjM3MiAwIDQzLjMzOWw0Ni45NjMgNDYuOTY0aC00Mi45ODJjLTE2LjkyNSAwLTMwLjY1NyAxMy43MzItMzAuNjU3IDMwLjYzNSAwIDE2LjkyNSAxMy43MzIgMzAuNjU2IDMwLjY1NyAzMC42NTZoNjYuMzkzdjMzLjRoLTY5LjE1OGMtMTYuOTI2IDAtMzAuNjM0IDEzLjczLTMwLjYzNCAzMC42MzQgMCAxNi45MjQgMTMuNzA4IDMwLjY1NiAzMC42MzQgMzAuNjU2aDY5LjE1OHY1OC41NWMwIDE2LjkwMiAxMy43MzIgMzAuNjM0IDMwLjY1OCAzMC42MzQgMTYuOTI0IDAgMzAuNjMyLTEzLjczMiAzMC42MzItMzAuNjM0di01OC41NWg2My42NWMxNi45MjYgMCAzMC42NTgtMTMuNzMyIDMwLjY1OC0zMC42NTYgMC0xNi45MDMtMTMuNzMyLTMwLjYzNC0zMC42NTctMzAuNjM0aC02My42NXYtMzMuNGg2Ni40MTZ6IiBmaWxsPSIjNzA3MDcwIi8+PC9zdmc+" alt="" />
                </div>
                <div className={`${ns.e('menu-item-label')}`}>收益分析</div>

                <IconUp className={`${ns.e('menu-item-arrow')}`}></IconUp>
            </div>
            <div className={`${ns.e('sub-menu')}`}>
                <div className={`${ns.e('menu-item')}`}>
                    <div className={`${ns.e('menu-item-icon')}`}>
                        {/* <img src="data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTgzMiA3Njh2NjRhNjQgNjQgMCAwIDEtNjQgNjRIMjU2YTY0IDY0IDAgMCAxIDAtMTI4aDU3Nm02NC02NEgyNTZhMTI4IDEyOCAwIDAgMCAwIDI1Nmg1MTJhMTI4IDEyOCAwIDAgMCAxMjgtMTI4VjcwNHoiIGZpbGw9IiM3MDcwNzAiLz48cGF0aCBkPSJNNzE1LjMwNyA2NEgzMDguNjkzQzIwOC45MDcgNjQgMTI4IDEzNi4zNzMgMTI4IDIyNS42djYwMS4wNjdsNjQtMzEuNDY3VjIyNS42YzAtNTMuODEzIDUyLjM3My05Ny42IDExNi42OTMtOTcuNmg0MDYuNjE0Qzc3OS42MjcgMTI4IDgzMiAxNzEuNzg3IDgzMiAyMjUuNnY1NDUuNDkzaDY0VjIyNS42Qzg5NiAxMzYuMzczIDgxNS4wOTMgNjQgNzE1LjMwNyA2NHoiIGZpbGw9IiM3MDcwNzAiLz48L3N2Zz4=" alt="" /> */}
                    </div>
                    <div className={`${ns.e('menu-item-label')}`}>小说收益</div>
                </div>
                <div className={`${ns.e('menu-item')}`}>
                    <div className={`${ns.e('menu-item-icon')}`}>
                        {/* <img src="data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTgzMiA3Njh2NjRhNjQgNjQgMCAwIDEtNjQgNjRIMjU2YTY0IDY0IDAgMCAxIDAtMTI4aDU3Nm02NC02NEgyNTZhMTI4IDEyOCAwIDAgMCAwIDI1Nmg1MTJhMTI4IDEyOCAwIDAgMCAxMjgtMTI4VjcwNHoiIGZpbGw9IiM3MDcwNzAiLz48cGF0aCBkPSJNNzE1LjMwNyA2NEgzMDguNjkzQzIwOC45MDcgNjQgMTI4IDEzNi4zNzMgMTI4IDIyNS42djYwMS4wNjdsNjQtMzEuNDY3VjIyNS42YzAtNTMuODEzIDUyLjM3My05Ny42IDExNi42OTMtOTcuNmg0MDYuNjE0Qzc3OS42MjcgMTI4IDgzMiAxNzEuNzg3IDgzMiAyMjUuNnY1NDUuNDkzaDY0VjIyNS42Qzg5NiAxMzYuMzczIDgxNS4wOTMgNjQgNzE1LjMwNyA2NHoiIGZpbGw9IiM3MDcwNzAiLz48L3N2Zz4=" alt="" /> */}
                    </div>
                    <div className={`${ns.e('menu-item-label')}`}>短故事稿费</div>
                </div>
            </div>
            <div className={`${ns.e('menu-item')}`}>
                <div className={`${ns.e('menu-item-icon')}`}>
                    <img src="data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTY0NS4xMiA0NjUuOTJIMjU2YTI1LjYgMjUuNiAwIDAgMCAwIDUxLjJoMzg5LjEyYTI1LjYgMjUuNiAwIDAgMCAwLTUxLjJ6TTUwMS43NiA2MDkuMjhIMjU2YTI1LjYgMjUuNiAwIDAgMCAwIDUxLjJoMjQ1Ljc2YTI1LjYgMjUuNiAwIDAgMCAwLTUxLjJ6IiBmaWxsPSIjNzA3MDcwIi8+PHBhdGggZD0iTTgyNC4zMiAxNDMuMzZINDU1LjY4YTEyOC4yMDUgMTI4LjIwNSAwIDAgMC0xMjggMTI4djIuNTZIMjEwLjYzN0ExMzkuMjY0IDEzOS4yNjQgMCAwIDAgNzEuNjggNDEzLjE4NHYyNzkuNjU0YTEzOS4yNjQgMTM5LjI2NCAwIDAgMCAxMzguOTU3IDEzOS4yNjRoNS43MzRsLTE5LjA0NiA2OS45NGEyNS42IDI1LjYgMCAwIDAgMjQuNjc4IDMyLjM1OCAyNi4yMTQgMjYuMjE0IDAgMCAwIDExLjk4MS0yLjU2bDE4Ny4wODUtOTkuMzI4aDI1OS4xNzRBMTM5LjI2NCAxMzkuMjY0IDAgMCAwIDgxOS4yIDY5Mi44MzhWNjE0LjRoNS4xMmExMjguMjA1IDEyOC4yMDUgMCAwIDAgMTI4LTEyOFYyNzEuMzZhMTI4LjIwNSAxMjguMjA1IDAgMCAwLTEyOC0xMjh6TTc2OCA2OTIuODM4YTg4LjA2NCA4OC4wNjQgMCAwIDEtODcuNzU3IDg4LjA2NEg0MTQuNzJhMjUuNiAyNS42IDAgMCAwLTExLjk4IDIuOTdsLTE0MC40OTQgNzQuNTQ3IDEyLjM5LTQ1LjE1OGEyNS42IDI1LjYgMCAwIDAtMjQuNjc4LTMyLjM1OWgtMzkuMzIxYTg4LjA2NCA4OC4wNjQgMCAwIDEtODcuNzU3LTg4LjA2NFY0MTMuMTg0YTg4LjA2NCA4OC4wNjQgMCAwIDEgODcuNzU3LTg4LjA2NGg0NjkuNjA2QTg4LjA2NCA4OC4wNjQgMCAwIDEgNzY4IDQxMy4xODR6TTkwMS4xMiA0ODYuNGE3Ni44IDc2LjggMCAwIDEtNzYuOCA3Ni44aC01LjEyVjQxMy4xODRBMTM5LjI2NCAxMzkuMjY0IDAgMCAwIDY4MC4yNDMgMjczLjkySDM3OC44OHYtMi41NmE3Ni44IDc2LjggMCAwIDEgNzYuOC03Ni44aDM2OC42NGE3Ni44IDc2LjggMCAwIDEgNzYuOCA3Ni44eiIgZmlsbD0iIzcwNzA3MCIvPjwvc3ZnPg==" alt="" />
                </div>
                <div className={`${ns.e('menu-item-label')}`}>互动管理</div>

                <IconUp className={`${ns.e('menu-item-arrow')}`}></IconUp>
            </div>
            <div className={`${ns.e('sub-menu')}`}>
                <div className={`${ns.e('menu-item')}`}>
                    <div className={`${ns.e('menu-item-icon')}`}>
                        {/* <img src="data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTgzMiA3Njh2NjRhNjQgNjQgMCAwIDEtNjQgNjRIMjU2YTY0IDY0IDAgMCAxIDAtMTI4aDU3Nm02NC02NEgyNTZhMTI4IDEyOCAwIDAgMCAwIDI1Nmg1MTJhMTI4IDEyOCAwIDAgMCAxMjgtMTI4VjcwNHoiIGZpbGw9IiM3MDcwNzAiLz48cGF0aCBkPSJNNzE1LjMwNyA2NEgzMDguNjkzQzIwOC45MDcgNjQgMTI4IDEzNi4zNzMgMTI4IDIyNS42djYwMS4wNjdsNjQtMzEuNDY3VjIyNS42YzAtNTMuODEzIDUyLjM3My05Ny42IDExNi42OTMtOTcuNmg0MDYuNjE0Qzc3OS42MjcgMTI4IDgzMiAxNzEuNzg3IDgzMiAyMjUuNnY1NDUuNDkzaDY0VjIyNS42Qzg5NiAxMzYuMzczIDgxNS4wOTMgNjQgNzE1LjMwNyA2NHoiIGZpbGw9IiM3MDcwNzAiLz48L3N2Zz4=" alt="" /> */}
                    </div>
                    <div className={`${ns.e('menu-item-label')}`}>评论管理</div>
                </div>
                <div className={`${ns.e('menu-item')}`}>
                    <div className={`${ns.e('menu-item-icon')}`}>
                        {/* <img src="data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTgzMiA3Njh2NjRhNjQgNjQgMCAwIDEtNjQgNjRIMjU2YTY0IDY0IDAgMCAxIDAtMTI4aDU3Nm02NC02NEgyNTZhMTI4IDEyOCAwIDAgMCAwIDI1Nmg1MTJhMTI4IDEyOCAwIDAgMCAxMjgtMTI4VjcwNHoiIGZpbGw9IiM3MDcwNzAiLz48cGF0aCBkPSJNNzE1LjMwNyA2NEgzMDguNjkzQzIwOC45MDcgNjQgMTI4IDEzNi4zNzMgMTI4IDIyNS42djYwMS4wNjdsNjQtMzEuNDY3VjIyNS42YzAtNTMuODEzIDUyLjM3My05Ny42IDExNi42OTMtOTcuNmg0MDYuNjE0Qzc3OS42MjcgMTI4IDgzMiAxNzEuNzg3IDgzMiAyMjUuNnY1NDUuNDkzaDY0VjIyNS42Qzg5NiAxMzYuMzczIDgxNS4wOTMgNjQgNzE1LjMwNyA2NHoiIGZpbGw9IiM3MDcwNzAiLz48L3N2Zz4=" alt="" /> */}
                    </div>
                    <div className={`${ns.e('menu-item-label')}`}>打赏管理</div>
                </div>
                <div className={`${ns.e('menu-item')}`}>
                    <div className={`${ns.e('menu-item-icon')}`}>
                        {/* <img src="data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTgzMiA3Njh2NjRhNjQgNjQgMCAwIDEtNjQgNjRIMjU2YTY0IDY0IDAgMCAxIDAtMTI4aDU3Nm02NC02NEgyNTZhMTI4IDEyOCAwIDAgMCAwIDI1Nmg1MTJhMTI4IDEyOCAwIDAgMCAxMjgtMTI4VjcwNHoiIGZpbGw9IiM3MDcwNzAiLz48cGF0aCBkPSJNNzE1LjMwNyA2NEgzMDguNjkzQzIwOC45MDcgNjQgMTI4IDEzNi4zNzMgMTI4IDIyNS42djYwMS4wNjdsNjQtMzEuNDY3VjIyNS42YzAtNTMuODEzIDUyLjM3My05Ny42IDExNi42OTMtOTcuNmg0MDYuNjE0Qzc3OS42MjcgMTI4IDgzMiAxNzEuNzg3IDgzMiAyMjUuNnY1NDUuNDkzaDY0VjIyNS42Qzg5NiAxMzYuMzczIDgxNS4wOTMgNjQgNzE1LjMwNyA2NHoiIGZpbGw9IiM3MDcwNzAiLz48L3N2Zz4=" alt="" /> */}
                    </div>
                    <div className={`${ns.e('menu-item-label')}`}>有话说管理</div>
                </div>
                <div className={`${ns.e('menu-item')}`}>
                    <div className={`${ns.e('menu-item-icon')}`}>
                        {/* <img src="data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTgzMiA3Njh2NjRhNjQgNjQgMCAwIDEtNjQgNjRIMjU2YTY0IDY0IDAgMCAxIDAtMTI4aDU3Nm02NC02NEgyNTZhMTI4IDEyOCAwIDAgMCAwIDI1Nmg1MTJhMTI4IDEyOCAwIDAgMCAxMjgtMTI4VjcwNHoiIGZpbGw9IiM3MDcwNzAiLz48cGF0aCBkPSJNNzE1LjMwNyA2NEgzMDguNjkzQzIwOC45MDcgNjQgMTI4IDEzNi4zNzMgMTI4IDIyNS42djYwMS4wNjdsNjQtMzEuNDY3VjIyNS42YzAtNTMuODEzIDUyLjM3My05Ny42IDExNi42OTMtOTcuNmg0MDYuNjE0Qzc3OS42MjcgMTI4IDgzMiAxNzEuNzg3IDgzMiAyMjUuNnY1NDUuNDkzaDY0VjIyNS42Qzg5NiAxMzYuMzczIDgxNS4wOTMgNjQgNzE1LjMwNyA2NHoiIGZpbGw9IiM3MDcwNzAiLz48L3N2Zz4=" alt="" /> */}
                    </div>
                    <div className={`${ns.e('menu-item-label')}`}>粉丝管理</div>
                </div>
            </div>
            <div className={`${ns.e('menu-item')}`}>
                <div className={`${ns.e('menu-item-icon')}`}>
                    <img src="data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTY0Ni44MjcgNzMzLjg2N0gzNDYuNDUzTDI3MS4zNiA2MDIuNDUzYy02NC44NTMtNjMuMTQ2LTk4Ljk4Ny0xNDYuNzczLTk4Ljk4Ny0yMzcuMjI2LTEuNzA2LTE4Mi42MTQgMTQ2Ljc3NC0zMzEuMDk0IDMzMS4wOTQtMzMxLjA5NCAxODIuNjEzIDAgMzMyLjggMTQ4LjQ4IDMzMi44IDMzMi44IDAgMTAyLjQtNDYuMDggMTk3Ljk3NC0xMjggMjYxLjEybC02MS40NCAxMDUuODE0ek0zODUuNzA3IDY2NS42SDYwOS4yOGw0OS40OTMtODMuNjI3IDUuMTItMy40MTNjNjYuNTYtNTEuMiAxMDUuODE0LTEyOCAxMDUuODE0LTIxMS42MjdDNzY4IDIyMS44NjcgNjQ4LjUzMyAxMDIuNCA1MDMuNDY3IDEwMi40UzIzOC45MzMgMjIxLjg2NyAyMzguOTMzIDM2Ni45MzNjMCA3My4zODcgMjkuMDE0IDEzOS45NDcgODEuOTIgMTkxLjE0N2wzLjQxNCAzLjQxMyA2MS40NCAxMDQuMTA3em0yNjYuMjQgMzQxLjMzM2gtMjk2Ljk2Vjc5OC43MmgyOTYuOTZ2MjA4LjIxM3ptLTIyOC42OTQtNjguMjY2SDU4My42OHYtNzEuNjhINDIzLjI1M3Y3MS42OHoiIGZpbGw9IiM3MDcwNzAiLz48cGF0aCBkPSJNMzc1LjQ2NyAzNDEuMzMzSDMwNy4yYzAtOTMuODY2IDc2LjgtMTcwLjY2NiAxNzAuNjY3LTE3MC42NjZ2NjguMjY2Yy01Ni4zMiAwLTEwMi40IDQ2LjA4LTEwMi40IDEwMi40eiIgZmlsbD0iIzcwNzA3MCIvPjwvc3ZnPg==" alt="" />
                </div>
                <div className={`${ns.e('menu-item-label')}`}>开书灵感</div>
            </div>
            <div className={`${ns.e('menu-item')}`}>
                <div className={`${ns.e('menu-item-icon')}`}>
                    <img src="data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTkzOS4zNTggNDIzLjQyNWMtMjMuMDE4LTM3LjI1My02Mi45MjQtNjAuNzgtMTA3LjAyLTYzLjIxYTU5LjY4MyA1OS42ODMgMCAwIDAtOC4zNDYtLjU4bC0xNTIuMjAzLS4xMmM2LjY1LTI4Ljk3NyAxMC4wMTUtNTguNjU1IDEwLjAxNS04OC42NTggMC0yOC4yMjQtMy4yMTMtNTcuMTQtOS41NTYtODUuOTUzYTMwLjAyMSAzMC4wMjEgMCAwIDAtMS45MzItNS44NjZjLTE1LjgyLTU3LjMwMi02Ny4zNzgtOTYuODQyLTEyNy4yODMtOTYuODQyLTcyLjgyOCAwLTEzMi4wODEgNTkuMjU1LTEzMi4wODEgMTMyLjA4MSAwIDMuMzM1LjEzMiA2LjY3LjQwNiAxMC4wMTUtMi4xOTYgNTcuMjExLTMyLjEwOCAxMDkuOTQ3LTgwLjI3IDE0MS4zNjQtMTQuNDQ2IDkuNDI1LTE4LjUyNCAyOC43NzMtOS4wOTkgNDMuMjIgOS40MTUgMTQuNDM4IDI4Ljc1MyAxOC41MzUgNDMuMjIgOS4xQzQzMS4wMjMgMzc1LjA1IDQ3MS42NCAzMDIuNjUgNDczLjg2NyAyMjQuMjljLjAzMS0xLjMzMi0uMDEtMi42NjMtLjE0Mi0zLjk5NmE1OS43MjIgNTkuNzIyIDAgMCAxLS4zMDUtNi4wMTljMC0zOC4zOCAzMS4yMzQtNjkuNjE0IDY5LjYxNS02OS42MTQgMzIuNTc2IDAgNjAuNDc0IDIyLjIwNCA2Ny44MjUgNTMuOTk4LjM1NiAxLjUzNS44MjMgMy4wMiAxLjQwMiA0LjQ1MyA0LjY5NyAyMi44MTUgNy4wNzcgNDUuNTggNy4wNzcgNjcuNzQ0IDAgMzcuNDg2LTYuMjIzIDc0LjM1Mi0xOC40OTUgMTA5LjU5MmEzMS4yMyAzMS4yMyAwIDAgMCA0LjAyNyAyOC4zNDUgMzEuMjQ0IDMxLjI0NCAwIDAgMCAyNS40NDkgMTMuMTU3bDE5My4yMjcuMTAxYzEuNDIzLjI2NCAyLjg1Ny40MjcgNC4zLjQ3OCAyNC4xMTcuOTk3IDQ1LjkzNiAxMy42MTQgNTguNjA0IDM0LjA5IDcuODM5IDEyLjMxMyAxMS40MzkgMjYuODAxIDEwLjQzMiA0MS45NC0uMDgxLjk0NS0uMTIyIDEuOTExLS4xMTIgMi44NzcgMCAuODU1LjA0MSAxLjY5OC4xMTIgMi41MzIuMDEuMzM2LS4wMy42NjEtLjExMi45NzYtLjEwMS4zNzctLjE5My43NzMtLjI4NCAxLjE2bC03NC45NzMgMzMwLjM5MmEzMS40NzYgMzEuNDc2IDAgMCAwLTIuNDUgNC4wNDZjLTUuOTM3IDExLjc2My0xNC42NiAyMS40ODMtMjUuMzQ2IDI4LjE3MmE3MS4zOTQgNzEuMzk0IDAgMCAxLTM1Ljc1NyAxMS4wNjJjLS44NTUtLjA2MS01MTMuNzY2LS4yMjQtNTEzLjc2Ni0uMjI0LS40NjgtLjAyLS45MzYtLjAzLTEuNDAzLS4wMyAwIDAtMTExLjAxNi4xNzItMTEyLjcxOS40NTctMS45MzIgMC0zLjQ0Ni0xLjUwNC0zLjQ0Ni0zLjQxNmwuMy00MTYuMzM0YzAtMS45MDEgMS41NDUtMy40NDcgMy4wMTQtMy40NTdsMS4yNDYuMTIyYzEuMTc1LjEzMiAyLjY1My4yODQgMy41MjguMTkzbDgzLjgyOC0uMjIydjMzOS4zNjhjMCAxNy4yNTQgMTMuOTggMzEuMjMzIDMxLjIzNCAzMS4yMzNzMzEuMjMzLTEzLjk4IDMxLjIzMy0zMS4yMzNWNDM1LjM1di0xMC40MWMwLTE3LjI1NS0xMy45OC0zMC45My0zMS4yMzMtMzAuOTMtMS41MDUgMC0xMTcuNTQ3LjMwNi0xMTkuNDAzLjMwNi0zNi4zNDIgMC02NS45MTMgMjkuNTY2LTY1LjkxMyA2NS44OTNsLS4zIDQxNi4zMzVjMCAzNi4zMzcgMjkuNTcyIDY1LjkwMyA2NS45MTMgNjUuOTAzIDIuNTQyIDAgMTExLjQwNy0uNDU4IDExMS40MDctLjQ1OC40NTcuMDIuOTI1LjAzIDEuMzgyLjAzbDUxMi41MDYuMjc1YzI1LjQ2OSAwIDUwLjI5Ni03LjE5OCA3MS42NDgtMjAuNzMxIDE5LjYxMi0xMi4yODIgMzUuNzc3LTI5Ljg4MiA0Ni44NC01MC45NjggMy42Ni01LjYyMiA2LjQzNS0xMS44NzUgOC4yNTUtMTguNjE2LjExMi0uNDE2LjIxNC0uODI0LjMwNS0xLjI0bDc0Ljg4Mi0zMzAuMzRhNjUuNjY5IDY1LjY2OSAwIDAgMCAyLjAwMi0xOC45OTNjMS41OTMtMjguMDQtNS4zNTEtNTUuMDc1LTE5Ljk0Mi03Ny45ODF6IiBmaWxsPSIjNzA3MDcwIi8+PHBhdGggZD0iTTQ1MC4wMjggNTE4LjY1Yy0xNy4yNTQgMC0zMS4yMzQgMTMuOTgtMzEuMjM0IDMxLjIzNHYzMC40N2MwIDE3LjI1NSAxMy45OCAzMS4yMzQgMzEuMjM0IDMxLjIzNHMzMS4yMzMtMTMuOTggMzEuMjMzLTMxLjIzM3YtMzAuNDcxYzAtMTcuMjU0LTEzLjk4LTMxLjIzNC0zMS4yMzMtMzEuMjM0ek02OTMuODA2IDUxOC42NWMtMTcuMjU0IDAtMzEuMjM0IDEzLjk4LTMxLjIzNCAzMS4yMzR2MzAuNDdjMCAxNy4yNTUgMTMuOTggMzEuMjM0IDMxLjIzNCAzMS4yMzRzMzEuMjMzLTEzLjk4IDMxLjIzMy0zMS4yMzN2LTMwLjQ3MWMwLTE3LjI1NC0xMy45OC0zMS4yMzQtMzEuMjMzLTMxLjIzNHpNNjQ4Ljk0IDY2MC4wOTVjLTE0LjMwNC05LjM5NC0zMy41OTEtNS4zOTktNDMuMTYgOC43NjQtLjEzMS4xOTMtMTMuNjEzIDE5Ljc1NC0zNC4xNyAxOS43NTQtMTkuOTg5IDAtMzIuNDI0LTE4LjA5Ny0zMy4yNjctMTkuMzY4LTkuMTctMTQuNDI3LTI4LjI1NS0xOC44MS00Mi44MzUtOS43Ny0xNC42NSA5LjExLTE5LjE1NSAyOC4zNjYtMTAuMDU1IDQzLjAxNyAxMS4yMTUgMTguMDQ3IDQxLjk3IDQ4LjU4OCA4Ni4xNTcgNDguNTg4IDQzLjk2MiAwIDc1LjEwNC0zMC4zMTggODYuNTcyLTQ4LjIyMiA5LjIyMi0xNC4zOTYgNS4wMzQtMzMuMzU4LTkuMjQxLTQyLjc2M3oiIGZpbGw9IiM3MDcwNzAiLz48L3N2Zz4=" alt="" />
                </div>
                <div className={`${ns.e('menu-item-label')}`}>作品运营</div>
                <IconUp className={`${ns.e('menu-item-arrow')}`}></IconUp>
            </div>
            <div className={`${ns.e('sub-menu')}`}>
                <div className={`${ns.e('menu-item')}`}>
                    <div className={`${ns.e('menu-item-icon')}`}>
                        {/* <img src="data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTgzMiA3Njh2NjRhNjQgNjQgMCAwIDEtNjQgNjRIMjU2YTY0IDY0IDAgMCAxIDAtMTI4aDU3Nm02NC02NEgyNTZhMTI4IDEyOCAwIDAgMCAwIDI1Nmg1MTJhMTI4IDEyOCAwIDAgMCAxMjgtMTI4VjcwNHoiIGZpbGw9IiM3MDcwNzAiLz48cGF0aCBkPSJNNzE1LjMwNyA2NEgzMDguNjkzQzIwOC45MDcgNjQgMTI4IDEzNi4zNzMgMTI4IDIyNS42djYwMS4wNjdsNjQtMzEuNDY3VjIyNS42YzAtNTMuODEzIDUyLjM3My05Ny42IDExNi42OTMtOTcuNmg0MDYuNjE0Qzc3OS42MjcgMTI4IDgzMiAxNzEuNzg3IDgzMiAyMjUuNnY1NDUuNDkzaDY0VjIyNS42Qzg5NiAxMzYuMzczIDgxNS4wOTMgNjQgNzE1LjMwNyA2NHoiIGZpbGw9IiM3MDcwNzAiLz48L3N2Zz4=" alt="" /> */}
                    </div>
                    <div className={`${ns.e('menu-item-label')}`}>推荐素材</div>
                </div>
                <div className={`${ns.e('menu-item')}`}>
                    <div className={`${ns.e('menu-item-icon')}`}>
                        {/* <img src="data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTgzMiA3Njh2NjRhNjQgNjQgMCAwIDEtNjQgNjRIMjU2YTY0IDY0IDAgMCAxIDAtMTI4aDU3Nm02NC02NEgyNTZhMTI4IDEyOCAwIDAgMCAwIDI1Nmg1MTJhMTI4IDEyOCAwIDAgMCAxMjgtMTI4VjcwNHoiIGZpbGw9IiM3MDcwNzAiLz48cGF0aCBkPSJNNzE1LjMwNyA2NEgzMDguNjkzQzIwOC45MDcgNjQgMTI4IDEzNi4zNzMgMTI4IDIyNS42djYwMS4wNjdsNjQtMzEuNDY3VjIyNS42YzAtNTMuODEzIDUyLjM3My05Ny42IDExNi42OTMtOTcuNmg0MDYuNjE0Qzc3OS42MjcgMTI4IDgzMiAxNzEuNzg3IDgzMiAyMjUuNnY1NDUuNDkzaDY0VjIyNS42Qzg5NiAxMzYuMzczIDgxNS4wOTMgNjQgNzE1LjMwNyA2NHoiIGZpbGw9IiM3MDcwNzAiLz48L3N2Zz4=" alt="" /> */}
                    </div>
                    <div className={`${ns.e('menu-item-label')}`}>新书预热</div>
                </div>
                <div className={`${ns.e('menu-item')}`}>
                    <div className={`${ns.e('menu-item-icon')}`}>
                        {/* <img src="data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTgzMiA3Njh2NjRhNjQgNjQgMCAwIDEtNjQgNjRIMjU2YTY0IDY0IDAgMCAxIDAtMTI4aDU3Nm02NC02NEgyNTZhMTI4IDEyOCAwIDAgMCAwIDI1Nmg1MTJhMTI4IDEyOCAwIDAgMCAxMjgtMTI4VjcwNHoiIGZpbGw9IiM3MDcwNzAiLz48cGF0aCBkPSJNNzE1LjMwNyA2NEgzMDguNjkzQzIwOC45MDcgNjQgMTI4IDEzNi4zNzMgMTI4IDIyNS42djYwMS4wNjdsNjQtMzEuNDY3VjIyNS42YzAtNTMuODEzIDUyLjM3My05Ny42IDExNi42OTMtOTcuNmg0MDYuNjE0Qzc3OS42MjcgMTI4IDgzMiAxNzEuNzg3IDgzMiAyMjUuNnY1NDUuNDkzaDY0VjIyNS42Qzg5NiAxMzYuMzczIDgxNS4wOTMgNjQgNzE1LjMwNyA2NHoiIGZpbGw9IiM3MDcwNzAiLz48L3N2Zz4=" alt="" /> */}
                    </div>
                    <div className={`${ns.e('menu-item-label')}`}>口碑说明</div>
                </div>
            </div>
            <div className={`${ns.e('menu-item')}`}>
                <div className={`${ns.e('menu-item-icon')}`}>
                    <img src="data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTU0Ni4xMzMgMzkyLjUzM1Y4MTkuMmgtNjguMjY2VjM5Mi41MzNhMzQuMTMzIDM0LjEzMyAwIDEgMSA2OC4yNjYgMHoiIGZpbGw9IiM3MDcwNzAiLz48cGF0aCBkPSJNODUzLjMzMyAyMjEuODY3SDE3MC42NjdhMTAyLjQgMTAyLjQgMCAwIDAtMTAyLjQgMTAyLjR2MTAyLjRhNjguMjY3IDY4LjI2NyAwIDAgMCA2OC4yNjYgNjguMjY2aDc1MC45MzRhNjguMjY3IDY4LjI2NyAwIDAgMCA2OC4yNjYtNjguMjY2di0xMDIuNGExMDIuNCAxMDIuNCAwIDAgMC0xMDIuNC0xMDIuNHptLTY4Mi42NjYgNjguMjY2aDY4Mi42NjZhMzQuMTMzIDM0LjEzMyAwIDAgMSAzNC4xMzQgMzQuMTM0djEwMi40SDEzNi41MzN2LTEwMi40YTM0LjEzMyAzNC4xMzMgMCAwIDEgMzQuMTM0LTM0LjEzNHoiIGZpbGw9IiM3MDcwNzAiLz48cGF0aCBkPSJNODE5LjIgNDI2LjY2N0gyMDQuOGE2OC4yNjcgNjguMjY3IDAgMCAwLTY4LjI2NyA2OC4yNjZ2MzkyLjUzNGE2OC4yNjcgNjguMjY3IDAgMCAwIDY4LjI2NyA2OC4yNjZoNjE0LjRhNjguMjY3IDY4LjI2NyAwIDAgMCA2OC4yNjctNjguMjY2VjQ5NC45MzNhNjguMjY3IDY4LjI2NyAwIDAgMC02OC4yNjctNjguMjY2em0tNjE0LjQgNjguMjY2aDYxNC40djM5Mi41MzRIMjA0LjhWNDk0LjkzM3pNMzY0LjQ3NiA3Ni4wMzJhMzQuMTMzIDM0LjEzMyAwIDAgMSA0Ni4xNjUgMi42MTFsMS44NzcgMi4xIDk4LjEzNCAxMTkuNDY2YTM0LjEzMyAzNC4xMzMgMCAwIDEtNTAuODkzIDQ1LjQxNGwtMS44NzctMi4wOTktOTguMTM0LTExOS40NjZhMzQuMTMzIDM0LjEzMyAwIDAgMSA0LjcyOC00OC4wMjZ6IiBmaWxsPSIjNzA3MDcwIi8+PHBhdGggZD0iTTYxMS40OTkgODAuNzI1YTM0LjEzMyAzNC4xMzMgMCAwIDEgNTQuNDQyIDQxLjExNGwtMS43MDYgMi4yMTlMNTY2LjEgMjQzLjUyNGEzNC4xMzMgMzQuMTMzIDAgMCAxLTU0LjQ0Mi00MS4wOTZsMS43MDYtMi4yMTlMNjExLjUgODAuNzQyeiIgZmlsbD0iIzcwNzA3MCIvPjwvc3ZnPg==" alt="" />
                </div>
                <div className={`${ns.e('menu-item-label')}`}>福利管理</div>
            </div>
            <div className={`${ns.e('menu-item')}`}>
                <div className={`${ns.e('menu-item-icon')}`}>
                    <img src="data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTUxMS41NCAxMjAuNzEzaC0uMTcxYTEyNS41NiAxMjUuNTYgMCAwIDAtOTIuMDkyIDM5LjU0MyAxMjcuOTY2IDEyNy45NjYgMCAwIDAtMzQuMjE5IDEwMS4zNDJsLjY4MyA1LjQxYzIuMDgyIDE0LjMzNiA2LjUwMiAyOC4wMDYgMTMuMDczIDQwLjYxOWwxLjU1MyAyLjg2Ny04Ny4yMjggMTA1Ljg2NC0xMzYuMjYtNjAuMDkxYTY1Ljc1OCA2NS43NTggMCAwIDAtOTAuMzg1IDc1LjkxMmwxMDMuOCA0MjEuMDg2YTY1Ljc1OCA2NS43NTggMCAwIDAgNjMuODYzIDUwLjAwNWg1MTUuNjg2YTY1Ljc1OCA2NS43NTggMCAwIDAgNjMuODY0LTUwLjAwNUw5MzcuNTc0IDQzMS44OWE2NS43NTggNjUuNzU4IDAgMCAwLTQ4LjExLTc5LjU4MmwtNC4yMzMtLjkwNGE2NS43NzUgNjUuNzc1IDAgMCAwLTM3Ljg1NCA0LjQ4OGwtMTM4LjQ5NiA2MC41NTMtODcuMjc5LTEwNS44OTkgMS4zNjUtMi40NThjNy4zNC0xNC4wMTEgMTIuMDUtMjkuMzU0IDEzLjg0Mi00NS40NjVhMTI4IDEyOCAwIDAgMC0zMy4yMy0xMDEuMzc2IDEyNS42OTYgMTI1LjY5NiAwIDAgMC05Mi4wNC00MC41MzN6bS00LjA4IDY1Ljg3N2wzLjg3NC0uMTJhNTkuOTM4IDU5LjkzOCAwIDAgMSA0NC4xIDE5LjU3NiA2Mi4yMjUgNjIuMjI1IDAgMCAxIDE2LjAxIDQ5LjM0IDYxLjc2NCA2MS43NjQgMCAwIDEtMTIuNzY3IDMxLjUyMmwtMi43OTkgMy4zNDVhMzIuODg3IDMyLjg4NyAwIDAgMC0uOTA0IDQyLjg3MUw2NzMuOTI5IDQ3Ny40NGM5LjMzNSAxMS4zMzIgMjUuMDcgMTUuMTA0IDM4LjUzNiA5LjIxNmwxNjEuMjYzLTcwLjQ4NS0xMDMuODg1IDQyMS4zNDJIMjU0LjE1N0wxNTAuMzQgNDE2LjQyN2wxNTkuMDYyIDcwLjE2YzEzLjQ4MiA1Ljk1NyAyOS4yNjkgMi4yMiAzOC42MzktOS4xNjRMNDY2Ljk5NSAzMzMuMDljMTAuMzI2LTEyLjUyNyA5Ljk2Ny0zMC43Mi0uODUzLTQyLjgzN2E2Mi4xNzQgNjIuMTc0IDAgMCAxLTE1LjY2Ny0zNS40MyA2Mi4xNzQgNjIuMTc0IDAgMCAxIDE2LjUwMy00OS4yOSA1OS41NjMgNTkuNTYzIDAgMCAxIDQwLjQ4Mi0xOC45NDN6IiBmaWxsPSIjNzA3MDcwIi8+PHBhdGggZD0iTTMyMi45ODcgNTg5LjA1Nmw0Mi44MzcgMTcxLjQzNWgtNzAuMzMybC0zOC43NDEtMTU0Ljg2M2EzNC4xMzMgMzQuMTMzIDAgMCAxIDY2LjIzNi0xNi41NTV6IiBmaWxsPSIjNzA3MDcwIi8+PC9zdmc+" alt="" />
                </div>
                <div className={`${ns.e('menu-item-label')}`}>作家等级</div>
            </div>
        </div>
    )
}


const WriterLayout: React.FC = () => {
    const ns = useNamespace('writer-layout')
    return (
        <div
            className={ns.b('')}
            style={{
                backgroundColor: '#f8f8f8',
                minHeight: '100vh'
            }}>
            <LayoutHeader
                left={
                    <div className="flex items-center">
                        <img src={Logo} alt='logo'></img>
                        <Divider type={'vertical'}></Divider>
                        <span className="cursor-pointer">作家专区</span>
                    </div>
                }
                right={
                    <div className="flex items-center">
                        <div className="writer-header-menu">西红柿小说网</div>
                        <div className="writer-header-menu">作家课堂</div>
                        <div className="writer-header-menu">作家福利</div>
                        <div className="writer-header-menu">消息通知</div>
                        <Divider type={'vertical'}></Divider>
                        <LayoutHeaderUserInfo></LayoutHeaderUserInfo>

                    </div>
                }
            ></LayoutHeader>



            <div className="container mx-auto flex" style={{
                padding: '10px'
            }}>

                <LayoutMenu></LayoutMenu>
                <div className="flex-1" style={{
                    marginLeft: '260px',
                }}>
                    <Outlet />
                </div>

            </div>
        </div>
    )
}

export default WriterLayout;
