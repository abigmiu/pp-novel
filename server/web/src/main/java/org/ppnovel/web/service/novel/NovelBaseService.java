package org.ppnovel.web.service.novel;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import org.apache.coyote.BadRequestException;
import org.ppnovel.common.dto.web.novel.common.NovelCategoryRes;
import org.ppnovel.common.entity.novel.NovelCategoryEntity;
import org.ppnovel.common.exception.BusinessException;
import org.ppnovel.common.mapper.novel.NovelCategoryMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Service
public class NovelBaseService {
    private NovelCategoryMapper novelCategoryMapper;

    public  NovelBaseService(
        NovelCategoryMapper novelCategoryMapper
    ) {
        this.novelCategoryMapper = novelCategoryMapper;
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
}
