import { Service } from './service.js'

export function flowsList (data) {
  return Service({
    url: '/flows/list',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}

export function getHots (data) {
  return Service({
    url: '/flows/hot',
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    params: data
  })
}

export function createFlow (data) {
  return Service({
    url: '/flows/createInstance',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}

export function createNode (data) {
  return Service({
    url: '/flows/createNode',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}

export function deleteNode (data) {
  return Service({
    url: '/flows/deleteNode',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}

export function updateNode (data) {
  return Service({
    url: '/flows/updateNode',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}

export function createLink (data) {
  return Service({
    url: '/flows/createLink',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}

export function deleteLink (data) {
  return Service({
    url: '/flows/deleteLink',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}

export function updateLink (data) {
  return Service({
    url: '/flows/updateLink',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}

export function detailInstance (versionId, processInstanceId) {
  return Service({
    url: '/flows/detail/'+versionId+'/'+processInstanceId,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function updateNodeCoordinate (data) {
  return Service({
    url: '/flows/updateNodeCoordinate',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}

export function updateNodeSize (data) {
  return Service({
    url: '/flows/updateNodeSize',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}

export function updateLinkTarget (data) {
  return Service({
    url: '/flows/updateLinkTarget',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}

export function getTools (data) {
  return Service({
    url: '/tools/list',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}

export function getToolDetail (data) {
  return Service({
    url: '/tools/detail',
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    params: data
  })
}

export function runTool (data) {
  return Service({
    url: '/tools/run',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}

export function getLog (data) {
  return Service({
    url: '/tools/log',
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    params: data
  })
}

export function enableFlow (data) {
  return Service({
    url: '/flows/enable',
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    params: data
  })
}

export function disableFlow (data) {
  return Service({
    url: '/flows/disable',
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    params: data
  })
}

export function getToolNames (data) {
  return Service({
    url: '/tools/name',
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    params: data
  })
}

export function queryParameter (data) {
  return Service({
    url: '/flows/queryParameter',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}

export function getAllComponent () {
  return Service({
    url: '/common/list',
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function queryNodes (versionId,processInstanceId) {
  return Service({
    url: '/flows/queryNodes/'+versionId+'/'+processInstanceId,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function editFlow (data) {
  return Service({
    url: '/flows/editInstance',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}

export function queryVariables (versionId,processInstanceId) {
  return Service({
    url: '/flows/queryVariables/'+versionId+'/'+processInstanceId,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function queryVersions (processInstanceId) {
  return Service({
    url: '/version/queryVersions/'+processInstanceId,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function publishVersion (data) {
  return Service({
    url: '/version/publishVersion',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}

export function offlineVersion (data) {
  return Service({
    url: '/version/offlineVersion',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}

export function copyVersion (data) {
  return Service({
    url: '/version/copyVersion',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}

export function executeFlow (data) {
  return Service({
    url: '/task/execute',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}

export function queryTaskLogs (taskId) {
  return Service({
    url: '/task/queryTaskLogs/'+taskId,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function queryLogs (versionId,processInstanceId) {
  return Service({
    url: '/task/queryLogs/'+versionId+'/'+processInstanceId,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function queryLastTaskId (versionId,processInstanceId) {
  return Service({
    url: '/task/queryLastTaskId/'+versionId+'/'+processInstanceId,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function queryTaskList (data) {
  return Service({
    url: '/task/queryTaskList',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}
