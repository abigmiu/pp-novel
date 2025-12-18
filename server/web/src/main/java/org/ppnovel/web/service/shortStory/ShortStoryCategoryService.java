package org.ppnovel.web.service.shortStory;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import org.ppnovel.common.dto.web.shortStory.ShortStoryCategoryListResponse;
import org.ppnovel.common.dto.web.shortStory.ShortStoryCategoryTreeRes;
import org.ppnovel.common.entity.ShortStoryCategoryEntity;
import org.ppnovel.common.mapper.ShortStoryCategoryMapper;
import org.ppnovel.web.component.RedisUtil;
import org.springframework.stereotype.Service;

import java.util.*;


@Service
public class ShortStoryCategoryService {
    private final ShortStoryCategoryMapper shortStoryCategoryMapper;
    private final RedisUtil redisUtil;

    public ShortStoryCategoryService(ShortStoryCategoryMapper shortStoryCategoryMapper, RedisUtil redisUtil) {
        this.shortStoryCategoryMapper = shortStoryCategoryMapper;
        this.redisUtil = redisUtil;
    }


    /**
     * 获取短故事的分类
     */
    public ArrayList<ShortStoryCategoryListResponse> getCategoryList() {
        // 从 redis 获取数据
        Map<String, ShortStoryCategoryEntity> redisData = redisUtil.hgetall("shortStoryCategory", ShortStoryCategoryEntity.class);

        if (redisData.isEmpty()) {

            QueryWrapper<ShortStoryCategoryEntity> queryWrapper = new QueryWrapper<>();
            List<ShortStoryCategoryEntity> categoryList = shortStoryCategoryMapper.selectList(queryWrapper);
            categoryList.forEach(category -> {
                redisData.put(category.getId().toString(), category);
            });

            redisUtil.hset("shortStoryCategory", redisData);
        }

        ArrayList<ShortStoryCategoryListResponse> response = new ArrayList<>();

        redisData.forEach((key, value) -> {
            if (!(value.getParentId() == null)) {
                String label = redisData.get(value.getParentId().toString()).getName();
                ShortStoryCategoryListResponse responseVo = new ShortStoryCategoryListResponse();
                ShortStoryCategoryEntity shortStoryCategoryEntity = redisData.get(key);
                responseVo.setLabel(label);
                responseVo.setName(value.getName());
                responseVo.setId(value.getId());
                responseVo.setCover(value.getCover());
                response.add(responseVo);
            }
        });
        return response;
    }


    /**
     * 获取短故事分类树型结构
     *
     */
    public ArrayList<ShortStoryCategoryTreeRes> getCategoryTree() {
        Map<String, ShortStoryCategoryEntity> redisData = redisUtil.hgetall("shortStoryCategory", ShortStoryCategoryEntity.class);

        if (redisData.isEmpty()) {

            QueryWrapper<ShortStoryCategoryEntity> queryWrapper = new QueryWrapper<>();
            List<ShortStoryCategoryEntity> categoryList = shortStoryCategoryMapper.selectList(queryWrapper);
            categoryList.forEach(category -> {
                redisData.put(category.getId().toString(), category);
            });

            redisUtil.hset("shortStoryCategory", redisData);
        }

        ArrayList<ShortStoryCategoryTreeRes> responseVo = new ArrayList<ShortStoryCategoryTreeRes>();


        Map<Integer, ShortStoryCategoryTreeRes> nodeMap = new HashMap<>();
        for (ShortStoryCategoryEntity shortStoryCategoryEntity : redisData.values()) {
            ShortStoryCategoryTreeRes shortStoryCategoryTreeRes = new ShortStoryCategoryTreeRes();
            shortStoryCategoryTreeRes.setId(shortStoryCategoryEntity.getId());
            shortStoryCategoryTreeRes.setName(shortStoryCategoryEntity.getName());
            shortStoryCategoryTreeRes.setCoverUrl(shortStoryCategoryEntity.getCover());
            nodeMap.put(shortStoryCategoryEntity.getId(), shortStoryCategoryTreeRes);
        }

        for (ShortStoryCategoryEntity shortStoryCategoryEntity : redisData.values()) {
            Integer parentId = shortStoryCategoryEntity.getParentId();
            ShortStoryCategoryTreeRes currentNode = nodeMap.get(shortStoryCategoryEntity.getId());
            if (parentId == null) {
                currentNode.setChildren(new ArrayList<>());
                responseVo.add(currentNode);
            } else {
                ShortStoryCategoryTreeRes parentNode = nodeMap.get(parentId);
                if (parentNode.getChildren() == null) {
                    parentNode.setChildren(new ArrayList<>());
                }
                parentNode.getChildren().add(currentNode);
            }
        }

        return responseVo;
    }
}
