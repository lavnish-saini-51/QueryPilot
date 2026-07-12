import axios from './axiosInstance'

export const testConnection = (data) => axios.post('/db-connections/test', data)
export const createConnection = (data) => axios.post('/db-connections', data)
export const getConnections = () => axios.get('/db-connections')
export const deleteConnection = (id) => axios.delete(`/db-connections/${id}`)