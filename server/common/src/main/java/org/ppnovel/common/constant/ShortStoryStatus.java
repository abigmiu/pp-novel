package org.ppnovel.common.constant;

/** 短故事状态 */
public class ShortStoryStatus {
    static public  Integer DRAFT = 0;

    /**
     * 审核中
     */
    static public Integer UNDER_REVIEW = 1;
    /**
     * 已发布
     */
    static public Integer PUBLISHED = 2;
    /**
     * 审核不通过
     */
    static public Integer NOT_PASS_THE_REVIEW = 3;
    /**
     * 停止推荐
     */
    static public Integer STOP_RECOMMEND = 4;

    /**
     * 主动下架
     */
    static public Integer SELF_OFF_SHELF = 5;

    /**
     * 系统下架
     */
    static public Integer SYSTEM_OFF_SHELF = 6;
}
