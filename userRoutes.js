const express = require('express');
const router = express.Router();

const User = require('./models').User;
const Project = require('./models').Project;

router.post('/user/:firebaseId', (req, res, next) => {
	User.findOrCreate({
		where: {
			firebaseId: req.params.firebaseId
		}
	})
		.spread(user => {
			Project.create(req.body)
				.then(createdProject => {
					createdProject.setUser(user);
				})
				.then(() => {
					res.status(201);
				})
				.catch(next);
		})
		.catch(console.error);
});

router.get('/user/:firebaseId', (req, res, next) => {
	User.findOne({ where: { firebaseId: req.params.firebaseId } })
		.then(user => {
			return user.getProjects();
		})
		.then(projects => {
			res.status(200).send(projects);
		})
		.catch(next);
});

router.get('/project/:hashedProjectId', (req, res, next) => {
	Project.findOne({
		where: {
			hashedProjectId: req.params.hashedProjectId
		}
	})
	.then( project => {
		res.status(200).send(project);
	})
	.catch(console.error);
})




module.exports = router;


