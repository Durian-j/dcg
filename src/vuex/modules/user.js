const user = {
  state: {
    userinfo: JSON.parse(localStorage.getItem('userinfo')),
    token: localStorage.getItem('token'),
    nickname: localStorage.getItem('nickname'),
    userId: localStorage.getItem('userId'),
    menus: [],
    permissions: [],
  },
  mutations: {
    // 登录
    LOGIN(state,data){
      localStorage.token = data;
      state.token = data;
    },
    // 退出
    LOGOUT(state){
      localStorage.removeItem('token');
      localStorage.removeItem('userinfo');
      localStorage.removeItem('nickname');
      localStorage.removeItem('userId');
      state.token = null;
      state.userinfo = null;
      state.nickname = null;
      state.userId = null;
    },
    // 保存用户信息
    SAVE(state,data){
      state.userinfo = data;
      localStorage.userinfo = JSON.stringify(data);
    },
    // 将路由和按钮分类
    SET_USER: (state, data) => {
      // state.role = userInfo.roleName;
      state.menus = data;
      state.permissions = data;
    },
    // 保存用户姓名
    SAVE_NAME: (state, data) => {
      state.nickname = data;
      localStorage.nickname = data;
    },
    // 保存用户id
    SAVE_ID: (state, data) => {
      state.userId = data;
      localStorage.userId = data;
    },

  },
}
export default user
