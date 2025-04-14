const { Role, User } = require('../../models');



const roleController = { 

     createRole : async (req, res) => {
        const { roleName, permissions } = req.body; // Extract role details from request body
      
        try {
          // Create a new role using the provided details
          const newRole = new Role({
            roleName,
            permissions,
          });
      
          // Save the new role to the database
          await newRole.save();
      
          res.status(201).json({
            message: 'Role created successfully',
            role: newRole,
          });
        } catch (err) {
          console.error('Error creating role:', err);
          res.status(500).json({ message: 'Server error' });
        }
      },

      getAllRoles: async (req, res) => {
        
        try {
          const roles = await Role.find(); // Fetch all roles from the database
          res.status(200).json({
            message: 'Roles fetched successfully',
            roles,
          });
        } catch (err) {
          console.error('Error fetching roles:', err);
          res.status(500).json({ message: 'Server error' });
        }
      },
      

       updateRole : async (req, res) => {
        const { roleId } = req.params; // Role ID from request parameters
        const { roleName, permissions } = req.body; // Data to update from request body
      
        try {
          // Update the role by its ID
          const role = await Role.findByIdAndUpdate(
            roleId,
            { roleName, permissions }, // Update fields
            { new: true, runValidators: true } // Return updated role and validate input
          );
      
          if (!role) {
            return res.status(404).json({ message: 'Role not found' });
          }
      
          res.status(200).json({
            message: 'Role updated successfully',
            role,
          });
        } catch (err) {
          console.error('Error updating role:', err);
          res.status(500).json({ message: 'Server error' });
        }
      },

       

       deleteRole : async (req, res) => {
        const { roleId } = req.params; // Role ID from request parameters

        try {
            // Delete the role by its ID
            const role = await Role.findByIdAndDelete(roleId);

            if (!role) {
            return res.status(404).json({ message: 'Role not found' });
            }

            res.status(200).json({
            message: 'Role deleted successfully',
            role,
            });
        } catch (err) {
            console.error('Error deleting role:', err);
            res.status(500).json({ message: 'Server error' });
        }
     },
      getRoleById : async (req, res) => {
        const { roleId } = req.params; // Role ID from request parameters
      
        try {
          // Find the role by its ID
          const role = await Role.findById(roleId);
      
          if (!role) {
            return res.status(404).json({ message: 'Role not found' });
          }
      
          res.status(200).json({
            message: 'Role fetched successfully',
            role,
          });
        } catch (err) {
          console.error('Error fetching role:', err);
          res.status(500).json({ message: 'Server error' });
        }
      },

       assignRoleToUser : async (req, res) => {
        const { userId, roleId } = req.body; // roleId is now passed directly
      
        try {
          // Find the role by roleId
          const role = await Role.findById(roleId);
          if (!role) {
            return res.status(404).json({ message: 'Role not found' });
          }
      
          // Find the user by userId
          const user = await User.findById(userId);
          if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }
      
          // Assign the role to the user
          user.role = role._id; // Assign role's ObjectId to the user's role field
          await user.save();
      
          return res.status(200).json({ message: 'Role assigned successfully', user });
        } catch (err) {
          console.error('Error assigning role:', err);
          return res.status(500).json({ message: 'Server error' });
        }
      },
      
};



module.exports = roleController;