package org.ppnovel.common.dto.common;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import org.ppnovel.common.constant.CodeStatus;

@Data
public class Result<T> {
    @Schema(title = "响应code", example = "200", requiredMode = Schema.RequiredMode.REQUIRED)
    private int code = CodeStatus.SUCCESS;

    @Schema(title = "响应消息", example = "OK", requiredMode = Schema.RequiredMode.REQUIRED)
    private String msg = "OK";

    @Schema(title = "数据", example = "OK", requiredMode = Schema.RequiredMode.REQUIRED)
    private T data = null;

    public static Result ok() {
        return new Result();
    }

    public static <T> Result<T> ok(T data) {
        Result<T> result = new Result<T>();
        result.setData(data);
        return result;
    }

    public static <T> Result<T> fail(int code, String msg) {
        Result<T> result = new Result<T>();
        result.setCode(code);
        result.setMsg(msg);
        return result;
    }
    public static <T> Result<T> fail(int code, String msg, T data) {
        Result<T> result = new Result<T>();
        result.setCode(code);
        result.setMsg(msg);
        result.setData(data);
        return result;
    }
    public static <T> Result<T> fail(String msg) {
        Result<T> result = new Result<T>();
        result.setCode(CodeStatus.BAD_REQUEST);
        result.setMsg(msg);
        return result;
    }
}
