package org.ppnovel.web.advice;


import org.ppnovel.common.dto.common.Result;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;


@RestControllerAdvice(basePackages = "org.ppnovel.web.controller")
public class GlobalResponseAdvice implements ResponseBodyAdvice<Object> {
    @Override
    public boolean supports(MethodParameter returnType, Class converterType) {
        return true;
    }

    @Override
    public Object beforeBodyWrite(Object body, MethodParameter returnType, MediaType selectedContentType, Class selectedConverterType, ServerHttpRequest request, ServerHttpResponse response) {
        if (MediaType.APPLICATION_JSON.equals(selectedContentType)) { // 判断响应的Content-Type为JSON格式的body
            if (body instanceof Result<?>) { // 如果响应返回的对象为统一响应体，则直接返回body
                return body;
            } else {
                // 只有正常返回的结果才会进入这个判断流程，所以返回正常成功的状态码
                return Result.ok(body);
            }
        }
        // 非JSON格式body直接返回即可
        return body;
    }


}
