import { RLogout } from "@/apis/auth";
import { RGetUserFansFollowStat, RGetUserInfo, ZUserFansFollowStatRes, type IUserFansFollowStatRes, type IUserInfoRes } from "@/apis/user";
import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware';

interface IUserStoreState {
    hasLogin: boolean;
    token: string | null;
    userInfo: IUserInfoRes | null;
    fansFollowStat: IUserFansFollowStatRes;
}

interface IUserStoreActions {
    setToken: (token: string) => void;
    getUserInfo: () => Promise<void>;
    logout: () => Promise<void>;
    getUserFansFollowStat: () =>Promise<void>;
}



type IUserStore = IUserStoreActions & IUserStoreState;

const useUserStore = create<IUserStore>()(
    persist(
        (set) => ({
            hasLogin: false,
            token: null,
            userInfo: null,
            fansFollowStat: {
                fansCount: 0,
                followCount: 0,
            },

            setToken: (token) => {
                set({
                    hasLogin: true,
                    token: token
                })
                localStorage.setItem('token', token);
            },
            getUserInfo: async () => {
                const res = await RGetUserInfo();
                set({
                    userInfo: res,
                })
            },
            /** 获取用户粉丝关注统计数据 */
            getUserFansFollowStat: async () => {
                const res = await RGetUserFansFollowStat();
                const valid = ZUserFansFollowStatRes.safeParse(res);
                if (valid.success) {
                    set({ fansFollowStat: res });
                } else {
                    console.error('❌ RGetUserFansFollowStat 接口响应错误')
                }

            },
            logout: async () => {
                set({
                    userInfo: null,
                    hasLogin: false,
                    token: null,
                })
                localStorage.removeItem('token');
                await RLogout();
            },
        }),
        {
            name: 'user-store',
            storage: createJSONStorage(() => localStorage)
        }
    )


)
export default useUserStore;