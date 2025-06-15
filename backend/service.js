import * as mysql from './mysql.js'

export const getUsers = async (filter = {}) => {
  try {
    const users = await mysql.getUsers(filter);
    return users;
  } catch (err) {
    console.error(err)
    throw err; // Re-throw to allow proper error handling in controller
  }
}

export const getCitas = async (filter = {}) => {
  try {
    const citas = await mysql.getCitas(filter);
    return citas;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export const getStores = async (filter = {}) => {
  try {
    const stores = await mysql.getStores(filter);
    return stores;
  } catch (err) {
    console.error(err);
    throw err;
  }
} 

export const getFeedback = async (filter = {}) => {
  try {
    const feedback = await mysql.getFeedback(filter);
    return feedback;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export const login = async (username, password) => {
  try {
    const user = await mysql.login(username, password);
    return user;
  } catch (err) {
    console.error(err);
    throw err; // Re-throw to allow proper error handling in controller
  }
}

export const register = async (userData) => {
  try {
    const newUser = await mysql.register(userData);
    return newUser;
  } catch (err) {
    console.error(err);
    throw err; // Re-throw to allow proper error handling in controller
  }
}