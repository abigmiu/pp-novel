package org.ppnovel.common.mapper.pay;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import org.ppnovel.common.entity.pay.WalletEntity;

import java.math.BigDecimal;

public interface WalletMapper extends BaseMapper<WalletEntity> {
    @Select("""
        SELECT *
        FROM wallet
        WHERE user_id = #{userId} AND is_delete = 0
        LIMIT 1
        """)
    WalletEntity findByUserId(@Param("userId") Integer userId);

    @Update("""
        UPDATE wallet
        SET balance = balance + #{amount},
            total_recharge = total_recharge + #{amount},
            updated_at = NOW()
        WHERE user_id = #{userId} AND is_delete = 0
        """)
    int increaseBalance(@Param("userId") Integer userId, @Param("amount") BigDecimal amount);

    @Update("""
        UPDATE wallet
        SET balance = balance - #{amount},
            total_consume = total_consume + #{amount},
            updated_at = NOW()
        WHERE user_id = #{userId} AND balance >= #{amount} AND is_delete = 0
        """)
    int decreaseBalanceIfEnough(@Param("userId") Integer userId, @Param("amount") BigDecimal amount);
}
