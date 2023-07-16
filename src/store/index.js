import { createStore } from 'vuex'

const store = createStore({
  state:{
    user: {'account': '','userName':''}
  },
  mutations:{
    setUser(state,newUser){
      state.user = newUser
    }
  },
  getters:{

  },
  actions:{

  },
  modules:{

  }
})
export default store
