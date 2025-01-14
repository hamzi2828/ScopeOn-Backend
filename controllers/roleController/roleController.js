const Role = require('../../models/Role');


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
};



module.exports = roleController;