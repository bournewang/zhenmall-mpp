// components/custom/carousel/index.js
import { camelStyleToSnake, redirectComponentRoute } from '../../../utils/util'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    options: {
      type: Object,
      value: {
        images: [
          {
            url: '',
            route: {},
          },
        ],
        height: '',
      },
      observer() {
        console.log('observer')
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    style: '',
    indicatorDots: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    style() {
      return { height: this.properties.options.height }
    },
    redirect(e) {
      const { index } = e.currentTarget.dataset
      redirectComponentRoute(this.properties.options.images[index].route)
    }
  },
  ready() {
    const arrs = ['style']
    const data = {}
    arrs.forEach(name => {
      data[name] = camelStyleToSnake(this[name]())
    })
    this.setData(data)
  }
})
