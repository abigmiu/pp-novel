package org.ppnovel.web;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@MapperScan("org.ppnovel.common.mapper")
@EnableAsync
public class WebApplication implements CommandLineRunner {
    @Autowired
    private ConfigurableApplicationContext context;

    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(WebApplication.class);
        app.run(args);
    }

    @Override
    public void run(String... args) throws Exception {
        // 这里是应用启动后执行的逻辑
        System.out.println("=================================");
        System.out.println("       启动成功      ");
        int port = context.getEnvironment().getProperty("server.port", Integer.class);
        System.out.println("启动端口-" + port);
        System.out.println("=================================");
    }
}
