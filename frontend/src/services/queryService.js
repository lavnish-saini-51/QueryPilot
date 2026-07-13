import axios from './axiosInstance'

export const runQuery = (data) => axios.post('/query', data)
export const getQueryHistory = (connectionId) => axios.get(`/query/history/${connectionId}`)