const Zstyle = {
  nodeLabel: {// 节点label的显示样式
    padding: 0,
    borderRadius: 4,
    textStyle: {font: '16px Arial', fillColor: 'black'},
    backgroundStyle: {fillColor: 'rgba(255,255,255,0.7)'}
  },
  linkLabel: {// 线的label显示样式
    padding: 0,
    borderRadius: 20,  //make as round as possible
    textStyle: {font: '16px Arial', fillColor: '#aaa'},
    backgroundStyle: {
      fillColor: 'rgba(255,255,255,1)',
      lineColor: 'rgba(0,0,0,0)'
    },
    rotateWithLink: true,
    scaleWithSize: true
  },
  linkLengthAutoScaling: 'logaritmic',
  linkLengthExtent: [1.5, 200]
}

export {
  Zstyle
}
