import { request } from './request'

export function getDetail(iid) {
  return request({
    url: '/detail',
    params: {
      iid
    }
  })
}

export function getRecommends() {
  return request({
    url: '/recommend'
  })
}

// 将商品价格、商品服务信息、商品标题等信息整合到一个对象当中
export class Goods {
  constructor(itemInfo, columns, services) {
    this.title = itemInfo.title
    this.desc = itemInfo.desc
    this.newPrice = itemInfo.price
    this.oldPrice = itemInfo.oldPrice
    this.discount = itemInfo.discountDesc;
    this.realPrice = itemInfo.lowNowPrice
    this.columns = columns
    this.services = services

  }
}

// 将商家信息整合到一个对象当中
export class Shop {
  constructor(shopInfo) {
    this.logo = shopInfo.shopLogo;
    this.name = shopInfo.name;
    this.fans = shopInfo.cFans;
    this.sells = shopInfo.cSells;
    this.score = shopInfo.score;
    this.goodsCount = shopInfo.cGoods
  }
}

// 获取商品参数信息
export class GoodsParams {
  constructor(info, rule) {
    this.infos = info.set;
    this.sizes = rule.tables;
    this.image = info.images ? info.images[0] : '';
  }
}