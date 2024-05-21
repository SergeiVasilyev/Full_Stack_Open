import axios from 'axios'
// const baseUrl = 'http://localhost:3002/api/persons'
const baseUrl = '/api/persons'

const getContacts = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const newContact = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const updateContact = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

const deleteContact = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`)
  return request.then(response => response.data)
}

export default { 
    getContacts: getContacts, 
    newContact: newContact, 
    updateContact: updateContact,
    deleteContact: deleteContact
}