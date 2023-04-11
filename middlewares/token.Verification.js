const jwt = require('jsonwebtoken');
const authConfig = require('../configs/auth.config');
const sendEmail = require('../utils/sendEmailRequest')
require('dotenv').config();
const User = require('../models/user.model')