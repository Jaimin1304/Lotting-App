import { createStore } from 'vuex'

export default createStore({
  state: {
    persons: [
      {name: 'Jery', remark: 'remark...'},
      {name: 'Alice', remark: 'remark...'},
      {name: 'Bob', remark: 'remark...'},
      {name: 'Harrison', remark: 'remark...'},
    ],
    gifts: [
      {name: 'iphone 13 X', remark: 'remark...', num: 1},
      {name: 'Huawei P40 Pro', remark: 'remark...', num: 1},
      {name: 'OPPO Ace 2', remark: 'remark...', num: 1},
      {name: 'MSI GS75', remark: 'remark...', num: 1},
      {name: 'RTX 3060', remark: 'remark...', num: 1},
      {name: '0.5*ETH', remark: 'remark...', num: 1},
    ],
    selectedPersons: [],
    selectedGifts: [],
    results: [
      {name: 'Jery', gift: '0.5*ETH', type: '抽1人', date: '2022'},
      {name: 'Bob', gift: 'Huawei P40 Pro', type: '抽1人', date: '2022'},
    ],
    mode: '公平模式',
    multipleHit: false,
  },
  mutations: {
    addGiftNum(state, index) {
      state.gifts[index]['num'] += 1
    },
    removeGiftNum(state, index) {
      if (state.gifts[index]['num'] > 1) {
        state.gifts[index]['num'] -= 1
      } else {
        state.gifts.splice(index, 1)
      }
    },
    deletePerson(state, index) {
      state.persons.splice(index, 1)
    },
    deleteGift(state, index) {
      state.gifts.splice(index, 1)
    },
    toggleMode(state, mode) {
      state.mode = mode
    },
    toggleMultipleHit(state, multipleHit) {
      state.multipleHit = multipleHit
    },
    insertNewPerson(state, newPerson) {
      state.persons.push(newPerson)
    },
    insertNewGift(state, newGift) {
      state.gifts.push(newGift)
    },
    importPersonsXlsx(state, newList) {
      state.persons = newList
    },
    importGiftsXlsx(state, newList) {
      state.gifts = newList
    },
    editPerson(state, payload) {
      console.log(payload)
      state.persons[payload.i] = payload.person
    },
    editGift(state, payload) {
      console.log(payload)
      state.gifts[payload.i] = payload.gift
    },
    changeSelectedPersons(state, payload) {
      console.log(payload)
      state.selectedPersons = payload
    },
    changeSelectedGifts(state, payload) {
      state.selectedGifts = payload
    },
    appendResult(state, newResult) {
      state.results.push(newResult)
    },
    popSelectedPerson(state, index) {
      state.selectedPersons.splice(index, 1)
    }
  },
  actions: {
  },
  modules: {
  }
})
