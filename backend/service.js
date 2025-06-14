import * as mysql from './mysql.js'

const getUsers = async (filter) => {
  try {
    const users = await  mysql.getUsers();
    return users;
  } catch (err){
    console.error(err)
  }
}

const getCitas = async (filter) => {
  try {
    const citas = await mysql.getCitas();
    return citas;
  } catch (err) {
    console.error(err);
  }
}

const getStores = async (filter) => {
  try {
    const stores = await mysql.getStores();
    return stores;
  } catch (err) {
    console.error(err);
  }
} 

const getFeedback = async (filter) => {
  try {
    const feedback = await mysql.getFeedback();
    return feedback;
  } catch (err) {
    console.error(err);
  }
}

export const service = {
  getUsers,
  getCitas,
  getStores,
  getFeedback
};