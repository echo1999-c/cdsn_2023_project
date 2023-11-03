import { createStore } from 'vuex'
import _ from 'lodash'

export default createStore({
  state: {
    // clickDates:["2023-01-01"]
    clickDates:[],
    maxBatchNumCntHour: -Infinity,
    maxOrderNumCntHour: -Infinity,

  },
  getters: {
    getClickDates(state){
      return state.clickDates
    }
  },
  mutations: {
    addClickDates(state, payload){
      // console.log(payload)
      state.clickDates.push(payload.date)
      // console.log("after add, state.clickDates", state.clickDates)
    },
    reduceClickDates(state, payload){
      _.pull(state.clickDates, payload.date)
    },
    setMaxBatchNumCntHour(state, maxBatchNumCntHour) {
      if(state.maxBatchNumCntHour < maxBatchNumCntHour){
        state.maxBatchNumCntHour = maxBatchNumCntHour
      }
    },
    setMaxOrderNumCntHour(state, maxOrderNumCntHour) {
      if(state.maxOrderNumCntHour < maxOrderNumCntHour){
        state.maxOrderNumCntHour = maxOrderNumCntHour
      }
    },
  },
  actions: {
  },
  modules: {
  }
})
