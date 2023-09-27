import { createStore } from 'vuex'
import _ from 'lodash'

export default createStore({
  state: {
    clickDates:[]
  },
  getters: {
    getClickDates(state){
      return state.clickDates
    }
  },
  mutations: {
    addClickDates(state, payload){
      console.log(payload)
      state.clickDates.push(payload.date)
      console.log(state.clickDates)
    },
    reduceClickDates(state, payload){
      _.pull(state.clickDates, payload.date)
    }
  },
  actions: {
  },
  modules: {
  }
})
