package org.ppnovel.common.entity.pay;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import org.ppnovel.common.entity.BaseEntity;

import java.math.BigDecimal;

@Data
@TableName("wallet_txn")
public class WalletTxnEntity extends BaseEntity {
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @TableField("user_id")
    private Integer userId;

    @TableField("type")
    private String type;

    @TableField("direction")
    private String direction;

    @TableField("amount")
    private BigDecimal amount;

    @TableField("balance_after")
    private BigDecimal balanceAfter;

    @TableField("biz_id")
    private Long bizId;

    @TableField("biz_type")
    private String bizType;

    @TableField("request_id")
    private String requestId;

    @TableField("remark")
    private String remark;
}
