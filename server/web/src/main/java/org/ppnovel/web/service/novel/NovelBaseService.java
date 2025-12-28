package org.ppnovel.web.service.novel;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import org.ppnovel.common.dto.common.PageResponse;
import org.ppnovel.common.dto.web.novel.NovelCatelogRes;
import org.ppnovel.common.dto.web.novel.NovelDetailRes;
import org.ppnovel.common.dto.web.novel.NovelPageListReq;
import org.ppnovel.common.dto.web.novel.NovelPageListRes;
import org.ppnovel.common.dto.web.novel.common.NovelCategoryRes;
import org.ppnovel.common.entity.novel.NovelCategoryEntity;
import org.ppnovel.common.entity.novel.NovelEntity;
import org.ppnovel.common.entity.novel.NovelUserFavoriteEntity;
import org.ppnovel.common.entity.novel.NovelUserFollowEntity;
import org.ppnovel.common.entity.novel.NovelUserLikeEntity;
import org.ppnovel.common.exception.BusinessException;
import org.ppnovel.common.mapper.novel.NovelCategoryMapper;
import org.ppnovel.common.mapper.novel.NovelMapper;
import org.ppnovel.common.mapper.novel.NovelChapterMapper;
import org.ppnovel.common.mapper.novel.NovelUserFavoriteMapper;
import org.ppnovel.common.mapper.novel.NovelUserFollowMapper;
import org.ppnovel.common.mapper.novel.NovelUserLikeMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.dao.DuplicateKeyException;
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
    private final NovelUserFavoriteMapper novelUserFavoriteMapper;
    private final NovelUserLikeMapper novelUserLikeMapper;
    private final NovelUserFollowMapper novelUserFollowMapper;

    public  NovelBaseService(
        NovelCategoryMapper novelCategoryMapper,
        NovelMapper novelMapper,
        NovelChapterMapper novelChapterMapper,
        NovelUserFavoriteMapper novelUserFavoriteMapper,
        NovelUserLikeMapper novelUserLikeMapper,
        NovelUserFollowMapper novelUserFollowMapper
    ) {
        this.novelCategoryMapper = novelCategoryMapper;
        this.novelMapper = novelMapper;
        this.novelChapterMapper = novelChapterMapper;
        this.novelUserFavoriteMapper = novelUserFavoriteMapper;
        this.novelUserLikeMapper = novelUserLikeMapper;
        this.novelUserFollowMapper = novelUserFollowMapper;
    }
    private String getParentCategoryName(Integer parentId) {
        var map = new HashMap<Integer, String>();
        map.put(1, "主分类");
        map.put(2, "主题");
        map.put(3, "角色");
        map.put(4, "情节");
        return map.getOrDefault(parentId, "");
    }

    private Integer requireUserId() {
        Integer userId = SaTokenUtil.getUserId();
        if (userId == null) {
            throw new BusinessException("请先登录");
        }
        return userId;
    }

    private void ensureNovelExists(Integer novelId) {
        NovelEntity novel = novelMapper.selectById(novelId);
        if (novel == null) {
            throw new BusinessException("小说不存在");
        }
    }

    private void toggleFavorite(Integer novelId, boolean enable) {
        Integer userId = requireUserId();
        ensureNovelExists(novelId);
        LambdaQueryWrapper<NovelUserFavoriteEntity> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(NovelUserFavoriteEntity::getNovelId, novelId)
            .eq(NovelUserFavoriteEntity::getUserId, userId);
        if (enable) {
            if (novelUserFavoriteMapper.selectCount(queryWrapper) > 0) {
                return;
            }
            NovelUserFavoriteEntity entity = new NovelUserFavoriteEntity();
            entity.setNovelId(novelId);
            entity.setUserId(userId);
            try {
                novelUserFavoriteMapper.insert(entity);
            } catch (DuplicateKeyException ignore) {
            }
        } else {
            novelUserFavoriteMapper.delete(queryWrapper);
        }
    }

    private void toggleLike(Integer novelId, boolean enable) {
        Integer userId = requireUserId();
        ensureNovelExists(novelId);
        LambdaQueryWrapper<NovelUserLikeEntity> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(NovelUserLikeEntity::getNovelId, novelId)
            .eq(NovelUserLikeEntity::getUserId, userId);
        if (enable) {
            if (novelUserLikeMapper.selectCount(queryWrapper) > 0) {
                return;
            }
            NovelUserLikeEntity entity = new NovelUserLikeEntity();
            entity.setNovelId(novelId);
            entity.setUserId(userId);
            try {
                novelUserLikeMapper.insert(entity);
            } catch (DuplicateKeyException ignore) {
            }
        } else {
            novelUserLikeMapper.delete(queryWrapper);
        }
    }

    private void toggleFollow(Integer novelId, boolean enable) {
        Integer userId = requireUserId();
        ensureNovelExists(novelId);
        LambdaQueryWrapper<NovelUserFollowEntity> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(NovelUserFollowEntity::getNovelId, novelId)
            .eq(NovelUserFollowEntity::getUserId, userId);
        if (enable) {
            if (novelUserFollowMapper.selectCount(queryWrapper) > 0) {
                return;
            }
            NovelUserFollowEntity entity = new NovelUserFollowEntity();
            entity.setNovelId(novelId);
            entity.setUserId(userId);
            try {
                novelUserFollowMapper.insert(entity);
            } catch (DuplicateKeyException ignore) {
            }
        } else {
            novelUserFollowMapper.delete(queryWrapper);
        }
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
        Integer userId = SaTokenUtil.getUserId();

        detail.setFavoriteCount(novelUserFavoriteMapper.selectCount(new LambdaQueryWrapper<NovelUserFavoriteEntity>()
            .eq(NovelUserFavoriteEntity::getNovelId, novelId)));
        detail.setLikeCount(novelUserLikeMapper.selectCount(new LambdaQueryWrapper<NovelUserLikeEntity>()
            .eq(NovelUserLikeEntity::getNovelId, novelId)));
        detail.setFollowCount(novelUserFollowMapper.selectCount(new LambdaQueryWrapper<NovelUserFollowEntity>()
            .eq(NovelUserFollowEntity::getNovelId, novelId)));

        if (userId != null) {
            detail.setFavorited(novelUserFavoriteMapper.selectCount(new LambdaQueryWrapper<NovelUserFavoriteEntity>()
                .eq(NovelUserFavoriteEntity::getNovelId, novelId)
                .eq(NovelUserFavoriteEntity::getUserId, userId)) > 0);
            detail.setLiked(novelUserLikeMapper.selectCount(new LambdaQueryWrapper<NovelUserLikeEntity>()
                .eq(NovelUserLikeEntity::getNovelId, novelId)
                .eq(NovelUserLikeEntity::getUserId, userId)) > 0);
            detail.setFollowed(novelUserFollowMapper.selectCount(new LambdaQueryWrapper<NovelUserFollowEntity>()
                .eq(NovelUserFollowEntity::getNovelId, novelId)
                .eq(NovelUserFollowEntity::getUserId, userId)) > 0);
        } else {
            detail.setFavorited(false);
            detail.setLiked(false);
            detail.setFollowed(false);
        }
        return detail;
    }

    public void favoriteNovel(Integer novelId) {
        toggleFavorite(novelId, true);
    }

    public void cancelFavoriteNovel(Integer novelId) {
        toggleFavorite(novelId, false);
    }

    public void likeNovel(Integer novelId) {
        toggleLike(novelId, true);
    }

    public void cancelLikeNovel(Integer novelId) {
        toggleLike(novelId, false);
    }

    public void followNovel(Integer novelId) {
        toggleFollow(novelId, true);
    }

    public void cancelFollowNovel(Integer novelId) {
        toggleFollow(novelId, false);
    }
}
