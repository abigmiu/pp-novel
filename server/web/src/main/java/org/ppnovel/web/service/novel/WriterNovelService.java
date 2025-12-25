package org.ppnovel.web.service.novel;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import org.ppnovel.common.constant.NovelStatus;
import org.ppnovel.common.dto.web.novel.writer.CreateNovelReq;
import org.ppnovel.common.dto.web.novel.writer.CreateNovelRes;
import org.ppnovel.common.entity.novel.NovelEntity;
import org.ppnovel.common.entity.novel.NovelRelateCategoryEntity;
import org.ppnovel.common.exception.BusinessException;
import org.ppnovel.common.mapper.novel.NovelMapper;
import org.ppnovel.common.mapper.novel.NovelRelateCategoryMapper;
import org.ppnovel.web.util.SaTokenUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
public class WriterNovelService {
    private  NovelMapper novelMapper;
    private NovelRelateCategoryMapper novelRelateCategoryMapper;


    public  WriterNovelService(
        NovelMapper novelMapper,
        NovelRelateCategoryMapper novelRelateCategoryMapper
    ) {
        this.novelMapper = novelMapper;
        this.novelRelateCategoryMapper = novelRelateCategoryMapper;
    };

    @Transactional
    public CreateNovelRes createNovel(CreateNovelReq req) {
        Integer authorId = SaTokenUtil.getUserId();

        NovelEntity novelEntity = new NovelEntity();
        novelEntity.setAuthorId(authorId);
        novelEntity.setTitle(req.getTitle());
        novelEntity.setType(req.getType());
        novelEntity.setCover(req.getCover());
        novelEntity.setProtagonist1(req.getProtagonist1());
        novelEntity.setProtagonist2(req.getProtagonist2());
        novelEntity.setDescription(req.getDescription());
        novelEntity.setStatus(NovelStatus.PENDING_CHECK);

        novelMapper.insert(novelEntity);
        Integer novelId = novelEntity.getId();

        insertNovelRelateCategories(novelId, req.getCategoryIds(), 1);
        insertNovelRelateCategories(novelId, req.getThemeIds(), 2);
        insertNovelRelateCategories(novelId, req.getRoleIds(), 3);
        insertNovelRelateCategories(novelId, req.getPlotIds(), 4);

        CreateNovelRes res = new CreateNovelRes();
        res.setNovelId(novelId);
        return res;
    }

    @Transactional
    public void deleteNovel(Integer novelId) {
        Integer authorId = SaTokenUtil.getUserId();
        LambdaQueryWrapper<NovelEntity> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(NovelEntity::getId, novelId);
        queryWrapper.eq(NovelEntity::getAuthorId, authorId);
        NovelEntity novelEntity = novelMapper.selectOne(queryWrapper);
        if (novelEntity == null) {
            throw new BusinessException("novel not exit");
        }

//        deleteNovelRelateCategories(novelId);
        novelMapper.deleteById(novelId);
    }

    private void deleteNovelRelateCategories(Integer novelId) {
        LambdaQueryWrapper<NovelRelateCategoryEntity>  queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(NovelRelateCategoryEntity::getNovelId, novelId);
        novelRelateCategoryMapper.delete(queryWrapper);
    }

    private void insertNovelRelateCategories(Integer novelId, List<Integer> categoryIds, Integer categoryType) {
        if (novelId == null || categoryIds == null || categoryIds.isEmpty()) {
            return;
        }

        categoryIds.stream()
            .filter(Objects::nonNull)
            .distinct()
            .forEach(categoryId -> {
                NovelRelateCategoryEntity relate = new NovelRelateCategoryEntity();
                relate.setNovelId(novelId);
                relate.setCategoryId(categoryId);
                relate.setCategoryType(categoryType);
                novelRelateCategoryMapper.insert(relate);
            });
    }
}
