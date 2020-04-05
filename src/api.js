import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
})

export const insertDeclaration = (payload) => api.post(`/declaration`, payload)
export const insertFolder = (payload) => api.post(`/folder`, payload)
export const getDeclarationsByFolder = (folder) => api.get(`/declarations/${folder}`)
export const getActiveFolder = () => api.get(`/folder`)
export const insertEmployer = (payload) => api.post(`/employer`, payload)
export const getEmployers = () => api.get(`/employer`)
export const deleteDeclarationById = id => api.delete(`/declaration/${id}`)
export const getDeclarationById = id => api.get(`/declaration/${id}`)

const apis = {
    insertDeclaration,
    insertFolder,
    getDeclarationsByFolder,
    getActiveFolder,
    insertEmployer,
    getEmployers,
    deleteDeclarationById,
    getDeclarationById
}

export default apis