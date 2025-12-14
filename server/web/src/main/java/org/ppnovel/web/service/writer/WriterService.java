package org.ppnovel.web.service.writer;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import lombok.extern.slf4j.Slf4j;
import org.ppnovel.common.dto.web.writer.WebWriterStatResponse;
import org.ppnovel.common.entity.WriterStatEntity;
import org.ppnovel.common.mapper.WriterStatMapper;
import org.ppnovel.web.service.user.UserInitService;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class WriterService {
    private WriterStatMapper writerStatMapper;
    private UserInitService userInitService;

    public WriterService(WriterStatMapper writerStatMapper, UserInitService userInitService) {
        this.writerStatMapper = writerStatMapper;
        this.userInitService = userInitService;
    }

    /**
     * 获取作者统计数据
     */
    public WebWriterStatResponse stat(Integer userId) {
        WebWriterStatResponse response = new WebWriterStatResponse();
        LambdaQueryWrapper<WriterStatEntity> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(
            WriterStatEntity::getUserId,
            userId
        );

        WriterStatEntity writerStatEntity = writerStatMapper.selectOne(queryWrapper);
        if (writerStatEntity == null) {
            userInitService.initWriterStat(userId);
            writerStatEntity = new WriterStatEntity();
            writerStatEntity.setBookCount(0);
            writerStatEntity.setShortStoryCount(0);
            writerStatEntity.setBookChapterCount(0);
            writerStatEntity.setBookCharCount(0);
            writerStatEntity.setShortStoryCount(0);
        }

        response.setBookCount(writerStatEntity.getBookCount());
        response.setShortStoryCount(writerStatEntity.getShortStoryCount());
        response.setBookChapterCount(writerStatEntity.getBookChapterCount());
        response.setBookCharCount(writerStatEntity.getBookCharCount());
        response.setShortStoryCharCount(writerStatEntity.getShortStoryCharCount());
        return response;
    }
}
