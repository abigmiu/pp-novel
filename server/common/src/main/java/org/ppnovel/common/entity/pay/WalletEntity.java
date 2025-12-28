package org.ppnovel.common.entity.pay;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import org.ppnovel.common.entity.BaseEntity;

import java.math.BigDecimal;

@Data
@TableName("wallet")
public class WalletEntity extends BaseEntity {
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @TableField("user_id")
    private Integer userId;

    @TableField("balance")
    private BigDecimal balance;

    @TableField("total_recharge")
    private BigDecimal totalRecharge;

    @TableField("total_consume")
    private BigDecimal totalConsume;
}
