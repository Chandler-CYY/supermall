<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav" />

    <scroll class="content" ref="scroll" :probeType="3" @scroll="contentScroll">
      <ul>
        <li v-for="(item, index) in $store.state.cartList" :key="index">
          {{ item }}
        </li>
      </ul>

      <detail-swiper :top-images="topImages" />
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shop" />
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad" />
      <detail-param-info ref="params" :paramInfo="paramInfo" />
      <detail-comment-info ref="comment" :comment-info="commentInfo" />
      <goods-list ref="recommend" :goods="recommends" />
    </scroll>

    <detail-bottom-bar @addCart="addToCart" />
    <back-top @click.native="backClick" v-show="isShowBackTop" />
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
import DetailBottomBar from "./childComps/DetailBottomBar";

import Scroll from "components/common/scroll/Scroll";
import GoodsList from "components/content/goods/GoodsList";
import BackTop from "components/content/backTop/BackTop";

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
    DetailBottomBar,
    Scroll,
    GoodsList,
    BackTop,
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
      isShowBackTop: false,
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
      let positionY = -position.y;
      // // 这是我的做法
      if (positionY >= this.themeTopYs[3]) {
        this.$refs.nav.currentIndex = 3;
      } else if (positionY >= this.themeTopYs[2]) {
        this.$refs.nav.currentIndex = 2;
      } else if (positionY >= this.themeTopYs[1]) {
        this.$refs.nav.currentIndex = 1;
      } else {
        this.$refs.nav.currentIndex = 0;
      }
      // 老师的做法
      // console.log(positionY);
      // let length = this.themeTopYs.length;
      // for (let i = 0; i < length; i++) {
      //   if (
      //     (i < length - 1 &&
      //       positionY >= this.themeTopYs[i] &&
      //       positionY < this.themeTopYs[i + 1]) ||
      //     (i === length - 1 && positionY >= this.themeTopYs[i])
      //   ) {
      //     this.$refs.nav.currentIndex = i;
      //   }
      // }

      // 是否显示backTop
      this.isShowBackTop = -position.y > 1000;
    },
    backClick() {
      this.$refs.scroll.scrollTo(0, 0);
    },
    // 1获取购物车需要展示的信息
    addToCart() {
      const product = {};
      product.img = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.realPrice;
      product.iid = this.iid;
      // console.log(product);

      // 2将商品添加到购物车
      // this.$store.state.cartList.push(product);
      // this.$store.commit("addCart", product);
      this.$store.dispatch("addCart", product);
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
  overflow: hidden;
}

.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
}

.content {
  height: calc(100% - 44px - 49px);
}
</style>