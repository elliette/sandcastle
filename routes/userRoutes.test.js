const request = require('supertest-as-promised')
const {expect} = require('chai')
const Project = require('../models').Project
const User = require('../models').User
const app = require('../server')
