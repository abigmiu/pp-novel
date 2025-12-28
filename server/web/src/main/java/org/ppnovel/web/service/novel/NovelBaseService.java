package org.ppnovel.web.service.novel;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import org.ppnovel.common.dto.common.PageResponse;
import org.ppnovel.common.dto.web.novel.NovelCatelogRes;
import org.ppnovel.common.dto.web.novel.NovelDetailRes;
import org.ppnovel.common.dto.web.novel.NovelPageListReq;
import org.ppnovel.common.dto.web.novel.NovelPageListRes;
import org.ppnovel.common.dto.web.novel.common.NovelCategoryRes;
import org.ppnovel.common.entity.novel.NovelCategoryEntity;
import org.ppnovel.common.exception.BusinessException;
import org.ppnovel.common.mapper.novel.NovelCategoryMapper;
import org.ppnovel.common.mapper.novel.NovelMapper;
import org.ppnovel.common.mapper.novel.NovelChapterMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.ppnovel.web.util.SaTokenUtil;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Service
public class NovelBaseService {
    private final NovelCategoryMapper novelCategoryMapper;
    private final NovelMapper novelMapper;
    private final NovelChapterMapper novelChapterMapper;

    public  NovelBaseService(
        NovelCategoryMapper novelCategoryMapper,
        NovelMapper novelMapper,
        NovelChapterMapper novelChapterMapper
    ) {
        this.novelCategoryMapper = novelCategoryMapper;
        this.novelMapper = novelMapper;
        this.novelChapterMapper = novelChapterMapper;
    }
    private String getParentCategoryName(Integer parentId) {
        var map = new HashMap<Integer, String>();
        map.put(1, "主分类");
        map.put(2, "主题");
        map.put(3, "角色");
        map.put(4, "情节");
        return map.getOrDefault(parentId, "");
    }

   public List<NovelCategoryRes> getNovelCategory(Integer type) {
       LambdaQueryWrapper<NovelCategoryEntity>  queryWrapper = new LambdaQueryWrapper<>();
       if (type == 1) {
           queryWrapper.eq(NovelCategoryEntity::isMan, true);
       } else if (type == 2) {
           queryWrapper.eq(NovelCategoryEntity::isWoman, true);
       } else {
           throw new BusinessException("invalid type");
       }

       List<NovelCategoryEntity> novelCategories = novelCategoryMapper.selectList(queryWrapper);
       System.out.println(novelCategories.size());
       List<NovelCategoryRes> novelCategoriesRes = new ArrayList<>();
       for (NovelCategoryEntity novelCategory : novelCategories) {
           NovelCategoryRes novelCategoryRes = new NovelCategoryRes();
           BeanUtils.copyProperties(novelCategory, novelCategoryRes);
           novelCategoryRes.setParentName(getParentCategoryName(novelCategoryRes.getParentId()));
           novelCategoriesRes.add(novelCategoryRes);
       }
       return novelCategoriesRes;
   };

    public PageResponse<NovelPageListRes> getNovelPageList(NovelPageListReq req) {
        Page<NovelPageListRes> page = new Page<>(req.getPage(), req.getSize());
        Page<NovelPageListRes> resPage = novelMapper.selectNovelPage(page, req);
        return new PageResponse<>(resPage);
    }

    public List<NovelCatelogRes> getNovelCatalog(Integer novelId) {
        Integer userId = SaTokenUtil.getUserId();
        return novelChapterMapper.getNovelCatalog(novelId, userId);
    }

    public NovelDetailRes getNovelDetail(Integer novelId) {
        NovelDetailRes detail = novelMapper.getNovelDetail(novelId);
        if (detail == null) {
            throw new BusinessException("小说不存在");
        }
        return detail;
    }
}
