export default {
  addCounter(state, payload) {
    payload.count++
  },
  addToCart(state, payload) {
    // 给每个新添加进购物车的商品的选中状态默认为true
    payload.checked = true
    state.cartList.push(payload)
  }
}