package org.ppnovel.common.entity;

import org.ppnovel.common.annotation.ColumnComment;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

/**
 * 短故事分析数据
 */
@TableName("short_story_analytics")
@Data
public class ShortStoryAnalyticsEntity  {

    /**
     * 短故事ID
     */
    @TableId(value = "short_story_id", type = IdType.INPUT)
    private Integer shortStoryId;

    /**
     * 总阅读量
     */
    @TableField(value = "total_reads")
    private Integer totalReads;

    /**
     * 总加入书架量
     */
    @TableField(value = "total_favorites")
    private Long totalFavorites;

    /**
     * 付费人数
     */
    @TableField(value = "payment_count")
    private Integer paymentCount;

    /**
     * 阅读人数
     */
    @TableField(value = "readers")
    private Long readers;

    /**
     * 15秒阅读人数
     */
    @TableField(value = "fifteen_second_readers")
    private Long fifteenSecondReaders;

    /**
     * 30秒阅读人数
     */
    @TableField(value = "thirty_second_readers")
    private Long thirtySecondReaders;

    /**
     * 60秒阅读人数
     */
    @TableField(value = "sixty_second_readers")
    private Long sixtySecondReaders;

    /**
     * 触底人数
     */
    @TableField(value = "bottom_readers")
    private Long bottomReaders;
}
