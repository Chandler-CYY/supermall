<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button
        class="check-button"
        :is-checked="isSelectAll"
        @click.native="checkClick"
      />
      <span>全选</span>
    </div>

    <div class="price">合计：{{ totalPrice }}</div>

    <div class="calculate">去计算 ({{ checkLength }})</div>
  </div>
</template>

<script>
import CheckButton from "components/content/checkButton/CheckButton";

import { mapGetters } from "vuex";

export default {
  name: "CartBottomBar",
  components: {
    CheckButton,
  },
  computed: {
    ...mapGetters(["cartList"]),
    // 计算被选中商品的总价格
    totalPrice() {
      return (
        "￥" +
        this.cartList
          .filter((item) => {
            return item.checked;
          })
          .reduce((preValue, item) => {
            return preValue + item.price * item.count;
          }, 0)
      );
    },
    // 计算被选中的商品的数量
    checkLength() {
      return this.cartList.filter((item) => item.checked).length;
    },
    // 检查购物车是否全选
    isSelectAll() {
      if (this.cartList.length === 0) return false;
      // console.log(!num) 当num=0 ！num输出为true  当num！=0 !num输出为false
      // return !this.cartList.filter((item) => !item.checked).length;
      return !this.cartList.find((item) => !item.checked);
    },
  },
  methods: {
    checkClick() {
      if (this.isSelectAll) {
        // 状态为全选时
        this.cartList.forEach((item) => (item.checked = false));
      } else {
        // 状态为部分选中或者全部选中时
        this.cartList.forEach((item) => (item.checked = true));
      }
    },
  },
};
</script>

<style>
.bottom-bar {
  position: relative;
  display: flex;
  height: 40px;
  line-height: 40px;
  background-color: #eee;

  font-size: 16px;
  line-height: 40px;
}

.check-content {
  display: flex;
  align-items: center;
  margin-left: 10px;
  width: 60px;
}

.check-button {
  width: 22px;
  height: 22px;
  line-height: 22px;
  margin-right: 5px;
}

.price {
  margin-left: 30px;
  flex: 1;
}

.calculate {
  width: 90px;
  background-color: red;
  color: #fff;
  text-align: center;
}
</style>