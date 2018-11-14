<template>
  <div id="plugdes" class="designplug">
    <div class="header">
      <div class="logo">
        <img src="../../assets/img/logo01-01.png" alt="" height="30px">
      </div>
      <div class="icon">
        <span><i class="iconfont icon-xiaoxi"></i></span>
        <span><i class="iconfont icon-yonghu" @click="show3 = !show3"></i></span>
        <el-collapse-transition>
          <el-card shadow="always" class="dropmenu" v-show="show3">
            <div style="height:200px">
              <p>用户名</p>
              <p>{{username}}</p>
              <span @click="logout">退出登录</span>
            </div>
          </el-card>
        </el-collapse-transition>
      </div>
    </div>

    <div class="designnav">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/main/plug/development' }">插件开发</el-breadcrumb-item>
         <el-breadcrumb-item>设计插件</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="" style="margin-left:80px;float:left;margin-top:-2px;">
        <p style="float:left;margin-right:20px">厂商ID:{{allplugininfo.profileEntity.vendorId}}</p>
        <p style="float:left">设备型号:{{allplugininfo.profileEntity.deviceModelId}}</p>
      </div>
      <div class="optbtn" style="float:right;margin-top:-2px;">
        <a href="javascript:void(0);" @click="Initialization" v-if="hasrealtion.length>1"><i class="iconfont icon-baocun"></i>编译</a>
        <a href="javascript:void(0);" @click="openguide"><i class="iconfont icon-question"></i>新手指导</a>
      </div>
    </div>
    <!-- 右边侧边栏 -->
    <div class="designaside">
      <div class="equipment">
        <div class="equipheader">
          <h4>设备 Profile</h4>
          <!-- <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              更多操作<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown" class="equopt">
              <el-dropdown-item>更换Profile</el-dropdown-item>
              <el-dropdown-item>选择Profile</el-dropdown-item>
              <el-dropdown-item>下载Profile</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> -->
        </div>
        <div class="equipbody">
          <div class="command">
            <div v-for="item in rightservice" :key="item.serviceName" v-show="item.appear==true">
              <p class="commandtitle" @click="openattr($event)">
                {{item.serviceName}}
                <i class="iconfont icon-jiantouxia" v-show="item.showFlag==false" @click.stop></i>
                <i class="iconfont icon-jiantoushang" v-show="item.showFlag==true" @click.stop></i>
                </p>
              <el-collapse-transition>
                <el-tabs v-model="activeName" v-if="item.showFlag==true">
                  <el-tab-pane label="属 性" name="first" v-if="item.judgecol==true">
                    <div class="attribute" @mousedown="firstclk($event,'pane-first',ite.upStreamId)" v-for="ite in item.upStreamEntityList" :key="ite.upStreamName" v-show="ite.upStreamName!='pluginPrefix'">
                      <div class="arrow"></div>
                      <img src="../../assets/img/attr-item01.png" alt="" height="40px" width="0px" @mousedown.stop style="visibility:hidden;margin-left:40px">
                      <p @mousedown.stop v-text="ite.upStreamName"></p>
                      <span v-text="item.serviceName"></span>
                      <i class="iconfont icon-shanchu" @mousedown.stop></i>
                    </div>
                  </el-tab-pane>
                  <el-tab-pane label="命 令" name="second" v-if="item.judgecol==false">
                    <div class="attribute" @mousedown="firstclk($event,'pane-second',ite.downStreamId)" v-for="ite in item.downStreamEntityList" :key="ite.downStreamName" v-show="ite.downStreamName!='pluginPrefix'">
                      <div class="arrow"></div>
                      <img src="../../assets/img/attr-item01.png" alt="" height="40px" width="0px" @mousedown.stop style="visibility:hidden;margin-left:40px">
                      <p @mousedown.stop v-text="ite.downStreamName"></p>
                      <span v-text="item.serviceName"></span>
                      <i class="iconfont icon-shanchu" @mousedown.stop></i>
                    </div>
                    
                  </el-tab-pane>
                </el-tabs>
              </el-collapse-transition>
            </div>
          </div>
        </div>
      </div>
      <div class="detail">
        <div class="detailheader">
          <h4>详情</h4>
        </div>
        <div class="detailbody">
          <h5>设备JSON详情</h5>
          <div class="jsondetail" v-if="fielddetflag==true">
            <span>fieldName : </span><span class="jsonword">{{jsonobj.fieldName}}</span><br>
            <p style="white-space:nowrap;"><span>dataType : </span><span class="jsonword">{{jsonobj.dataTypeDictionary.valueAlias}}</span></p>
            <span>dataLength : </span><span class="jsonword">{{jsonobj.dataLength}}</span><br>
            <span>dataDefault : </span><span class="jsonword">{{jsonobj.dataDefault}}</span><br>
            <span>dataOffset : </span><span class="jsonword">{{jsonobj.dataOffset}}</span><br>
            <span>relativeField : </span><span class="jsonword">{{jsonobj.relativeField}}</span>
          </div>
          <div class="jsondetail" v-if="fielddetflag==false">
            <div v-if="updownflag==true">
              <span>Name : </span><span class="jsonword">{{streamjson.upStreamName}}</span><br>
              <p style="white-space:nowrap;"><span>dataType : </span><span class="jsonword">{{streamjson.dictionaryUpStreamType.valueAlias}}</span></p>
            </div>
            <div v-if="updownflag==false">
              <span>Name : </span><span class="jsonword">{{streamjson.downStreamName}}</span><br>
              <p style="white-space:nowrap;"><span>dataType : </span><span class="jsonword">{{streamjson.dictionaryDownStreamType.valueAlias}}</span></p>
            </div>
            <span>min : </span><span class="jsonword">{{streamjson.min}}</span><br>
            <span>max : </span><span class="jsonword">{{streamjson.max}}</span><br>
            <span>step : </span><span class="jsonword">{{streamjson.step}}</span><br>
            <span>unit : </span><span class="jsonword">{{streamjson.unit}}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 左边主体部分 -->
    <div class="designbody">
      <div class="designplugbody" id="leftbody">
        <el-row id="leftsvg">
          <el-col :span="5">
            <div class="grid-content" style="margin-top:30px;margin-left:60px;">
              <el-button round icon="iconfont icon-tainjia" @click="add" v-show="this.Alist==0" v-if="hasPermission('plugin:ability:addPluginMessage')">新增消息</el-button>
              <ul class="messagelist">
                <li class="active" v-for="Aname in Alist" :key="Aname.messageName" v-if="hasPermission('plugin:ability:queryPluginMessageList')">
                  {{Aname.messageName}}
                </li>
              </ul>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content" v-if="Alist.length!=0">
              <div class="message" v-show="delmessage==false">
                <div class="messoption">
                  <i class="iconfont icon-bianji" @click="leftedit(activedetaile.messageId)" v-if="hasPermission('plugin:ability:modifyPluginMessage')"></i>
                  <i class="iconfont icon-shanchu" @click="deltotalnew(activedetaile.messageId)" v-if="hasPermission('plugin:ability:removePluginMessage')"></i>
                </div>
                <div class="messdetail" v-if="hasPermission('plugin:ability:queryPluginMessage')">
                  <h4>消息名: {{activedetaile.messageName}}</h4>
                  <p>消息类型: {{datatype}}</p>
                  <p>是否包含响应消息 :{{activedetaile.checked==true?'Yse':'No'}}</p>
                  <p>描述: {{activedetaile.messageDesc}}</p>
                </div>
                <div class="messcon">
                  <span>字段列表</span>
                  <i class="iconfont icon-tainjia" style="font-size:24px;cursor:pointer" @click="addword" v-if="hasPermission('plugin:messageField:addMessageField')"></i>
                  <i class="iconfont icon-code" style="font-size:24px;cursor:pointer;margin-right:0px" @click="addcheck" title="增加校验字段" v-if="checkflag==false"></i>
                </div>
                <div class="messcon" v-for="item in leftfield" :key="item.number" v-if="hasPermission('plugin:messageField:queryMessageFieldList')" @click="watch(item.fieldName)">
                  <span class="number"><b v-text="item.number"></b></span>
                  <span v-text="item.fieldName"></span>
                  <i class="iconfont icon-shanchu" @click="alldelete(item.fieldId,item.number)" v-if="item.fieldName!='pluginPrefix'"></i>
                  <i class="iconfont icon-bianji" @click="prefixedit(item.fieldId)" v-if="item.fieldName=='pluginPrefix'"></i>
                  <i class="iconfont icon-bianji" @click="fieldedit(item.fieldId)" v-if="item.fieldName!='pluginPrefix'"></i>
                  <div class="arrow"></div>
                </div>
                <div class="messcon" v-if="checkflag==true">
                  <span>校验字段 :</span>
                  <span>{{checkword.fieldName}}</span>
                  <i class="iconfont icon-shanchu" @click="delcheckfield(checkword.fieldId)"></i>
                  <i class="iconfont icon-bianji" @click="editcheckfield(checkword.fieldId)"></i>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content" id="svgcon" v-show="delmessage==false">

              <svg xmlns="http://www.w3.org/2000/svg" version="1.1" height="500" width="120%" id="svgcurve">

                <path :d=pathd
                style="fill:none;stroke:red;stroke-dasharray: 10;stroke-width:3;display:none;" id="svgdash"></path>

              </svg>

            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <div class="everyattr" v-show="delmessage==false">
                <div class="creattr" v-for="item in hasrealtion" @click="watchdetail(item.fieldName)">
                  <div class="arrow"></div>
                  <img src="../../assets/img/attr-item01.png" alt="" height="40px" width="0px" style="visibility:hidden;margin-left:40px">
                  <p v-text="item.fieldName"></p>
                  <span v-text="item.serviceName"></span>
                  <i class="iconfont icon-shanchu" @click="delattr($event,item.fieldName)" v-if="item.fieldName!='pluginPrefix'"></i>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

    </div>

    <!-- 新增消息弹出框 -->
    <el-dialog title="新建消息" :visible.sync="addnews" width="1100px" @close='closeadd' :close-on-click-modal="false">
      <div class="createnews">
        <div class="basic">
          <div class="head">
            <h4>基本信息</h4>
          </div>
          <div class="basicbody">
            <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign" ref="add">
              <el-row :gutter="20">
                <el-col :span="10">
                  <div class="grid-content">
                    <el-form-item label="消息名" prop="messageName" 
                    :rules="[
                      { required: true, message: '名称不能为空', trigger: 'blur'},
                    ]">
                      <el-input v-model="formLabelAlign.messageName"></el-input>
                    </el-form-item>
                    <el-form-item label="消息类型">
                      <el-radio v-model="formLabelAlign.messageType" label="数据上报" disabled>数据上报</el-radio>
                      <el-radio v-model="formLabelAlign.messageType" label="命令下发" disabled>命令下发</el-radio><br>
                      <!-- <el-checkbox v-model="formLabelAlign.checked">是否添加响应字段</el-checkbox> -->
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="grid-content" style="height:20px">
                  </div>
                </el-col>
                <el-col :span="10">
                  <div class="grid-content">
                    <el-form-item label="消息描述">
                      <el-input
                        type="textarea"
                        :rows="7"
                        placeholder="消息描述"
                        v-model="formLabelAlign.messageDesc">
                      </el-input>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>
        <!-- <div class="basic">
          <div class="head">
            <h4>
              字段
              <a href="javascript:void(0);" @click="addfield" v-if="newfieldlist.length!=0">
                <i class="iconfont icon-tainjia"></i> 添加字段
              </a>
            </h4>
            
          </div>
          <div class="field" v-if="newfieldlist.length==0">
            <a href="javascript:void(0);" @click="addfield">
              <i class="iconfont icon-tainjia"></i> 添加字段
            </a>
          </div>
          <div class="resfield" v-for="item in newfieldlist">
            <el-row>
              <el-col :span="2">
                <div class="grid-content edit">
                  <span>{{item.deviation}}</span>
                </div>
              </el-col>
              <el-col :span="4">
                <div class="grid-content">
                  <span>名字</span>
                  <p>{{item.name}}</p>
                </div>
              </el-col>
              <el-col :span="5">
                <div class="grid-content">
                  <span>消息描述</span>
                  <p>{{item.textarea}}</p>
                </div>
              </el-col>
              <el-col :span="4">
                <div class="grid-content">
                  <span>数据类型</span>
                  <p>{{item.type}}</p>
                </div>
              </el-col>
              <el-col :span="2">
                <div class="grid-content">
                  <span>长度</span>
                  <p>{{item.length}}</p>
                </div>
              </el-col>
              <el-col :span="4">
                <div class="grid-content">
                  <span>是否地址域</span>
                  <p>{{item.default}}</p>
                </div>
              </el-col>
              <el-col :span="3">
                <div class="grid-content edit">
                  <i class="iconfont icon-tubiao09" @click="editnewfield($event)"></i>
                  <i class="iconfont icon-shanchu" @click="delnewfield($event)"></i>
                </div>
              </el-col>
            </el-row>
          </div>
          

        </div> -->
        <div class="basic" v-if="formLabelAlign.checked==true">
          <div class="head responsefield" style="margin-top:30px">
            <h4>响应字段：
              <el-input v-model="formLabelAlign.resfield" placeholder="AAAA0000"></el-input>
              <span>不输入默认为AAAA0000</span>
            </h4>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer fieldfooter">
        <el-button class="confirm" type="primary" @click="addmessage('add')">确 定</el-button>
        <el-button class="cancel" plain @click="addnews = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加字段弹出框 -->
    <el-dialog title="添加字段" :visible.sync="fieldadd" width="600px" @close='closeForm' :close-on-click-modal="false">
      <div class="response">

        <!-- <el-checkbox v-model="addressdomain" @change="whether">标记为地址域</el-checkbox>
        <el-tooltip class="item" effect="light" content="当有相同类型的消息时（例如两条数据上报的消息），必须选择标记为地址域，且相同类型消息的该字段在字段列表的位置必须一致。" placement="right">
          <i class="iconfont icon-question" style="vertical-align:middle"></i>
        </el-tooltip>
        <p v-if="text==true" style="color:red;font-size:12px;">当标记为地址域时，名字固定为messageId；否则，名字不能设置为messageId。</p> -->

        <el-form :label-position="labelPosition" :model="newfield" ref="ruleForm" :rules="rules" label-width="80px">
          <el-form-item label="名字" prop="fieldName">
            <el-input v-model="newfield.fieldName" placeholder="名字" :disabled="editadd"></el-input>
            <!-- <el-input v-model="newfield.fieldName" placeholder="名字" :disabled="nowrite"></el-input> -->
          </el-form-item>
          <el-form-item label="描述">
            <el-input
              type="textarea"
              :rows="6"
              placeholder="描述"
              v-model="newfield.fieldDesc">
            </el-input>
          </el-form-item>
          <el-form-item label="数据类型" prop="dataType">
            <el-select v-model="newfield.dataType" clearable placeholder="请选择" @change="stringchange">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择关联字段" v-if="relationstring==true">
            <el-select v-model="newfield.relativeField" clearable placeholder="请选择">
              <el-option
                v-for="item in resarray"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="dataLength">
            <span slot="label">
              长度
              <el-tooltip class="item" effect="light" content="该字段占多少的字节长度" placement="right">
                <i class="iconfont icon-question" style="vertical-align:middle"></i>
              </el-tooltip>
            </span>
            <el-input v-model="newfield.dataLength" placeholder="长度"></el-input>
          </el-form-item>
          <el-form-item prop="dataDefault">
            <span slot="label">
              默认值
              <el-tooltip class="item" effect="light" content="该字段在码流中的参考值。" placement="right">
                <i class="iconfont icon-question" style="vertical-align:middle"></i>
              </el-tooltip>
            </span>
            <el-input v-model="newfield.dataDefault" placeholder="默认值"></el-input>
          </el-form-item>
          <el-form-item>
            <span slot="label">
              偏移值
              <el-tooltip class="item" effect="light" content="偏移值指的是当前字段到本条消息码流起始位置的字节数。" placement="right">
                <i class="iconfont icon-question" style="vertical-align:middle"></i>
              </el-tooltip>
            </span>
            <el-input v-model="newfield.dataOffset" placeholder="偏移值 "></el-input>
          </el-form-item>

        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="confirm" type="primary" @click="confirmadd('ruleForm')">确 定</el-button>
        <el-button class="cancel" plain @click="fieldadd = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 编辑消息弹出框 -->
    <el-dialog title="编辑消息" :visible.sync="editnews" width="480px" :close-on-click-modal="false">
      <div class="editnew">
        <el-form :label-position="labelPosition" label-width="80px" :model="modifymessage" ref="modify">
          <el-form-item label="消息名" prop="messageName"
          :rules="[{ required: true, message: '名称不能为空', trigger: 'blur'},]">
            <el-input v-model="modifymessage.messageName"></el-input>
          </el-form-item>
          <el-form-item label="消息描述">
            <el-input
              type="textarea"
              :rows="7"
              placeholder="消息描述"
              v-model="modifymessage.messageDesc">
            </el-input>
          </el-form-item>
          <el-form-item label="消息类型">
            <el-radio v-model="modifymessage.messageType" label="数据上报" disabled>数据上报</el-radio>
            <el-radio v-model="modifymessage.messageType" label="命令下发" disabled>命令下发</el-radio><br>
            <!-- <el-checkbox v-model="modifymessage.checked">是否添加响应字段</el-checkbox> -->
          </el-form-item>
        </el-form>
        <div class="editfield" v-if="modifymessage.checked==true">
          <h4>响应字段：
            <el-input v-model="modifymessage.resfield" placeholder="AAAA0000"></el-input><br>
            <span>不输入默认为AAAA0000</span>
          </h4>
        </div>
      </div>
      <div slot="footer" class="dialog-footer fieldfooter">
        <el-button class="confirm" type="primary" @click="editmessage('modify')">完 成</el-button>
        <el-button class="cancel" plain @click="editnews = false">取 消</el-button>
      </div>
    </el-dialog>

    <plugguide ref="look"></plugguide>

    <!-- 新增校验字段 -->
    <el-dialog title="新增校验字段" :visible.sync="checkefield" @close='closecheckform' width="460px" :close-on-click-modal="false" top="25vh">
      <div class="attr">
        <el-form :model="checkfieldlist" ref="ruleForm2" :rules="rules" label-width="80px">
          <el-form-item label="校验字段" prop="fieldName">
            <el-select v-model="checkfieldlist.fieldName" clearable placeholder="请选择">
              <el-option
                v-for="item in checkoptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="confirm" type="primary" @click="confirmcheck('ruleForm2')">保 存</el-button>
        <el-button class="cancel" plain @click="checkefield = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 修改pluginprefix默认值 -->
    <el-dialog title="提示" :visible.sync="pluginprefixbox" width="420px" :close-on-click-modal="false" top="25vh">
      <div class="pluginbox">
        <el-form :label-position="'top'" :model="pluginprefixlist" ref="ruleForm3" :rules="rules" label-width="80px">
          <el-form-item label="修改pluginPrefix的值" prop="default">
            <el-input v-model="pluginprefixlist.default"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="confirm" type="primary" @click="savedefault('ruleForm3')">保 存</el-button>
        <el-button class="cancel" plain @click="pluginprefixbox = false">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import plugguide from './plugguide.vue';
import Qs from 'qs'
export default {
  data () {
    return {
      judgecol: true,
      dialogFormVisible: false,
      username: this.$store.getters.nickname,
      form: {
        name: '',
        textarea: '',
        type: '',
        length: '',
        default: '',
        deviation: '',
      },
      newfield: {
        fieldName: '',
        fieldDesc: '',
        dataType: '',
        dataLength: '',
        dataDefault: '',
        dataOffset: '',
        relativeField:'',
        userId:this.$store.getters.userId,
      },
      options: [{
        value: 's0',
        label: 'byte(字节)'
      },{
        value: 's1',
        label: 'int8u(8位无符号整型)'
      },{
        value: 's2',
        label: 'int8s(8位有符号整型)'
      },{
        value: 's3',
        label: 'int16u(16位无符号整型)'
      },{
        value: 's4',
        label: 'int16s(16位有符号整型)'
      },{
        value: 's5',
        label: 'int24u(24位无符号整型)'
      },{
        value: 's6',
        label: 'int24s(24位有符号整型)'
      },{
        value: 's7',
        label: 'int32s(32位有符号整型)'
      },{
        value: 's8',
        label: 'int32u(32位无符号整型)'
      },{
        value: 'c8',
        label: 'string(字符串类型)'
      },{
        value: 'c9',
        label: 'varstring(可变长度字符串类型)'
      },{
        value: 'c10',
        label: 'array(数组类型)'
      },{
        value: 'c11',
        label: 'variant(可变长度数组类型)'
      }],

      rules: {
        fieldName: [
          {
            required: true,
            message: '请输入字段名称',
            trigger: 'blur'
          },
          { pattern: /^\S+$/, message: '字段名称禁止输入空格' }
        ],
        dataType: [
          {
            required: true,
            message: '请选择数据类型',
            trigger: 'blur'
          }
        ],
        dataLength: [
          {
            required: true,
            message: '请输入长度',
            trigger: 'blur'
          },
          { pattern: /^\S+$/, message: '字段长度不能为空' }
        ],
        dataDefault: [
          {
            required: true,
            message: '请输入默认值',
            trigger: 'blur'
          },
          { pattern: /^\S+$/, message: '字段默认值不能为空' }
        ],
        default: [
          {
            required: true,
            message: '请输入默认值',
            trigger: 'blur'
          },
          { pattern: /^(([0-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5]))))$/, message: '默认值为0~255之间' }
        ],
      },
      activeName: 'first',
      // 新增消息弹出框
      addnews: false,
      value4:'',
      labelPosition: 'top',
      formLabelAlign: {
        messageName: '',
        messageType: '',
        checked: false,
        messageDesc: '',
        resfield:'',
      },
      //编辑消息的字段列表
      modifymessage: {
        messageName: '',
        messageType: '',
        checked: false,
        messageDesc: '',
        resfield:'',
        userId:this.$store.getters.userId,
      },
      //当前激活的信息内容
      activedetaile:{},

      // 新增字段弹出框
      fieldadd:false,

      pathd:'',

      // 用来盛放已经存在的svg曲线坐标的数组
      svgarr:[],

      delarr:[],

      hasmove:false,
      //左侧字段列表数组
      leftfield:[],
      //右侧服务列表
      rightservice:[{
        serviceName:'1',
        showflag:true,
        upStreamEntityList:[{
          upStreamName:'2',
          serviceName:'3'
        }],
        downStreamEntityList:[{
          downStreamName:'4',
          serviceName:'5'
        }]},{
        serviceName:'6',
        showflag:false,
        upStreamEntityList:[{
          upStreamName:'7',
          serviceName:'8'
        }],
        downStreamEntityList:[{
          downStreamName:'9',
          serviceName:'10'
        }]}],

      hasrealtion:[],
      //初始宽度
      initialwidth:0,
      //svg曲线的宽度
      svgwidth:232,
      //左侧的消息列表
      Alist:[],
      //当前激活的元素
      active:'DeviceStatus',
      //需要保存的连接关系
      needsave:[],
      //判断是添加字段还是添加字段列表
      addlist:true,
      //是否标记为地址域
      addressdomain:false,
      //输入框不能输入
      nowrite:false,
      //提示文本
      text:false,
      //判断是编辑还是新增
      editadd:false,
      //当前编辑的是哪个字段
      ordnum:1,
      //编辑消息
      editnews:false,
      //新建消息弹窗框中的字段列表
      newfieldlist:[],
      //关联关系字符串的显示隐藏
      relationstring:false,
      //关联字符串数组
      resarray:[],
      //已经存在关联关系的数组
      relationarr:[],
      //新建消息中当前点击的字段序号
      newnum:'',
      //判断当前修改的消息属于左侧列表的哪一个
      editnumber:'',
      //删除消息
      delmessage:false,
      //选择profile
      selectprofile: false,

      profilelist:[],
      profileId:'',
      plugdetail:false,
      pluglist:{
        pluginName:'',
        pluginType:'',
        pluginDesc:'',
        userId:this.$store.getters.userId,
        profileId:'',
      },
      pluginId:'',
      //当前plugin所有属性列表
      allplugininfo:{
        profileEntity:{
          vendorId:'123',
          deviceModelId:'123',
          serviceEntityList:[],
        },
      },
      messageId:'',
      //插件类型
      plugintype:[{
        value:1,
        label:'数据上报',
      },{
        value:2,
        label:'命令下发',
      }],
      //插件类型
      datatype:'',
      //当前字段的fieldid
      nowfieldId:'',
      fixId:'',
      // json数据详情
      jsonobj: {
        fieldName: '',
        dataType: '',
        dataLength: '',
        dataDefault: '',
        dataOffset: '',
        dataTypeDictionary: {valueAlias: ''},
      },
      // 右侧连接服务属性详情
      streamjson: {
        upStreamName:'',
        dictionaryUpStreamType:{valueAlias:''},
        downStreamName:'',
        dictionaryDownStreamType:{valueAlias:''},
        min:'',
        max:'',
        step:'',
        unit:'',
      },
      serviceorder:'',
      // 校验字段的弹框
      checkefield: false,
      checkoptions: [{
        value: 'CRC16/ModBus',
        label: '循环冗余(CRC16/ModBus)',
      },{
        value: 'BBC',
        label: '异或(BBC)',
      },{
        value: 'LRC',
        label: '纵向冗余(LRC)',
      },{
        value: 'CHECKSUM',
        label: '累加和(CHECKSUM)',
      }],
      checkfieldlist:{
        fieldName:'',
      },
      // 单独拎出的校验字段
      checkword:'',
      // 判断是不是已经存在check字段
      checkflag: false,
      // 判断是增加check字段还是修改
      flagcheck: true,
      // 判断时展示字段详情还是属性详情
      fielddetflag: true,
      // 判断展示属性还是命令
      updownflag: true,
      userId:this.$store.getters.userId,
      show3: false,
      pluginprefixbox: false,
      pluginprefixlist: {
        default:'',
      },
      pluginprefixfield:{},
    }
  },
  created(){
    this.setwidth();
    this.pluginId=this.$route.query.pluginId;
    this.getplugindetail();
  },
  mounted(){
    //this.Initial();
    window.onresize = () => {
      return (() => {
        this.svgwidth = (document.documentElement.clientWidth*0.8-16.8)/24*4+30;
      })()
    };
    
  },
  methods: {
    // 匹配是否显示按钮
    hasPermission(permission){
      let myPermissions = this.$store.getters.permissions;
      return myPermissions.indexOf(permission) > -1;
    },
    logout(){
      this.$store.commit('LOGOUT')
      this.$router.push({ path: '/' });
      location.reload(true)
    },
    // 打开新手指导的方法
    openguide(){
      this.$refs.look.openguid();
    },
    closeForm () {
      this.$refs.ruleForm.resetFields();
      this.text=false;this.nowrite=false;this.addressdomain=false;
      for(let key in this.newfield){
        this.newfield[key]  = ''
      }
    },
    // 新增消息弹出框
    add(){
      this.addnews=true;
      this.formLabelAlign.messageName='';
      this.formLabelAlign.messageDesc='';
      this.formLabelAlign.messageType=this.datatype;
      this.formLabelAlign.checked=false;
      this.newfieldlist=[];
    },
    // 添加字段
    addfield(){
      this.addlist=false;
      this.fieldadd=true;
      //为false时为增加信息
      this.editadd=false;
      this.resarray=[];
      this.relationarr=[];
      //先生成已经存在的关联关系数组，使已经关联的字段不会再被关联
      for(let i=0;i<this.newfieldlist.length;i++){
        this.relationarr.push(this.newfieldlist[i].relativeField);
      }
      //循环字段列表，获取关联字段的数据
      
      for(let i=0;i<this.newfieldlist.length;i++){
        if(this.newfieldlist[i].dataTypeDictionary.id.substring(0,1)=='s'&&this.relationarr.includes(this.newfieldlist[i].fieldName)==false){
          let obj={};
          obj.value=this.newfieldlist[i].fieldName;
          obj.label=this.newfieldlist[i].fieldName;
          this.resarray.push(obj);
        }
      }
    },
    //添加字段列表
    addword(){
      this.addlist=true;
      this.fieldadd=true;
      //为false时为增加信息
      this.editadd=false;
      this.resarray=[];
      this.relationarr=[];
      //先生成已经存在的关联关系数组，使已经关联的字段不会再被关联
      for(let i=0;i<this.leftfield.length;i++){
        this.relationarr.push(this.leftfield[i].relativeField);
      }

      
      //循环字段列表，获取关联字段的数据
      for(let i=0;i<this.leftfield.length;i++){
        if(this.leftfield[i].dataTypeDictionary.id.substring(0,1)=='s'&&this.relationarr.includes(this.leftfield[i].fieldName)==false){
          let obj={};
          obj.value=this.leftfield[i].fieldName;
          obj.label=this.leftfield[i].fieldName;
          this.resarray.push(obj);
        }
      }
    },
    //点击右侧属性栏拖动时
    firstclk(e,proattr,cid){
      let origin=e.target;
      //创建一个和被点击元素相同的元素
      let fieldName=origin.getElementsByTagName('p')[0].innerText;
      let serviceName=origin.getElementsByTagName('span')[0].innerText;
      let div = e.target.cloneNode(true);
      //找到父级元素
      var container = document.getElementById('plugdes');
      //在末尾添加元素
      container.appendChild(div);
      //给元素添加类名
      div.className='creattr';
      // 使创建的元素宽度自适应
      div.style.width=this.initialwidth+'px';
      
      //使元素放置在当前鼠标点击的位置
      div.style.top=(e.clientY-e.layerY)+'px';
      div.style.left=(e.clientX-e.layerX-2)+'px';
      //计算鼠标相对元素位置
      let disX=e.layerX;
      let disY=e.layerY;
      //修改被放置盒子的样式
      let movecon=document.getElementsByClassName('everyattr')[0];
      movecon.style.border='3px dashed #2b78e0';
      movecon.style.opacity='0.5';
      // 设置父盒子的宽度，使不同放分辨率下都可以使子盒子居中
      movecon.style.width=this.initialwidth+20+'px';
      // 获取svg标签及svg虚线元素
      var svgcurves=document.getElementById('svgcurve');
      var svgdash=document.getElementById('svgdash');
      //获取最右侧所有的可以拖拽的元素
      let canmove=document.getElementById(proattr).children;
      
      // 左侧属性栏个数
      let leftnum=this.leftfield.length;
      //来判断是移动元素还是点击元素
      if(this.hasmove==false){
        e.target.style.visibility='visible';
        div.style.visibility='hidden';
        movecon.style.border='none';
        movecon.style.opacity='1';
      }else {
        e.target.style.visibility='hidden';
        div.style.visibility='visible';
      }


      document.onmousemove = (e)=>{

        this.hasmove=true;
        div.style.visibility='visible';
        origin.style.visibility='hidden';
        movecon.style.border='3px dashed #2b78e0';
        movecon.style.opacity='0.5';
        movecon.style.height=this.leftfield.length*79+'px';
        svgcurves.style.height=this.leftfield.length*79+100+'px';
        //计算出盒子跟随鼠标需要移动的位置
        let left=e.clientX-disX;
        let top=e.clientY-disY;
        //如果鼠标移动的距离超过了被放置的盒子，使鼠标的距离为盒子的边界距离
        if(left<movecon.offsetLeft){
          left=movecon.offsetLeft;
        }
        if(top<movecon.offsetTop+135){
          top=movecon.offsetTop+135;
        }
        // 盒子靠到左边产生吸附效果
        if(left<movecon.offsetLeft+60){
          left=movecon.offsetLeft+30;
          // 获取左侧主体部分盒子，以便获取鼠标在当前属性盒子中的位置
          var leftdes =document.getElementById('leftbody');
          // 计算鼠标在当前盒子的位置
          var nowheight = leftdes.scrollTop+top;
          // 计算出左侧对应的点的y坐标
          var number =(((Math.floor((nowheight-70)/50)))*50>315)?((Math.floor((nowheight-70)/50)))*50+15:315;
          // 循环当前svg曲线数组，如果发现这个点已经存在曲线，则向下一个位置开始绘制
          for(var i=0;i<this.svgarr.length;i++){
            if(number==this.svgarr[i]){
              number+=50;
              // number增加之后使i=-1;再从头遍历一遍
              i=-1;
            }
          }
          //如果超过最后一个属性栏，则自动连接到最后一个属性栏
          if(number>(265+leftnum*50)){
            number=265+leftnum*50;
            //如果最后一个连接点已经存在，则自动寻找上一个连接点
            for(var i=0;i<this.svgarr.length;i++){
              if(number==this.svgarr[i]){
                number-=50;
                // number增加之后使i=-1;再从头遍历一遍
                i=-1;
              }
            }
          }
          //绘制红色的虚拟连接虚线
          this.pathd = 'M4'+','+number+','+'C116'+','+number+','+'116'+','+(nowheight-75)+','+this.svgwidth+','+(nowheight-75);

          // 拖拽时的元素样式
          svgcurves.style.opacity='0.2';
          svgdash.style.display='block';
          //如果没有可以连接的点，则不插入元素，也不生成曲线
          if(this.svgarr.length>=leftnum){
            svgdash.style.display='none';
          }
          //如果左侧的消息类型和右侧拖动的属性栏不符，则不生产
          // if(origin.parentNode.id=='pane-second'&&this.activedetaile.radio=='数据上报'){
          //   svgdash.style.display='none';
          // }else if(origin.parentNode.id=='pane-first'&&this.activedetaile.radio=='命令下发'){
          //   svgdash.style.display='none';
          // }
        }

        //盒子离开左边区域时
        if(left>movecon.offsetLeft+60){
          svgdash.style.display='none';
        }

        //使鼠标跟随盒子移动
        div.style.left=left+'px';
        div.style.top = top + 'px';
      };
      //松开鼠标时触发的方法
      document.onmouseup = (e) => {
        document.onmousemove = null;
        document.onmouseup = null;
        movecon.style.border='none';
        movecon.style.opacity='1';
        svgcurves.style.opacity='1';
        //如果左侧的消息类型和右侧拖动的属性栏不符，则不生产
        // if(origin.parentNode.id=='pane-second'&&this.datatype=='数据上报'){
        //   origin.style.visibility='visible';
        // }else if(origin.parentNode.id=='pane-first'&&this.datatype=='命令下发'){
        //   origin.style.visibility='visible';
        // }
        //盒子离开左边区域时
        if(svgdash.style.display=='none'){
          for(let i=0;i<canmove.length;i++){
            if(div.textContent==canmove[i].textContent){
              canmove[i].style.visibility='visible';
              div.style.display='none';
              // 如果不连接则删除子元素
              container.removeChild(div);
            }
          }
        }else {
          // movecon.appendChild(div);
          
          svgdash.style.display='none';
          // 将path曲线放到数组里面
          var arr=this.pathd.split(',');
          // 创建一个path元素
          var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          // 获取当前连接的是哪个元素，以便对曲线的曲率进行修改
          var num = (arr[1]-315)/50+1;
          
          // 根据当前连接的元素来放置属性元素
          // div.style.left="30px";
          // div.style.top=28+(num-1)*80+"px";
          container.removeChild(div);
          let obj={};
          obj.fieldName=fieldName;
          obj.serviceName=serviceName;
          obj.number=num;
          this.hasrealtion.push(obj);
          
          this.$axios.put(process.env.API_HOST+'plugin/messageField/modifyMessageField',
            JSON.stringify(this.leftfield[num-1]),
            {headers:{'Content-Type': 'application/json'}})
            .then(res => {
              // this.searchfieldlist();
            })
            .catch(error => {
            });
          
          //当连接元素时，只保留当前元素父级的服务，其他服务隐藏
          for(let i=0;i<this.rightservice.length;i++){
            if(this.datatype=='数据上报'){
              for(let j=0;j<this.rightservice[i].upStreamEntityList.length;j++){
                if(cid==this.rightservice[i].upStreamEntityList[j].upStreamId){
                  this.rightservice[i].appear=true;
                  break
                }else{
                  this.rightservice[i].appear=false;
                }
              }
            }else{
              for(let j=0;j<this.rightservice[i].downStreamEntityList.length;j++){
                if(cid==this.rightservice[i].downStreamEntityList[j].downStreamId){
                  this.rightservice[i].appear=true;
                  break
                }else{
                  this.rightservice[i].appear=false;
                }
              }
            }
          }
          //保存当前的属性命令id
          if(this.datatype=='数据上报'){
            this.leftfield[num-1].upStreamId=cid
            for(let i=0;i<this.rightservice.length;i++){
              if(obj.serviceName==this.rightservice[i].serviceName){
                this.fixId=this.rightservice[i].upStreamEntityList[0].upStreamId;
              }
            }
            this.leftfield[0].upStreamId=this.fixId;
          }else{
            this.leftfield[num-1].downStreamId=cid;
            for(let i=0;i<this.rightservice.length;i++){
              if(obj.serviceName==this.rightservice[i].serviceName){
                this.fixId=this.rightservice[i].downStreamEntityList[0].downStreamId;
              }
            }
            this.leftfield[0].downStreamId=this.fixId;
          }
          
          this.$axios.put(process.env.API_HOST+'plugin/messageField/modifyMessageField',
            JSON.stringify(this.leftfield[0]),
            {headers:{'Content-Type': 'application/json'}})
            .then(res => {
              // this.searchfieldlist();
            })
            .catch(error => {
            });


          this.$axios.put(process.env.API_HOST+'plugin/messageField/modifyMessageField',
            JSON.stringify(this.leftfield[num-1]),
            {headers:{'Content-Type': 'application/json'}})
            .then(res => {
              // this.searchfieldlist();
            })
            .catch(error => {
            });
          
          
          this.$nextTick(function(){
            let nowdiv=movecon.lastElementChild;
            nowdiv.style.width=this.initialwidth+'px';
            // 根据当前连接的元素来放置属性元素
            nowdiv.style.left='30px';
            nowdiv.style.top=28+(num-1)*80+'px';
            //如果此时为数据上报时显示右侧箭头
            if(this.datatype=='数据上报'){
              nowdiv.firstElementChild.style.display='block';
            }else{
              path.setAttribute('style', 'fill:none;stroke:#bf70d5;stroke-width:3;animation:dash 0s linear');
              let commandarrow=document.getElementsByClassName('messcon');
              for(let i=1;i<commandarrow.length;i++){
                if(i==num){
                  commandarrow[i].lastElementChild.style.display='block'
                }
              }
            }
            
          });


          // 对连接的曲线曲率进行设置
          var d = 'M4'+','+arr[1]+','+'C116'+','+arr[1]+','+'116'+','+(100+80*(num-1))+','+this.svgwidth+','+(100+80*(num-1));
          // 对path曲线的属性进行设置
          path.setAttribute('d', d);
          path.setAttribute('style', 'fill:none;stroke:#2b78e0;stroke-width:3');
          
          // 将path曲线添加到svg中
          svgcurves.appendChild(path);

          this.svgarr.push(arr[1]);

          for(let i=0;i<canmove.length;i++){
            if(div.textContent==canmove[i].textContent){
              // canmove[i].style.visibility='visible';
              canmove[i].style.display='none';
            }
          }
          
        }
        this.hasmove=false;
        
      };
    },
    //初始化
    Initial(){
      
      let initbox=document.getElementsByClassName('everyattr')[0];
      var svgcurves=document.getElementById('svgcurve');
      let commandarrow=document.getElementsByClassName('messcon');
      this.svgarr=[];
      if(this.hasrealtion.length>0){
        //生成盒子元素以及svg曲线
        for(let i=0;i<this.hasrealtion.length;i++){
          //生成初始化盒子，并放置好位置
          for(let j=0;j<initbox.children.length;j++){
            initbox.children[j].style.width=this.initialwidth+'px';
            if(i==j){
              initbox.children[j].style.top=28+(this.hasrealtion[i].number-1)*80+'px';
              if(this.datatype=='数据上报'){
                initbox.children[j].firstElementChild.style.display='block';
              }
            }
          }
          var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          var ih=(this.hasrealtion[i].number-1)*50+315;
          var d = 'M4'+','+ih+','+'C116'+','+ih+','+'116'+','+(100+80*(this.hasrealtion[i].number-1))+','+this.svgwidth+','+(100+80*(this.hasrealtion[i].number-1));
          path.setAttribute('d', d);
          
          
          if(this.datatype=='数据上报'){
            path.setAttribute('style', 'fill:none;stroke:#2b78e0;stroke-width:3');
          }else{
            path.setAttribute('style', 'fill:none;stroke:#bf70d5;stroke-width:3;animation:dash 0s linear');
            for(let j=1;j<commandarrow.length;j++){
              if(j==this.hasrealtion[i].number){
                commandarrow[j].lastElementChild.style.display='block'
              }
            }
          }
          
          svgcurves.appendChild(path);
          this.svgarr.push(ih);
          
        }
      }
      initbox.style.height=this.leftfield.length*79+'px';
      svgcurves.style.height=this.leftfield.length*79+100+'px';
      
    },
    //删除元素及svg曲线
    delattr(e,fidname){
      this.$confirm('确定要删除这条映射关系吗？', '删除映射', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        this.delarr=[];
        //声明当前元素
        let nowelement=e.target.parentNode;
        let commandarrow=document.getElementsByClassName('messcon');
        //获取当前元素所构成svg曲线的高度
        let noweleht=nowelement.offsetTop+72;
        var svgcurves=document.getElementById('svgcurve');
        for(let i=1;i<svgcurves.children.length;i++){
          var str=svgcurves.children[i].outerHTML;
          //获取path中d的最后一位的值
          str = str.substring(str.indexOf('=') + 2,str.indexOf('s')-2).split(',')[7];
          this.delarr.push(str);
        }
        //找到当前连接的元素属于svg中的第几个
        let svgnum=this.delarr.indexOf(noweleht.toString())+1;
        
        //在svg中删除这个元素
        svgcurves.removeChild(svgcurves.children[svgnum]);
        
        // 获取svg左侧的连接节点的位置
        let leftnumber=((noweleht-100)/80*50+315).toString();
        let relnum=(leftnumber-315)/50+1;
        
        for(let i=0;i<this.hasrealtion.length;i++){
          if(relnum==this.hasrealtion[i].number){
            let order=this.hasrealtion.indexOf(this.hasrealtion[i]);
            this.hasrealtion.splice(order,1);
          }
        }
        
        if(this.datatype=='数据上报'){
          this.leftfield[relnum-1].upStreamId=null;
          let canmove=document.getElementById('pane-first').children;
          
          for(let j=0;j<canmove.length;j++){
            if(fidname==canmove[j].children[2].innerText){
              canmove[j].style.visibility='visible';
              canmove[j].style.display='block';
            }
          }
          if(this.hasrealtion.length<=1){
            for(let i=0;i<this.rightservice.length;i++){
              this.rightservice[i].appear=true;
            }
          }

        }else{
          this.leftfield[relnum-1].downStreamId=null;
          commandarrow[relnum].lastElementChild.style.display='none'
          let canmove=document.getElementById('pane-second').children;
          for(let j=0;j<canmove.length;j++){
            if(fidname==canmove[j].children[2].innerText){
              canmove[j].style.visibility='visible';
              canmove[j].style.display='block';
            }
          }
          if(this.hasrealtion.length<=1){
            for(let i=0;i<this.rightservice.length;i++){
              this.rightservice[i].appear=true;
            }
          }
        }

        this.$axios.put(process.env.API_HOST+'plugin/messageField/modifyMessageField',
          JSON.stringify(this.leftfield[relnum-1]),
          {headers:{'Content-Type': 'application/json'}})
          .then(res => {
            // this.searchfieldlist();
          })
          .catch(error => {
          });
        
        
        
        //定义一个从数组中删除指定数值的方法
        function removeByValue(arr, val) {
          for(var i=0; i<arr.length; i++) {
            if(arr[i] == val) {
              arr.splice(i, 1);
              break;
            }
          }
        }
        
        //从数组中删除这个元素，删除后便可以连接
        removeByValue(this.svgarr,leftnumber);
        
        // 将这个盒子也一起删除
        this.$nextTick(function () {
          let initbox=document.getElementsByClassName('everyattr')[0];
          for(let i=0;i<this.hasrealtion.length;i++){
            initbox.children[i].style.top=28+(this.hasrealtion[i].number-1)*80+'px';
          }

        })
        
        
        
        
        
      }).catch(() => {
      });
    },
    //动态改变svg曲线的宽度
    setwidth(){
      this.svgwidth = (document.documentElement.clientWidth*0.8-16.8)/24*4+30;
      this.initialwidth = document.documentElement.clientWidth*0.2-52;
      
    },
    //保存当前页的svg连接数据
    savenow(){
      let curves=document.getElementById('svgcurve');
      let arr=[];
      for(let i=1;i<curves.children.length;i++){
        let str=curves.children[i].outerHTML;
        //获取path中d对应的高度值
        str = str.substring(str.indexOf('=') + 2,str.indexOf('s')-2).split(',')[1];
        arr.push(str);
      }
      let box=document.getElementsByClassName('everyattr')[0];
      let num=box.children.length;
      // this.hasrealtion=[];
      this.needsave=[];
      for(let i=0;i<num;i++){
        let obj={};
        obj.name=box.children[i].getElementsByTagName('p')[0].innerText;
        obj.serviceName=box.children[i].getElementsByTagName('span')[0].innerText;
        this.needsave.push(obj);
      }

      for(let i=0;i<this.needsave.length;i++){
        this.needsave[i].number=(arr[i]-315)/50+1;
      }
      let object={};
      object.hasrealtion=this.needsave;
      object.leftfield=this.leftfield;
      let name=document.getElementsByClassName('active')[0].innerText.replace(/\s/g, '');
      //在点击左侧列表栏时保存当前已经连接好的数据关系
      sessionStorage.setItem(name,JSON.stringify(object));
    },
    //确定添加字段列表
    confirmadd(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //增加字段信息
          if(this.editadd==false){
            this.newfield.pluginId=this.pluginId;
            this.newfield.profileId=this.profileId;
            this.newfield.messageId=this.messageId;
            delete this.newfield.fieldId;
            if(this.newfield.dataType.substr(0,1)=='s'){
              delete this.newfield.relativeField;
            }
            var array=[];
            array.push(this.newfield);
            this.$axios.post(process.env.API_HOST+'plugin/messageField/addMessageField',
              Qs.stringify({
                'messageFieldJson': JSON.stringify(array),
              }))
              .then(res => {
                this.fieldadd=false;

                this.$axios.get(process.env.API_HOST+'plugin/messageField/queryMessageFieldList?'
                +Qs.stringify({
                  'userId':this.userId,
                  'profileId':this.profileId,
                  'messageId':this.messageId,
                }))
                  .then(res => {
                    this.leftfield=res.data.returnData;
                    for(let i=0;i<this.leftfield.length;i++){
                      this.leftfield[i].number=i+1;
                    }
                    
                  })
                  .catch(error => {
                  });

                // this.searchfieldlist();
              })
              .catch(error => {
              });
          }else{
            //修改字段信息
            this.newfield.profileId=this.profileId;
            
            if(this.newfield.dataType.substr(0,1)=='s'){
              delete this.newfield.relativeField;
            }
            
            if(this.datatype=='数据上报'){
              if(this.newfield.profileUpStreamEntity!=null){
                this.newfield.upStreamId=this.newfield.profileUpStreamEntity.upStreamId
              }
            }else{
              if(this.newfield.profileDownStreamEntity!=null){
                this.newfield.downStreamId=this.newfield.profileDownStreamEntity.downStreamId
              }
            }
            
            this.$axios.put(process.env.API_HOST+'plugin/messageField/modifyMessageField',
              JSON.stringify(this.newfield),
              {headers:{'Content-Type': 'application/json'}})
              .then(res => {
                this.fieldadd=false;
                let curves=document.getElementById('svgcurve');
                let svgnum=curves.children.length;
                for(let i=1;i<svgnum;i++){
                  curves.removeChild(curves.children[1])
                }
                let relobj=this.hasrealtion[0];
                this.hasrealtion=[];
                this.hasrealtion.push(relobj);
                this.searchfieldlist();
              })
              .catch(error => {
              });
          }
          
        } else {
          return false;
        }
      });

      
    },
    //是否标记为地址域之后input输入框的改变
    whether(){
      if(this.addressdomain==true){
        this.newfield.name='messageId';
        this.nowrite=true;
        this.text=true;
      }else {
        this.newfield.name='';
        this.nowrite=false;
        this.text=false;
      }
    },
    //编解
    edit(){
      this.hasrealtion=[];
      //清除svg曲线，只保留那根红色的虚线
      let curves=document.getElementById('svgcurve');
      let num=curves.children.length;
      for(let i=1;i<num;i++){
        curves.removeChild(curves.children[1])
      }
      //数据完成渲染之后再调用初始化函数
      this.$nextTick(function(){
        this.Initial();
      });
    },
    //字段编辑
    fieldedit(fid){
      this.nowfieldId=fid;
      //为true时为编辑信息
      this.editadd=true;
      this.fieldadd=true;
      this.$axios.get(process.env.API_HOST+'plugin/messageField/queryMessageField?'
      +Qs.stringify({
        'userId':this.userId,
        'profileId':this.profileId,
        'fieldId':fid,
      }))
        .then(res => {
          this.newfield=res.data.returnData[0];
          this.newfield.dataType=this.newfield.dataTypeDictionary.id;
          if(this.newfield.dataType.substring(0,1)=='s'){
            this.relationstring=false
          }else{
            this.relationstring=true
          }
          this.resarray=[];
          this.relationarr=[];
          for( let i=0;i<this.leftfield.length;i++){
            if(this.leftfield[i].fieldName==this.newfield.fieldName){
              this.ordnum=this.leftfield[i].number
            }
          }
          //先生成已经存在的关联关系数组，使已经关联的字段不会再被关联
          for(let i=0;i<this.leftfield.length;i++){
            this.relationarr.push(this.leftfield[i].relativeField);
          }
          //循环字段列表，获取关联字段的数据
          for(let i=0;i<this.ordnum-1;i++){
            if(this.leftfield[i].dataTypeDictionary.id.substring(0,1)=='s'&&this.relationarr.includes(this.leftfield[i].fieldName)==false){
              let obj={};
              obj.value=this.leftfield[i].fieldName;
              obj.label=this.leftfield[i].fieldName;
              this.resarray.push(obj);
            }
          }
          
          
        })
        .catch(error => {
        });
    },
    //字段删除
    alldelete(fid,fidnumber){
      this.$confirm('确定删除该字段?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        this.$axios.delete(process.env.API_HOST+'plugin/messageField/removeMessageField?'
      +Qs.stringify({
        'userId':this.userId,
        'profileId':this.profileId,
        'messageId':this.messageId,
        'fieldId':fid,
      })).then(res => {
          let commandarrow=document.getElementsByClassName('messcon');
          commandarrow[fidnumber].lastElementChild.style.display='none'
          let curves=document.getElementById('svgcurve');
          let svgnum=curves.children.length;
          for(let i=1;i<svgnum;i++){
            curves.removeChild(curves.children[1])
          }
          
          let relobj=this.hasrealtion[0];
          this.hasrealtion=[];
          this.hasrealtion.push(relobj);
          console.log(this.leftfield);
          
          
          this.searchfieldlist();

          for(let i=0;i<this.hasrealtion.length;i++){
            if(fidnumber==this.hasrealtion[i].number){
              var fidname=this.hasrealtion[i].fieldName
            }
          }
          if(this.datatype=='数据上报'){
            let canmove=document.getElementById('pane-first').children;
            
            for(let j=0;j<canmove.length;j++){
              if(fidname==canmove[j].children[2].innerText){
                canmove[j].style.visibility='visible';
                canmove[j].style.display='block';
              }
            }
            if(this.hasrealtion.length<=1){
              for(let i=0;i<this.rightservice.length;i++){
                this.rightservice[i].appear=true;
              }
            }
          }else{
            let canmove=document.getElementById('pane-second').children;
            for(let j=0;j<canmove.length;j++){
              if(fidname==canmove[j].children[2].innerText){
                canmove[j].style.visibility='visible';
                canmove[j].style.display='block';
              }
            }
            if(this.hasrealtion.length<=1){
              for(let i=0;i<this.rightservice.length;i++){
                this.rightservice[i].appear=true;
              }
            }
          }
        }).catch(error => {
        });
      }).catch(() => {    
      });
    },
    //编辑消息
    leftedit(meid){
      this.editnews=true;
      this.messageId=meid;
      let obj={};
      for ( let j in this.activedetaile) {
        obj[j] = this.activedetaile[j];
      }
      this.modifymessage=obj;
      this.modifymessage.messageType=this.datatype;
    },
    //编辑消息的确定按钮
    editmessage(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.modifymessage.profileId=this.profileId;
          this.$axios.put(process.env.API_HOST+'plugin/ability/modifyPluginMessage',
            JSON.stringify(this.modifymessage),
            {headers:{'Content-Type': 'application/json'}})
            .then(res => {
              this.editnews=false;
              this.getplugindetail();
            })
            .catch(error => {
            });
        } else {
          return false;
        }
      });
    },
    //关闭弹窗并清除验证结果
    closeadd(){
      this.$refs.add.resetFields();
    },
    //字段添加弹框选择字符串发生改变时
    stringchange(value){
      if(value.substr(0,1)=='s'){
        this.relationstring=false
      }else{
        this.relationstring=true
      }
    },
    
    //编辑新建消息的字段列表
    editnewfield(e){
      let str=e.target.parentNode.parentNode.parentNode.children[1].innerText;
      str=str.substring(3,str.length-2);
      this.fieldadd=true;
      this.editadd=true;
      for(let i=0;i<this.newfieldlist.length;i++){
        if(str==this.newfieldlist[i].name){
          this.newnum=i
          let obj={};
          for ( let j in this.newfieldlist[i]) {
            obj[j] = this.newfieldlist[i][j];
          }
          this.newfield=obj;
        }
      }
      
      // 如果名字为messageid则将多选框勾选
      if(this.newfield.name=='messageId'){
        this.addressdomain=true;
        this.nowrite=true;
      }
      if(this.newfield.type.substring(0,1)=='s'){
        this.relationstring=false
      }else{
        this.relationstring=true
      }
      this.resarray=[];
      this.relationarr=[];
      //先生成已经存在的关联关系数组，使已经关联的字段不会再被关联
      for(let i=0;i<this.newfieldlist.length;i++){
        this.relationarr.push(this.newfieldlist[i].relativeField);
      }
      //循环字段列表，获取关联字段的数据
      for(let i=0;i<this.newnum;i++){
        if(this.newfieldlist[i].type.substring(0,1)=='s'&&this.relationarr.includes(this.newfieldlist[i].name)==false){
          let obj={};
          obj.value=this.newfieldlist[i].name;
          obj.label=this.newfieldlist[i].name;
          this.resarray.push(obj);
        }
      }

    },
    //删除新建消息的字段列表
    delnewfield(e){
      let str=e.target.parentNode.parentNode.parentNode.children[1].innerText;
      str=str.substring(3,str.length-2);
      for(let i=0;i<this.newfieldlist.length;i++){
        if(str==this.newfieldlist[i].name){
          this.newfieldlist.splice(i,1)
        }
      }
      
    },
    //删除整条消息
    deltotalnew(meid){
      this.$confirm('确定删除这条消息吗？', '删除消息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        this.$axios.delete(process.env.API_HOST+'plugin/ability/removePluginMessage?'
      +Qs.stringify({
        'userId':this.userId,
        'profileId':this.profileId,
        'messageId':meid,
        'pluginId':this.pluginId,
      })).then(res => {
          this.getplugindetail();
          this.hasrealtion=[];
          let curves=document.getElementById('svgcurve');
          let svgnum=curves.children.length;
          for(let i=1;i<svgnum;i++){
            curves.removeChild(curves.children[1])
          }
          if(this.datatype=='数据上报'){
            let canmove=document.getElementById('pane-first').children;
            for(let j=0;j<canmove.length;j++){
              canmove[j].style.visibility='visible';
              canmove[j].style.display='block';
            }
          }else{
            let canmove=document.getElementById('pane-second').children;
            for(let j=0;j<canmove.length;j++){
              canmove[j].style.visibility='visible';
              canmove[j].style.display='block';
            }
          }
        }).catch(error => {
        });
      }).catch(() => {        
      });
    },
    //展开服务
    openattr(e){
      for(let i=0;i<this.rightservice.length;i++){
        this.rightservice[i].showFlag=false;
      }
      let str=e.target.parentNode.firstElementChild.innerText.trim();
      for(let i=0;i<this.rightservice.length;i++){
        if(str==this.rightservice[i].serviceName){
          this.rightservice[i].showFlag=true;
        }
      }
    },
    //获取当前插件详情
    getplugindetail(){
      this.$axios.get(process.env.API_HOST+'plugin/queryPluginInfo?'
      +Qs.stringify({
        'pluginId':this.pluginId,
      }))
        .then(res => {
          this.allplugininfo=res.data.returnData[0];
          this.profileId=this.allplugininfo.profileEntity.profileId;
          // 控制service的展开和关闭
          this.rightservice=this.allplugininfo.profileEntity.serviceEntityList;
          // for(let i=0;i<this.rightservice.length;i++){
          //   if(i==0){
          //     this.rightservice[i].showFlag=true
          //   }else{
          //     this.rightservice[i].showFlag=false
          //   }
          // }
          // 当前消息的消息类型
          this.profileId=this.allplugininfo.profileEntity.profileId;
          this.datatype=res.data.returnData[0].pluginType;
          if(this.datatype==1){
            this.datatype='数据上报'
          }else{
            this.datatype='命令下发'
          }
          // 控制当前服务展示属性还是命令
          for(let i=0;i<this.rightservice.length;i++){
            this.rightservice[i].appear=true;
            if(this.datatype=='数据上报'){
              this.rightservice[i].judgecol=true;
              this.activeName='first'
            }else{
              this.rightservice[i].judgecol=false;
              this.activeName='second'
            }
          }
          this.getnewslist();
        })
        .catch(error => {
        });
    },
    //新建消息的确定按钮
    addmessage(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.formLabelAlign.pluginId=this.pluginId;
          this.formLabelAlign.userId=this.userId;

          let pluginType=this.datatype;
          if(pluginType=='数据上报'){
            pluginType=1
          }else{
            pluginType=2
          }
          this.$prompt('<span>请输入pluginPrefix的值</span>', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPattern: /^(([0-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5]))))$/,
            inputErrorMessage: '请输入0~255的整数',
            dangerouslyUseHTMLString: true,
          }).then(({ value }) => {
            this.$axios.get(process.env.API_HOST+'plugin/messageField/queryMessageFieldValue?'
          +Qs.stringify({
            'userId':this.userId,
            'pluginId':this.pluginId,
            'pluginType':pluginType,
            'profileId':this.profileId,
          }))
              .then(res => {
                if(res.data.returnData.includes(value)==true){ 
                  this.$confirm('该值已经存在，请重新输入?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                  }).then(() => {
                  }).catch(() => {         
                  });
                }else{
                  this.$axios.post(process.env.API_HOST+'plugin/ability/addPluginMessage',
                    JSON.stringify(this.formLabelAlign),
                    {headers:{'Content-Type': 'application/json'}})
                    .then(res => {
                      this.addnews=false;
                      this.messageId=res.data.returnData[0].messageId;
                      let obj={};
                      obj.userId=this.userId;obj.pluginId=this.pluginId;obj.profileId=this.profileId;
                      obj.messageId=this.messageId;
                      obj.fieldName='pluginPrefix';obj.dataType='s0';
                      obj.dataLength=1;obj.dataOffset=0;
                      obj.positionAreaFlag=true;obj.number=1;
                      obj.dataDefault=value;
                      this.leftfield=[];
                      this.leftfield.push(obj);
                      this.$axios.post(process.env.API_HOST+'plugin/messageField/addMessageField',
                        Qs.stringify({
                          'messageFieldJson': JSON.stringify(this.leftfield),
                        }))
                        .then(res => {
                          this.getplugindetail();
                        })
                        .catch(error => {
                        });
                    })
                    .catch(error => {
                    });
                }
              })
              .catch(error => {
              });
          }).catch(() => {
            return       
          });

        } else {
          return false;
        }
      });
    },
    //查询当前的消息列表
    getnewslist(){
      this.$axios.get(process.env.API_HOST+'plugin/ability/queryPluginMessageList?'
      +Qs.stringify({
        'userId':this.userId,
        'pluginId':this.pluginId,
        'profileId':this.profileId,
      }))
        .then(res => {

          this.Alist=res.data.returnData;
          this.activedetaile=this.Alist[0];
          this.messageId=this.Alist[0].messageId;
          if(this.activedetaile.messageType==0){
            this.activedetaile.messageType='数据上报'
          }else{
            this.activedetaile.messageType='命令下发'
          }
          this.searchfieldlist();
        })
        .catch(error => {
        });
    },
    //查询字段列表
    searchfieldlist(){
      this.$axios.get(process.env.API_HOST+'plugin/messageField/queryMessageFieldList?'
      +Qs.stringify({
        'userId':this.userId,
        'profileId':this.profileId,
        'messageId':this.messageId,
      }))
        .then(res => {
          console.log(res);
          
          this.leftfield=res.data.returnData;
          this.checkflag=false;
          // 将校验字段拎出去
          for(let i=0;i<this.leftfield.length;i++){
            if(this.leftfield[i].fieldName=='CRC16/ModBus'||this.leftfield[i].fieldName=='BBC'||this.leftfield[i].fieldName=='LRC'||this.leftfield[i].fieldName=='CHECKSUM'){
              this.checkflag=true;
              this.checkword=this.leftfield[i];
              this.leftfield.splice(i,1);
            }
          }
          for(let i=0;i<this.leftfield.length;i++){
            this.leftfield[i].number=i+1;
          }
          // 防止修改时导致连线缺失
          if(this.hasrealtion.length<1){
            this.hasrealtion=[{
              number:1,
              fieldName:'pluginPrefix',
            }];
          }

          // 原来问题就出在这里，如果是删除和编辑的话会重复增加字段,要么先让this.hasrelation为0；要么在编辑和删除后不更改this.hasrelation
          if(this.datatype=='数据上报'){
            for(let i=1;i<this.leftfield.length;i++){
              if(this.leftfield[i].profileUpStreamEntity!=null){
                //生成已经存在的关联关系
                var obj={};
                obj.number=i+1;
                obj.fieldName=this.leftfield[i].profileUpStreamEntity.upStreamName;
                for(let j=0;j<this.rightservice.length;j++){
                  for(let k=0;k<this.rightservice[j].upStreamEntityList.length;k++){
                    if(this.leftfield[i].profileUpStreamEntity.upStreamId==this.rightservice[j].upStreamEntityList[k].upStreamId)
                      obj.serviceName=this.rightservice[j].serviceName;
                  }
                }
                // 根据servicename来显示或隐藏服务
                for(let i=0;i<this.rightservice.length;i++){
                  if(obj.serviceName==this.rightservice[i].serviceName){
                    this.rightservice[i].showFlag=true;
                    this.rightservice[i].appear=true;
                    this.serviceorder=i;
                  }else{
                    this.rightservice[i].showFlag=false;
                    this.rightservice[i].appear=false
                  }
                }
                this.hasrealtion.push(obj);
              }
            }
          }else{
            for(let i=1;i<this.leftfield.length;i++){
              if(this.leftfield[i].profileDownStreamEntity!=null){
                var object={};
                object.number=i+1;
                object.fieldName=this.leftfield[i].profileDownStreamEntity.downStreamName;
                for(let j=0;j<this.rightservice.length;j++){
                  for(let k=0;k<this.rightservice[j].downStreamEntityList.length;k++){
                    if(this.leftfield[i].profileDownStreamEntity.downStreamId==this.rightservice[j].downStreamEntityList[k].downStreamId){
                      object.serviceName=this.rightservice[j].serviceName;
                    } 
                  }
                }
                for(let i=0;i<this.rightservice.length;i++){
                  if(object.serviceName==this.rightservice[i].serviceName){
                    this.rightservice[i].showFlag=true;
                    this.rightservice[i].appear=true;
                    this.serviceorder=i;
                  }else{
                    this.rightservice[i].showFlag=false;
                    this.rightservice[i].appear=false
                  }
                }
                this.hasrealtion.push(object);
              }
            }
            
          }


          this.$nextTick(function(){
            if(this.datatype=='数据上报'){
              let canmove=document.getElementById('pane-first').children;
              //如果存在已经关联的元素，则使该属性隐藏
              for(let i=0;i<this.hasrealtion.length;i++){
                for(let j=0;j<canmove.length;j++){
                  if(this.hasrealtion[i].fieldName==canmove[j].children[2].innerText){
                    canmove[j].style.display='none';
                  }
                }
              }
            }else{
              let canmove=document.getElementById('pane-second').children;
              //如果存在已经关联的元素，则使该属性隐藏
              for(let i=0;i<this.hasrealtion.length;i++){
                for(let j=0;j<canmove.length;j++){
                  if(this.hasrealtion[i].fieldName==canmove[j].children[2].innerText){
                    canmove[j].style.display='none';
                  }
                }
              }
            }
            
            this.Initial();
          })
        })
        .catch(error => {
        });
    },
    //插件初始化
    Initialization(){
      this.$axios.post(process.env.API_HOST+'plugin/initJar',
        Qs.stringify({
          'deviceId':this.deviceId,
          'pluginId':this.pluginId
        }))
        .then(res => {
          if(res.data.returnCode=='success'){
            this.$confirm(res.data.returnMsg, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
            }).then(() => {
            }).catch(() => {         
            });
          }else{
            this.$confirm(res.data.returnMsg, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
            }).then(() => {
            }).catch(() => {         
            });
          }
        })
        .catch(error => {
        });
    },
    // 查询字段详情
    watch(a){
      this.fielddetflag=true;
      for(let i=0;i<this.leftfield.length;i++){
        if(a==this.leftfield[i].fieldName){
          this.jsonobj=this.leftfield[i]
        }
      }
      for(let i=0;i<this.options.length;i++){
        if(this.jsonobj.dataType==this.options[i].value){
          this.jsonobj.dataType=this.options[i].label;
        }
      }
    },
    // 校验字段的方法
    addcheck(){
      this.checkefield=true;
      this.flagcheck=true;
    },
    confirmcheck(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 增加校验字段
          if(this.flagcheck==true){
            let array=[];
            this.checkfieldlist.pluginId=this.pluginId;
            this.checkfieldlist.profileId=this.profileId;
            this.checkfieldlist.messageId=this.messageId;
            delete this.checkfieldlist.fieldId;
            array.push(this.checkfieldlist);
            this.$axios.post(process.env.API_HOST+'plugin/messageField/addMessageField',
              Qs.stringify({
                'messageFieldJson': JSON.stringify(array),
              }))
              .then(res => {
                let curves=document.getElementById('svgcurve');
                let svgnum=curves.children.length;
                for(let i=1;i<svgnum;i++){
                  curves.removeChild(curves.children[1])
                }
                this.searchfieldlist();
                this.checkefield=false;
                this.checkflag=true;
                
              })
              .catch(error => {
              });
          }else{
            // 修改校验字段
            this.$axios.put(process.env.API_HOST+'plugin/messageField/modifyMessageField',
              JSON.stringify(this.checkfieldlist),
              {headers:{'Content-Type': 'application/json'}})
              .then(res => {
                this.checkefield=false;
                let curves=document.getElementById('svgcurve');
                let svgnum=curves.children.length;
                for(let i=1;i<svgnum;i++){
                  curves.removeChild(curves.children[1])
                }
                let relobj=this.hasrealtion[0];
                this.hasrealtion=[];
                this.hasrealtion.push(relobj);
                this.searchfieldlist();
              })
              .catch(error => {
              });
          }
        } else {
          return false;
        }
      });
      
      
    },
    // 编辑校验字段
    editcheckfield(fid){
      this.checkefield=true;
      this.$axios.get(process.env.API_HOST+'plugin/messageField/queryMessageField?'
      +Qs.stringify({
        'userId':this.userId,
        'profileId':this.profileId,
        'fieldId':fid,
      }))
        .then(res => {
          this.checkfieldlist=res.data.returnData[0];
          this.flagcheck=false;
        })
        .catch(error => {
        });
    },
    delcheckfield(fid){
      this.$confirm('确定删除该字段?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        this.$axios.delete(process.env.API_HOST+'plugin/messageField/removeMessageField?'
      +Qs.stringify({
        'userId':this.userId,
        'profileId':this.profileId,
        'messageId':this.messageId,
        'fieldId':fid,
      })).then(res => {
          let curves=document.getElementById('svgcurve');
          let svgnum=curves.children.length;
          for(let i=1;i<svgnum;i++){
            curves.removeChild(curves.children[1])
          }
          let relobj=this.hasrealtion[0];
          this.hasrealtion=[];
          this.hasrealtion.push(relobj);
          this.searchfieldlist();
          // this.checkflag=false;
        }).catch(error => {
        });
      }).catch(() => {    
      });
    },
    // 查看命令详细
    watchdetail(fname){
      this.fielddetflag=false;
      if(this.datatype=='数据上报'){
        this.updownflag=true;
        let upstream=this.rightservice[0].upStreamEntityList;
        for(let i=0;i<upstream.length;i++){
          if(fname==upstream[i].upStreamName){
            this.streamjson=upstream[i];
          }
        }
      }else{
        this.updownflag=false;
        let downstream=this.rightservice[0].downStreamEntityList;
        for(let i=0;i<downstream.length;i++){
          if(fname==downstream[i].downStreamName){
            this.streamjson=downstream[i];
          }
        }
      }
    },
    // prefix的编辑
    prefixedit(fid){
      this.pluginprefixbox=true;
      this.$axios.get(process.env.API_HOST+'plugin/messageField/queryMessageField?'
      +Qs.stringify({
        'userId':this.userId,
        'profileId':this.profileId,
        'fieldId':fid,
      }))
        .then(res => {
          this.pluginprefixlist.default=res.data.returnData[0].dataDefault;

          this.pluginprefixfield=res.data.returnData[0];
          
        })
        .catch(error => {
        });
    },
    savedefault(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {

          let pluginType;
          if(this.datatype=='数据上报'){
            pluginType=1
          }else{
            pluginType=2
          }
          this.$axios.get(process.env.API_HOST+'plugin/messageField/queryMessageFieldValue?'
          +Qs.stringify({
            'userId':this.userId,
            'pluginId':this.pluginId,
            'pluginType':pluginType,
            'profileId':this.profileId,
          }))
            .then(res => {
              if(res.data.returnData.includes(this.pluginprefixlist.default)==true){ 
                this.$confirm('该值已经存在，请重新输入?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                }).then(() => {
                }).catch(() => {         
                });
              }else{
                this.pluginprefixfield.dataDefault=this.pluginprefixlist.default;
                this.$axios.put(process.env.API_HOST+'plugin/messageField/modifyMessageField',
                  JSON.stringify(this.pluginprefixfield),
                  {headers:{'Content-Type': 'application/json'}})
                  .then(res => {
                    this.pluginprefixbox=false;
                    this.fieldadd=false;
                    let curves=document.getElementById('svgcurve');
                    let svgnum=curves.children.length;
                    for(let i=1;i<svgnum;i++){
                      curves.removeChild(curves.children[1])
                    }
                    let relobj=this.hasrealtion[0];
                    this.hasrealtion=[];
                    this.hasrealtion.push(relobj);
                    this.searchfieldlist();
                  })
                  .catch(error => {
                  });

              }
            })
            .catch(error => {
            });
        } else {
          return false;
        }
      });
    },
    closecheckform(){
      this.$refs.ruleForm2.resetFields();
    }
  },
  // 调用组件
  components: {
    'plugguide': plugguide
  },


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .designplug{
    width: 100%;
    height: 100%;
    position: absolute;
    overflow-y: hidden;
    // min-width: 1500px;
    .header{
      width:100%;
      height:60px;
      position:fixed;
      z-index: 10;
      top:0;
      left:0;
      right:0;
      background-color:#2b78e0;
      color:#fff;
      line-height: 60px;
      z-index: 1155;
      .logo{
        padding-left: 50px;
        width: 190px;
        height: 50px;
        float: left;
        padding-top: 10px;
      }
      .current{
        float: left;
        .el-dropdown{
          width: 220px;
          cursor: pointer;
          color: #fff;
          padding-left: 40px;
          i{
            float: right;
            line-height: 60px;
          }
          .el-dropdown-menu{
            left: 331px;
            font-size: 12px;
          }
        }
      }
      .icon{
        float: right;
        margin-right: 10px;
        height: 60px;
        z-index: 2022;
        span{
          margin-right: 15px;
          .iconfont{
            font-size: 25px;
            cursor: pointer;
          }
        }
      }
    }
    .designaside{
      background-color: #fff;
      width:20%;
      position:absolute;
      top:106px;
      right:0;
      bottom:0;
      min-width: 307px;
      z-index: 1150;
      .equipment{
        height: 50%;
        border-bottom: 2px #e6e6e6 solid;
        padding: 16px;
        .equipheader{
          height: 35px;
          .el-dropdown{
            float: right;
          }
          h4{
            float: left;
          }
        }
        .equipbody{
          border: 1px #e6e6e6 solid;
          overflow: auto;
          height:calc(100% - 38px);
          position: relative;
          .command{
            overflow-x: hidden;
          }
          .name{
            height: 48px;
            border-bottom: 1px #e6e6e6 solid;
            color: #4c4c4c;
            line-height: 48px;
            font-weight: 550;
            padding-left: 16px;
          }
          .attribute{
            height: 48px;
            border-bottom: 1px #ccc solid;
            padding-top: 11px;
            padding-left: 16px;
            position: relative;
            z-index: 1151;
            cursor: move;
            
            background: url(../../assets/img/attr-item02.png) no-repeat 16px 11px;
            img{
              display:inline-block;
              vertical-align:middle;
            }
            p{
              display: inline-block;
              margin-left: 15px;
              font-weight: bold;
            }
            i{
              display: none;
            }
            span{
              display: none;
            }
          }
        }
      }
      .detail{
        padding: 16px;
        height: calc(50% - 102px);
        .detailheader{
          height: 35px;
        }
        .detailbody{
          border: 1px #e6e6e6 solid;
          overflow: auto;
          height:calc(100% - 35px);
          padding: 16px;
          h5{
            border-bottom: 1px #e6e6e6 solid;
            font-size: 14px;
            line-height: 30px;
          }
        }
      }
    }
    .designbody{
      width:100%;
      height:100%;
      padding:106px 20% 0 0px;
      box-sizing:border-box;
      background-color: #dadfe6;
      .designplugbody{
        height: 100%;
        overflow: auto;
      }
      .grid-content{
        .el-button{
          background-color: #dadfe6;
          border: 1px #2b78e0 solid;
          color: #2b78e0;
          padding: 9px 23px;
        }
      }
      .message{
        width: 100%;
        border: 2px #ccc solid;
        background-color: #fff;
        margin-top: 70px;
        text-align: left;
        .messoption{
          height: 48px;
          border-bottom: 1px #e8e8e8 solid;
          line-height: 48px;
          padding-left: 16px;
          i{
            margin-right: 8px;
            cursor: pointer;
          }
          i:hover{
            color:#2b78e0;
          }
        }
        .messdetail{
          padding: 16px;
          border-bottom: 1px #e8e8e8 solid;
          h4{
            color: #4c4c4c;
            margin-bottom: 8px;
          }
          p{
            font-size: 12px;
            color: #8a8a8a;
            margin-top: 5px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
        .messcon{
          height: 49px;
          border-bottom: 1px #e8e8e8 solid;
          line-height: 48px;
          padding-left: 23px;
          color: #6F7479;
          position: relative;
          .number{
            color: #b3b3b3;
            margin-right: 15px;
          }
          i{
            float: right;
            margin-right: 15px;
            cursor: pointer;
          }
          i:hover{
            color: #2b78e0;
          }
          .arrow{
            border-right: 7px solid #bf70d5;
            border-top: 7px solid transparent;
            border-bottom: 7px solid transparent;
            width: 0;
            height: 0;
            position: absolute;
            top: 50%;
            right: -7px;
            margin-top: -5px;
            display: none;
          }
        }
      }
      .everyattr{
        height: 500px;
        margin-top: 40px;
        padding: 30px;
        text-align: left;
        position: relative;
      }
      .messagelist{
        font-size: 12px;
        color: #6F7479;
        width: 160px;
        margin-left: -20px;
        margin-top: 35px;
        li{
          height: 36px;
          position: relative;
          text-align: left;
          cursor: pointer;
        }
        li:hover{
          color: #2b78e0;
        }
        li:before{
          content: '';
          width: 10px;
          height: 10px;
          display: inline-block;
          border-radius: 5px;
          background-color: #b3b3b3;
          margin-right: 10px;
          vertical-align: middle;
        }
        li:after{
          content: '';
          display: block;
          width: 1px;
          height: 22px;
          position: absolute;
          left: 4.5px;
          top: 20%;
          margin-top: 7px;
          background-color: #b3b3b3;
        }
        li:last-child:after{
           background: none;
        }
        .active{
          color: #2b78e0;
        }
        .active:before{
          background-color: #2b78e0;
        }
      }
    }
  }

  .el-dropdown-menu{
    width: 250px;
    .el-dropdown-menu__item{
      font-size: 12px;
    }
  }
  .create{
    padding: 0 40px 0 20px;
  }
  .designnav{
    height: 28px;
    border-bottom: 1px solid #f2f2f2;
    padding-top: 18px;
    padding-left: 50px;
    position:fixed;
    z-index: 10;
    top:60px;
    left:0;
    right:0;
    background-color: #fff;
    .el-breadcrumb{
      float: left;
      p{
        display: inline-block;
        margin-right: 15px;
      }
    }
    i{
      color: #000;
      line-height: 5px;
      margin-right: 5px;
    }
    .optbtn{
      a{
        color: #000;
        margin-right: 20px;
      }
      a:hover{
        color: #2b78e0;
        i{
          color: #2b78e0;
        }
      }
    }
  }
  .equopt{
    width: 105px;
  }
  .el-dropdown-link{
    cursor: pointer;
  }

  .createnews{
    padding: 0px 10px;
    height: 400px;
    overflow: auto;
    .head{
      background-color: #f7f9fc;
      height: 40px;
      line-height: 40px;
      padding-left: 20px;
      a{
        float: right;
        margin-right: 10px;
        font-weight: normal;
        color: #000;
      }
      a:hover{
        color: #2b78e0;
      }
    }
    .basicbody{
      margin-top: 20px;
      padding: 0 20px;
    }
    .field{
      text-align: center;
      border-bottom: 1px solid #ddd;
      padding: 20px 0px;
      a{
        color: #000;
      }
      a:hover{
        color: #2b78e0;
      }
    }
    .resfield{
      font-size: 12px;
      height: 65px;
      border-bottom: 1px solid #ddd;
      padding: 15px 20px 0px;
      span{
        color: #555;
      }
      p{
        color: #000;
        font-weight: 500;
      }
      .edit{
        padding-top: 12px;
      }
      i{
        margin-right: 20px;
        cursor: pointer;
      }
      i:hover{
        color: #2b78e0;
      }
    }
  }
  .fieldfooter{
    margin-top: -20px;
  }
  .response{
    padding: 0 30px;
    height: 380px;
    overflow: auto;
    .el-form{
      margin-top: 10px;
    }
  }
  #svgdash{
    display: none;
  }
  .editnew{
    padding: 0 10px;
    height: 430px;
    overflow: auto;
    .el-form-item{
      margin-bottom: 10px;
    }
    .editfield{
      background-color: #f7f9fc;
      padding-top: 8px;
      span{
        color: red;
        font-weight: normal;
        display: inline-block;
        margin-top: 5px;
      }
    }
  }
  .responsefield{
    span{
      color: red;
      font-weight: normal;
      margin-left: 5px;
    }
  }
  .commandtitle{
    width: 100%;
    height: 48px;
    border-bottom: 1px solid #ddd;
    font-size: 14px;
    line-height: 48px;
    color: #4c4c4c;
    font-weight: 600;
    padding-left: 20px;
    i{
      font-size: 13px;
      float: right;
      margin-right: 30px;
    }
  }
  .selectpro{
    background-color: #f5f5f5;
    padding: 24px;
    height: 380px;
    overflow: auto;
    .el-card{
      margin-bottom: 30px;
    }
    .el-card__body{
      
      img{
        width: 130px;
        display: block;
        margin: 40px auto 30px;
      }
      .onlinedetail{
        span{
          font-size: 12px;
        }
      }
      .gouxuan{
        border: 1px solid #cccccc;
        width: 25px;
        height: 25px;
        float: right;
        i{
          vertical-align: middle;
        }
      }
    }
  }
  .jsondetail{
    background-color: #000;
    width: 100%;
    min-height: 100%;
    margin-top: 15px;
    overflow-x: hidden;
    span{
      font-size: 12px;
      color: #fff;
      display: inline-block;
      margin: 10px 15px 0px;
    }
    .jsonword{
      margin-left: 0px;
      
    }
  }
  .commandinfo{
    // background-color: #000;
    height: 50px;
    border-bottom: 1px solid #ccc;
    line-height: 50px;
    font-weight: bold;
    padding-left: 15px;
    i{
      float: right;
    }
  }
  .attr{
    width: 90%;
  }
  .el-dropdown-menu{
    width: 250px;
    .el-dropdown-menu__item{
      font-size: 12px;
    }
  }
  .dropmenu{
    width: 160px;
    height: 200px;
    background-color: #fff;
    position: absolute;
    top: 60px;
    right: 0;
    z-index: 2022;
  }
  .el-card__body{
    p,span{
      line-height: 30px;
      padding-left: 20px;
      color: #000;
      font-weight: 600;
    }
    span{
      cursor: pointer;
      color: #2b78e0;
      font-weight: normal;
      display: inline-block;
      margin-top: 30px;
    }
  }
  .pluginbox{
    width: 90%;
    margin-left: 20px;
    margin-bottom: -50px;
    margin-top: -20px;
  }
  
  

</style>

<style lang="scss">
  .el-message-box__message{
    span{
      margin-left: -225px;
    }
  }
  .el-form-item__label{
    font-size: 12px;
  }
  .dialog-footer{
    text-align: center;
  }
  .el-select{
    width: 100%;
  }
  .el-dropdown-menu__item:focus, .el-dropdown-menu__item:not(.is-disabled):hover{
    background-color: #f7f9fc;
    color: #2b78e0;
  }
  .dialog-footer{
    margin-top: 40px;
    .confirm{
      background-color: #2b78e0;
      font-size: 12px;
      padding: 10px 30px;
    }
    .cancel{
      font-size: 12px;
      padding: 10px 30px;
    }
    .cancel:hover{
      border-color: #2b78e0;
      color: #2b78e0;
    }
  }
  .equipbody{
    .el-tabs__header{
      background-color: #F0F2F5;
      height: 40px;
      padding-top: 8px;
      padding-left: 16px;
      margin: 0px;
    }
    .el-tabs__item{
      color: #6F7479;
      font-weight: 600;
    }
    .el-tabs__item:hover{
      color: #2b78e0;
    }
    .el-tabs__item.is-active{
      color: #2b78e0;
    }
  }
  .el-radio__label{
    font-size: 12px;
  }
  .el-checkbox__label{
    font-size: 12px;
  }
  .createnews{
    .el-form-item__label{
      line-height: 0px;
    }
  }
  .response{
    .el-form-item__label{
      line-height: 20px;
    }
  }
  .el-radio__input.is-checked+.el-radio__label,.el-checkbox__input.is-checked+.el-checkbox__label{
    color: #2b78e0;
  }
  .el-radio__input.is-checked .el-radio__inner,
  .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{
    background-color: #2b78e0;
    border-color: #2b78e0;
  }
  .designplug{
    .el-dialog__body{
      padding: 15px 20px;
    }
  }
  .el-tooltip__popper.is-light{
    border: 1px solid #8a8a8a!important;
    color: #8a8a8a;
    width: 200px;
  }
  .creattr{
    // width: 20%;
    // height: 48px;
    border: 2px #ccc solid;
    position: absolute;
    z-index: 1152;
    background-color: #fff;
    padding-top: 10px;
    padding-left: 16px;
    padding-bottom: 6px;

    background:#fff url(../../assets/img/attr-item02.png) no-repeat 16px 10px;
    span{
      font-size: 12px;
      color: #8a8a8a;
      position: absolute;
      top: 30px;
      left: 75px;
      display: block;
    }
    p{
      display: inline-block;
      margin-left: 15px;
      font-weight: bold;
    }
    img{
      vertical-align:top;
    }
    i{
      float: right;
      margin-top: 11px;
      margin-right: 18px;
      display: none;
      color: #8a8a8a;
    }
    .arrow{
      border-left: 7px solid #2b78e0;
      border-top: 7px solid transparent;
      border-bottom: 7px solid transparent;
      width: 0;
      height: 0;
      position: absolute;
      top: 50%;
      left: -7px;
      margin-top: -5px;
      display: none;
    }
  }
  .creattr:hover{
    i{
      display: block;
    }
    i:hover{
      color: #2b78e0;
      cursor: pointer;
    }
  }
  .el-message-box{
    width: 480px;
    .el-message-box__header{
      padding: 23px 33px 10px;
    }
    .el-message-box__content{
      text-align: center;
    }
    .el-message-box__btns{
      padding: 22px 113px 0;
      .el-button{
        float: right;
        margin-right: 15px;
        border: 1px #d9d9d9 solid;
        background-color: #fff;
        color: #333;
        padding: 11px 40px;
      }
      .el-button:hover{
        color: #2b78e0;
        border-color: #2b78e0;
      }
      .el-button--primary{
        border-color: #2b78e0;
        background-color: #2b78e0;
        color: #fff;
      }
      .el-button--primary:hover{
        color: #fff;
      }
    }
  }
  .editnew{
    .el-form--label-top .el-form-item__label{
      padding: 0 0 10px;
    }
  }
  .el-input.is-disabled .el-input__inner{
    color:#000;
  }
  .responsefield{
    .el-input{
      width: 200px;
      input{
        height: 32px !important;
      }
    }
  }
  .editfield{
    .el-input{
      width: 200px;
      input{
        height: 32px !important;
      }
    }
  }
  .el-message-box__content{
    padding: 10px 50px;
  }
  svg{
    min-height: 600px;
    path{
      stroke-dasharray: 400;
      stroke-dashoffset: 0;
      animation: dash 1s linear;
    }
    // path:hover{
    //   cursor: pointer;
    //   stroke:#e64545!important;
    //   stroke-width:3.5!important;
    //   transition:all 0.3s ease-out;
    // }
    #svgdash{
      animation: dash 0s linear;
    }
    @keyframes dash {
      from { stroke-dashoffset: 400; }
      to{ stroke-dashoffset: 0; }
    }
  }
  .el-card__body{
    // text-align: center;
    cursor: pointer;
  }
  .el-loading-spinner i{
    font-size: 30px;
  }
  .el-loading-spinner .el-loading-text{
    font-size: 16px;
  }
  .el-dropdown-menu{
    height: 200px;
    overflow: auto;
    z-index: 2022;
  }
  
</style>
