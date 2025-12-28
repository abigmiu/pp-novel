package org.ppnovel.common.entity.novel;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

import org.ppnovel.common.entity.BaseEntity;

/**
 * 小说收藏
 */
@Data
@TableName("novel_user_favorite")
public class NovelUserFavoriteEntity extends BaseEntity {
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @TableField("user_id")
    private Integer userId;

    @TableField("novel_id")
    private Integer novelId;

}
