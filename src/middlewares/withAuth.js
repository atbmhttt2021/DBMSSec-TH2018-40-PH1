const withAuth = (req, res, next) => {
  if(req.session.user){
    next();
  } else {
    res.redirect('/auth/login');
  }
};
const withNoAuth = (req, res, next) => {
  if(!req.session.user){
    next();
  } else {
    res.redirect('/');
  }
};

module.exports = {
  withAuth,
  withNoAuth
};