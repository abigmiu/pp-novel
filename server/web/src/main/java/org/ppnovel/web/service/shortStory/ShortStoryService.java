package org.ppnovel.web.service.shortStory;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import org.ppnovel.common.dto.web.shortStory.*;
import org.ppnovel.common.entity.*;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.ppnovel.common.constant.ShortStoryStatus;
import org.ppnovel.common.dto.common.PageResponse;
import org.ppnovel.common.dto.common.Result;
import org.ppnovel.common.dto.web.shortStory.CreateShortStory;
import org.ppnovel.common.entity.ShortStoryEntity;
import org.ppnovel.common.exception.BusinessException;
import org.ppnovel.common.entity.UserShortStoryProgressEntity;

import org.ppnovel.common.mapper.*;
import org.ppnovel.web.util.SaTokenUtil;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class ShortStoryService {
    private final ShortStoryMapper shortStoryMapper;
    private final ShortStoryDraftMapper shortStoryDraftMapper;
    private final UserMapper userMapper;
    private final ShortStoryAnalyticsMapper shortStoryAnalyticsMapper;
    private final UserShortStoryProgressMapper userShortStoryProgressMapper;
    private final ShortStoryCategoryMapper shortStoryCategoryMapper;
    private final ShortStoryDraftRelateCategoryMapper shortStoryDraftRelateCategoryMapper;
    private final ShortStoryRelateCategoryMapper shortStoryRelateCategoryMapper;

    public ShortStoryService(
        ShortStoryMapper shortStoryMapper,
        UserMapper userMapper,
        ShortStoryAnalyticsMapper shortStoryAnalyticsMapper,
        UserShortStoryProgressMapper userShortStoryProgressMapper,
        ShortStoryDraftMapper shortStoryDraftMapper,
        ShortStoryCategoryMapper shortStoryCategoryMapper,
        ShortStoryDraftRelateCategoryMapper shortStoryDraftRelateCategoryMapper,
        ShortStoryRelateCategoryMapper shortStoryRelateCategoryMapper) {
        this.shortStoryMapper = shortStoryMapper;
        this.userMapper = userMapper;
        this.shortStoryAnalyticsMapper = shortStoryAnalyticsMapper;
        this.userShortStoryProgressMapper = userShortStoryProgressMapper;
        this.shortStoryDraftMapper = shortStoryDraftMapper;
        this.shortStoryCategoryMapper = shortStoryCategoryMapper;
        this.shortStoryDraftRelateCategoryMapper = shortStoryDraftRelateCategoryMapper;
        this.shortStoryRelateCategoryMapper = shortStoryRelateCategoryMapper;
    }

    /**
     * 删除草稿箱
     *
     * @param draftId 草稿箱id
     */
    private void deleteDraft(Integer draftId) {
        shortStoryDraftMapper.deleteById(draftId);
    }

    private void updateDraftReletCategoryIds(Integer draftId, List<Integer> categoryIds) {
        LambdaQueryWrapper<ShortStoryDraftRelateCategoryEntity> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(ShortStoryDraftRelateCategoryEntity::getStoryId, draftId);

        shortStoryDraftRelateCategoryMapper.delete(queryWrapper);

        categoryIds.forEach(categoryId -> {
            ShortStoryDraftRelateCategoryEntity categoryEntity = new ShortStoryDraftRelateCategoryEntity();
            categoryEntity.setCategoryId(categoryId);
            categoryEntity.setStoryId(draftId);
            shortStoryDraftRelateCategoryMapper.insert(categoryEntity);
        });
    }

    private void updateStoryRelateCategoryIds(Integer storyId, List<Integer> categoryIds) {
        LambdaQueryWrapper<ShortStoryRelateCategoryEntity> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(ShortStoryRelateCategoryEntity::getStoryId, storyId);
        shortStoryRelateCategoryMapper.delete(queryWrapper);

        categoryIds.forEach(categoryId -> {
            ShortStoryRelateCategoryEntity categoryEntity = new ShortStoryRelateCategoryEntity();
            categoryEntity.setCategoryId(categoryId);
            categoryEntity.setStoryId(storyId);
            shortStoryRelateCategoryMapper.insert(categoryEntity);
        });
    }

    private List<ShortStoryCategorySimpleListItem> findCategories(Integer draftId) {
        LambdaQueryWrapper<ShortStoryDraftRelateCategoryEntity> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(ShortStoryDraftRelateCategoryEntity::getStoryId, draftId);
        List<ShortStoryDraftRelateCategoryEntity> relateEntity = shortStoryDraftRelateCategoryMapper.selectList(queryWrapper);
        List<ShortStoryCategorySimpleListItem> categoryIds = new ArrayList<>();
        return new ArrayList<>();
    }

    public void createShortStory(CreateShortStory createDto) {
        boolean hasFreeRate = createDto.getFreeRate() != null;
        boolean hasFreeParagraph = createDto.getFreeParagraph() != null;
        if (
            (hasFreeRate && !hasFreeParagraph) || (!hasFreeRate && hasFreeParagraph)
        ) {
            throw new BusinessException("试读比例和试读段落数必须同时传");
        }

        Integer authorId = SaTokenUtil.getUserId();
        ShortStoryDraftEntity draftEntity = null;
        if (createDto.getDraftId() != null) {
            draftEntity = shortStoryDraftMapper.selectById(createDto.getDraftId());
            if (draftEntity == null || !authorId.equals(draftEntity.getAuthorId())) {
                throw new BusinessException("草稿不存在或无权发布");
            }
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
        shortStoryEntity.setAuthorId(authorId);
        shortStoryEntity.setStatus(ShortStoryStatus.UNDER_REVIEW);
        shortStoryMapper.insert(shortStoryEntity);
        if (draftEntity != null) {
            deleteDraft(draftEntity.getId());
        }

        updateStoryRelateCategoryIds(shortStoryEntity.getId(), createDto.getCategoryIds());
    }

    public void createShortStoryDraft(CreateShortStoryDraft reqBody) {
        Integer authorId = SaTokenUtil.getUserId();
        ShortStoryDraftEntity draftEntity;
        if (reqBody.getDraftId() != null) {
            draftEntity = shortStoryDraftMapper.selectById(reqBody.getDraftId());
            if (draftEntity == null || !authorId.equals(draftEntity.getAuthorId())) {
                throw new BusinessException("草稿不存在或无权修改");
            }
        } else {
            draftEntity = new ShortStoryDraftEntity();
            draftEntity.setAuthorId(authorId);
            draftEntity.setStatus(ShortStoryStatus.DRAFT);
        }

        draftEntity.setTitle(reqBody.getTitle());
        String content = reqBody.getContent();


        draftEntity.setContent(content);
        draftEntity.setContentLength(content == null ? 0 : content.length());
        draftEntity.setCover(reqBody.getCover());
        draftEntity.setToutiaoCover(reqBody.getToutiaoCover());
        draftEntity.setFreeRate(reqBody.getFreeRate());
        draftEntity.setFreeParagraph(reqBody.getFreeParagraph());
        draftEntity.setRecommendTitle(reqBody.getRecommendTitle());
        draftEntity.setStatus(ShortStoryStatus.DRAFT);
        draftEntity.setAuthorId(authorId);

        if (draftEntity.getId() == null) {
            shortStoryDraftMapper.insert(draftEntity);

        } else {
            shortStoryDraftMapper.updateById(draftEntity);
        }

        updateDraftReletCategoryIds(draftEntity.getId(), reqBody.getCategoryIds());
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

    public void deleteStoryCategories(Integer storyId) {
        LambdaQueryWrapper<ShortStoryRelateCategoryEntity> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(ShortStoryRelateCategoryEntity::getStoryId, storyId);
        shortStoryRelateCategoryMapper.delete(queryWrapper);
    }

    public void deleteDraftCategories(Integer draftId) {
        LambdaQueryWrapper<ShortStoryDraftRelateCategoryEntity> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(ShortStoryDraftRelateCategoryEntity::getStoryId, draftId);

        shortStoryDraftRelateCategoryMapper.delete(queryWrapper);
    }

    public void deleteSelfDraft(Integer draftId) {
        LambdaQueryWrapper<ShortStoryDraftEntity> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(ShortStoryDraftEntity::getId, draftId);
        queryWrapper.eq(ShortStoryDraftEntity::getAuthorId, SaTokenUtil.getUserId());
        ShortStoryDraftEntity foundData =  shortStoryDraftMapper.selectOne(queryWrapper);
        if (foundData == null) {
            throw new BusinessException("草稿不存在");
        }
        shortStoryDraftMapper.deleteById(foundData.getId());
        deleteDraftCategories(foundData.getId());
    }

    public PageResponse<DraftPageRes> getSelfDraftPageData(DraftPageReq queryReq) {
        LambdaQueryWrapper<ShortStoryDraftEntity> queryWrapper = new LambdaQueryWrapper<>();

        queryWrapper.eq(ShortStoryDraftEntity::getAuthorId, SaTokenUtil.getUserId());
        if (queryReq.isDataSortDesc()) {
            queryWrapper.orderByDesc(ShortStoryDraftEntity::getCreatedAt);
        } else {
            queryWrapper.orderByAsc(ShortStoryDraftEntity::getCreatedAt);
        }

        Page<ShortStoryDraftEntity> page = new Page<>(queryReq.getPage(), queryReq.getSize());
        page = shortStoryDraftMapper.selectPage(page, queryWrapper);


        return buildDraftPageRes(page);
    }

    private PageResponse<DraftPageRes> buildDraftPageRes(Page<ShortStoryDraftEntity> entityPage) {
        List<ShortStoryDraftEntity> draftEntities = entityPage.getRecords();
        if (draftEntities.isEmpty()) {
            Page<DraftPageRes> emptyPage = new Page<>();
            emptyPage.setPages(entityPage.getPages());
            emptyPage.setSize(entityPage.getSize());
            emptyPage.setTotal(entityPage.getTotal());
            emptyPage.setRecords(new ArrayList<>());
            return new PageResponse<DraftPageRes>(emptyPage);
        }

        List<Integer> draftIds = draftEntities.stream()
            .map(ShortStoryDraftEntity::getId)
            .toList();

        LambdaQueryWrapper<ShortStoryDraftRelateCategoryEntity> relateQuery = new LambdaQueryWrapper<>();
        relateQuery.in(ShortStoryDraftRelateCategoryEntity::getStoryId, draftIds);
        List<ShortStoryDraftRelateCategoryEntity> relateList = shortStoryDraftRelateCategoryMapper.selectList(relateQuery);

        Map<Integer, List<Integer>> draftToCategoryIds = relateList.stream()
            .collect(Collectors.groupingBy(
                ShortStoryDraftRelateCategoryEntity::getStoryId,
                Collectors.mapping(ShortStoryDraftRelateCategoryEntity::getCategoryId, Collectors.toList())
            ));

        List<Integer> categoryIds = relateList.stream()
            .map(ShortStoryDraftRelateCategoryEntity::getCategoryId)
            .distinct()
            .toList();

        Map<Integer, ShortStoryCategoryEntity> categoryMap = categoryIds.isEmpty()
            ? Map.of()
            : shortStoryCategoryMapper.selectBatchIds(categoryIds)
                .stream()
                .collect(Collectors.toMap(ShortStoryCategoryEntity::getId, c -> c));

        List<DraftPageRes> records = draftEntities.stream()
            .map(e -> {
                DraftPageRes data = new DraftPageRes();
                data.setId(e.getId());
                data.setTitle(e.getTitle());
                data.setCover(e.getCover());
                data.setContentLength(e.getContentLength());
                data.setUpdatedAt(e.getUpdatedAt());
                data.setCreatedAt(e.getCreatedAt());

                List<ShortStoryCategorySimpleListItem> categories = draftToCategoryIds.getOrDefault(e.getId(), List.of())
                    .stream()
                    .map(categoryId -> {
                        ShortStoryCategoryEntity foundData = categoryMap.get(categoryId);
                        if (foundData == null) {
                            return null;
                        }
                        ShortStoryCategorySimpleListItem listItem = new ShortStoryCategorySimpleListItem();
                        listItem.setId(foundData.getId());
                        listItem.setName(foundData.getName());
                        return listItem;
                    })
                    .filter(Objects::nonNull)
                    .toList();
                data.setCategories(new ArrayList<>(categories));
                return data;
            })
            .toList();
        Page<DraftPageRes> newPage = new Page<>();
        newPage.setPages(entityPage.getPages());
        newPage.setSize(entityPage.getSize());
        newPage.setTotal(entityPage.getTotal());
        newPage.setRecords(records);
        return new PageResponse<DraftPageRes>(newPage);
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
