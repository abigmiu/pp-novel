package org.ppnovel.web.component;

import cn.dev33.satoken.exception.NotLoginException;

import org.ppnovel.common.dto.common.Result;
import org.ppnovel.common.exception.BusinessException;
import org.springframework.util.StringUtils;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

@RestControllerAdvice
public class WebExceptionHandler {
    /**
     * 其他拦截
     *
     * @param e
     * @return
     */
    @ExceptionHandler(Exception.class)
    public Result<?> handleException(Exception e) {
        e.printStackTrace();
        return Result.fail(500, "服务异常");
    }

    /**
     * 资源不存在
     *
     * @param {NoResourceFoundException} e
     * @return
     */
    @ExceptionHandler(NoResourceFoundException.class)
    public Result<?> handleException(NoResourceFoundException e) {
        e.printStackTrace();
        return Result.fail(404, "资源不存在");
    }

    /**
     * 未登录
     *
     * @param e
     * @return
     */
    @ExceptionHandler(NotLoginException.class)
    public Result<?> handleNotLoginException(NotLoginException e) {
        return Result.fail(401, "未登录");
    }

    /**
     * 请求参数校验失败
     *
     * @param e
     * @return
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Result<?> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        BindingResult bindingResult = e.getBindingResult();

        String firstErrorMessage = bindingResult.getFieldErrors().getFirst().getDefaultMessage();
        if (StringUtils.hasLength(firstErrorMessage)) {
            return Result.fail(400, firstErrorMessage);
        } else {
            return Result.fail(400, "请求参数 校验失败");
        }
    }

    /**
     * 业务异常
     *
     * @param e
     * @return
     */
    @ExceptionHandler(BusinessException.class)
    public Result<?> handleBusinessException(BusinessException e) {
        return Result.fail(e.getCode(), e.getMessage());
    }
}
