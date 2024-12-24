module.exports = function authorize(...allowedRoles) {
    return (req, res, next) => {
      if (!req.session.user) {
        return res.redirect("/login"); 
      }
  
      const { role } = req.session.user;
  
      if (!allowedRoles.includes(role)) {
        return res.status(403).send("Access Denied: You don't have permission.");
      }
  
      next();
    };
  };
   