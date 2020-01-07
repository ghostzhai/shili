const propertyType = {
  TEXT: ".asText()",
  DATE: ".asDate()",
  UUID: ".asUuid()",
  BYTE: ".asByte()",
  BLOB: ".asBlob()",
  INT: ".asInt()",
  FLOAT: ".asFloat()",
  DOUBLE: ".asDouble()",
  LONG: ".asLong()",
  MEDIA: ".asText()",
};
const mediaType = {
  "文本": '.userdata("type","文本")',
  "图像": '.userdata("type","图像")',
  "音频": '.userdata("type","音频")',
  "视频": '.userdata("type","视频")',
};
const indexType = {
  "SECONDARY": '.secondary()',
  "RANGE": '.range()',
  "SEARCH": '.search()'
};
export default {
  vertex: {
    getCount(name) {
      return `g.V().hasLabel('${name}').count()`
    },
    /**
     * 获得定义以确定值是否存在
     * @param name
     */
    getByName(name) {
      return `graph.schema().getVertexLabel('${name}')`
    },
    /**
     * 创建
     * @param values
     */
    create(values) {
      var nullableKeys = {}
      if (values.propertyList)
        for (var i = 0; i < values.propertyList.length; i++) {
          nullableKeys[values.propertyList[i].name] = true
        }
      var propertiesMap = Object.assign({'名称': true}, nullableKeys)
      var nullableKeysList = []
      var propertiesList = []
      for (var key in nullableKeys) {
        if (key !== '名称')
          nullableKeysList.push(`"${key}"`)
      }
      for (var key in propertiesMap) {
        propertiesList.push(`"${key}"`)
      }
      //1. 建立vertexLabel(name,properties)
      var gremlinList = [
        `graph.schema().vertexLabel("${values.name}").properties(${propertiesList.join(',')}).useCustomizeStringId().nullableKeys(${nullableKeysList.join(',')}).ifNotExist().create()`,
        `graph.schema().indexLabel("${values.name}ByName").onV("${values.name}").by("名称").search().ifNotExist().create()`];
      //2. 建立索引
      if (values.indexList)
        for (var i = 0; i < values.indexList.length; i++) {
          var index = values.indexList[i];
          let hasAllAttr = true;
          if (index.fields) {
            for (var j = 0; j < index.fields.length; j++) {
              if (!propertiesMap[index.fields[j]]
                || (index.fields[j] === '名称' && index.index_type === 'SEARCH')) {
                hasAllAttr = false
                break
              }
            }
          }
          var type = indexType[index.index_type] ? indexType[index.index_type] : '';
          const byStr = `.by("${index.fields.join(",")}")`
          if (hasAllAttr)
            gremlinList.push(`graph.schema().indexLabel("${index.name}").onV("${values.name}")${byStr}${type}.ifNotExist().create()`)
        }
      return gremlinList.join(";")
    },
    /**
     * 删除
     */
    deleteByName(name) {
      return `graph.schema().vertexLabel("${name}").remove()`
    }
  },
  edge: {
    getCount(name) {
      return `g.E().hasLabel('${name}').count()`
    },
    /**
     * 获得定义以确定值是否存在
     * @param name
     */
    getByName(name) {
      return `graph.schema().getEdgeLabel('${name}')`
    },
    /**
     * 创建
     * @param values
     */
    create(values) {
      var nullableKeys = {}
      if (values.propertyList)
        for (var i = 0; i < values.propertyList.length; i++) {
          nullableKeys[values.propertyList[i].name] = true
        }
      var propertiesMap = Object.assign({'名称': true}, nullableKeys)
      var nullableKeysList = []
      var propertiesList = []
      for (var key in nullableKeys) {
        // if (key !== '名称')
          nullableKeysList.push(`"${key}"`)
      }
      for (var key in propertiesMap) {
        propertiesList.push(`"${key}"`)
      }
      //1. 建立vertexLabel(name,properties)
      //
      var gremlinList = [
        `graph.schema().edgeLabel("${values.name}").sourceLabel("${values.source_label}").targetLabel("${values.target_label}").properties(${propertiesList.join(',')}).nullableKeys(${propertiesList.join(',')}).ifNotExist().create()`,
        `graph.schema().indexLabel("${values.name}ByName").onE("${values.name}").by("名称").search().ifNotExist().create()`
      ];
      //2. 建立索引
      //2. 建立索引
      if (values.indexList)
        for (var i = 0; i < values.indexList.length; i++) {
          var index = values.indexList[i];
          let hasAllAttr = true;
          if (index.fields) {
            for (var j = 0; j < index.fields.length; j++) {
              if (!propertiesMap[index.fields[j]]
                || (index.fields[j] === '名称' && index.index_type === 'SEARCH')) {
                hasAllAttr = false
                break
              }
            }
          }
          var type = indexType[index.index_type] ? indexType[index.index_type] : '';
          const byStr = `.by("${index.fields.join(",")}")`
          if (hasAllAttr)
            gremlinList.push(`graph.schema().indexLabel("${index.name}").onE("${values.name}")${byStr}${type}.ifNotExist().create()`)
        }
      return gremlinList.join(";")
    },
    /**
     * 删除
     */
    deleteByName(name) {
      return `graph.schema().edgeLabel("${name}").remove()`
    }
  },
  property: {
    /**
     * 获得属性,以确定属性是否存在
     * @param name
     * @returns {string}
     */
    getByName(name) {
      return `graph.schema().getPropertyKey('${name}')`
    },
    /**
     * 创建PropertyKey
     * @param data
     * id: "1", name: "2", link: "MEDIA", title: "1", media: "文本"
     */
    create(values) {
      // graph.schema().propertyKey("name").asByte().valueSet().ifNotExist().create()
      const type = propertyType[values.link];
      const media = values.link === 'MEDIA' ? mediaType[values.media] : '';
      return `graph.schema().propertyKey("${values.name}")${type}${media}.valueSingle().ifNotExist().create()`;
    },
    deleteByName(name) {
      return `graph.schema().propertyKey("${name}").remove()`
      //schema.propertyKey("name").remove()
    }
  },
  index: {
    create(values) {
      var type = indexType[values.index_type] ? indexType[values.index_type] : '';
      return `graph.schema().indexLabel("${values.name}").${values.label_type}("${values.label_name}").by("${values.fields.join('')}")${type}.ifNotExist().create()`
    },
    deleteByName(name) {
      return `graph.schema().indexLabel("${name}").remove()`
    }
  }
}
