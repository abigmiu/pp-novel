package org.ppnovel.web.service.upload;

import com.aliyun.oss.ClientBuilderConfiguration;
import com.aliyun.oss.HttpMethod;
import com.aliyun.oss.OSS;
import com.aliyun.oss.OSSClientBuilder;
import com.aliyun.oss.common.auth.CredentialsProvider;
import com.aliyun.oss.common.auth.CredentialsProviderFactory;
import com.aliyun.oss.common.auth.DefaultCredentialProvider;
import com.aliyun.oss.common.auth.EnvironmentVariableCredentialsProvider;
import com.aliyun.oss.common.comm.SignVersion;
import com.aliyun.oss.model.GeneratePresignedUrlRequest;
import com.aliyuncs.auth.StaticCredentialsProvider;
import com.aliyuncs.exceptions.ClientException;
import com.aventrix.jnanoid.jnanoid.NanoIdUtils;
import org.ppnovel.common.dto.web.upload.ShortStoryCoverGetUploadSignReq;
import org.ppnovel.common.dto.web.upload.ShortStoryCoverGetUploadSignRes;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URL;
import java.util.Date;

@Service
public class AliUploadService {
    @Value("${aliOss.accessKey}")
    private String accessKey;

    @Value("${aliOss.secretKey}")
    private String secretKey;

    public ShortStoryCoverGetUploadSignRes getShortStoryCoverUploadUrl(ShortStoryCoverGetUploadSignReq reqData) {
        String endpoint = "https://oss-cn-shanghai.aliyuncs.com";
        String region = "cn-shanghai";
        String bucketName = "mk-upload-sh";
        String objectName = NanoIdUtils.randomNanoId();
        DefaultCredentialProvider credentialsProvider = new DefaultCredentialProvider(accessKey, secretKey);


        ClientBuilderConfiguration clientBuilderConfiguration = new ClientBuilderConfiguration();
        clientBuilderConfiguration.setSignatureVersion(SignVersion.V4);
        OSS ossClient = OSSClientBuilder.create()
            .endpoint(endpoint)
            .credentialsProvider(credentialsProvider)
            .clientConfiguration(clientBuilderConfiguration)
            .region(region)
            .build();
        URL signedUrl = null;
        Date expiration = new Date(new Date().getTime() + 3600 * 1000L);

        // 生成预签名URL。
        GeneratePresignedUrlRequest request = new GeneratePresignedUrlRequest(bucketName, objectName, HttpMethod.PUT);
        // 设置过期时间。
        request.setExpiration(expiration);
        request.setContentType(reqData.getContentType());
        // 通过HTTP PUT请求生成预签名URL。
        signedUrl = ossClient.generatePresignedUrl(request);

        ShortStoryCoverGetUploadSignRes response = new ShortStoryCoverGetUploadSignRes();
        response.setUploadUrl(signedUrl.toString());
        response.setDownloadUrl("https://mk-upload-sh.oss-cn-shanghai.aliyuncs.com/".concat(objectName));
        return response;
    }
}
