export default {
  addCart(context, payload) {
    return new Promise((resolve, reject) => {
      // 1查找之前数组中是否有该商品
      let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)

      // 2判断oldProduct
      if (oldProduct) { // 商品数量 +1
        // oldProduct.count += 1
        context.commit('addCounter', oldProduct)
        resolve('当前的商品数量加+1')
      } else { // 添加新的商品
        payload.count = 1
        context.commit('addToCart', payload)
        resolve('添加了新的商品')
      }
    })
  }
}