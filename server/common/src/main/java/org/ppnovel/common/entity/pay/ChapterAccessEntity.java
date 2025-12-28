package org.ppnovel.common.entity.pay;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import org.ppnovel.common.entity.BaseEntity;

@Data
@TableName("chapter_access")
public class ChapterAccessEntity extends BaseEntity {
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @TableField("user_id")
    private Integer userId;

    @TableField("chapter_id")
    private Integer chapterId;

    @TableField("grant_type")
    private String grantType;
}
