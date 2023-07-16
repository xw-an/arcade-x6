<template>
<!--  <div class="shade" v-if="configVisible"></div>-->
  <div class="flow-div">
    <graph-config-container :graphConfig="graphConfig" :versionId="currentVersionId" :processInstanceId="processInstanceId" @updateVersion="handleUpdateVersion"></graph-config-container>
    <div id="container">
      <div id="stencil" :class="{'disabled-item':isDisabled}"></div>
      <div id="graph-container" ref="graphCon"></div>
      <a-drawer
          placement="right"
          :closable="false"
          :visible="configVisible"
          @close="handleCloseConfig"
          :width="700"
          :footer="footerContent"
      >
        <node-config-container :class="{'disabled-item':isDisabled}" v-show="isNode" :node="curNode" :visible="configVisible" :versionId="currentVersionId" @delete="deleteNodeApi" @close="handleCloseConfig"></node-config-container>
        <edge-config-container :class="{'disabled-item':isDisabled}" v-show="!isNode" :edge="curEdge" :versionId="currentVersionId" @delete="deleteLinkApi"></edge-config-container>
<!--        <span class="iconfont collpase-icon" @click="handleCloseConfig">&#xe68a;</span>-->
      </a-drawer>
<!--      <div v-if="configVisible" id="config-container">-->
<!--        <node-config-container v-show="isNode" :node="curNode" :visible="configVisible"></node-config-container>-->
<!--        <edge-config-container v-show="!isNode" :edge="curEdge"></edge-config-container>-->
<!--        <span class="iconfont collpase-icon" @click="handleCloseConfig">&#xe68a;</span>-->
<!--      </div>-->
<!--      <span v-if="!configVisible" class="iconfont open-icon" @click="handleOpenConfig">&#xe689;</span>-->
    </div>
  </div>
</template>

<script>
import { Graph, Shape, Addon } from '@antv/x6'
import '@antv/x6-vue-shape'
import GraphConfigContainer from "@/views/flows/components/GraphConfigContainer";
import NodeConfigContainer from "@/views/flows/components/NodeConfigContainer";
import EdgeConfigContainer from "@/views/flows/components/EdgeConfigContainer";
import {ref, onMounted} from "vue";
import {
  createLink,
  createNode,
  deleteLink,
  deleteNode,
  detailInstance,
  updateLinkTarget,
  updateNodeCoordinate, updateNodeSize
} from "@/api/request";
import {useRouter} from "vue-router";
import {useStore} from "vuex";
import {message} from "ant-design-vue";

// 初始化画布
let graph = {}
let curNode = ref({})
let curEdge = ref({})
const isNode = ref(true)
const processInstanceId = ref(0)
const author = ref('')
// 画布相关操作
const useGraphEffect = ()=>{
  // 初始化画布
  const initGraph = ()=>{
    // 初始化画布
    graph = new Graph({
      container: document.getElementById('graph-container'),
      grid: true,
      mousewheel: {
        enabled: true,
        zoomAtMousePosition: true,
        modifiers: 'ctrl',
        minScale: 0.5,
        maxScale: 3
      },
      connecting: {
        router: {
          name: 'manhattan',
          args: {
            padding: 1
          }
        },
        connector: {
          name: 'rounded',
          args: {
            radius: 8
          }
        },
        anchor: 'center',
        connectionPoint: 'anchor',
        allowBlank: true,
        snap: {
          radius: 20
        },
        createEdge () {
          return new Shape.Edge({
            attrs: {
              line: {
                stroke: '#4A4A4A',
                strokeWidth: 2,
                targetMarker: {
                  name: 'block',
                  width: 12,
                  height: 8
                }
              }
            },
            zIndex: 0
          })
        },
        validateConnection ({ targetMagnet }) {
          return !!targetMagnet
        }
      },
      highlighting: {
        magnetAdsorbed: {
          name: 'stroke',
          args: {
            attrs: {
              fill: '#5F95FF',
              stroke: '#5F95FF'
            }
          }
        }
      },
      resizing: true,
      rotating: true,
      // selecting: {
      //   enabled: true,
      //   rubberband: true,
      //   showNodeSelectionBox: true
      // },
      selecting:{
        enabled: true,
        pointerEvents: "none", // 新属性
        showNodeSelectionBox: true
        // multiple: true,
      },
      snapline: true,
      keyboard: true,
      clipboard: true,
      history: true,
      translating: {
        restrict: true,
      },
      transforming: {
        clearAll: true,
        clearOnBlankMouseDown: true,
      },
      panning: {
        enabled: true,
      }
    })
  }
  // 画布绑定监听事件
  const graphOnEvent = ()=> {
    // 控制连接桩显示/隐藏
    const showPorts = (ports, show) => {
      for (let i = 0, len = ports.length; i < len; i = i + 1) {
        ports[i].style.visibility = show ? 'visible' : 'hidden'
      }
    }
    graph.on('node:mouseenter', () => {
      const container = document.getElementById('graph-container')
      const ports = container.querySelectorAll('.x6-port-body')
      showPorts(ports, true)
    })
    graph.on('node:mouseleave', () => {
      const container = document.getElementById('graph-container')
      const ports = container.querySelectorAll('.x6-port-body')
      showPorts(ports, false)
    })
    graph.on('blank:click', () => {
      console.log('监听到点击画布')
      // 收缩右侧配置面板
      useConfigPanel().handleCloseConfig()
    })
    // 监听调节节点大小
    graph.on('node:resized', ({ node }) => {
      curNode.value = node
      isNode.value = true
      console.log('监听调整大小一个控件id：')
      const size = node.size()
      useNodeEffect().updateSize(node,size.width,size.height)
    })
    // 监听移动画布的节点
    graph.on('node:moved', ({ node }) => {
      curNode.value = node
      isNode.value = true
      console.log('监听到移动一个控件id：' + node.id)
      if (node.label=='开始'||node.label=='结束') {
        // 收缩右侧配置面板
        useConfigPanel().handleCloseConfig()
      }
      useNodeEffect().updateXY(node,node.position().x,node.position().y)
    })
    // 监听点击画布的节点
    graph.on('node:click', ({ node }) => {
      curNode.value = node
      isNode.value = true
      console.log('监听到点击一个控件id：'+node.id)
      if (node.label=='开始'||node.label=='结束') {
        // 收缩右侧配置面板
        useConfigPanel().handleCloseConfig()
        message.info('开始/结束节点不可配置')
      } else {
        // 打开右侧配置面板
        useConfigPanel().handleOpenConfig()
      }
      // useConfigPanel().handleOpenConfig()
      // console.log(e)
      // console.log(x)
      // console.log(y)
      // console.log(view)
    })
    // 监听画布添加节点动作
    graph.on('node:added', ({ node}) => {
      curNode.value = node
      isNode.value = true
      console.log('监听到拖入一个控件id开始：' + node.id)
      // 收缩右侧配置面板
      useConfigPanel().handleCloseConfig()
      useNodeEffect().createNodeApi(curNode.value) // 调用后端接口创建节点
      console.log('监听到拖入一个控件id结束：' + node.id)
      // console.log(index)
      // console.log(options)
    })
    // 监听画布移除节点动作
    graph.on('node:removed', ({node}) => {
      // let name = node.shape==="custom-text"?node.attrs.label?.text:node.attrs.text?.text
      // // 如果是开始/结束节点不调接口删除
      // if(name == '开始'||name == '结束'){
      //   message.error('开始/结束节点不能删除')
      //   return
      // }
      curNode.value = node
      console.log('监听到移除一个控件id开始：' + node.id)
      // 收缩右侧配置面板
      // useConfigPanel().handleCloseConfig()
      // useNodeEffect().deleteNodeApi(curNode.value)
      console.log('监听到移除一个控件id结束：' + node.id)
      // console.log(index)
      // console.log(options)
    })
    // 监听节点之间连接动作
    graph.on('edge:added', ({ edge}) => {
      isNode.value = false
      curEdge.value = edge
      console.log('监听到连接线动作开始：' + edge.id)
      // 收缩右侧配置面板
      useConfigPanel().handleCloseConfig()
      useNodeEffect().createLinkApi(curEdge.value)
      console.log('监听到连接线动作结束：' + edge.id)
    })
    graph.on('edge:change:target', ({cell, current}) => {
      isNode.value = false
      console.log('监听到连接线change动作开始：')
      // console.log(cell)
      // console.log(current)
      // console.log(previous)
      // console.log(options)
      // console.log(cell.getSourcePortId())
      // console.log(cell.getTargetPortId())
      if (cell.id && current.cell&&cell.getTargetPortId()&&cell.getSourcePortId()) {
        const obj = {
          id: cell.id,
          targetNodeId: current.cell,
          targetPortId: cell.getTargetPortId(),
          sourcePortId: cell.getSourcePortId()
        }
        console.log(obj)
        useNodeEffect().updateTargetApi(obj)
      }
      console.log('监听到连接线change动作结束：')
    })
    // 监听点击节点之间连接动作
    graph.on('edge:click', ({ edge }) => {
      isNode.value = false
      curEdge.value = edge
      console.log('监听到点击连接线动作开始：' + edge.id)
      // 打开右侧配置面板
      useConfigPanel().handleOpenConfig()
      // console.log(e)
      // console.log(x)
      // console.log(y)
      // console.log(view)
    })
    // 监听节点之间移除连接动作
    graph.on('edge:removed', ({ edge}) => {
      isNode.value = false
      curEdge.value = edge
      console.log('监听到移除连接线动作开始：' + edge.id)
      // 收缩右侧配置面板
      // useConfigPanel().handleCloseConfig()
      // useNodeEffect().deleteLinkApi(curEdge.value)
      console.log('监听到移除连接线动作结束：' + edge.id)
      // console.log('edge:removed')
      // console.log(edge)
      // console.log(index)
      // console.log(options)
    })
  }
  // 绑定画布快捷键
  const graphBindKey =() =>{
    // todo 暂时不用，因为撤回没有实时更新数据
    // graph.bindKey(['meta+c', 'ctrl+c'], () => {
    //   const cells = graph.getSelectedCells()
    //   if (cells.length) {
    //     graph.copy(cells)
    //   }
    //   return false
    // })
    // graph.bindKey(['meta+x', 'ctrl+x'], () => {
    //   const cells = graph.getSelectedCells()
    //   if (cells.length) {
    //     graph.cut(cells)
    //   }
    //   return false
    // })
    // graph.bindKey(['meta+v', 'ctrl+v'], () => {
    //   if (!graph.isClipboardEmpty()) {
    //     const cells = graph.paste({ offset: 32 })
    //     graph.cleanSelection()
    //     graph.select(cells)
    //   }
    //   return false
    // })
    // // undo redo
    // graph.bindKey(['meta+z', 'ctrl+z'], () => {
    //   if (graph.history.canUndo()) {
    //     graph.history.undo()
    //   }
    //   return false
    // })
    // graph.bindKey(['meta+shift+z', 'ctrl+shift+z'], () => {
    //   if (graph.history.canRedo()) {
    //     graph.history.redo()
    //   }
    //   return false
    // })
    // select all
    graph.bindKey(['meta+a', 'ctrl+a'], () => {
      const nodes = graph.getNodes()
      if (nodes) {
        graph.select(nodes)
      }
    })
    // delete
    graph.bindKey('backspace', () => {
      const cells = graph.getSelectedCells()
      if (cells.length) {
        // 收缩右侧配置面板
        useConfigPanel().handleCloseConfig()
        // 调接口删除
        cells.forEach(cell=> {
          if (cell.isNode()) {
            useNodeEffect().deleteNodeApi(cell)
          } else {
            useNodeEffect().deleteLinkApi(cell)
          }
        })
        // graph.removeCells(cells)
      }
    })
    // zoom
    graph.bindKey(['ctrl+1', 'meta+1'], () => {
      const zoom = graph.zoom()
      if (zoom < 1.5) {
        graph.zoom(0.1)
      }
    })
    graph.bindKey(['ctrl+2', 'meta+2'], () => {
      const zoom = graph.zoom()
      if (zoom > 0.5) {
        graph.zoom(-0.1)
      }
    })
  }
  return {initGraph,graphOnEvent,graphBindKey}
}

// 左侧控件面板
const useStencilEffect = ()=>{
  let stencil = {}
  // 初始化左侧流程控件面板
  const initStencil = () =>{
    stencil = new Addon.Stencil({
      title: '流程图',
      target: graph,
      stencilGraphWidth: 250,
      stencilGraphHeight: 320,
      collapsable: true,
      notFoundText: '暂未匹配到结果',
      search: (cell, keyword, groupName, stencil) => {
        console.log(groupName)
        console.log(stencil)
        if (keyword) {
          return cell?.label?.includes(keyword)
        }
        return true
      },
      groups: [
        {
          title: '基础节点',
          name: 'group1'
        },
        // {
        //   title: '图片节点',
        //   name: 'group2',
        //   graphHeight: 250,
        //   layoutOptions: {
        //     rowHeight: 70
        //   }
        // }
      ],
      layoutOptions: {
        columns: 2,
        columnWidth: 110,
        rowHeight: 60
      }
    })
    document.getElementById('stencil').appendChild(stencil.container)
  }
  // 初始化链接桩
  let ports = {}
  // 初始化链接桩
  const initPorts = () => {
    ports = {
      groups: {
        top: {
          position: 'top',
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: '#fe6a00',
              strokeWidth: 1,
              fill: '#fff',
              style: {
                visibility: 'hidden'
              }
            }
          }
        },
        right: {
          position: 'right',
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: '#fe6a00',
              strokeWidth: 1,
              fill: '#fff',
              style: {
                visibility: 'hidden'
              }
            }
          }
        },
        bottom: {
          position: 'bottom',
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: '#fe6a00',
              strokeWidth: 1,
              fill: '#fff',
              style: {
                visibility: 'hidden'
              }
            }
          }
        },
        left: {
          position: 'left',
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: '#fe6a00',
              strokeWidth: 1,
              fill: '#fff',
              style: {
                visibility: 'hidden'
              }
            }
          }
        }
      },
      items: [
        {
          group: 'top'
        },
        {
          group: 'right'
        },
        {
          group: 'bottom'
        },
        {
          group: 'left'
        }
      ]
    }
  }
  // 渲染所有左侧控件图形
  const loadStencil= ()=> {
    Graph.registerNode(
        'custom-rect',
        {
          inherit: 'rect',
          width: 80,
          height: 36,
          attrs: {
            body: {
              strokeWidth: 1,
              stroke: '#fe6a00',
              fill: '#fcf0e6'
            },
            text: {
              fontSize: 12,
              fill: '#262626'
            }
          },
          ports: { ...ports }
        },
        true
    )

    Graph.registerNode(
        'custom-polygon',
        {
          inherit: 'polygon',
          width: 80,
          height: 38,
          attrs: {
            body: {
              strokeWidth: 1,
              stroke: '#fe6a00',
              fill: '#fcf0e6'
            },
            text: {
              fontSize: 12,
              fill: '#262626'
            }
          },
          ports: {...ports}
        },
        true
    )

    Graph.registerNode(
        'custom-circle',
        {
          inherit: 'circle',
          width: 48,
          height: 48,
          attrs: {
            body: {
              strokeWidth: 1,
              stroke: '#fe6a00',
              fill: '#fcf0e6'
            },
            text: {
              fontSize: 12,
              fill: '#262626'
            }
          },
          ports: { ...ports }
        },
        true
    )
    Graph.registerNode(
        'custom-cylinder',
        {
          inherit: 'cylinder',
          width: 62,
          height: 48,
          attrs: {
            body: {
              strokeWidth: 1,
              stroke: '#fe6a00',
              fill: '#fcf0e6'
            },
            text: {
              fontSize: 12,
              fill: '#262626',
              refY: 32
            },
            top: {
              strokeWidth: 1,
              stroke: '#fe6a00',
              fill: '#fcf0e6'
            }
          },
          ports: { ...ports }
        },
        true
    )

    Graph.registerNode(
        'custom-text',
        {
          inherit: 'text-block',
          width: 60,
          height: 36,
          attrs: {
            body: {
              // strokeWidth: 0,
              rx: 4,
              ry: 4,
              fill: '#fff',
              stroke: '#fff'
            },
            text: {
              fontSize: 12,
              fill: '#000'
            }
          },
          ports: { ...ports }
        },
        true
    )

    Graph.registerNode(
        'custom-path',
        {
          inherit: 'path',
          width: 60,
          height: 36,
          attrs: {
            body: {
              strokeWidth: 1,
              stroke: '#fe6a00',
              fill: '#fcf0e6'
            },
            text: {
              fontSize: 12,
              fill: '#262626'
            }
          },
          ports: { ...ports }
        },
        true
    )
    Graph.registerNode(
        'custom-image',
        {
          inherit: 'rect',
          width: 52,
          height: 52,
          markup: [
            {
              tagName: 'rect',
              selector: 'body'
            },
            {
              tagName: 'image'
            },
            {
              tagName: 'text',
              selector: 'label'
            }
          ],
          attrs: {
            body: {
              strokeWidth: 1,
              stroke: '#ff8833',
              fill: '#ff8833'
            },
            image: {
              width: 26,
              height: 26,
              refX: 13,
              refY: 16
            },
            label: {
              refX: 3,
              refY: 2,
              textAnchor: 'left',
              textVerticalAnchor: 'top',
              fontSize: 12,
              fill: '#fff'
            }
          },
          ports: { ...ports }
        },
        true
    )

    const r1 = graph.createNode({
      shape: 'custom-rect',
      attrs: {
        body: {
          rx: 6,
          ry: 6
        }
      },
      label: '工具组件'
    })
    const r2 = graph.createNode({
      shape: 'custom-rect',
      attrs: {
        body: {
          rx: 6,
          ry: 6
        }
      },
      label: '提取组件'
    })
    const r3 = graph.createNode({
      shape: 'custom-polygon',
      attrs: {
        body: {
          refPoints: '0,10 10,0 20,10 10,20'
        }
      },
      label: '条件'
    })
    // const r5 = graph.createNode({
    //   shape: 'custom-polygon',
    //   attrs: {
    //     body: {
    //       refPoints: '10,0 40,0 30,20 0,20'
    //     }
    //   },
    //   label: '数据'
    // })
    // const r6 = graph.createNode({
    //   shape: 'custom-circle',
    //   label: '连接'
    // })
    // const r7 = graph.createNode({
    //   shape: 'custom-cylinder',
    //   label: '数据库'
    // })
    // const r8 = graph.createNode({
    //   shape: 'custom-path',
    //   label: '文档',
    //   attrs: {
    //     body: {
    //       refD: 'M 0 0 0 4 C 10 8 15 2 25 5 L 25 0 Z'
    //     }
    //   }
    // })
    // const r9 = graph.createNode({
    //   shape: 'custom-path',
    //   label: '手动输入',
    //   attrs: {
    //     body: {
    //       refD: 'M 0 7 0 15 15 15 15 5 Z'
    //     }
    //   }
    // })
    // const r10 = graph.createNode({
    //   shape: 'custom-text',
    //   text: '文本'
    // })
    // stencil.load([r1, r2, r3, r4, r5, r6, r7, r8, r9, r10], 'group1')
    stencil.load([ r1, r2, r3], 'group1')
    // const imageShapes = [
    //   {
    //     label: 'Client',
    //     image:
    //         'https://gw.alipayobjects.com/zos/bmw-prod/687b6cb9-4b97-42a6-96d0-34b3099133ac.svg'
    //   },
    //   {
    //     label: 'Http',
    //     image:
    //         'https://gw.alipayobjects.com/zos/bmw-prod/dc1ced06-417d-466f-927b-b4a4d3265791.svg'
    //   },
    //   {
    //     label: 'Api',
    //     image:
    //         'https://gw.alipayobjects.com/zos/bmw-prod/c55d7ae1-8d20-4585-bd8f-ca23653a4489.svg'
    //   },
    //   {
    //     label: 'Sql',
    //     image:
    //         'https://gw.alipayobjects.com/zos/bmw-prod/6eb71764-18ed-4149-b868-53ad1542c405.svg'
    //   },
    //   {
    //     label: 'Clound',
    //     image:
    //         'https://gw.alipayobjects.com/zos/bmw-prod/c36fe7cb-dc24-4854-aeb5-88d8dc36d52e.svg'
    //   },
    //   {
    //     label: 'Mq',
    //     image:
    //         'https://gw.alipayobjects.com/zos/bmw-prod/2010ac9f-40e7-49d4-8c4a-4fcf2f83033b.svg'
    //   }
    // ]
    // const imageNodes = imageShapes.map((item) =>
    //     graph.createNode({
    //       shape: 'custom-image',
    //       label: item.label,
    //       attrs: {
    //         image: {
    //           'xlink:href': item.image
    //         }
    //       }
    //     })
    // )
    // stencil.load(imageNodes, 'group2')
  }
  return  {stencil,ports,initStencil,initPorts,loadStencil}
}
const configVisible = ref(false)
const graphCon = ref()
// 右侧配置面板
const useConfigPanel = ()=> {
  // 收缩配置面板
  const handleCloseConfig = () =>{
    configVisible.value = false
    // graphCon.value.style.width = 'calc(100% - 250px)'
  }
  // 展开配置面板
  const handleOpenConfig = ()=> {
    configVisible.value = true
    // graphCon.value.style.width = 'calc(100% - 600px - 250px)'
  }
  return {configVisible,graphCon,handleCloseConfig,handleOpenConfig}
}
// 当前版本id
let currentVersionId = ref(1)
// 画布节点相关接口
const useNodeEffect = ()=>{
  const isDisabled = ref(false)
  let processNode = ref([])
  let processLink = ref([])
  let data = {nodes:[],edges:[]}
  // 调后端创建节点接口
  const createNodeApi = async(node)=>{
    const pos = node.position()
    const name = node.shape==="custom-text"?node.attrs.label?.text:node.attrs.text?.text
    let req = {
      "processNode": {
        "versionId": currentVersionId.value,
        "processInstanceId": Number(processInstanceId.value),
        "uuid": node.id,
        "name": name,
        "type": node.shape,
        "ports": JSON.stringify(node.getPorts()),
        "position": pos.x+","+pos.y,
        "size": node.size().width+","+node.size().height,
        "createdBy": author.value,
        "updatedBy": author.value,
      },
      "processInstanceParameter": [
        {
          "versionId": currentVersionId.value,
          "parameterType": "样式信息",
          "parameterName": "style",
          "parameterValue": "{" +
              "\"label\": \""+name+"\", " +
              "\"fontSize\": \""+node.attrs.text?.fontSize+"\", " +
              "\"textFill\": \""+node.attrs.text?.fill+"\", " +
              "\"bodyFill\": \""+node.attrs.body?.fill+"\"}",
          "createdBy": author.value,
          "updatedBy": author.value,
        },
        {
          "versionId": currentVersionId.value,
          "parameterType": "参数信息",
          "parameterName": "params",
          "parameterValue": null,
          "createdBy": author.value,
          "updatedBy": author.value,
        }
      ]
    }
    await createNode(req).then(res=>{
      if(res.code === 0){
        message.success("["+req.processNode.name+"]节点创建成功;"+"id:"+node.id)
      } else {
        message.error("["+req.processNode.name+"]节点创建失败："+res.message)
        graph.removeNode(node)
      }
    })
  }
  // 调后端删除节点接口
  const deleteNodeApi = async(node)=>{
    let req = {
      versionId: Number(currentVersionId.value),
      processInstanceId: Number(processInstanceId.value),
      uuid: node.id,
      updatedBy: author.value
    }
    await deleteNode(req).then(res=>{
      if (res.code === 0){
        message.success("节点删除成功;"+"id:"+node.id)
        graph.removeNode(node)
        useConfigPanel().handleCloseConfig()
      } else {
        message.error("节点删除失败:"+res.message)
      }
    })
  }
  // 调后端接口更新node位置
  const updateXY = async(node,x,y)=>{
    let req = {
      versionId: Number(currentVersionId.value),
      processInstanceId: Number(processInstanceId.value),
      uuid: node.id,
      updatedBy: author.value,
      position: x+","+y
    }
    await updateNodeCoordinate(req).then(res=>{
      if(res.code === 0){
        console.log("节点位置更新成功;"+"id:"+node.id)
      } else {
        message.error("节点位置更新失败："+res.message)
      }
    })
  }
  // 调后端接口更新node的大小
  const updateSize = async(node,width,height)=>{
    let req = {
      versionId: Number(currentVersionId.value),
      processInstanceId: Number(processInstanceId.value),
      uuid: node.id,
      updatedBy: author.value,
      size: width+","+height
    }
    await updateNodeSize(req).then(res=>{
      if(res.code === 0){
        console.log("节点大小更新成功;"+"id:"+node.id)
      } else {
        message.error("节点大小更新失败:"+res.message)
      }
    })
  }
  // 调后端创建连线接口
  const createLinkApi = async(edge)=>{
    let req = {
      "sourceNodeId": edge.getSourceCellId(),
      "targetNodeId": null,
      "processLink": {
        "versionId": currentVersionId.value,
        "targetPortId": edge.getTargetPortId(),
        "sourcePortId": edge.getSourcePortId(),
        "processInstanceId": Number(processInstanceId.value),
        "uuid": edge.id,
        "lineCondition": null,
        "createdBy": author.value,
        "updatedBy": author.value,
      },
      "processInstanceParameter": [
        {
          "versionId": currentVersionId.value,
          "parameterType": "样式信息",
          "parameterName": "style",
          "parameterValue": "{" +
              "\"line\": \"\", " +
              "\"arrow\": \"1\", " +
              "\"color\": \""+edge?.attrs?.line?.stroke+"\", " +
              "\"text\": \"\"" +
              "}",
          "createdBy": author.value,
          "updatedBy": author.value
        },
        {
          "versionId": currentVersionId.value,
          "parameterType": "参数信息",
          "parameterName": "params",
          "parameterValue": "{}",
          "createdBy": author.value,
          "updatedBy": author.value
        }
      ]
    }
    await createLink(req).then(res=>{
      if(res.code === 0){
        console.log("连线创建成功;id:"+edge.id)
        // node.id = res.data.id
      } else {
        message.error("连线创建失败:"+res.message)
        graph.removeEdge(edge)
      }
    })
  }
  // 调后端更新连线目标
  const updateTargetApi = async(obj)=>{
    let req = {
      "targetNodeId": obj.targetNodeId,
      "processLink": {
        "versionId": currentVersionId.value,
        "processInstanceId": Number(processInstanceId.value),
        "targetPortId": obj.targetPortId,
        "sourcePortId": obj.sourcePortId,
        "uuid": obj.id,
        "updatedBy": author.value,
      }
    }
    await updateLinkTarget(req).then(res=>{
      if(res.code === 0){
        console.log("连线目标更新成功;id:"+obj.id)
      } else {
        message.error("连线目标更新失败;id:"+res.message)
        graph.removeEdge(obj)
      }
    })
  }
  // 调后端删除连线接口
  const deleteLinkApi = async(edge)=>{
    let req = {
      versionId: Number(currentVersionId.value),
      processInstanceId: Number(processInstanceId.value),
      uuid: edge.id,
      updatedBy: author.value
    }
    await deleteLink(req).then(res=>{
      if(res.code === 0){
        message.success("连线删除成功;"+"id:"+edge.id)
        graph.removeEdge(edge)
        useConfigPanel().handleCloseConfig()
      } else {
        message.error("连线删除失败:"+res.message)
      }
    })
  }
  // 调后端查询画布接口
  const detailNodeLink = async(graph,versionId)=>{
    let currentVersionStatus = 0
    await detailInstance(versionId,Number(processInstanceId.value)).then(res=>{
      if(res.code === 0){
        data = {nodes:[],edges:[]} // 画布数据
        processNode.value = res.data.processNodeResponse
        processLink.value = res.data.processLinkResponse
        currentVersionId.value = versionId==0?res.data.versionId:versionId // 0表示首次加载
        // 组装node节点
        processNode.value.forEach(curNode => {
          let x = Number(curNode.processNode.position.split(",")[0])
          let y = Number(curNode.processNode.position.split(",")[1])
          let w = Number(curNode.processNode.size.split(",")[0])
          let h = Number(curNode.processNode.size.split(",")[1])
          let parameterValue = curNode?.processInstanceParameters?.find(item=>item.parameterName === "style")?.parameterValue
          let strokeColor = parameterValue?JSON.parse(parameterValue).strokeColor:'#fe6a00'
          switch (curNode.processNode.type){
            case 'start':
            case 'end':
              data.nodes.push({
                id: curNode.processNode.uuid, // String，可选，节点的唯一标识
                x: x,       // Number，必选，节点位置的 x 值
                y: y,       // Number，必选，节点位置的 y 值
                width: w,  // Number，必选，节点大小的 width 值
                height: h, // Number，必选，节点大小的 height 值
                label: curNode.processNode.name , // String，节点标签
                shape: 'custom-rect',
                attrs: {
                  body: {
                    rx: 18,
                    ry: 26
                  }
                },
                ports: {
                  groups: {
                    top: {
                      position: 'top',
                      attrs: {
                        circle: {
                          r: 4,
                          magnet: true,
                          stroke: '#fe6a00',
                          strokeWidth: 1,
                          fill: '#fff',
                          style: {
                            visibility: 'hidden'
                          }
                        }
                      }
                    },
                    right: {
                      position: 'right',
                      attrs: {
                        circle: {
                          r: 4,
                          magnet: true,
                          stroke: '#fe6a00',
                          strokeWidth: 1,
                          fill: '#fff',
                          style: {
                            visibility: 'hidden'
                          }
                        }
                      }
                    },
                    bottom: {
                      position: 'bottom',
                      attrs: {
                        circle: {
                          r: 4,
                          magnet: true,
                          stroke: '#fe6a00',
                          strokeWidth: 1,
                          fill: '#fff',
                          style: {
                            visibility: 'hidden'
                          }
                        }
                      }
                    },
                    left: {
                      position: 'left',
                      attrs: {
                        circle: {
                          r: 4,
                          magnet: true,
                          stroke: '#fe6a00',
                          strokeWidth: 1,
                          fill: '#fff',
                          style: {
                            visibility: 'hidden'
                          }
                        }
                      }
                    }
                  },
                  items: JSON.parse(curNode.processNode.ports)
                }
              })
              break;
            case 'tool':
            case 'extract':
            case 'auto':
            case 'flow':
              if (curNode.processInstanceParameters.length) {
                curNode.processInstanceParameters.forEach(ps=>{
                  if (ps.parameterName ==='style'){
                    let style = JSON.parse(ps.parameterValue)
                    data.nodes.push({
                      id: curNode.processNode.uuid, // String，可选，节点的唯一标识
                      x: x,       // Number，必选，节点位置的 x 值
                      y: y,       // Number，必选，节点位置的 y 值
                      width: w,  // Number，必选，节点大小的 width 值
                      height: h, // Number，必选，节点大小的 height 值
                      label: curNode.processNode.name , // String，节点标签
                      shape: 'custom-rect',
                      attrs: {
                        body: {
                          rx: 6,
                          ry: 6,
                          fill: style.bodyFill,
                          stroke: strokeColor
                        },
                        text: {
                          text: style.label,
                          fontSize: style.fontSize,
                          fill: style.textFill
                        }
                      },
                      ports: {
                        groups: {
                          top: {
                            position: 'top',
                            attrs: {
                              circle: {
                                r: 4,
                                magnet: true,
                                stroke: '#fe6a00',
                                strokeWidth: 1,
                                fill: '#fff',
                                style: {
                                  visibility: 'hidden'
                                }
                              }
                            }
                          },
                          right: {
                            position: 'right',
                            attrs: {
                              circle: {
                                r: 4,
                                magnet: true,
                                stroke: '#fe6a00',
                                strokeWidth: 1,
                                fill: '#fff',
                                style: {
                                  visibility: 'hidden'
                                }
                              }
                            }
                          },
                          bottom: {
                            position: 'bottom',
                            attrs: {
                              circle: {
                                r: 4,
                                magnet: true,
                                stroke: '#fe6a00',
                                strokeWidth: 1,
                                fill: '#fff',
                                style: {
                                  visibility: 'hidden'
                                }
                              }
                            }
                          },
                          left: {
                            position: 'left',
                            attrs: {
                              circle: {
                                r: 4,
                                magnet: true,
                                stroke: '#fe6a00',
                                strokeWidth: 1,
                                fill: '#fff',
                                style: {
                                  visibility: 'hidden'
                                }
                              }
                            }
                          }
                        },
                        items: JSON.parse(curNode.processNode.ports)
                      }// String，节点标签
                    })
                  }
                })
              }
              else {
                data.nodes.push({
                  id: curNode.processNode.uuid, // String，可选，节点的唯一标识
                  x: x,       // Number，必选，节点位置的 x 值
                  y: y,       // Number，必选，节点位置的 y 值
                  width: w,  // Number，必选，节点大小的 width 值
                  height: h, // Number，必选，节点大小的 height 值
                  label: curNode.processNode.name , // String，节点标签
                  shape: 'custom-rect',
                  attrs: {
                    body: {
                      rx: 6,
                      ry: 6,
                      stroke: strokeColor
                    }
                  },
                  ports: {
                    groups: {
                      top: {
                        position: 'top',
                        attrs: {
                          circle: {
                            r: 4,
                            magnet: true,
                            stroke: '#fe6a00',
                            strokeWidth: 1,
                            fill: '#fff',
                            style: {
                              visibility: 'hidden'
                            }
                          }
                        }
                      },
                      right: {
                        position: 'right',
                        attrs: {
                          circle: {
                            r: 4,
                            magnet: true,
                            stroke: '#fe6a00',
                            strokeWidth: 1,
                            fill: '#fff',
                            style: {
                              visibility: 'hidden'
                            }
                          }
                        }
                      },
                      bottom: {
                        position: 'bottom',
                        attrs: {
                          circle: {
                            r: 4,
                            magnet: true,
                            stroke: '#fe6a00',
                            strokeWidth: 1,
                            fill: '#fff',
                            style: {
                              visibility: 'hidden'
                            }
                          }
                        }
                      },
                      left: {
                        position: 'left',
                        attrs: {
                          circle: {
                            r: 4,
                            magnet: true,
                            stroke: '#fe6a00',
                            strokeWidth: 1,
                            fill: '#fff',
                            style: {
                              visibility: 'hidden'
                            }
                          }
                        }
                      }
                    },
                    items: JSON.parse(curNode.processNode.ports)
                  }// String，节点标签
                })
              }
              break;
            case 'database':
              if (curNode.processInstanceParameters.length) {
                curNode.processInstanceParameters.forEach(ps=>{
                  if (ps.parameterName ==='style'){
                    let style = JSON.parse(ps.parameterValue)
                    data.nodes.push({
                      id: curNode.processNode.uuid, // String，可选，节点的唯一标识
                      x: x,       // Number，必选，节点位置的 x 值
                      y: y,       // Number，必选，节点位置的 y 值
                      width: w,  // Number，必选，节点大小的 width 值
                      height: h, // Number，必选，节点大小的 height 值
                      label: curNode.processNode.name , // String，节点标签
                      shape: 'custom-cylinder',
                      attrs: {
                        body: {
                          fill: style.bodyFill,
                          stroke: strokeColor
                        },
                        text: {
                          text: style.label,
                          fontSize: style.fontSize,
                          fill: style.textFill
                        }
                      },
                      ports: {
                        groups: {
                          top: {
                            position: 'top',
                            attrs: {
                              circle: {
                                r: 4,
                                magnet: true,
                                stroke: '#fe6a00',
                                strokeWidth: 1,
                                fill: '#fff',
                                style: {
                                  visibility: 'hidden'
                                }
                              }
                            }
                          },
                          right: {
                            position: 'right',
                            attrs: {
                              circle: {
                                r: 4,
                                magnet: true,
                                stroke: '#fe6a00',
                                strokeWidth: 1,
                                fill: '#fff',
                                style: {
                                  visibility: 'hidden'
                                }
                              }
                            }
                          },
                          bottom: {
                            position: 'bottom',
                            attrs: {
                              circle: {
                                r: 4,
                                magnet: true,
                                stroke: '#fe6a00',
                                strokeWidth: 1,
                                fill: '#fff',
                                style: {
                                  visibility: 'hidden'
                                }
                              }
                            }
                          },
                          left: {
                            position: 'left',
                            attrs: {
                              circle: {
                                r: 4,
                                magnet: true,
                                stroke: '#fe6a00',
                                strokeWidth: 1,
                                fill: '#fff',
                                style: {
                                  visibility: 'hidden'
                                }
                              }
                            }
                          }
                        },
                        items: JSON.parse(curNode.processNode.ports)
                      }// String，节点标签
                    })
                  }
                })
              }
              else {
                data.nodes.push({
                  id: curNode.processNode.uuid, // String，可选，节点的唯一标识
                  x: x,       // Number，必选，节点位置的 x 值
                  y: y,       // Number，必选，节点位置的 y 值
                  width: w,  // Number，必选，节点大小的 width 值
                  height: h, // Number，必选，节点大小的 height 值
                  label: curNode.processNode.name , // String，节点标签
                  shape: 'custom-cylinder',
                  ports: {
                    groups: {
                      top: {
                        position: 'top',
                        attrs: {
                          circle: {
                            r: 4,
                            magnet: true,
                            stroke: '#fe6a00',
                            strokeWidth: 1,
                            fill: '#fff',
                            style: {
                              visibility: 'hidden'
                            }
                          }
                        }
                      },
                      right: {
                        position: 'right',
                        attrs: {
                          circle: {
                            r: 4,
                            magnet: true,
                            stroke: '#fe6a00',
                            strokeWidth: 1,
                            fill: '#fff',
                            style: {
                              visibility: 'hidden'
                            }
                          }
                        }
                      },
                      bottom: {
                        position: 'bottom',
                        attrs: {
                          circle: {
                            r: 4,
                            magnet: true,
                            stroke: '#fe6a00',
                            strokeWidth: 1,
                            fill: '#fff',
                            style: {
                              visibility: 'hidden'
                            }
                          }
                        }
                      },
                      left: {
                        position: 'left',
                        attrs: {
                          circle: {
                            r: 4,
                            magnet: true,
                            stroke: '#fe6a00',
                            strokeWidth: 1,
                            fill: '#fff',
                            style: {
                              visibility: 'hidden'
                            }
                          }
                        }
                      }
                    },
                    items: JSON.parse(curNode.processNode.ports)
                  }// String，节点标签
                })
              }
              break;
            case 'condition':
              if (curNode.processInstanceParameters.length) {
                curNode.processInstanceParameters.forEach(ps=>{
                  if (ps.parameterName ==='style'){
                    let style = JSON.parse(ps.parameterValue)
                    data.nodes.push({
                      id: curNode.processNode.uuid, // String，可选，节点的唯一标识
                      x: x,       // Number，必选，节点位置的 x 值
                      y: y,       // Number，必选，节点位置的 y 值
                      width: w,  // Number，必选，节点大小的 width 值
                      height: h, // Number，必选，节点大小的 height 值
                      label: curNode.processNode.name , // String，节点标签
                      shape: 'custom-polygon',
                      attrs: {
                        body: {
                          refPoints: '0,10 10,0 20,10 10,20',
                          fill: style.bodyFill
                        },
                        text: {
                          text: style.label,
                          fontSize: style.fontSize,
                          fill: style.textFill
                        }
                      },
                      ports: {
                        groups: {
                          top: {
                            position: 'top',
                            attrs: {
                              circle: {
                                r: 4,
                                magnet: true,
                                stroke: '#fe6a00',
                                strokeWidth: 1,
                                fill: '#fff',
                                style: {
                                  visibility: 'hidden'
                                }
                              }
                            }
                          },
                          right: {
                            position: 'right',
                            attrs: {
                              circle: {
                                r: 4,
                                magnet: true,
                                stroke: '#fe6a00',
                                strokeWidth: 1,
                                fill: '#fff',
                                style: {
                                  visibility: 'hidden'
                                }
                              }
                            }
                          },
                          bottom: {
                            position: 'bottom',
                            attrs: {
                              circle: {
                                r: 4,
                                magnet: true,
                                stroke: '#fe6a00',
                                strokeWidth: 1,
                                fill: '#fff',
                                style: {
                                  visibility: 'hidden'
                                }
                              }
                            }
                          },
                          left: {
                            position: 'left',
                            attrs: {
                              circle: {
                                r: 4,
                                magnet: true,
                                stroke: '#fe6a00',
                                strokeWidth: 1,
                                fill: '#fff',
                                style: {
                                  visibility: 'hidden'
                                }
                              }
                            }
                          }
                        },
                        items: JSON.parse(curNode.processNode.ports)
                      }// String，节点标签
                    })
                  }
                })
              }
              else {
                data.nodes.push({
                  id: curNode.processNode.uuid, // String，可选，节点的唯一标识
                  x: x,       // Number，必选，节点位置的 x 值
                  y: y,       // Number，必选，节点位置的 y 值
                  width: w,  // Number，必选，节点大小的 width 值
                  height: h, // Number，必选，节点大小的 height 值
                  label: curNode.processNode.name , // String，节点标签
                  shape: 'custom-polygon',
                  attrs: {
                    body: {
                      refPoints: '0,10 10,0 20,10 10,20'
                    }
                  },
                  ports: {
                    groups: {
                      top: {
                        position: 'top',
                        attrs: {
                          circle: {
                            r: 4,
                            magnet: true,
                            stroke: '#fe6a00',
                            strokeWidth: 1,
                            fill: '#fff',
                            style: {
                              visibility: 'hidden'
                            }
                          }
                        }
                      },
                      right: {
                        position: 'right',
                        attrs: {
                          circle: {
                            r: 4,
                            magnet: true,
                            stroke: '#fe6a00',
                            strokeWidth: 1,
                            fill: '#fff',
                            style: {
                              visibility: 'hidden'
                            }
                          }
                        }
                      },
                      bottom: {
                        position: 'bottom',
                        attrs: {
                          circle: {
                            r: 4,
                            magnet: true,
                            stroke: '#fe6a00',
                            strokeWidth: 1,
                            fill: '#fff',
                            style: {
                              visibility: 'hidden'
                            }
                          }
                        }
                      },
                      left: {
                        position: 'left',
                        attrs: {
                          circle: {
                            r: 4,
                            magnet: true,
                            stroke: '#fe6a00',
                            strokeWidth: 1,
                            fill: '#fff',
                            style: {
                              visibility: 'hidden'
                            }
                          }
                        }
                      }
                    },
                    items: JSON.parse(curNode.processNode.ports)
                  }// String，节点标签
                })
              }
              break;
          }
        })
        // 组装连线节点
        processLink.value.forEach(curLink=>{
          if (curLink.processInstanceParameters.length){
            curLink.processInstanceParameters.forEach(ps=>{
              if (ps.parameterName ==='style'){
                let style = JSON.parse(ps.parameterValue)
                data.edges.push({
                  source: { cell: curLink.sourceUuid, port: curLink.processLink.sourcePortId },
                  target: { cell: curLink.targetUuid, port: curLink.processLink.targetPortId },
                  id: curLink.processLink.uuid,
                  label: curLink.processLink.lineCondition,
                  attrs: {
                    text: {
                      text: style.text
                    },
                    line: {
                      stroke: style.color
                    }
                  }
                })
              }
            })
          }
        })
        currentVersionStatus = res.data?.processInstanceVersions.filter(item=>item.id === currentVersionId.value)[0].status
        console.log("画布加载成功")
        graph.fromJSON(data)
      } else {
        message.error("画布加载失败；失败原因："+res.message)
      }
      if (currentVersionStatus === 1 || currentVersionStatus=== 2){
        message.warning("当前版本已经发布/下线，不能进行修改")
        isDisabled.value = true
      } else {
        isDisabled.value = false
      }
    })
  }
  return {createNodeApi,deleteNodeApi,createLinkApi,deleteLinkApi,detailNodeLink,updateXY,updateSize,updateTargetApi,isDisabled}
}

export default {
  name: "FlowDetail",
  components: {GraphConfigContainer,NodeConfigContainer,EdgeConfigContainer},
  setup() {
    const router = useRouter()
    const store = useStore()
    processInstanceId.value = router.currentRoute.value.params.processInstanceId
    author.value = store.state.user.account
    const {initGraph,graphOnEvent,graphBindKey} = useGraphEffect()
    const {stencil,ports,initStencil,initPorts,loadStencil} = useStencilEffect()
    const {configVisible,graphCon,handleCloseConfig,handleOpenConfig} = useConfigPanel()
    const {createNodeApi,deleteNodeApi,createLinkApi,deleteLinkApi,detailNodeLink,isDisabled} = useNodeEffect()
    const graphConfig = ref()
    configVisible.value = false
    onMounted(()=>{
      // 初始化画布
      initGraph()
      // 绑定画布快捷键
      graphBindKey()
      // 画布绑定监听事件
      graphOnEvent()
      // 初始化流程控件面板
      initStencil()
      // 初始化连接桩
      initPorts()
      // 渲染所有左侧控件图形
      loadStencil()
      graphConfig.value = graph
      // 调后端接口获取渲染数据
      detailNodeLink(graph,0)
    })
    const footerContent = (
      <div style="display: flex; justify-content: flex-end; margin-right: 90px;">
        <a-button onClick={handleCloseConfig}>取消</a-button>
      </div>
    )
    // 更新画布的版本号以及版本对应的数据
    const handleUpdateVersion = (record) =>{
      console.log("更新版本号"+record.id)
      currentVersionId.value = record.id
      detailNodeLink(graph,currentVersionId.value)
      // if (record.status ==1 || record.status ==2){
      //   message.warning("当前版本已经发布/下线，不能进行修改")
      //   isDisabled.value = true
      // } else {
      //   isDisabled.value = false
      // }
    }
    return {
      graph,initGraph,graphOnEvent,graphBindKey,
      stencil,initStencil,
      ports,initPorts,loadStencil,
      curNode,curEdge,isNode,
      graphCon,configVisible,handleCloseConfig,handleOpenConfig,
      graphConfig,
      createNodeApi,deleteNodeApi,createLinkApi,deleteLinkApi,detailNodeLink,
      footerContent,
      currentVersionId,
      processInstanceId,
      handleUpdateVersion,
      isDisabled
    }
  }
}
</script>

<style scoped>
/*.shade {*/
/*  position: fixed;*/
/*  top: 0;*/
/*  left: 0;*/
/*  z-index: 1;*/
/*  width: 100%;*/
/*  height: 100%;*/
/*  background-color: rgba(0, 0, 0, 0.5);*/
/*}*/
.flow-div {
  position: fixed;
  overflow: auto;
  top: 64px;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #fff;
  border: 0;
  border-radius: 0px;
  padding:0;
  margin:0;
  height: auto;
}
#container {
  display: flex;
  border: 1px solid #dfe3e8;
  height: 100%;
  width: 100%;
}
#stencil {
  width: 250px;
  height: 100%;
  position: relative;
  border-right: 1px solid #dfe3e8;
}
#graph-container {
  /*width: calc(100% - 500px);*/
  width: 100%;
  height: 100%;
  /*background-color: #fffbe6*/
}
#config-container {
  z-index: 2;
  position: relative;
  width: 600px;
  height: 100%;
  border-left: 1px solid #dfe3e8;
}
.collpase-icon {
  position: absolute;
  top: 30px;
  left: -8px;
  color: #ff7c34;
  background-color: #fff;
  cursor: pointer;
  font-size: 22px;
}
.open-icon{
  position: relative;
  top: 30px;
  right: 8px;
  color: #ff7c34;
  background-color: #fff;
  cursor: pointer;
  font-size: 22px;
}
.drawer-iconfont{
  position: absolute;
  top: 100px;
  left: 100px;
}
.color-container {
  width: 24px;
  height: 24px;
  padding: 4px;
  border: 1px solid #dfe3e8;
  border-radius: 2px;
}
.edit-color {
  cursor: pointer;
  height: 100%;
}
/deep/ .x6-widget-stencil  {
  background-color: #fff;
}
/deep/ .x6-widget-stencil-title {
  background-color: rgba(0,0,0,.03)
}
/deep/ .x6-widget-stencil-group-title {
  background-color: rgba(0,0,0,.03)
}
.x6-widget-transform {
  margin: -1px 0 0 -1px;
  padding: 0px;
  border: 1px solid #239edd;
}
.x6-widget-transform > div {
  border: 1px solid #239edd;
}
.x6-widget-transform > div:hover {
  background-color: #3dafe4;
}
.x6-widget-transform-active-handle {
  background-color: #3dafe4;
}
.x6-widget-transform-resize {
  border-radius: 0;
}
.x6-widget-selection-inner {
  border: 1px solid #239edd;
}
.x6-widget-selection-box {
  opacity: 0;
}
.disabled-item {
  pointer-events: none;
  opacity: 0.6;
}
</style>
