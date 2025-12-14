package org.ppnovel.common.exception;

import lombok.Data;
import org.ppnovel.common.constant.CodeStatus;

@Data
public class BusinessException extends RuntimeException {
    private int code = CodeStatus.BAD_REQUEST;
    private String message = "请求错误";

    public BusinessException(String message) {
        this.message = message;
    }

    public BusinessException(String message, Integer code) {
        this.message = message;
        this.code = code;
    }
}
