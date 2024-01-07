// components/custom/title/index.js
import { camelStyleToSnake } from '../../../utils/util'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    options: {
      type: Object,
      value: {
        type: 1,
        title: '标题',
        titleColor: '#333',
        backgroundColor: '',
        subtitle: 'RECOMMEND',
        subtitleColor: '#333',
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
    lineStyle: '',
    titleStyle: '',
    subTitleStyle: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    style() {
      return { backgroundColor: this.properties.options.backgroundColor }
    },
    lineStyle() {
      return { backgroundColor: this.properties.options.titleColor }
    },
    titleStyle() {
      return { color: this.properties.options.titleColor }
    },
    subTitleStyle(){
      return {color: this.properties.options.subtitleColor}
    }
  },
  ready() {
    const arrs = ['style', 'lineStyle', 'titleStyle', 'subTitleStyle']
    const data = {}
    arrs.forEach(name => {
      data[name] = camelStyleToSnake(this[name]())
    })
    this.setData(data)
  }
})
