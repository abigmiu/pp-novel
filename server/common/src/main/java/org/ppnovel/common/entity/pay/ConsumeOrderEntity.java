package org.ppnovel.common.entity.pay;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import org.ppnovel.common.entity.BaseEntity;

import java.math.BigDecimal;

@Data
@TableName("consume_order")
public class ConsumeOrderEntity extends BaseEntity {
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @TableField("order_no")
    private String orderNo;

    @TableField("user_id")
    private Integer userId;

    @TableField("amount")
    private BigDecimal amount;

    @TableField("status")
    private Integer status;

    @TableField("biz_scene")
    private String bizScene;

    @TableField("target_id")
    private Integer targetId;

    @TableField("request_id")
    private String requestId;
}
