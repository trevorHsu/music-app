import * as types from './mutationType'

const mutations = {
    [types.SET_SINGER](state, singer) {
        state.singer = singer
    }
}

export default mutations