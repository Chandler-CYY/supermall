<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" />

    <scroll class="content" ref="scroll">
      <detail-swiper :top-images="topImages" />
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shop" />
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad" />
      <detail-param-info :paramInfo="paramInfo" />
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

import Scroll from "components/common/scroll/Scroll";

import { getDetail, Goods, Shop, GoodsParams } from "network/detail";

export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    Scroll,
  },
  data() {
    return {
      iid: null,
      topImages: null,
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
    };
  },
  created() {
    // 1保存传入的iid
    this.iid = this.$route.params.iid;
    // 2根据iid请求数据详情
    getDetail(this.iid).then((res) => {
      console.log(res);
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
    });
  },
  methods: {
    imageLoad() {
      this.$refs.scroll.refresh();
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