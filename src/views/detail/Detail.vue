<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" />

    <scroll class="content" ref="scroll" :probeType="3" @scroll="contentScroll">
      <detail-swiper :top-images="topImages" />
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shop" />
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad" />
      <detail-param-info ref="params" :paramInfo="paramInfo" />
      <detail-comment-info ref="comment" :comment-info="commentInfo" />
      <goods-list ref="recommend" :goods="recommends" />
    </scroll>
  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar";
import DetailSwiper from "./childComps/DetailSwiper";
import DetailBaseInfo from "./childComps/DetailBaseInfo";
import DetailShopInfo from "./childComps/DetailShopInfo";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
import DetailParamInfo from "./childComps/DetailParamInfo";
import DetailCommentInfo from "./childComps/DetailCommentInfo";

import Scroll from "components/common/scroll/Scroll";
import GoodsList from "components/content/goods/GoodsList";

import {
  getDetail,
  Goods,
  Shop,
  GoodsParams,
  getRecommends,
} from "network/detail";

export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    Scroll,
    GoodsList,
  },
  data() {
    return {
      iid: null,
      topImages: null,
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [],
    };
  },
  created() {
    // 1保存传入的iid
    this.iid = this.$route.params.iid;
    // 2根据iid请求数据详情
    getDetail(this.iid).then((res) => {
      // console.log(res);
      // 1获取顶部的轮播图图片
      const data = res.result;
      this.topImages = data.itemInfo.topImages;

      // 2获取商品信息（价格、标题、售后等）
      this.goods = new Goods(
        data.itemInfo,
        data.columns,
        data.shopInfo.services
      );

      // 3获取商家信息
      this.shop = new Shop(data.shopInfo);

      // 4获取商品的详情数据
      this.detailInfo = data.detailInfo;

      // 5获取商品参数信息
      this.paramInfo = new GoodsParams(
        data.itemParams.info,
        data.itemParams.rule
      );

      // 6获取商品评论信息
      if (data.rate.crate !== 0) {
        this.commentInfo = data.rate.list[0];
      }

      this.$nextTick(() => {
        // 能获取到数据 但是数据不一定对
        // DOM已经渲染完成 但是图片没有加载完成 故图片的高度没有被算进去
        // this.themeTopYs = [];
        // this.themeTopYs.push(0);
        // this.themeTopYs.push(this.$refs.params.$el.offsetTop);
        // this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
        // console.log(this.themeTopYs);
      });
    });
    // 3获取推荐数据
    getRecommends().then((res) => {
      this.recommends = res.data.list;
    });
  },
  mounted() {},
  updated() {},
  methods: {
    imageLoad() {
      this.$refs.scroll.refresh();

      this.themeTopYs = [];
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);

      console.log(this.themeTopYs);
    },
    titleClick(index) {
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 100);
    },
    contentScroll(position) {
      let y = -position.y;
      if (y >= this.themeTopYs[3]) {
        this.$refs.scroll.currentIndex = 3;
      } else if (y >= this.themeTopYs[2]) {
        this.$refs.scroll.currentIndex = 2;
      } else if (y >= this.themeTopYs[1]) {
        this.$refs.scroll.currentIndex = 1;
      } else {
        this.$refs.scroll.currentIndex = 0;
      }
    },
  },
};
</script>

<style scoped>
#detail {
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}

.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
}

.content {
  height: calc(100% - 44px);
}
</style>