const roleCheck = (session, allowedRoles) => {
   let isUserAllowed = false;

   allowedRoles.forEach((role) => {
      if (session?.user?.groups.includes(role)) {
         isUserAllowed = true;
      }
   });

   return isUserAllowed;
};

export default roleCheck;