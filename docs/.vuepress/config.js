const path = require('path');

module.exports = {
  title: '树子未个人博客',  // 设置网站标题
  description : '枪在手 跟我走 前端路上不回头',
  themeConfig : {
    nav: [
      {
        text: '前端基础知识',
        link: '/web/base/'
      },
      {
        text: '前端工程化',
        link: '/engineering/webpack/introduction'
      },
      {
        text: '计算机基础',
        link: '/csbase/dataStructure/lineStru'
      }
    ],
    sidebar: {
      '/web/': [
        {
          title: "JS基础",
          collapsable: true,  // 设置是否可以手动展开
          children: [
            'base/',
            'base/fnM',
            'base/thisM',
            'base/eventM',
            'base/protoM',
            'base/scopM',
            'base/closureM',
            'base/extend',
            'base/exContent',
            'base/jsRun'
          ]
        },
        // {
        //   title: "JS进阶",
        //   collapsable: true,  // 设置是否可以手动展开
        //   children: [
        //     'jsAdvanced/uniqueM',
        //     'jsAdvanced/copyM',
        //     'jsAdvanced/cabM',
        //     // 'jsAdvanced/extendM',
        //     'jsAdvanced/composeFn',
        //     'jsAdvanced/jsRun'
        //   ]
        // },
        {
          title: "HTML与CSS",
          collapsable: true,  // 设置是否可以手动展开
          children: [
            'HtmlCss/getCss',
            'HtmlCss/box',
            'HtmlCss/reflowAndRepaint',
            'HtmlCss/bfc'
          ]
        },
        {
          title: "ES6 +",
          collapsable: true,  // 设置是否可以手动展开
          children: [
            'es6/array',
            // '/es6/arrowFnM',
            // '/es6/promiseM',
          ]
        },
        {
          title: "Node",
          collapsable: true,  // 设置是否可以手动展开
          children: [
            'node/nrmM'
          ]
        },
        {
          title: '移动端',
          collapsable: true,
          children: [
            'phone/shipei'
          ]
        },
        {
          title: "VUE",
          collapsable: true,  // 设置是否可以手动展开
          children: [
            // 'vueBase/render',
            'vue/data',
            'vue/binding',
            'vue/signal',
            'vue/vue3'
          ]
        },
        {
          title: "后端",
          collapsable: true,
          children: [
            'backEnd/sequelize-cli'
          ]
        },
        {
          title: "其它",
          collapsable: true,
          children: [
            // 'other/server',
            'other/git01',
            'other/tools'
          ]
        },
      ],
      '/csbase/': [
        {
          title: '数据结构',
          collapsable: true,
          children: [
            'dataStructure/lineStru',
            'dataStructure/stack',
            'dataStructure/queue',
            'dataStructure/hashtable',
            'dataStructure/tree',
            'dataStructure/tu'
          ]
        },
        {
          title: '算法',
          collapsable: true,
          children: [
            'algorithm/',
            'algorithm/fenzhicelue',
            'algorithm/dongtaiguihua',
            'algorithm/tanxin',
            'algorithm/huisu',
            // 'algorithm/fenzhi'
          ]
        },
        {
          title: "计算机网络",
          collapsable: true,  // 设置是否可以手动展开
          children: [
            'network/tcp',
            'network/udp',
            'network/http',
            'network/network01',
            'network/dns'
          ]
        },
        {
          title: '设计模式',
          collapsable: true,
          children: [
            'designMode/singleMode',
            'designMode/fabudingyueMode',
            'designMode/celueMode',
            'designMode/shipeiqiMode',
            'designMode/dailiMode',
            // 'designMode/xiangyuanMode'
          ]
        },
      ],
      '/engineering/': [
        {
          title: "Webpack",
          collapsable: true,  // 设置是否可以手动展开
          children: [
            'webpack/introduction',
            'webpack/loader',
            'webpack/devServer',
            'webpack/babel',
            'webpack/sourceMap',
            'webpack/JSOptimize',
            'webpack/CssOptimize',
            'webpack/cache'
          ]
        },
        {
          title: '性能优化',
          collapsable: true,
          children: [
            'optimization/thAndde',
            'optimization/cdn',
            'optimization/lazy'
          ]
        },
        {
          title: '前端缓存',
          collapsable: true,
          children: [
            'webCache/HttpCache'
          ]
        },
        // {
        //   title: "Babel",
        //   collapsable: true,  // 设置是否可以手动展开
        //   children: [
        //     'Babel/babel_base',
        //     'Babel/babel_api',
        //     'Babel/babel_preset'
        //   ]
        // }
      ]
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@alias': path.resolve(__dirname, '../assets/')
      }
    }
  }
}

