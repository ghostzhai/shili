import axios from 'axios'

const instance = axios.create()

function createAPI(baseURL) {
  return function (conf) {
    conf = conf || {}
    conf.data = {}
    if (conf.method === 'post' || conf.method === 'delete') {
      if (conf.opts) delete conf.opts.path
      conf.data = conf.opts
    }
    let type = conf.data ? conf.data.type : ''
    if (type === 'form') {
      conf.data.data = objectToFormData(conf.data.data)
    }
    // if(conf.method === 'get') {
    //   if (conf.opts.type == 'form') {
    //     type = 'form'
    //     conf.data.data = objectToFormData(conf.opts.data)
    //   }
    // }
    let no_data
    if (conf.opts) {
      conf.opts.no_data ? no_data = true : ''
    }
    const option = Object.assign({}, {
      url: decodeURI(conf.url),
      // baseURL: baseURL,
      transformResponse: [function (data) {
        if(data.charAt(0) === "{"||data.charAt(0) === "["){
          data = JSON.parse(data)
          data.code = window.code
        }
        return data;
      }],
      validateStatus: function (status) {
        window.code = status
        return status === 500 || status >= 200 && status < 300; // 默认的
      },
      method: conf.method,
      headers: {
        'Content-Type': type
          ? 'application/x-www-form-urlencoded'
          : 'application/json'
      },
      data: no_data ? null : type ? conf.data.data : conf.data
      // transformRequest: [
      //   function (data, headers) {
      // if (headers.isRest) {
      //   const retArr = []
      //   for (const it in data) {
      //     retArr.push(encodeURIComponent(it) + '=' +
      //       encodeURIComponent(data[it]))
      //   }
      //   debugger
      //   return retArr.join('&')
      // } else {
      //   return JSON.stringify(data)
      // }
      // }]
    }, conf.opts)
    return instance(option)
  }
}

// 转formData
function objectToFormData(obj, form, namespace) {
  var fd = form || new FormData()
  let formKey
  for (var property in obj) {
    if (obj.hasOwnProperty(property)) {
      let key = Array.isArray(obj) ? '[]' : `[${property}]`
      if (namespace) {
        formKey = namespace + key
      } else {
        formKey = property
      }
      // if the property is an object, but not a File, use recursivity.
      if (typeof obj[property] === 'object' &&
        !(obj[property] instanceof File)) {
        objectToFormData(obj[property], fd, formKey)
      } else {
        // if it's a string or a File object
        fd.append(formKey, obj[property])
      }
    }
  }
  return fd
}

function convertRESTAPI(url, opts) {
  if (!opts || !opts.path) return url

  const pathKeys = Object.keys(opts.path)

  pathKeys.forEach((key) => {
    const r = new RegExp('(:' + key + '|{' + key + '})', 'g')
    url = url.replace(r, opts.path[key])
  })

  return url
}

export {
  createAPI,
  convertRESTAPI
}
