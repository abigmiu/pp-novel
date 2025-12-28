package org.ppnovel.web.interceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.HandlerInterceptor;

@Slf4j
@Component
public class RequestLoggingInterceptor implements HandlerInterceptor {
    private static final String REQUEST_START_TIME = "REQUEST_START_TIME";
    private static final String TRACE_ID = "traceId";

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        request.setAttribute(REQUEST_START_TIME, System.currentTimeMillis());
        String traceId = getOrCreateTraceId(request);
        MDC.put(TRACE_ID, traceId);
        response.setHeader("X-Trace-Id", traceId);

        String query = request.getQueryString();
        String pathWithQuery = query == null ? request.getRequestURI() : request.getRequestURI() + "?" + query;
        log.info("Incoming request {} {} from {}", request.getMethod(), pathWithQuery, getClientIp(request));
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        long duration = -1L;
        Object startObj = request.getAttribute(REQUEST_START_TIME);
        if (startObj instanceof Long) {
            duration = System.currentTimeMillis() - (Long) startObj;
        }

        String query = request.getQueryString();
        String pathWithQuery = query == null ? request.getRequestURI() : request.getRequestURI() + "?" + query;
        if (ex != null) {
            log.error("Completed {} {} with status {} in {} ms", request.getMethod(), pathWithQuery, response.getStatus(), duration, ex);
        } else {
            log.info("Completed {} {} with status {} in {} ms", request.getMethod(), pathWithQuery, response.getStatus(), duration);
        }
        MDC.remove(TRACE_ID);
    }

    private String getClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (StringUtils.hasText(forwarded)) {
            return forwarded.split(",")[0].trim();
        }

        String realIp = request.getHeader("X-Real-IP");
        if (StringUtils.hasText(realIp)) {
            return realIp;
        }

        return request.getRemoteAddr();
    }

    private String getOrCreateTraceId(HttpServletRequest request) {
        String incoming = request.getHeader("X-Trace-Id");
        if (StringUtils.hasText(incoming)) {
            return incoming.trim();
        }
        return java.util.UUID.randomUUID().toString();
    }
}
