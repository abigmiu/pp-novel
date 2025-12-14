package org.ppnovel.web.configuration;

import cn.dev33.satoken.interceptor.SaInterceptor;
import cn.dev33.satoken.stp.StpUtil;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class SaTokenConfigure implements WebMvcConfigurer {
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new SaInterceptor(handle -> StpUtil.checkLogin()))
            .addPathPatterns("/**")
            .excludePathPatterns("/swagger-ui/**")
            .excludePathPatterns("/v3/api-docs/**")
            .excludePathPatterns("/swagger-resources/**")
            .excludePathPatterns("/webjars/**")
            .excludePathPatterns("/swagger-ui.html")
        ;
    }
}
