package org.ppnovel.web.service.shortStory;
import org.ppnovel.common.entity.UserEntity;
import org.ppnovel.common.entity.UserShortStoryProgressEntity;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.ppnovel.common.constant.ShortStoryStatus;
import org.ppnovel.common.dto.common.PageResponse;
import org.ppnovel.common.dto.common.Result;
import org.ppnovel.common.dto.web.shortStory.CreateShortStory;
import org.ppnovel.common.dto.web.shortStory.SelfShortStoryPageQuery;
import org.ppnovel.common.dto.web.shortStory.ShortStoryAuthor;
import org.ppnovel.common.dto.web.shortStory.ShortStoryDetailResponse;
import org.ppnovel.common.dto.web.shortStory.SubmitReadingProgress;
import org.ppnovel.common.entity.ShortStoryAnalyticsEntity;
import org.ppnovel.common.entity.ShortStoryEntity;
import org.ppnovel.common.dto.web.shortStory.CreateShortStory;
import org.ppnovel.common.entity.ShortStoryEntity;
import org.ppnovel.common.exception.BusinessException;
import org.ppnovel.common.entity.UserShortStoryProgressEntity;

import org.ppnovel.common.mapper.ShortStoryAnalyticsMapper;
import org.ppnovel.common.mapper.ShortStoryMapper;
import org.ppnovel.common.mapper.UserMapper;
import org.ppnovel.common.mapper.UserShortStoryProgressMapper;
import org.ppnovel.web.util.SaTokenUtil;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Service
public class ShortStoryService {
    private final ShortStoryMapper shortStoryMapper;
    private final UserMapper userMapper;
    private final ShortStoryAnalyticsMapper shortStoryAnalyticsMapper;
    private final UserShortStoryProgressMapper userShortStoryProgressMapper;

    public ShortStoryService(ShortStoryMapper shortStoryMapper, UserMapper userMapper, ShortStoryAnalyticsMapper shortStoryAnalyticsMapper, UserShortStoryProgressMapper userShortStoryProgressMapper) {
        this.shortStoryMapper = shortStoryMapper;
        this.userMapper = userMapper;
        this.shortStoryAnalyticsMapper = shortStoryAnalyticsMapper;
        this.userShortStoryProgressMapper = userShortStoryProgressMapper;
    }

    public void createShortStory(CreateShortStory createDto) {
        boolean hasFreeRate = createDto.getFreeRate() != null;
        boolean hasFreeParagraph = createDto.getFreeParagraph() != null;
        if (
            (hasFreeRate && !hasFreeParagraph) || (!hasFreeRate && hasFreeParagraph)
        ) {
            throw new BusinessException("试读比例和试读段落数必须同时传");
        }

        ShortStoryEntity shortStoryEntity = new ShortStoryEntity();
        shortStoryEntity.setTitle(createDto.getTitle());
        shortStoryEntity.setContent(createDto.getContent());
        shortStoryEntity.setCover(createDto.getCover());
        shortStoryEntity.setToutiaoCover(createDto.getToutiaoCover());
        shortStoryEntity.setFreeRate(createDto.getFreeRate());
        shortStoryEntity.setFreeParagraph(createDto.getFreeParagraph());
        shortStoryEntity.setRecommendTitle(createDto.getRecommendTitle());
        shortStoryEntity.setContentLength(createDto.getContent().length());
        shortStoryEntity.setAuthorId(SaTokenUtil.getUserId());
        shortStoryEntity.setStatus(ShortStoryStatus.UNDER_REVIEW);
        shortStoryMapper.insert(shortStoryEntity);
    }

    public ShortStoryDetailResponse getShortStoryDetail(Long id) {
        ShortStoryEntity entity = shortStoryMapper.selectById(id);
        if (entity == null) {
            throw new BusinessException("短故事不存在");
        }

        ShortStoryDetailResponse response = new ShortStoryDetailResponse();

        response.setId(entity.getId());
        String fullContent = entity.getContent();
        String content;
        Integer freeParagraph = entity.getFreeParagraph();
        if (freeParagraph != null) {
            String[] lines = fullContent.split("\n");
            String[] firstLines = Arrays.copyOfRange(lines, 0, Math.min(freeParagraph, lines.length));
            content = String.join("\n", firstLines);
        } else {
            content = fullContent;
        }
        response.setContent(content);
        response.setFreeRate(entity.getFreeRate());
        response.setFreeParagraph(entity.getFreeParagraph());
        response.setRecommendTitle(entity.getRecommendTitle());
        response.setContentLength(entity.getContentLength());
        response.setUpdatedAt(entity.getUpdatedAt());

        UserEntity userEntity = userMapper.selectById(entity.getAuthorId());
        ShortStoryAuthor author = new ShortStoryAuthor();
        author.setId(userEntity.getId());
        author.setName(userEntity.getPseudonym());
        author.setAvatar(userEntity.getAvatar());
        response.setAuthor(author);

        return response;
    }

    public PageResponse getSelfShortPageData(SelfShortStoryPageQuery query) {
        QueryWrapper<ShortStoryEntity> queryWrapper = new QueryWrapper<ShortStoryEntity>();
        queryWrapper.eq("author_id", SaTokenUtil.getUserId());
        System.out.println(query.getStatus());
        if (query.getStatus() != null) {
            queryWrapper.eq("status", query.getStatus());
        }
        if ("desc".equalsIgnoreCase(query.getDateSort())) {
            queryWrapper.orderByDesc("created_at");
        } else if ("asc".equalsIgnoreCase(query.getDateSort())) {
            queryWrapper.orderByAsc("created_at");
        }
        Page<ShortStoryEntity> page = new Page<>(query.getPage(), query.getSize());

        page = shortStoryMapper.selectPage(page, queryWrapper);
        return new PageResponse(page);
    }

    private int getBucket(int readingTime) {
        if (readingTime < 15) return 0;
        if (readingTime < 30) return 1;
        if (readingTime < 60) return 2;
        return 3;
    }

    public void submitReadingProgress(SubmitReadingProgress submitReadingProgress) {
        Integer userId = SaTokenUtil.getUserId();
        Integer storyId = submitReadingProgress.getStoryId();
        Integer newReadingTime = submitReadingProgress.getReadingTime();

        QueryWrapper<UserShortStoryProgressEntity> progressQueryWrapper = new QueryWrapper<>();
        progressQueryWrapper.eq("user_id", userId);
        progressQueryWrapper.eq("short_story_id", storyId);
        UserShortStoryProgressEntity progressEntity = userShortStoryProgressMapper.selectOne(progressQueryWrapper);

        int oldReadingTime = progressEntity != null ? progressEntity.getReadingTime() : 0;

        if (newReadingTime <= oldReadingTime) {
            return;
        }

        ShortStoryAnalyticsEntity analyticsEntity = shortStoryAnalyticsMapper.selectById(storyId);
        if (analyticsEntity == null) {
            analyticsEntity = new ShortStoryAnalyticsEntity();
            analyticsEntity.setShortStoryId(storyId);
            analyticsEntity.setReaders(0L);
            analyticsEntity.setFifteenSecondReaders(0L);
            analyticsEntity.setThirtySecondReaders(0L);
            analyticsEntity.setSixtySecondReaders(0L);
            analyticsEntity.setBottomReaders(0L);
            analyticsEntity.setTotalReads(0);
            analyticsEntity.setTotalFavorites(0L);
            analyticsEntity.setPaymentCount(0);
        }

        if (progressEntity == null) {
            progressEntity = new UserShortStoryProgressEntity();
            progressEntity.setUserId(userId);
            progressEntity.setShortStoryId(storyId);
            analyticsEntity.setReaders(analyticsEntity.getReaders() + 1);
        }

        progressEntity.setReadingTime(newReadingTime);

        int oldBucket = getBucket(oldReadingTime);
        int newBucket = getBucket(newReadingTime);

        if (oldBucket != newBucket) {
            if (oldBucket == 1) {
                analyticsEntity.setFifteenSecondReaders(analyticsEntity.getFifteenSecondReaders() - 1);
            } else if (oldBucket == 2) {
                analyticsEntity.setThirtySecondReaders(analyticsEntity.getThirtySecondReaders() - 1);
            } else if (oldBucket == 3) {
                analyticsEntity.setSixtySecondReaders(analyticsEntity.getSixtySecondReaders() - 1);
            }

            if (newBucket == 1) {
                analyticsEntity.setFifteenSecondReaders(analyticsEntity.getFifteenSecondReaders() + 1);
            } else if (newBucket == 2) {
                analyticsEntity.setThirtySecondReaders(analyticsEntity.getThirtySecondReaders() + 1);
            } else if (newBucket == 3) {
                analyticsEntity.setSixtySecondReaders(analyticsEntity.getSixtySecondReaders() + 1);
            }
        }

        if (progressEntity.getId() == null) {
            userShortStoryProgressMapper.insert(progressEntity);
        } else {
            userShortStoryProgressMapper.updateById(progressEntity);
        }

        shortStoryAnalyticsMapper.updateById(analyticsEntity);
    }
}

