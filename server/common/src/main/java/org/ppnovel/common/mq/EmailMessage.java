package org.ppnovel.common.mq;

import lombok.Data;
import org.ppnovel.common.constant.EmailType;

@Data
public class EmailMessage {
    private String to;
    private String subject;
    private String content;
    private Integer type;
}
