const Complaint = require('../models/Complaint');
const User = require('../models/User');

// @desc    Create new complaint
// @route   POST /api/complaints
// @access  Private
const createComplaint = async (req, res) => {
  try {
    const { type, date, address, location, description, suspect, evidence } = req.body;
    
    // In actual implementation we might handle files, etc.
    const complaint = await Complaint.create({
      user: req.user.id,
      type,
      date,
      address,
      location,
      description,
      suspect,
      evidence
    });

    res.status(201).json(complaint);
  } catch (error) {
    console.error('Error creating complaint:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user's complaints
// @route   GET /api/complaints
// @access  Private
const getUserComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(complaints);
  } catch (error) {
    console.error('Error fetching user complaints:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all complaints
// @route   GET /api/admin/complaints
// @access  Private/Admin
const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.status(200).json(complaints);
  } catch (error) {
    console.error('Error fetching all complaints:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update complaint status
// @route   PUT /api/admin/complaints/:id
// @access  Private/Admin
const updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.status = status;
    await complaint.save();

    res.status(200).json(complaint);
  } catch (error) {
    console.error('Error updating complaint status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
  try {
    const totalComplaints = await Complaint.countDocuments({});
    const activeInvestigations = await Complaint.countDocuments({ status: 'in_progress' });
    const resolvedComplaints = await Complaint.countDocuments({ status: 'resolved' });
    
    const resolutionRate = totalComplaints > 0 ? Math.round((resolvedComplaints / totalComplaints) * 100) : 0;

    // Aggregate complaint types for the chart
    const categoryDistribution = await Complaint.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          name: "$_id",
          value: "$count",
          _id: 0
        }
      }
    ]);

    // Format if no data exists
    const defaultCategories = [
      { name: 'Theft', value: 0 },
      { name: 'Assault', value: 0 },
      { name: 'Fraud', value: 0 },
      { name: 'Traffic', value: 0 },
      { name: 'Other', value: 0 }
    ];

    // Merge actual data with defaults to ensure chart always has structure
    let formattedCategories = defaultCategories.map(cat => {
       const found = categoryDistribution.find(d => 
         (d.name || '').toLowerCase().includes(cat.name.toLowerCase())
       );
       return found ? { name: cat.name, value: found.value } : cat;
    });

    // Determine "Other" category for unstructured data
    if (categoryDistribution.length > 0) {
        let actualOtherCount = categoryDistribution.reduce((acc, curr) => {
           const isStandard = defaultCategories.some(c => (curr.name || '').toLowerCase().includes(c.name.toLowerCase()));
           return isStandard ? acc : acc + curr.value;
        }, 0);
        
        let otherIndex = formattedCategories.findIndex(c => c.name === 'Other');
        if (otherIndex !== -1) {
            formattedCategories[otherIndex].value += actualOtherCount;
        }
    }

    res.status(200).json({
      totalComplaints,
      resolutionRate,
      activeInvestigations,
      categoryDistribution: formattedCategories
    });
  } catch (error) {
    console.error('Error fetching admin statistics:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createComplaint,
  getUserComplaints,
  getAllComplaints,
  updateComplaintStatus,
  getAdminStats,
  getAllUsers
};
