const { User } = require('../models/User');
const { Report } = require('../models/Report');

// Create a new user
const createUser = async (userData) => {
  try {
    const user = await User.create({
      firebaseUid: userData.firebaseUid,
      email: userData.email,
      name: userData.name,
      avatar: userData.avatar || null,
      company: userData.company || null,
      provider: userData.provider || 'firebase',
      plan: userData.plan || 'free',
      subscriptionId: null,
      subscriptionStatus: 'active',
      isEmailVerified: userData.isEmailVerified || false,
      reportsUsed: 0,
      reportsLimit: userData.plan === 'free' ? 3 : userData.plan === 'pro' ? -1 : -1
    });

    console.log('✅ User created:', user.id);
    return user;
  } catch (error) {
    console.error('❌ Failed to create user:', error);
    throw new Error('Failed to create user');
  }
};

// Get user by ID
const getUserById = async (userId) => {
  try {
    const user = await User.findByPk(userId);
    return user;
  } catch (error) {
    console.error('❌ Failed to get user by ID:', error);
    throw new Error('Failed to get user');
  }
};

// Get user by email
const getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ where: { email } });
    return user;
  } catch (error) {
    console.error('❌ Failed to get user by email:', error);
    throw new Error('Failed to get user');
  }
};

// Update user
const updateUser = async (userId, updateData) => {
  try {
    const [affectedRows] = await User.update(updateData, {
      where: { id: userId }
    });
    
    if (affectedRows === 0) {
      throw new Error('User not found');
    }
    
    const user = await User.findByPk(userId);
    return user;
  } catch (error) {
    console.error('❌ Failed to update user:', error);
    throw new Error('Failed to update user');
  }
};

// Delete user
const deleteUser = async (userId) => {
  try {
    await User.destroy({ where: { id: userId } });
    console.log('✅ User deleted:', userId);
    return true;
  } catch (error) {
    console.error('❌ Failed to delete user:', error);
    throw new Error('Failed to delete user');
  }
};

// Get user's reports
const getUserReports = async (userId, limit = 10, offset = 0) => {
  try {
    const reports = await Report.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });
    
    return reports;
  } catch (error) {
    console.error('❌ Failed to get user reports:', error);
    throw new Error('Failed to get user reports');
  }
};

// Check if user can create more reports
const canCreateReport = async (userId) => {
  try {
    const user = await getUserById(userId);
    
    if (!user) {
      return false;
    }
    
    // If user has unlimited reports (pro/business plan)
    if (user.reportsLimit === -1) {
      return true;
    }
    
    // Check if user has reached their limit
    return user.reportsUsed < user.reportsLimit;
  } catch (error) {
    console.error('❌ Failed to check report creation limit:', error);
    return false;
  }
};

// Increment user's report count
const incrementReportCount = async (userId) => {
  try {
    await User.increment('reportsUsed', { where: { id: userId } });
    return true;
  } catch (error) {
    console.error('❌ Failed to increment report count:', error);
    throw new Error('Failed to increment report count');
  }
};

// Get user statistics
const getUserStats = async (userId) => {
  try {
    const user = await getUserById(userId);
    const reports = await getUserReports(userId, 1000); // Get all reports for stats
    
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const reportsThisMonth = reports.filter(r => {
      const reportDate = new Date(r.createdAt);
      return reportDate.getMonth() === currentMonth && 
             reportDate.getFullYear() === currentYear;
    }).length;
    
    return {
      totalReports: reports.length,
      reportsThisMonth,
      plan: user.plan,
      subscriptionStatus: user.subscriptionStatus,
      reportsLimit: user.reportsLimit,
      reportsUsed: user.reportsUsed
    };
  } catch (error) {
    console.error('❌ Failed to get user stats:', error);
    throw new Error('Failed to get user statistics');
  }
};

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
  getUserReports,
  canCreateReport,
  incrementReportCount,
  getUserStats
};
