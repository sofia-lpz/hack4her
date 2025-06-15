import * as chatbot from './chat.js';
import * as service from './service.js';

export const chat = async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ 
        success: false, 
        error: 'Prompt is required' 
      });
    }

    const response = await chatbot.chat(prompt);
    
    return res.status(200).json({
      success: true,
      response: response
    });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    return res.status(500).json({
      success: false,
      error: 'An error occurred while processing your request'
    });
  }
};

export const summarizeFeedback = async (req, res) => {
  try {
    const store_id = req.params.store_id;

    if (!store_id) {
      return res.status(400).json({
        success: false,
        error: 'Store ID is required'
      });
    }

    const store = await service.getStores({ id: store_id });
    if (!store || store.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Store not found'
      });
    }

    const feedback = await service.getFeedback({ store_id: store_id });

    const feedbackSummary = await chatbot.summarizeFeedback(feedback, store[0].nombre);

    return res.status(200).json({
      success: true,
      data: feedbackSummary
    });
  } catch (error) {
    console.error('Error in summarizeFeedback endpoint:', error);
    return res.status(500).json({
      success: false,
      error: 'An error occurred while summarizing feedback'
    });
  }
}

export const getUsers = async (req, res) => {
  try {
    const { filter } = req.query;
    const users = await service.getUsers(filter);

    return res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Error in getUsers endpoint:', error);
    return res.status(500).json({
      success: false,
      error: 'An error occurred while fetching users'
    });
  }
}

export const getStores = async (req, res) => {
  try {
    const { filter } = req.query;
    const stores = await service.getStores(filter);

    return res.status(200).json({
      success: true,
      data: stores
    });
  } catch (error) {
    console.error('Error in getStores endpoint:', error);
    return res.status(500).json({
      success: false,
      error: 'An error occurred while fetching stores'
    });
  }
};
export const getFeedback = async (req, res) => {
  try {
    const { filter } = req.query;
    const feedback = await service.getFeedback(filter);

    return res.status(200).json({
      success: true,
      data: feedback
    });
  } catch (error) {
    console.error('Error in getFeedback endpoint:', error);
    return res.status(500).json({
      success: false,
      error: 'An error occurred while fetching feedback'
    });
  }
};
export const getCitas = async (req, res) => {
  try {
    const { filter } = req.query;
    const citas = await service.getCitas(filter);

    return res.status(200).json({
      success: true,
      data: citas
    });
  } catch (error) {
    console.error('Error in getCitas endpoint:', error);
    return res.status(500).json({
      success: false,
      error: 'An error occurred while fetching citas'
    });
  }
};

export const login = async (req, res) => {
  try {
    console.log('Login request received:', req.body);
    const { username, password } = req.body;
    console.log('Login attempt with username:', username);


    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username and password are required'
      });
    }

    const user = await service.login(username, password);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid username or password'
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,  // Explicitly include the role in the response
      }
    });
  } catch (error) {
    console.error('Error in login endpoint:', error);
    return res.status(500).json({
      success: false,
      error: 'An error occurred while processing your request'
    });
  }
}

export const register = async (req, res) => {
  try {
    const userData = req.body;

    if (!userData || !userData.username || !userData.password) {
      return res.status(400).json({
        success: false,
        error: 'Username and password are required'
      });
    }

    const newUser = await service.register(userData);

    return res.status(201).json({
      success: true,
      data: newUser
    });
  } catch (error) {
    console.error('Error in register endpoint:', error);
    return res.status(500).json({
      success: false,
      error: 'An error occurred while processing your request'
    });
  }
}

export const getLeastVisitedStores = async (req, res) => {
  try {
    const stores = await service.getLeastVisitedStores();

    return res.status(200).json({
      success: true,
      data: stores
    });
  } catch (error) {
    console.error('Error in getLeastVisitedStores endpoint:', error);
    return res.status(500).json({
      success: false,
      error: 'An error occurred while fetching least visited stores'
    });
  }
}

export const getStats = async (req, res) => {
  try {
    const stats = await service.getStats();

    return res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error in getStats endpoint:', error);
    return res.status(500).json({
      success: false,
      error: 'An error occurred while fetching statistics'
    });
  }
}