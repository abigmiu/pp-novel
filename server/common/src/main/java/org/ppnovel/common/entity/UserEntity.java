package org.ppnovel.common.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("user")
public class UserEntity extends BaseEntity {
    @TableId(type = IdType.AUTO)
    private Integer id;

    @TableField("uid")
    private Long uid;

    /**
     * 笔名
     */
    @TableField("pseudonym")
    private String pseudonym;

    /**
     * 昵称
     */
    @TableField("nickname")
    private String nickname;

    @TableField("has_register_writer")
    private Boolean hasRegisterWriter;

    @TableField("password")
    private String password;

    @TableField("email")
    private String email;

    @TableField("phone")
    private String phone;

    @TableField("qq")
    private String qq;


    @TableField("avatar")
    private String avatar;

    @TableField("`desc`")
    private String desc;

    @TableField("exp")
    private Integer exp;
}
