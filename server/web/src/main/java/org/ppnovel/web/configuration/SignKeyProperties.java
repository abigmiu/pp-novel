package org.ppnovel.web.configuration;

import jakarta.validation.constraints.NotBlank;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;

@Validated
@Component
@ConfigurationProperties(prefix = "signKey")
public class SignKeyProperties {
    @NotBlank
    private String webUserPassword;

    public String getWebUserPassword() {
        return webUserPassword;
    }

    public void setWebUserPassword(String webUserPassword) {
        this.webUserPassword = webUserPassword;
    }
}

