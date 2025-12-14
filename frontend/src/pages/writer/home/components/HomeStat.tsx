import type React from "react";
import dayjs from 'dayjs';
import weatcherGIF from '@/assets/afternoon.gif';
import LV0PNG from '@/assets/lv0.png';
import useUserStore from "@/store/userStore";
import { useMount } from "ahooks";
import { useRef, useState } from "react";
import { RGetWriterStat, ZWriterCountStat, type IRWriterCountStatRes } from "@/apis/writer";

function getPeriod(time = dayjs()) {
    const h = time.hour()

    if (h >= 6 && h < 12) return '上午'
    if (h >= 12 && h < 13) return '中午'
    if (h >= 13 && h < 18) return '下午'
    if (h >= 18 && h < 24) return '晚上'
    return '凌晨'
}


function getDiffRegisterTime(time: string = dayjs().toString()) {
    return dayjs(dayjs()).diff(dayjs(time), 'D');
}

function useWriterStat() {
    const [writerStat, setWriterStat] = useState<IRWriterCountStatRes>({
        bookCount: 0,
        shortStoryCharCount: 0,
        shortStoryCount: 0,
        bookChapterCount: 0,
        bookCharCount: 0,
    });

    const fetchWriterStat = async () => {
        const res = await RGetWriterStat();
        const valid = ZWriterCountStat.safeParse(res);
        if (valid.success) {
            setWriterStat(res);
        }
    }

    return {
        writerStat,
        fetchWriterStat,
    }
}

const HomeStat: React.FC = () => {
    const ranRef = useRef(false);

    const userInfo = useUserStore((s) => s.userInfo)!;
    const fansFollowStat = useUserStore((s) => s.fansFollowStat)!;
    const getUserFansFollowStat = useUserStore(
        (s) => s.getUserFansFollowStat
    );

    const { writerStat, fetchWriterStat } = useWriterStat();
    useMount(() => {
        if (ranRef.current) return;
        fetchWriterStat();
    })
    useMount(() => {
        if (ranRef.current) return;

        getUserFansFollowStat();
    })
    useMount(() => {
        ranRef.current = true;
    })

    return (
        <div className="serial-card serial-card-normal flex justify-between items-center">
            <div className="flex items-center">
                <img src={weatcherGIF} alt="" style={{
                    width: '90px',
                    height: '90px'
                }} />

                <div>
                    <div className="font-500 font-size-16px flex items-center">
                        {getPeriod()}好，{userInfo.pseudonym}
                        <img src={LV0PNG} style={{
                            width: '16px',
                            height: '16px',
                            marginLeft: '10px'
                        }} alt="" />
                    </div>

                    <div className="font-size-12px color-#A4A4A4 mt-4px">
                        今天是西红柿陪你的第 {getDiffRegisterTime(userInfo.createdDate)}天， 努力加油码字吧
                    </div>
                </div>
            </div>

            <div className="flex">
                <div>
                    <div className="font-size-14px color-#A4A4A4">粉丝数</div>
                    <div className="font-size-20px font-500">{fansFollowStat.fansCount}</div>
                </div>
                <div style={{ marginLeft: '50px' }}>
                    <div className="font-size-14px color-#A4A4A4">累计创作字数</div>
                    <div className="font-size-20px font-500">{writerStat.bookCharCount}</div>
                </div>
            </div>
        </div>
    )
}

export default HomeStat;