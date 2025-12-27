package org.ppnovel.web.service.novel;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import org.apache.coyote.BadRequestException;
import org.ppnovel.common.constant.NovelChapterStatus;
import org.ppnovel.common.dto.web.novel.chapter.CreateChapterReq;
import org.ppnovel.common.entity.novel.NovelChapterEntity;
import org.ppnovel.common.exception.BusinessException;
import org.ppnovel.common.mapper.novel.NovelChapterMapper;
import org.ppnovel.web.util.SaTokenUtil;
import org.springframework.stereotype.Service;

@Service
public class WriterChapterService {

    private final NovelChapterMapper chapterMapper;

    public WriterChapterService(NovelChapterMapper chapterMapper) {
        this.chapterMapper = chapterMapper;
    }

    public Integer getBookMaxIdx(Integer authorId, Integer bookId) {
        Object obj = chapterMapper.selectObjs(
                new LambdaQueryWrapper<NovelChapterEntity>()
                    .select(NovelChapterEntity::getChapterIdx)
                    .eq(NovelChapterEntity::getAuthorId, authorId)
                    .eq(NovelChapterEntity::getBookId, bookId)
                    .orderByDesc(NovelChapterEntity::getChapterIdx)
                    .last("limit 1")
            ).stream()
            .findFirst()
            .orElse(0);
        return ((Number) obj).intValue();
    }

    public void createChapter(CreateChapterReq req) {
        // TODO: 检查书本和作者是否一致
        Integer authorId = SaTokenUtil.getUserId();
        Integer maxIdx = getBookMaxIdx(authorId, req.getBookId());
        if (maxIdx + 1 != req.getChapterIdx()) {
            throw new BusinessException("max chapter idx is " + maxIdx);
        }


        NovelChapterEntity  entity = new NovelChapterEntity();
        entity.setAuthorId(authorId);
        entity.setTitle(req.getTitle());   
        entity.setBookId(req.getBookId());
        entity.setChapterIdx(req.getChapterIdx());
        entity.setContent(req.getContent());
        entity.setStatus(NovelChapterStatus.PENDING_CHECK);
        entity.setAuthorRemark(req.getAuthorRemark());
        chapterMapper.insert(entity);
    }
}
