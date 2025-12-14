package org.ppnovel.web.service.upload;

import java.lang.reflect.Array;
import java.net.URI;
import java.time.Duration;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.ppnovel.common.dto.web.upload.ShortStoryCoverGetUploadSignReq;
import org.ppnovel.common.exception.BusinessException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.aventrix.jnanoid.jnanoid.NanoIdUtils;

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.AwsCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

@Service
public class UploadService {
    @Value("${s3.bucket}")
    private String bucket;

    @Value("${s3.region}")
    private String region;

    @Value("${s3.access-key}")
    private String accessKey;

    @Value("${s3.secret-key}")
    private String secretKey;

    @Value("${s3.endpoint}")
    private String endPoint;

    public String generateShortStoryCoverUploadUrl(ShortStoryCoverGetUploadSignReq  req) {
         // 上传大小限制
        Integer maxSizeBytes = 1 * 1024 * 1204;
        ArrayList<String> whiteContentType = new ArrayList<>();
        whiteContentType.add("image/jpeg");
        whiteContentType.add("image/png");
        whiteContentType.add("image/webp");

        if (req.getContentLength() > maxSizeBytes) {
            throw new BusinessException("文件过大");
        }

        if (!whiteContentType.contains(req.getContentType())) {
            throw new BusinessException("文件类型");
        }


        S3Presigner presigner = S3Presigner.builder()
                .region(Region.of(region))
                .credentialsProvider(
                        StaticCredentialsProvider.create(
                                AwsBasicCredentials.create(accessKey, secretKey)))
                .endpointOverride(URI.create(endPoint))
                .build();


        String key = NanoIdUtils.randomNanoId();
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
            .bucket(bucket)
            .key(key)
            .contentType(req.getContentType())
            .contentLength(Long.parseLong(req.getContentLength().toString()))
            .build();


        PutObjectPresignRequest  presign  = PutObjectPresignRequest.builder()
            .signatureDuration(Duration.ofMinutes(15))
            .putObjectRequest(putObjectRequest)
            .build();

        String url = presigner.presignPutObject(presign).url().toString();
        return url;
    }
}
