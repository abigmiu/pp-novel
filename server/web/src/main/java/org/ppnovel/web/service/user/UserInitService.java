package org.ppnovel.web.service.user;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import lombok.extern.slf4j.Slf4j;
import org.ppnovel.common.entity.FansFollowEntity;
import org.ppnovel.common.entity.WriterStatEntity;
import org.ppnovel.common.mapper.FansFollowMapper;
import org.ppnovel.common.mapper.UserMapper;
import org.ppnovel.common.mapper.WriterStatMapper;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * 用户数据初始化
 */
@Slf4j
@Service
public class UserInitService {
    private final FansFollowMapper fansFollowMapper;
    private final WriterStatMapper writerStatMapper;

    public UserInitService(
        FansFollowMapper fansFollowMapper,
        WriterStatMapper writerStatMapper
    ) {
        this.fansFollowMapper = fansFollowMapper;
        this.writerStatMapper = writerStatMapper;
    }

    /**
     * 初始化粉丝和关注统计数据
     */
    @Async
    public void initFansFollowStat(Integer userId) {
        log.info("initFansFollowStat userId: {}", userId);
        LambdaQueryWrapper<FansFollowEntity> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(FansFollowEntity::getUserId, userId);
        FansFollowEntity fansFollowEntity = fansFollowMapper.selectOne(queryWrapper);
        if (fansFollowEntity == null) {
            fansFollowEntity = new FansFollowEntity();
            fansFollowEntity.setUserId(userId);
            fansFollowEntity.setFollowCount(0);
            fansFollowEntity.setFansCount(0);
            try {
                fansFollowMapper.insert(fansFollowEntity);
                log.info("初始化粉丝和关注统计数据成功 {}", userId);
            } catch (DuplicateKeyException duplicateKeyException) {
                log.error("初始化粉丝和关注统计数据重复: ", duplicateKeyException.fillInStackTrace());
            } catch (Exception e) {
                log.error("初始化粉丝和关注统计数据失败: ", e.fillInStackTrace());
            }
        }
    }


    @Async
    public void initWriterStat(Integer userId) {
        log.info("initWriterStat userId: {}", userId);
        WriterStatEntity writerStatEntity = new WriterStatEntity();
        writerStatEntity.setBookCount(0);
        writerStatEntity.setShortStoryCount(0);
        writerStatEntity.setBookChapterCount(0);
        writerStatEntity.setBookCharCount(0);
        writerStatEntity.setShortStoryCount(0);

        try {
            writerStatMapper.insert(writerStatEntity);
            log.info("初始化作者统计数据成功 {}", userId);
        } catch (DuplicateKeyException duplicateKeyException) {
            log.error("初始化作者统计数据重复", duplicateKeyException.fillInStackTrace());
        } catch (Exception e) {
            log.error("初始化作者统计数据失败", e.fillInStackTrace());
        }

    }
}
