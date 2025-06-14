import * as mysql from './mysql.js'

const getUsers = async (filter = {}) => {
  try {
    const users = await mysql.getUsers(filter);
    return users;
  } catch (err) {
    console.error(err)
    throw err; // Re-throw to allow proper error handling in controller
  }
}

const getCitas = async (filter = {}) => {
  try {
    const citas = await mysql.getCitas(filter);
    return citas;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

const getStores = async (filter = {}) => {
  try {
    const stores = await mysql.getStores(filter);
    return stores;
  } catch (err) {
    console.error(err);
    throw err;
  }
} 

const getFeedback = async (filter = {}) => {
  try {
    const feedback = await mysql.getFeedback(filter);
    return feedback;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// Export individual functions directly
export {
  getUsers,
  getCitas,
  getStores,
  getFeedback
};