const permissions = {
    'admin': {
      'users': ['read', 'write', 'delete'],
      'products': ['read', 'write', 'delete'],
    },
    'user': {
      'users': ['read'],
      'products': ['read', 'write'],
    },
    'guest': {
      'users': [],
      'products': ['read'],
    },
  };
  