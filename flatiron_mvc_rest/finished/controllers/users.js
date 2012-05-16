var user   = require('../models/user')
   , users = exports
   ;

  users.create = function create(username) {
    var self = this;
    user.create(username, function create_cb(err, user) { 
      if(err) {
        if(err["status-code"] === 409) {
          err = errs.merge(err, 
            { error: "controller:users:user_exists"
            , status_code: 409
            , reason: "User exists"
            });
        } else {
          err = errs.merge(err, 
            { error: "controller:users:user_create"
            , status_code: 500
            , reason: "Couldn't create user"
            });
        }
      }
      self.res.json(user);
    });
  };
 
