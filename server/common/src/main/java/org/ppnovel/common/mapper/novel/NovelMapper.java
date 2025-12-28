package org.ppnovel.common.mapper.novel;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.ibatis.annotations.Param;
import org.ppnovel.common.dto.web.novel.NovelPageListReq;
import org.ppnovel.common.dto.web.novel.NovelPageListRes;
import org.ppnovel.common.entity.novel.NovelEntity;

public interface NovelMapper extends BaseMapper<NovelEntity> {
    Page<NovelPageListRes> selectNovelPage(Page<NovelPageListRes> page, @Param("req") NovelPageListReq req);
}
