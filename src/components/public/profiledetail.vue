<template lang="html">
  <div class="detaile">
    <div class="inform">
      <div class="picture">
        <img :src="nowprodetail.commonImagePrefix+nowprodetail.productImagePath" alt="" width="160px" style="position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);">
      </div>
      <div class="describe">
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <span>设备类型:</span>
              <p>{{nowprodetail.deviceTypeId}}</p>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <span>设备型号:</span>
              <p>{{nowprodetail.deviceModelId}}</p>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <span>厂商ID/厂商名称</span>
              <p>{{nowprodetail.vendorId}} / {{nowprodetail.vendorName}}</p>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <span>协议类型:</span>
              <p>{{nowprodetail.protocolTypeId}}</p>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <span>最后修改时间:</span>
              <p>{{nowprodetail.createTime}}</p>
            </div>
          </el-col>
          <el-col :span="24" v-show ='pro'>
            <div class="grid-content bg-purple">
              <span>描述:</span>
              <p></p>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="service">
      <h5>服务列表</h5>
      <a href="javascript:void(0);" @click="newservice" v-show ='!pro' v-if="hasPermission('profile:ability:addProfileAbility')">
        <i class="iconfont icon-tainjia"></i>新建服务
      </a>
      <div class="table">
        <el-table
          :data="tableData5"
          :row-key="getRowKeys"
          :expand-row-keys="expands"
          style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <div class="">
                  <h6>上行</h6>
                  <!-- <a href="javascript:void(0);" @click="addattribute(props.row)" v-if="props.row.upStreamEntityList!=null&&pro==false&&hasPermission('profile:ability:upStream:addProfileupStream')"> -->
                  <a href="javascript:void(0);" @click="addattribute(props.row)">
                    <i class="iconfont icon-tainjia"></i> 新增上行
                  </a>
                  <div class="order" style="text-align:center" v-if="props.row.upStreamEntityList==null&&pro==false">
                    <a href="javascript:void(0);" @click="addattribute(props.row)">
                      <i class="iconfont icon-tainjia"></i> 新增上行
                    </a>
                  </div>
                  <div class="order" style="text-align:center" v-if="props.row.upStreamEntityList==null&&pro==true">
                    没有数据
                  </div>
                  <div class="attribute" v-for="item in props.row.upStreamEntityList" :key="item.upStreamName">
                    <div class="name">
                      <img src="../../assets/img/attribute.png" alt="">
                      <p style="font-size:13px;display:inline-block;margin-top:10px;">{{item.upStreamName}}</p>
                    </div>
                    <div class="command">
                      <el-row :gutter="20">
                        <el-col :span="4.5">
                          <div class="grid-content bg-purple">
                            <span>属性类型</span>
                            <p>{{item.dictionaryUpStreamType.value}}</p>
                          </div>
                        </el-col>
                        <el-col :span="4.5">
                          <div class="grid-content bg-purple">
                            <span>取值范围</span>
                            <p>{{item.min}}~{{item.max}}</p>
                          </div>
                        </el-col>
                        <el-col :span="4.5">
                          <div class="grid-content bg-purple">
                            <span>步长</span>
                            <p>{{item.step}}</p>
                          </div>
                        </el-col>
                        <el-col :span="4.5">
                          <div class="grid-content bg-purple">
                            <span>单位</span>
                            <p>{{item.unit}}</p>
                          </div>
                        </el-col>
                      </el-row>
                    </div>
                    <div class="visit">
                      <span>访问模式</span>
                      <p>{{item.method}}</p>
                    </div>
                    <div class="check">
                      <span>是否必选</span>
                      <p><el-checkbox v-model="item.required" disabled></el-checkbox></p>
                    </div>
                    <div class="option" v-if='!pro'>
                      <span style="display:none">{{item.upStreamId}}</span>
                      <i class="iconfont icon-tubiao09" title="编辑" @click="editupStream($event,props.row)" v-if="hasPermission('profile:ability:upStream:modifyProfileUpStream')&&item.upStreamName!='pluginPrefix'"></i>
                      <i class="iconfont icon-shanchu" title="删除" @click="delupStream($event,props.row)" v-if="hasPermission('profile:ability:upStream:removeProfileUpStream')&&item.upStreamName!='pluginPrefix'"></i>
                    </div>
                  </div>
                </div>
                <div class="">
                  <h6>下行</h6>
                  <a href="javascript:void(0);" @click="addfield(props.row)" v-if="props.row.downStreamEntityList!=null&&pro==false&&hasPermission('profile:ability:downStream:addProfileDownStream')">
                    <i class="iconfont icon-tainjia"></i> 新增下行
                  </a>
                  <div class="order" v-if="props.row.downStreamEntityList==null&&pro==false">
                    <a href="javascript:void(0);" @click="addfield(props.row)">
                      <i class="iconfont icon-tainjia"></i> 新增下行
                    </a>
                  </div>
                  <div class="order" v-if="props.row.downStreamEntityList==null&&pro==true">
                    没有下行
                  </div>
                  <!-- <div class="attribute comlist" v-for="item in props.row.commandEntityList" :key="item.commandValue">
                    <div class="name">
                      <img src="../../assets/img/attribute.png" alt="">
                      <p style="font-size:13px;display:inline-block;margin-top:10px;">{{item.commandValue}}</p>
                    </div>
                    <div class="command">
                      <el-row :gutter="20">
                      </el-row>
                    </div>
                    <div class="option" v-if='!pro'>
                      <span style="display:none">{{item.commandId}}</span>
                      <i class="iconfont icon-tubiao09" title="编辑" @click="editcommand($event,props.row)" v-if="hasPermission('profile:ability:command:modifyProfileCommand')&&item.commandValue!='pluginPrefix'"></i>
                      <i class="iconfont icon-shanchu" title="删除" @click="delcommand($event,props.row)" v-if="hasPermission('profile:ability:command:removeProfileColumn')&&item.commandValue!='pluginPrefix'"></i>
                    </div>
                  </div> -->

                  <div class="attribute" v-for="item in props.row.downStreamEntityList" :key="item.downStreamName">
                    <div class="name">
                      <img src="../../assets/img/attribute.png" alt="">
                      <p style="font-size:13px;display:inline-block;margin-top:10px;">{{item.downStreamName}}</p>
                    </div>
                    <div class="command">
                      <el-row :gutter="20">
                        <el-col :span="4.5">
                          <div class="grid-content bg-purple">
                            <span>属性类型</span>
                            <p>{{item.dictionaryDownStreamType.value}}</p>
                          </div>
                        </el-col>
                        <el-col :span="4.5">
                          <div class="grid-content bg-purple">
                            <span>取值范围</span>
                            <p>{{item.min}}~{{item.max}}</p>
                          </div>
                        </el-col>
                        <el-col :span="4.5">
                          <div class="grid-content bg-purple">
                            <span>步长</span>
                            <p>{{item.step}}</p>
                          </div>
                        </el-col>
                        <el-col :span="4.5">
                          <div class="grid-content bg-purple">
                            <span>单位</span>
                            <p>{{item.unit}}</p>
                          </div>
                        </el-col>
                      </el-row>
                    </div>
                    <div class="check">
                      <span>是否必选</span>
                      <p><el-checkbox v-model="item.required" disabled></el-checkbox></p>
                    </div>
                    <div class="option" v-if='!pro'>
                      <span style="display:none">{{item.downStreamId}}</span>
                      <i class="iconfont icon-tubiao09" title="编辑" @click="editdownStream(item.downStreamId,props.row)" v-if="hasPermission('profile:ability:downStream:modifyProfileDownStream')&&item.downStreamName!='pluginPrefix'"></i>
                      <i class="iconfont icon-shanchu" title="删除" @click="deldownStream(item.downStreamId,props.row)" v-if="hasPermission('profile:ability:downStream:removeProfileDownStream')&&item.downStreamName!='pluginPrefix'"></i>
                    </div>
                  </div>

                  <!-- <div class="fieldadd">
                    <div class="fieldcommand">
                      <div class="commandheader">
                        <div class="">
                          <img src="../../assets/img/attribute.png" alt="">
                          <p style="font-size:13px;display:inline-block">FORMAT</p>
                        </div>
                        <div class="" style="float:right;padding-top:14px">
                          <i class="iconfont icon-tubiao09" title="编辑"></i>
                          <i class="iconfont icon-shanchu" title="删除"></i>
                          <i class="iconfont icon-jiantouxia" @click="show3 = !show3" v-show="!show3"></i>
                          <i class="iconfont icon-jiantoushang" @click="show3 = !show3" v-show="show3"></i>
                        </div>
                      </div>
                      <el-collapse-transition>
                        <div class="commandinform" v-show="show3">
                          <div class="infofield">
                            <span style="font-size:14px">命令下发字段</span>
                            <a href="javascript:void(0);" @click="responsefil" style="margin-top:5px">
                              <i class="iconfont icon-tainjia"></i> 新增命令下发字段
                            </a>
                          </div>
                          <div class="addinfo">
                            <a href="javascript:void(0);" @click="responsefil">
                              <i class="iconfont icon-tainjia"></i> 新增命令下发字段
                            </a>
                          </div>
                          <div class="addattr">
                            <div class="attribute">
                              <div class="name">
                                <p style="font-size:13px;display:inline-block;margin-top:10px;">FORMAT</p>
                              </div>
                              <div class="command">
                                <el-row :gutter="20">
                                  <el-col :span="2">
                                    <div style="height:66px;"></div>
                                  </el-col>
                                  <el-col :span="4.5">
                                    <div class="grid-content bg-purple">
                                      <span>属性类型</span>
                                      <p>Int</p>
                                    </div>
                                  </el-col>
                                  <el-col :span="4.5">
                                    <div class="grid-content bg-purple">
                                      <span>属性类型</span>
                                      <p>Int</p>
                                    </div>
                                  </el-col>
                                  <el-col :span="4.5">
                                    <div class="grid-content bg-purple">
                                      <span>属性类型</span>
                                      <p>Int</p>
                                    </div>
                                  </el-col>
                                  <el-col :span="4.5">
                                    <div class="grid-content bg-purple">
                                      <span>属性类型</span>
                                      <p>Int</p>
                                    </div>
                                  </el-col>
                                </el-row>
                              </div>
                              <div class="visit">
                                <span>访问模式</span>
                                <p>RWE</p>
                              </div>
                              <div class="check">
                                <span>是否必选</span>
                                <p><el-checkbox v-model="checked" disabled></el-checkbox></p>
                              </div>
                              <div class="option">
                                <i class="iconfont icon-tubiao09" title="编辑"></i>
                                <i class="iconfont icon-shanchu" title="删除"></i>
                              </div>
                            </div>
                          </div>

                          <div class="infofield">
                            <span style="font-size:14px">新增响应字段</span>
                            <a href="javascript:void(0);" @click="responsefil">
                              <i class="iconfont icon-tainjia"></i> 新增响应字段
                            </a>
                          </div>
                          <div class="addinfo">
                            <a href="javascript:void(0);" @click="responsefil">
                              <i class="iconfont icon-tainjia"></i> 新增响应字段
                            </a>
                          </div>
                          <div class="addattr">
                            <div class="attribute">
                              <div class="name">
                                <p style="font-size:13px;display:inline-block;margin-top:10px;">FORMAT</p>
                              </div>
                              <div class="command">
                                <el-row :gutter="20">
                                  <el-col :span="2">
                                    <div style="height:66px;"></div>
                                  </el-col>
                                  <el-col :span="4.5">
                                    <div class="grid-content bg-purple">
                                      <span>属性类型</span>
                                      <p>Int</p>
                                    </div>
                                  </el-col>
                                  <el-col :span="4.5">
                                    <div class="grid-content bg-purple">
                                      <span>属性类型</span>
                                      <p>Int</p>
                                    </div>
                                  </el-col>
                                  <el-col :span="4.5">
                                    <div class="grid-content bg-purple">
                                      <span>属性类型</span>
                                      <p>Int</p>
                                    </div>
                                  </el-col>
                                  <el-col :span="4.5">
                                    <div class="grid-content bg-purple">
                                      <span>属性类型</span>
                                      <p>Int</p>
                                    </div>
                                  </el-col>
                                </el-row>
                              </div>
                              <div class="visit">
                                <span>访问模式</span>
                                <p>RWE</p>
                              </div>
                              <div class="check">
                                <span>是否必选</span>
                                <p><el-checkbox v-model="checked"></el-checkbox></p>
                              </div>
                              <div class="option">
                                <i class="iconfont icon-tubiao09" title="编辑"></i>
                                <i class="iconfont icon-shanchu" title="删除"></i>
                              </div>
                            </div>
                          </div>
                        </div>
                      </el-collapse-transition>
                    </div>
                  </div> -->

                </div>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            label="服务名称"
            prop="serviceName"
            align="center">
            <template slot-scope="scope">
              <b style="color:black">{{ scope.row.serviceName }}</b>
            </template>
          </el-table-column>
          <el-table-column
            label="描述"
            prop="serviceDesc"
            align="center">
          </el-table-column>
          <el-table-column
            label="最后修改时间"
            prop="createTime"
            align="center">
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            v-if ='!pro'>
            <template slot-scope="scope">
              <i class="iconfont icon-tubiao09" title="编辑" style="margin-right:15px" @click="serdetail(scope.row)" v-if="hasPermission('profile:ability:modifyProfileAbility')"></i>
              <i class="iconfont icon-shanchu" title="删除" @click="delser(scope.row)" v-if="hasPermission('profile:ability:removeProfileAbility')"></i>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 新建服务 -->
    <el-dialog title="新建服务" :visible.sync="servicetable" width="70%"  @close='closeForm' :close-on-click-modal="false" top="10vh">
      <div class="servicebody">
        <div class="basicinform">
          <span>基本信息</span>
        </div>
        <div class="informdet">
          <el-row :gutter="20">
            <el-col :span="10">
              <div class="grid-content bg-purple">
                <el-form :label-position="labelPosition" label-width="80px" :model="newservicetable" ref="ruleForm1" :rules="rules">
                  <el-form-item label="服务名称" prop="serviceName">
                    <el-input v-model="newservicetable.serviceName" placeholder="服务名称"></el-input>
                  </el-form-item>
                  <span>建议采取驼峰的命名方式，如：DoorLock，Smoke</span>
                </el-form>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="grid-content bg-purple"></div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">
                <el-form :label-position="labelPosition" label-width="80px" :model="newservicetable" ref="ruleForm2">
                  <el-form-item label="描述" prop="serviceDesc">
                    <el-input
                      type="textarea"
                      :autosize="{ minRows: 2, maxRows: 4}"
                      placeholder="model"
                      v-model="newservicetable.serviceDesc">
                    </el-input>
                  </el-form-item>
                </el-form>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="basicinform">
          <span>上行</span>
          <a href="javascript:void(0);" @click="addattribute" v-if="newservicetable.upStreamEntityList!=null">
            <i class="iconfont icon-tainjia"></i> 新增上行
          </a>
        </div>
        <div class="add" v-if="newservicetable.upStreamEntityList==null">
          <a href="javascript:void(0);" @click="addattribute">
            <i class="iconfont icon-tainjia"></i> 新增上行
          </a>
        </div>
        <div class="attribute" v-for="item in newservicetable.upStreamEntityList">
          <div class="name">
            <img src="../../assets/img/attribute.png" alt="">
            <p style="font-size:13px;display:inline-block;margin-top:10px;">{{item.upStreamName}}</p>
          </div>
          <div class="command">
            <el-row :gutter="20">
              <el-col :span="2">
                <div style="height:66px;"></div>
              </el-col>
              <el-col :span="4.5">
                <div class="grid-content bg-purple">
                  <span>属性类型</span>
                  <p>{{item.dictionaryUpStreamType.value}}</p>
                </div>
              </el-col>
              <el-col :span="4.5">
                <div class="grid-content bg-purple">
                  <span>取值范围</span>
                  <p>{{item.min}}~{{item.max}}</p>
                </div>
              </el-col>
              <el-col :span="4.5">
                <div class="grid-content bg-purple">
                  <span>步长</span>
                  <p>{{item.step}}</p>
                </div>
              </el-col>
              <el-col :span="4.5">
                <div class="grid-content bg-purple">
                  <span>单位</span>
                  <p>{{item.unit}}</p>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="visit">
            <span>访问模式</span>
            <p>{{item.method}}</p>
          </div>
          <div class="check">
            <span>是否必选</span>
            <p><el-checkbox v-model="item.required" disabled></el-checkbox></p>
          </div>
          <div class="option">
            <span style="display:none">{{item.upStreamName}}</span>
            <i class="iconfont icon-tubiao09" title="编辑" @click="editupStreamlist($event)" v-if="item.upStreamName!='pluginPrefix'"></i>
            <i class="iconfont icon-shanchu" title="删除" @click="delupStreamlist($event)" v-if="item.upStreamName!='pluginPrefix'"></i>
          </div>
        </div>
        
        <div class="basicinform">
          <span>下行</span>
          <a href="javascript:void(0);" @click="addfield" v-if="newservicetable.downStreamEntityList!=null">
            <i class="iconfont icon-tainjia"></i> 新增下行
          </a>
        </div>
        <div class="add" v-if="newservicetable.downStreamEntityList==null">
          <a href="javascript:void(0);" @click="addfield">
            <i class="iconfont icon-tainjia"></i> 新增下行
          </a>
        </div>
        <div class="attribute" v-for="item in newservicetable.downStreamEntityList">
          <div class="name">
            <img src="../../assets/img/attribute.png" alt="">
            <p style="font-size:13px;display:inline-block;margin-top:10px;">{{item.downStreamName}}</p>
          </div>
          <div class="command">
            <el-row :gutter="20">
              <el-col :span="4.5">
                <div class="grid-content bg-purple">
                  <span>属性类型</span>
                  <p>{{item.dictionaryDownStreamType.value}}</p>
                  <!-- <p>{{item.downStreamTypeName}}</p> -->
                </div>
              </el-col>
              <el-col :span="4.5">
                <div class="grid-content bg-purple">
                  <span>取值范围</span>
                  <p>{{item.min}}~{{item.max}}</p>
                </div>
              </el-col>
              <el-col :span="4.5">
                <div class="grid-content bg-purple">
                  <span>步长</span>
                  <p>{{item.step}}</p>
                </div>
              </el-col>
              <el-col :span="4.5">
                <div class="grid-content bg-purple">
                  <span>单位</span>
                  <p>{{item.unit}}</p>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="check">
            <span>是否必选</span>
            <p><el-checkbox v-model="item.required" disabled></el-checkbox></p>
          </div>
          <div class="option" v-if='!pro'>
            <span style="display:none">{{item.downStreamName}}</span>
            <i class="iconfont icon-tubiao09" title="编辑" @click="editdownStreamlist($event)" v-if="item.downStreamName!='pluginPrefix'"></i>
            <i class="iconfont icon-shanchu" title="删除" @click="deldownStreamlist($event)" v-if="item.downStreamName!='pluginPrefix'"></i>
          </div>
        </div>
        <!-- <div class="attribute comlist" v-for="item in newservicetable.commandEntityList">
          <div class="name">
            <img src="../../assets/img/attribute.png" alt="">
            <p style="font-size:13px;display:inline-block;margin-top:10px;">{{item.commandValue}}</p>
          </div>
          <div class="command">
            <el-row :gutter="20">
            </el-row>
          </div>
          <div class="option" v-if='!pro'>
            <span style="display:none">{{item.commandValue}}</span>
            <i class="iconfont icon-tubiao09" title="编辑" @click="editcommandlist($event)" v-if="item.commandValue!='pluginPrefix'"></i>
            <i class="iconfont icon-shanchu" title="删除" @click="delcommandlist($event)" v-if="item.commandValue!='pluginPrefix'"></i>
          </div>
        </div> -->

        <!-- <div class="fieldadd">
          <div class="fieldcommand">
            <div class="commandheader">
              <div class="">
                <img src="../../assets/attribute.png" alt="">
                <p style="font-size:13px;display:inline-block">FORMAT</p>
              </div>
              <div class="" style="float:right;padding-top:14px">
                <i class="iconfont icon-tubiao09" title="编辑"></i>
                <i class="iconfont icon-shanchu" title="删除"></i>
                <i class="iconfont icon-jiantouxia" @click="show3 = !show3" v-show="!show3"></i>
                <i class="iconfont icon-jiantoushang" @click="show3 = !show3" v-show="show3"></i>
              </div>
            </div>
            <el-collapse-transition>
              <div class="commandinform" v-show="show3">
                <div class="infofield">
                  <span>字段</span>
                  <a href="javascript:void(0);" @click="responsefil">
                    <i class="iconfont icon-tainjia"></i> 新增字段
                  </a>
                </div>
                <div class="addinfo">
                  <a href="javascript:void(0);" @click="responsefil">
                    <i class="iconfont icon-tainjia"></i> 新增字段
                  </a>
                </div>
                <div class="addattr">
                  <div class="attribute">
                    <div class="name">
                      <p style="font-size:13px;display:inline-block;margin-top:10px;">FORMAT</p>
                    </div>
                    <div class="command">
                      <el-row :gutter="20">
                        <el-col :span="2">
                          <div style="height:66px;"></div>
                        </el-col>
                        <el-col :span="4.5">
                          <div class="grid-content bg-purple">
                            <span>属性类型</span>
                            <p>Int</p>
                          </div>
                        </el-col>
                        <el-col :span="4.5">
                          <div class="grid-content bg-purple">
                            <span>属性类型</span>
                            <p>Int</p>
                          </div>
                        </el-col>
                        <el-col :span="4.5">
                          <div class="grid-content bg-purple">
                            <span>属性类型</span>
                            <p>Int</p>
                          </div>
                        </el-col>
                        <el-col :span="4.5">
                          <div class="grid-content bg-purple">
                            <span>属性类型</span>
                            <p>Int</p>
                          </div>
                        </el-col>
                      </el-row>
                    </div>
                    <div class="visit">
                      <span>访问模式</span>
                      <p>RWE</p>
                    </div>
                    <div class="check">
                      <span>是否必选</span>
                      <p><el-checkbox v-model="checked"></el-checkbox></p>
                    </div>
                    <div class="option">
                      <i class="iconfont icon-tubiao09" title="编辑"></i>
                      <i class="iconfont icon-shanchu" title="删除"></i>
                    </div>
                  </div>
                </div>

                <div class="infofield">
                  <span>新增响应字段</span>
                  <a href="javascript:void(0);" @click="responsefil">
                    <i class="iconfont icon-tainjia"></i> 新增响应字段
                  </a>
                </div>
                <div class="addinfo">
                  <a href="javascript:void(0);" @click="responsefil">
                    <i class="iconfont icon-tainjia"></i> 新增响应字段
                  </a>
                </div>
                <div class="addattr">
                  <div class="attribute">
                    <div class="name">
                      <p style="font-size:13px;display:inline-block;margin-top:10px;">FORMAT</p>
                    </div>
                    <div class="command">
                      <el-row :gutter="20">
                        <el-col :span="2">
                          <div style="height:66px;"></div>
                        </el-col>
                        <el-col :span="4.5">
                          <div class="grid-content bg-purple">
                            <span>属性类型</span>
                            <p>Int</p>
                          </div>
                        </el-col>
                        <el-col :span="4.5">
                          <div class="grid-content bg-purple">
                            <span>属性类型</span>
                            <p>Int</p>
                          </div>
                        </el-col>
                        <el-col :span="4.5">
                          <div class="grid-content bg-purple">
                            <span>属性类型</span>
                            <p>Int</p>
                          </div>
                        </el-col>
                        <el-col :span="4.5">
                          <div class="grid-content bg-purple">
                            <span>属性类型</span>
                            <p>Int</p>
                          </div>
                        </el-col>
                      </el-row>
                    </div>
                    <div class="visit">
                      <span>访问模式</span>
                      <p>RWE</p>
                    </div>
                    <div class="check">
                      <span>是否必选</span>
                      <p><el-checkbox v-model="checked"></el-checkbox></p>
                    </div>
                    <div class="option">
                      <i class="iconfont icon-tubiao09" title="编辑"></i>
                      <i class="iconfont icon-shanchu" title="删除"></i>
                    </div>
                  </div>
                </div>
              </div>
            </el-collapse-transition>

          </div>
        </div> -->


      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="confirm" type="primary" @click="saveservice('ruleForm1')">保 存</el-button>
        <el-button class="cancel" plain @click="servicetable = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 新增属性 -->
    <el-dialog title="新增上行" :visible.sync="newattribute" width="608px"  @close='closeSecond' :close-on-click-modal="false" top="10vh">
      <div class="attr">
        <el-form :model="form" ref="ruleForm3" :rules="rules" label-width="80px">
          <el-form-item label="属性名" prop="upStreamName" v-if="this.servicetable==false">
            <!-- <el-input v-model="form.upStreamName" @change="checkname()"></el-input> -->
            <el-input v-model="form.upStreamName"></el-input>
          </el-form-item>
          <el-form-item label="属性名" prop="upStreamName" v-if="this.servicetable==true">
            <el-input v-model="form.upStreamName"></el-input>
          </el-form-item>
          <el-form-item label="属性类型" prop="upStreamTypeId">
            <el-select v-model="form.upStreamTypeId" placeholder="请选择" @change="currentSel">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.value"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-row :gutter="0">
            <el-col :span="12" v-if="minflag">
              <div class="grid-content bg-purple">
                <el-form-item label="最小" prop="min">
                  <el-input v-model="form.min"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12" v-if="minflag">
              <div class="grid-content bg-purple">
                <el-form-item label="最大" prop="max">
                  <el-input v-model="form.max"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple">
                <el-form-item label="步长" prop="step">
                  <el-input v-model="form.step"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple">
                <el-form-item label="单位" prop="unit">
                  <el-input v-model="form.unit"></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <div class="visitmod">
            <el-form-item label="访问模式" prop="method"><br>
              <el-checkbox-group v-model="form.method">
                <el-checkbox label="R"></el-checkbox><br>
                <el-checkbox label="W"></el-checkbox><br>
                <el-checkbox label="E"></el-checkbox><br>
              </el-checkbox-group>
            </el-form-item>
            <div class="methodtext">
              <span>可以读取属性的值</span><br>
              <span>你可以写（更改）属性的值</span><br>
              <span>当属性值更改时上报事件</span><br>
            </div>
          </div>
          <el-form-item label="是否必选" prop="required">
            <el-checkbox v-model="form.required">是</el-checkbox>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="confirm" type="primary" @click="addupStreamlist('ruleForm3')" v-if="this.servicetable==true">确 定</el-button>
        <el-button class="confirm" type="primary" @click="addupStream('ruleForm3')" v-if="this.servicetable==false">确 定</el-button>
        <el-button class="cancel" plain @click="newattribute = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 新增命令 -->
    <!-- <el-dialog title="新增命令" :visible.sync="field" width="460px"  @close='closeSecond' :close-on-click-modal="false" top="25vh">
      <div class="attr">
        <el-form :model="newfield" ref="ruleForm4" :rules="rules" label-width="80px">
          <el-form-item label="命令报文" prop="commandValue">
            <el-input v-model="newfield.commandValue" placeholder="Command Name"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="confirm" type="primary" @click="addcommandlist('ruleForm4')" v-if="this.servicetable==true">保 存</el-button>
        <el-button class="confirm" type="primary" @click="addcommand('ruleForm4')" v-if="this.servicetable==false">保 存</el-button>
        <el-button class="cancel" plain @click="field = false">取 消</el-button>
      </div>
    </el-dialog> -->

    <!-- 新增响应字段 -->
    <el-dialog title="新增字段" :visible.sync="response" width="600px"  @close='closeThird' :close-on-click-modal="false" top="10vh">
      <div class="attr">
        <el-form :model="fieldform" ref="ruleForm4" :rules="rules" label-width="80px">
          <el-form-item label="字段名" prop="downStreamName">
            <el-input v-model="fieldform.downStreamName"></el-input>
          </el-form-item>
          <el-form-item label="属性类型" prop="downStreamTypeId">
            <el-select v-model="fieldform.downStreamTypeId" placeholder="请选择" @change="currentSel">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.value"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-row :gutter="0">
            <el-col :span="12" v-if="minflag">
              <div class="grid-content bg-purple">
                <el-form-item label="最小" prop="min">
                  <el-input v-model="fieldform.min"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12" v-if="minflag">
              <div class="grid-content bg-purple">
                <el-form-item label="最大" prop="max">
                  <el-input v-model="fieldform.max"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple">
                <el-form-item label="步长" prop="step">
                  <el-input v-model="fieldform.step"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple">
                <el-form-item label="单位" prop="unit">
                  <el-input v-model="fieldform.unit"></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-form-item label="是否必选" prop="required">
            <el-checkbox v-model="fieldform.required">是</el-checkbox>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="confirm" type="primary" @click="adddownStreamlist('ruleForm4')" v-if="this.servicetable==true">确 定</el-button>
        <el-button class="confirm" type="primary" @click="adddownStream('ruleForm4')" v-if="this.servicetable==false">确 定</el-button>
        <el-button class="cancel" plain @click="response = false">取 消</el-button>
      </div>
    </el-dialog>




  </div>
</template>

<script>
import Qs from 'qs'
export default {
  data() {
    return {
      // 是否必选
      checked: true,
      // 新建服务弹出框
      servicetable: false,
      // 是否显示描述
      pro: this.$route.path=='/main/equipment/equipdetail',
      // 服务列表展示的数据
      tableData5: [],
      // 新建服务表单的位置类型
      labelPosition: 'top',
      //新建服务弹框信息
      newservicetable:{
        serviceName:'',
        serviceDesc:'',
        upStreamEntityList:[],
        downStreamEntityList:[]
      },
      // 新建服务的表单验证规则
      rules: {
        serviceName: [
          { required: true, message: '请输入服务名称', trigger: 'blur' },
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        upStreamName: [
          { required: true, message: '请输入服务名称', trigger: 'blur' }
        ],
        upStreamTypeId: [
          { required: true, message: '请输入服务类型', trigger: 'blur' }
        ],
        min: [
          { required: true, message: '请输入最小值', trigger: 'blur' },
          { pattern: /^[+-]?\d*$/, message: '最小值为-32768~32767之间' }
        ],
        max: [
          { required: true, message: '请输入最大值', trigger: 'blur' },
          { pattern: /^[+-]?\d*$/, message: '最大值为-32768~32767之间' }
        ],
        method: [
          { required: true, message: '请选择访问模式', trigger: 'blur' }
        ],
        downStreamName: [
          { required: true, message: '请输入字段名', trigger: 'blur' }
        ],
        downStreamTypeId: [
          { required: true, message: '请选中属性类型', trigger: 'blur' }
        ],
        step: [
          { required: true, message: '请输入步长', trigger: 'blur' }
        ],
        unit: [
          { required: true, message: '请输入单位', trigger: 'blur' }
        ],
      },
      // 新增属性弹出框
      newattribute: false,
      // 新增属性的表单信息
      form: {
        upStreamName: '',
        upStreamTypeId: '',
        min: '',
        max: '',
        step: '',
        unit: '',
        method: [],
        required: true,
      },
      // 新增属性的选择框
      options: [{
        id: 's0',
        value: 'byte(字节)'
      },{
        id: 's1',
        value: 'int8u(8位无符号整型)'
      },{
        id: 's2',
        value: 'int8s(8位有符号整型)'
      },{
        id: 's3',
        value: 'int16u(16位无符号整型)'
      },{
        id: 's4',
        value: 'int16s(16位有符号整型)'
      },{
        id: 's5',
        value: 'int24u(24位无符号整型)'
      },{
        id: 's6',
        value: 'int24s(24位有符号整型)'
      },{
        id: 's7',
        value: 'int32s(32位有符号整型)'
      },{
        id: 's8',
        value: 'int32u(32位无符号整型)'
      },{
        id: 'c8',
        value: 'string(字符串类型)'
      },{
        id: 'c9',
        value: 'varstring(可变长度字符串类型)'
      },{
        id: 'c10',
        value: 'array(数组类型)'
      },{
        id: 'c11',
        value: 'variant(可变长度数组类型)'
      }],
      // 新增属性的选择框内容
      value4: '',
      // 多项选择框数组
      checkList: [],
      // 是否必选
      mustchecked: true,
      // 新增字段弹出框
      field: false,
      // 新增命令信息
      newfield: {
        downStreamValue: '',
      },
      // 新增字段的折叠面板
      activeNames: ['1'],
      // 控制命令字段的显示和隐藏
      show3: true,
      // 响应字段弹出框
      response: false,
      profileId:'',
      //当前产品详细信息
      nowprodetail:{
        productImagePath:'',
        deviceTypeId:'',
        deviceModelId:'',
        vendorId:'',
        vendorName:'',
        protocolTypeId:'',
        createTime:''
      },
      //判断是新增还是修改当前服务
      serflag: true,
      //当前的serviId
      nowserviceId:'',
      //判断是新增还是修改当前属性
      upStreamflag: true,
      //当前的upStreamId
      nowupStreamId: '',
      // 获取row的key值
      getRowKeys(row) {
        return row.serviceId;
      },
      // 要展开的行，数值的元素是row的key值
      expands: [],
      nowserviceName:'',
      //判断是新增还是修改当前命令
      downStreamflag: true,
      //当前的downStreamId
      nowdownStreamId: '',
      upStreamlistnum:'',
      downStreamlistnum:'',
      // 命令字段
      fieldform:{
        downStreamName: '',
        downStreamTypeId: '',
        max: '',
        min: '',
        step: '',
        unit: '',
        required: true,
      },
      userId:this.$store.getters.userId,
      minflag:true,
    }
  },
  created(){
    this.profileId=this.$route.query.profileId;
    this.getnowproduct();
    // this.getattrlist();
  },
  methods:{
    // 匹配是否显示按钮
    hasPermission(permission){
      let myPermissions = this.$store.getters.permissions;
      return myPermissions.indexOf(permission) > -1;
    },
    // 新建服务
    newservice(){
      this.servicetable=true;
      this.serflag=true;
      
      this.newservicetable.upStreamEntityList=[{
        'userId':this.userId,
        'profileId':this.profileId,
        'serviceId':this.nowserviceId,
        'upStreamName':'pluginPrefix',
        'upStreamTypeId':this.options[0].id,
        // 'upStreamTypeName':this.options[0].value,
        'min':'0',
        'max':'255',
        'step':'1',
        'unit':'u',
        'method':'R,W',
        'required':true,
        'dictionaryUpStreamType':{value: this.options[0].value},
      }];
      this.newservicetable.downStreamEntityList=[{
        'userId':this.userId,
        'profileId':this.profileId,
        'serviceId':this.nowserviceId,
        'downStreamName':'pluginPrefix',
        'downStreamTypeId':this.options[0].id,
        // 'downStreamTypeName':this.options[0].value,
        'min':'0',
        'max':'255',
        'step':'1',
        'unit':'u',
        'required':true,
        'dictionaryDownStreamType':{value: this.options[0].value},
      }];
      
    },
    // 清除表单信息
    closeForm () {
      this.$refs.ruleForm1.resetFields();
      this.$refs.ruleForm2.resetFields();
      this.newservicetable.upStreamEntityList=[];
      this.newservicetable.downStreamEntityList=[];
    },
    //清除第二层弹出框信息
    closeSecond(){
      this.$refs.ruleForm3.resetFields();
    },
    closeThird(){
      this.$refs.ruleForm4.resetFields();
    },
    // 新增属性
    addattribute(row){
      this.newattribute=true;
      this.upStreamflag=true;
      this.nowserviceId=row.serviceId;
      this.nowserviceName=row.serviceName;
      this.form = {
        upStreamName: '',
        upStreamTypeId: '',
        min: '',
        max: '',
        step: '',
        unit: '',
        method: [],
        required: true,
      }
    },
    // 新增命令
    addfield(row){
      this.response = true;
      this.downStreamflag=true;
      this.nowserviceId=row.serviceId;
      this.nowserviceName=row.serviceName;
    },
    // 新增命令折叠面板的方法
    handleChange(val) {
      console.log(val);
    },
    // 新增响应字段
    responsefil(){
      this.response=true;
    },
    //获取当前产品的详细信息
    getnowproduct(){
      this.$axios.get(process.env.API_HOST+'profile/queryProfileDetail?'
      +Qs.stringify({
        'userId':this.userId,
        'profileId':this.profileId,
      }))
        .then(res => {
          this.nowprodetail=res.data.returnData[0];
          if(this.nowprodetail.productImagePath==''){
            this.nowprodetail.productImagePath='../../../static/img/default.png'
          }
          this.nowprodetail.deviceTypeId=this.nowprodetail.dictionaryDeviceType.value;
          this.nowprodetail.protocolTypeId=this.nowprodetail.dictionaryProtocolType.value;
          this.tableData5=this.nowprodetail.serviceEntityList;
          for(let i=0;i<this.tableData5.length;i++){
            this.tableData5[i].createTime=this.tableData5[i].createTime.replace('T','\n');
          }
          this.expands=[];
          this.expands.push(this.nowserviceId)
        })
        .catch(error => {
        });
    },
    //保存服务
    saveservice(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //如果为true为增加服务信息
          if(this.serflag==true){
            this.newservicetable.userId=this.userId;
            this.newservicetable.profileId=this.profileId;
            delete this.newservicetable.serviceId;
            let array=[];
            for (let i = 0; i < this.tableData5.length; i++) {
              array.push(this.tableData5[i].serviceName);
            }
            if(array.includes(this.newservicetable.serviceName)==true){
              this.$message('当前服务名称重复，请修改服务名称');
            }else{
              this.$axios.post(process.env.API_HOST+'profile/ability/addProfileAbility',
                JSON.stringify(this.newservicetable),
                {headers:{'Content-Type': 'application/json'}}
              ).then(res => {
                this.getnowproduct();
                this.servicetable=false;
              }).catch(error => {
              });
            }
          }else{
            //如果为false为修改服务信息
            this.newservicetable.showFlag=true;
            this.$axios.put(process.env.API_HOST+'profile/ability/modifyProfileAbility',
              JSON.stringify(this.newservicetable),
              {headers:{'Content-Type': 'application/json'}}
            ).then(res => {
              this.getnowproduct();
              this.servicetable=false;
            }).catch(error => {
            });
          }
        } else {
          return false;
        }
      });
    },
    //查看当前服务信息
    serdetail(row){
      this.servicetable=true;
      this.serflag=false;
      this.$axios.get(process.env.API_HOST+'profile/ability/queryProfileAbility?'
      +Qs.stringify({
        'userId':this.userId,
        'profileId':this.profileId,
        'serviceId':row.serviceId
      }))
        .then(res => {
          this.newservicetable=res.data.returnData[0];
          // 对属性的typeid进行赋值
          let array=this.newservicetable.upStreamEntityList;
          for(let i=0;i<array.length;i++){
            array[i].upStreamTypeId=array[i].dictionaryUpStreamType.id;
          }
          let arr=this.newservicetable.downStreamEntityList;
          for(let i=0;i<arr.length;i++){
            arr[i].downStreamTypeId=arr[i].dictionaryDownStreamType.id;
          }
          
        })
        .catch(error => {
        });
    },
    //删除当前服务
    delser(row){
      this.$confirm('你确定要删除该服务吗？', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        this.$axios.delete(process.env.API_HOST+'profile/ability/removeProfileAbility?'
        +Qs.stringify({
          'userId':row.userId,
          'profileId':this.profileId,
          'serviceId':row.serviceId
        }))
          .then(res => {
            if(res.data.returnCode=='success'){
              this.getnowproduct();
              
            }
          })
          .catch(error => {
          });
      }).catch(() => {
                 
      });
    },
    //获取属性类型下拉框
    // getattrlist(){
    //   this.$axios.get(process.env.API_HOST+'dictionary/queryDictionaryByType?'+Qs.stringify({'type':'COLUMN_TYPE'}))
    //     .then(res => {
    //       this.options=res.data.returnData[0];
    //     })
    //     .catch(error => {
    //     });
    // },
    //新增属性
    addupStream(formName){
      // 判断名称是否重复
      // this.$axios.get(process.env.API_HOST+'profile/ability/upStream/queryProfileUpStream?'
      // +Qs.stringify({
      //   'upStreamName':this.form.upStreamName,
      //   'profileId':this.profileId,
      // }))
      //   .then(res => {
      //     if(res.data.returnCode=='success'){
      //       this.$confirm('该属性名重复请更换', '提示', {
      //         confirmButtonText: '确定',
      //         cancelButtonText: '取消',
      //       }).then(() => {
      //         this.form.upStreamName=''
      //       }).catch(() => {
      //         this.form.upStreamName=''  
      //       });
      //     }else{
      //       // 如果不重复则对属性进行增加和修改
      //       this.$refs[formName].validate((valid) => {
      //         if (valid) {
      //           //为true时为新增属性
      //           if(this.upStreamflag==true){
      //             this.form.profileId=this.profileId;
      //             this.form.method=this.form.method.join(',');
      //             this.form.serviceId=this.nowserviceId;
      //             delete this.form.upStreamId;
      //             this.$axios.post(process.env.API_HOST+'profile/ability/upStream/addProfileUpStream',
      //               JSON.stringify(this.form),
      //               {headers:{'Content-Type': 'application/json'}}
      //             ).then(res => {
      //               this.newattribute=false;
      //               this.getnowproduct();
      //             }).catch(error => {
      //             });
      //           }else{
      //             //为false时为修改属性
      //             this.form.profileId=this.profileId;
      //             this.form.method=this.form.method.join(',');
      //             this.form.serviceId=this.nowserviceId;
      //             this.$axios.put(process.env.API_HOST+'profile/ability/upStream/modifyProfileUpStream',
      //               JSON.stringify(this.form),
      //               {headers:{'Content-Type': 'application/json'}}
      //             ).then(res => {
      //               this.newattribute=false;
      //               this.getnowproduct();
      //             }).catch(error => {
      //             });
      //           }
      //         } else {
      //           return false;
      //         }
      //       });
      //     }
      //   })
      //   .catch(error => {
      //   });
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //为true时为新增属性
          if(this.upStreamflag==true){

            this.$axios.get(process.env.API_HOST+'profile/ability/upStream/queryProfileUpStream?'
            +Qs.stringify({
              'upStreamName':this.form.upStreamName,
              'profileId':this.profileId,
            }))
              .then(res => {
                if(res.data.returnCode=='success'){
                  this.$confirm('该属性名重复请更换', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                  }).then(() => {
                    this.form.upStreamName=''
                  }).catch(() => {
                    this.form.upStreamName=''  
                  });
                }else{
                  this.form.profileId=this.profileId;
                  this.form.method=this.form.method.join(',');
                  this.form.serviceId=this.nowserviceId;
                  delete this.form.upStreamId;
                  this.$axios.post(process.env.API_HOST+'profile/ability/upStream/addProfileUpStream',
                    JSON.stringify(this.form),
                    {headers:{'Content-Type': 'application/json'}}
                  ).then(res => {
                    this.newattribute=false;
                    this.getnowproduct();
                  }).catch(error => {
                  });
                }
              })
              .catch(error => {
              });
          }else{
            this.$axios.get(process.env.API_HOST+'profile/ability/upStream/queryProfileUpStream?'
              +Qs.stringify({
                'upStreamName':this.form.upStreamName,
                'profileId':this.profileId,
              }))
              .then(res => {
                if((res.data.returnCode=='success'&&res.data.returnData[0].upStreamId==this.form.upStreamId&&res.data.returnData[0].upStreamName==this.form.upStreamName)||res.data.returnCode=='failure'){
                  //为false时为修改属性
                  this.form.profileId=this.profileId;
                  this.form.method=this.form.method.join(',');
                  this.form.serviceId=this.nowserviceId;
                  this.$axios.put(process.env.API_HOST+'profile/ability/upStream/modifyProfileUpStream',
                    JSON.stringify(this.form),
                    {headers:{'Content-Type': 'application/json'}}
                  ).then(res => {
                    this.newattribute=false;
                    this.getnowproduct();
                  }).catch(error => {
                  });
                }else{
                  this.$confirm('该属性名重复请更换', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                  }).then(() => {
                    this.form.upStreamName=''
                  }).catch(() => {
                    this.form.upStreamName=''  
                  });
                }
              })
              .catch(error => {
              });
            
          }
        } else {
          return false;
        }
      });

      
    },
    //修改属性
    editupStream(e,row){
      this.upStreamflag=false;
      this.nowserviceId=row.serviceId;
      this.nowserviceName=row.serviceName;
      this.nowupStreamId=e.target.parentNode.firstElementChild.innerText;
      this.$axios.get(process.env.API_HOST+'profile/ability/upStream/queryProfileUpStream?'
      +Qs.stringify({
        'userId':this.userId,
        'profileId':this.profileId,
        'serviceId':row.serviceId,
        'upStreamId':this.nowupStreamId
      }))
        .then(res => {
          this.newattribute=true;
          this.form=res.data.returnData[0];
          this.form.upStreamTypeId=this.form.dictionaryUpStreamType.id;
          this.form.method=this.form.method.split(',');
        })
        .catch(error => {
        });
    },
    //删除属性
    delupStream(e,row){
      this.$confirm('确定删除该上行字段？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        this.nowserviceName=row.serviceName;
        this.$axios.delete(process.env.API_HOST+'profile/ability/upStream/removeProfileUpStream?'
      +Qs.stringify({
        'userId':this.userId,
        'profileId':this.profileId,
        'serviceId':row.serviceId,
        'upStreamId':e.target.parentNode.firstElementChild.innerText
      }))
          .then(res => {
            this.getnowproduct();
          })
          .catch(error => {
          });
      }).catch(() => {
                  
      });
      
    },
    //验证属性名是否重复
    checkname(){
      this.$axios.get(process.env.API_HOST+'profile/ability/upStream/queryProfileUpStream?'
      +Qs.stringify({
        'upStreamName':this.form.upStreamName,
        'profileId':this.profileId,
      }))
        .then(res => {
          if(res.data.returnCode=='success'){
            this.$confirm('该属性名重复请更换', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
            }).then(() => {
              this.form.upStreamName=''
            }).catch(() => {
              this.form.upStreamName=''  
            });
          }
        })
        .catch(error => {
        });
    },
    //新增命令
    adddownStream(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.downStreamflag==true){
            this.fieldform.userId=this.userId;
            this.fieldform.serviceId=this.nowserviceId;
            this.fieldform.profileId=this.profileId;
            delete this.fieldform.downStreamId;

            this.$axios.post(process.env.API_HOST+'profile/ability/downStream/addProfileDownStream',
              JSON.stringify(this.fieldform),
              {headers:{'Content-Type': 'application/json'}}
            ).then(res => {
              this.response = false;
              this.getnowproduct();
            }).catch(error => {
            });

          }else{
            this.fieldform.userId=this.userId;
            this.fieldform.serviceId=this.nowserviceId;
            this.fieldform.profileId=this.profileId;
            this.$axios.put(process.env.API_HOST+'profile/ability/downStream/modifyProfileDownStream',
              JSON.stringify(this.fieldform),
              {headers:{'Content-Type': 'application/json'}}
            ).then(res => {
              this.response=false;
              this.getnowproduct();
            }).catch(error => {
            });
          }
          
        } else {
          return false;
        }
      });
    },
    //修改命令
    editdownStream(cid,row){
      this.response=true;
      this.downStreamflag=false;
      this.nowserviceId=row.serviceId;
      this.nowserviceName=row.serviceName;
      this.nowdownStreamId=cid;
      this.$axios.get(process.env.API_HOST+'profile/ability/downStream/queryProfileDownStream?'
      +Qs.stringify({
        'userId':this.userId,
        'profileId':this.profileId,
        'serviceId':row.serviceId,
        'downStreamId':this.nowdownStreamId
      }))
        .then(res => {
          this.fieldform=res.data.returnData[0];
          this.fieldform.downStreamTypeId=this.fieldform.dictionaryDownStreamType.id;
        })
        .catch(error => {
        });
    },
    //删除命令
    deldownStream(e,row){
      this.$confirm('确定删除本条下行字段？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        this.nowserviceName=row.serviceName;
        this.$axios.delete(process.env.API_HOST+'profile/ability/downStream/removeProfileDownStream?'
      +Qs.stringify({
        'userId':this.userId,
        'profileId':this.profileId,
        'serviceId':row.serviceId,
        'downStreamId':e
      }))
          .then(res => {
            this.getnowproduct();
          })
          .catch(error => {
          });

      }).catch(() => {
                  
      });
      
    },
    //增加属性列表
    addupStreamlist(formName){
      this.$axios.get(process.env.API_HOST+'profile/ability/upStream/queryProfileUpStream?'
      +Qs.stringify({
        'upStreamName':this.form.upStreamName,
        'profileId':this.profileId,
      }))
        .then(res => {
          if((res.data.returnCode=='success'&&res.data.returnData[0].upStreamId==this.form.upStreamId&&res.data.returnData[0].upStreamName==this.form.upStreamName)||res.data.returnCode=='failure'){
            this.$refs[formName].validate((valid) => {
              if (valid) {
                if(this.upStreamflag==true){
                  this.form.method=this.form.method.join(',');
                  let obj={};
                  for ( let j in this.form) {
                    obj[j] = this.form[j];
                  }
                
                  let object={};
                  for(let i=0;i<this.options.length;i++){
                    if(obj.upStreamTypeId==this.options[i].id){
                      object.value=this.options[i].value
                    }
                  }
                  obj.dictionaryUpStreamType=object;
                  this.newservicetable.upStreamEntityList.push(obj);
                  this.newattribute=false;
                }else{
                  this.form.method=this.form.method.join(',');
                  let obj={};
                  for ( let j in this.form) {
                    obj[j] = this.form[j];
                  }
                  for(let i=0;i<this.options.length;i++){
                    if(obj.upStreamTypeId==this.options[i].id){
                      obj.dictionaryUpStreamType.value=this.options[i].value
                    }
                  }
                  this.newservicetable.upStreamEntityList.splice(this.upStreamlistnum,1,obj);
                  this.newattribute=false;
                }
              } else {
                return false;
              }
            });
          }else{
            this.$confirm('该属性名重复请更换', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
            }).then(() => {
              this.form.upStreamName=''
            }).catch(() => {
              this.form.upStreamName=''  
            });
          }
        })
        .catch(error => {
        });
      
    },
    //编辑属性列表
    editupStreamlist(e){
      this.newattribute=true;
      this.upStreamflag=false;
      let name=e.target.parentNode.firstElementChild.innerText;
      for(let i=0;i<this.newservicetable.upStreamEntityList.length;i++){
        if(name==this.newservicetable.upStreamEntityList[i].upStreamName){
          this.upStreamlistnum=i;
          let obj={};
          for ( let j in this.newservicetable.upStreamEntityList[i]) {
            obj[j] = this.newservicetable.upStreamEntityList[i][j];
          }
          this.form=obj;
          this.form.method=this.form.method.split(',')
        }
      }
    },
    //删除属性列表
    delupStreamlist(e){
      this.$confirm('确定删除该上行字段?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        let name=e.target.parentNode.firstElementChild.innerText;
        for(let i=0;i<this.newservicetable.upStreamEntityList.length;i++){
          if(name==this.newservicetable.upStreamEntityList[i].upStreamName){
            this.newservicetable.upStreamEntityList.splice(i,1)
          }
        }
      }).catch(() => {   
      });
    },
    //新增命令列表
    adddownStreamlist(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.downStreamflag==true){
            let obj={};
            for ( let j in this.fieldform) {
              obj[j] = this.fieldform[j];
            }
            let object={};
            for(let i=0;i<this.options.length;i++){
              if(obj.downStreamTypeId==this.options[i].id){
                object.value=this.options[i].value
              }
            }
            obj.dictionaryDownStreamType=object;
            
            this.newservicetable.downStreamEntityList.push(obj);
            this.response=false;
          }else{
            let obj={};
            for ( let j in this.fieldform) {
              obj[j] = this.fieldform[j];
            }
            for(let i=0;i<this.options.length;i++){
              if(obj.downStreamTypeId==this.options[i].id){
                obj.dictionaryDownStreamType.value=this.options[i].value
              }
            }
            this.newservicetable.downStreamEntityList.splice(this.downStreamlistnum,1,obj);
            this.response=false;
          }
        } else {
          return false;
        }
      });
    },
    //编辑命令列表
    editdownStreamlist(e){
      this.response=true;
      this.downStreamflag=false;
      let name=e.target.parentNode.firstElementChild.innerText;
      
      for(let i=0;i<this.newservicetable.downStreamEntityList.length;i++){
        if(name==this.newservicetable.downStreamEntityList[i].downStreamName){
          this.downStreamlistnum=i;
          
          let obj={};
          for ( let j in this.newservicetable.downStreamEntityList[i]) {
            obj[j] = this.newservicetable.downStreamEntityList[i][j];
          }
          
          this.fieldform=obj;
        }
      }
    },
    deldownStreamlist(e){
      this.$confirm('确定删除本条下行字段?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        let name=e.target.parentNode.firstElementChild.innerText;
        for(let i=0;i<this.newservicetable.downStreamEntityList.length;i++){
          if(name==this.newservicetable.downStreamEntityList[i].downStreamName){
            this.newservicetable.downStreamEntityList.splice(i,1)
          }
        }
      }).catch(() => {   
      });
    },
    currentSel(val){
      if(val=='c8'||val=='c9'||val=='c10'||val=='c11'){
        this.minflag=false;
      }else{
        this.minflag=true;
      }
    },
  }
}
</script>

<style lang="scss" scoped>
  .inform{
    min-height: 210px;
    padding: 26px;
    .picture{
      border: 1px #e6e6e6 solid;
      width: 192px;
      float: left;
      height: 192px;
      position: relative;
    }
    .describe{
      padding-left: 230px;
      span{
        font-size: 12px;
        font-weight: 500;
        color: #8a8a8a;
        display: inline-block;
        margin-bottom: 10px;
      }
      P{
        font-size: 12px;
        font-weight: 500;
        color: black;
        margin-bottom: 25px;
      }
    }
  }
  .service{
    padding: 26px;
    >a{
      color: #000;
      float: right;
      i{
        margin-right: 3px;
      }
    }
    a:hover{
      color: #2b78e0;
    }
    h5{
      font-size: 14px;
      color: #000;
      font-weight: bold;
      display: inline-block;
    }
    .table{
      margin-top: 20px;
      margin-bottom: 70px;
      .demo-table-expand{
        background-color: #f0f2f5;
        padding: 0px 30px;
        padding-bottom: 30px;
        border-top: 3px solid #2b78e0;
      }
      h6{
        color: #000;
        font-size: 14px;
        font-weight: 400;
        line-height: 40px;
        height: 40px;
        border-bottom: 1px #d9d9d9 solid;
        display: inline-block;
      }
      a{
        font-size: 14px;
        float: right;
        line-height: 40px;
      }
      .attribute{
        height: 77px;
        width: 100%;
        border-bottom: 1px #d9d9d9 solid;
        display: flex;
        flex-flow: row;
        >div{
          float: left;
          padding-top: 20px;
          height: 76px;
          padding-left: 20px;
          background-color: #fff;
          span{
            font-size: 12px;
            font-weight: 500;
            color: #8a8a8a;
          }
          p{
            font-size: 12px;
            color: #000;
            font-weight: 600;
            margin-top: 5px;
          }
        }
        .name{
          flex: 2;
          border-right: 1px #ddd solid;
          img{
            vertical-align: middle;
            margin-right: 15px;
          }
        }
        .command{
          flex: 4;
          border-right: 1px #ddd solid;
        }
        .visit{
          flex: 1;
        }
        .check{
          flex: 1;
        }
        .option{
          flex: 1;
          padding-top: 30px;
          i{
            margin-right: 20px;
            color: #8a8a8a;
          }
        }
      }
      .comlist{
        height: 50px;
        >div{
          height: 50px;
          padding-top: 6px;
          border-bottom: 1px solid #d9d9d9;
        }
        .option{
          padding-top: 17px;
        }
        .name,.command{
          border-right: none;
        }
      }
      .order{
        width: 100%;
        height: 48px;
        background-color: #fff;
        border-bottom: 1px #d9d9d9 solid;
        text-align: center;
        font-size: 14px;
        line-height: 48px;
        a{
          float: none;
        }
      }
      i:hover{
        color: #2b78e0;
        cursor: pointer;
      }
    }
  }
  .servicebody{
    height: 480px;
    overflow: auto;
    .basicinform{
      height: 50px;
      background-color: #f7f9fc;
      line-height: 50px;
      padding-left: 30px;
      span{
        color: #000;
      }
      a{
        float: right;
        margin-right: 30px;
      }
    }
    .informdet{
      padding: 0 30px;
      height: 200px;
      .el-col{
        height: 200px;
        span{
          font-size: 12px;
          color: #8a8a8a;
        }
      }
    }
    .add{
      text-align: center;
      height: 48px;
      line-height: 48px;
      border-bottom: 1px solid #ddd;
      margin-bottom: 15px;
    }
  }
  .dialog-footer{
    margin-top: 10px;
  }
  .attr{
    margin-top: 20px;
    padding: 0 60px 0 30px;
  }
  .servicebody{
    .attribute{
      height: 77px;
      width: 100%;
      border-bottom: 1px #d9d9d9 solid;
      background-color: #fff;
      display: flex;
      flex-flow: row;
      >div{
        float: left;
        padding-top: 10px;
        height: 66px;
        background-color: #fff;
        padding-left: 20px;
        span{
          font-size: 12px;
          font-weight: 500;
          color: #8a8a8a;
        }
        p{
          font-size: 12px;
          color: #000;
          font-weight: 600;
          margin-top: 5px;
        }
      }
      .name{
        flex: 2;
        border-right: 1px #ddd solid;
        padding-top: 20px;
        height: 56px;
        img{
          vertical-align: middle;
          margin-right: 15px;
        }
      }
      .command{
        flex: 4;
        border-right: 1px #ddd solid;
      }
      .visit{
        flex: 1;
      }
      .check{
        flex: 1;
      }
      .option{
        flex: 1;
        padding-top: 30px;
        height: 46px;
        i{
          margin-right: 20px;
          color: #8a8a8a;
        }
        i:hover{
          color: #2b78e0;
          cursor: pointer;
        }
      }
    }
    .comlist{
      height: 50px;
      >div{
        height: 44px;
        padding-top: 6px;
        border-bottom: 1px solid #d9d9d9;
      }
      .option{
        padding-top: 17px;
        height: 33px;
      }
      .name,.command{
        border-right: none;
        height: 44px;
        padding-top: 6px;
      }
    }
  }

  a{
    color: #000;
  }
  a:hover{
    color: #2b78e0;
  }
  .fieldadd{

    .fieldcommand{
      width: 100%;
      background-color: #fff;
      .commandheader{
        height: 49px;
        border-bottom: 1px #e6e6e6 solid;
        padding-left: 30px;
        >div{
          float: left;
          p{
            font-size: 12px;
            color: #000;
            font-weight: 600;
            line-height: 49px;
            margin-left: 10px;
          }
          img{
            vertical-align: middle;
          }
          i{
            margin-right: 10px;
            color: #8a8a8a;
          }
          i:hover{
            color: #2b78e0;
            cursor: pointer;
          }
        }
      }
      .commandinform{
        width: 100%;
        background-color: rgb(218, 223, 230);
        padding-bottom: 30px;
        .infofield{
          height: 50px;
          line-height: 50px;
          padding-left: 30px;
          color: #000;
          a{
            float: right;
            margin-right: 20px;
          }
        }
        .addinfo{
          text-align: center;
          height: 48px;
          line-height: 48px;
          border-bottom: 1px solid #ddd;
          margin-bottom: 15px;
          margin: 0 20px;
          background-color: #fff;
        }
        .addattr{
          margin: 0 20px;
        }
      }
    }
  }
  .visitmod{
    position: relative;
    .methodtext{
      position: absolute;
      top: 25px;
      left: 122px;
      span{
        font-size: 12px;
        margin-bottom: 5px;
        display: inline-block;
      }
    }
  }
  



</style>

<style lang="scss">
  .el-table__expanded-cell{
    padding: 0px 0px!important;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{
    background-color: #2b78e0;
  }
  .detaile{
    .el-dialog__body{
      padding: 0px;
      line-height: 24px;
      .el-input__inner{
        height: 36px;
      }
      textarea{
        height: 140px!important;
        resize:none;
      }
    }
    .el-checkbox__label{
      font-size: 12px!important;
    }
    .visitmod{
      .el-form-item__content{
        line-height: 25px;
      }
    }
  }
  .el-form--label-top .el-form-item__label{
    padding: 0 0 10px;
  }
</style>
