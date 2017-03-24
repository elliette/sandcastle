import firebase from 'firebase';

import store from './store';


export default function makeFirepads() {
	let userId = store.getState().user.userId;

	var cssFirepadRef = firebase.database().ref(`/users/${userId}/css`);
	var htmlFirepadRef = firebase.database().ref(`/users/${userId}/html`);
	var jsFirepadRef = firebase.database().ref(`/users/${userId}/javascript`);
	var serverFirepadRef = firebase.database().ref(`/users/${userId}/server`);
	var databaseFirepadRef = firebase.database().ref(`/users/${userId}/database`);

	let firepads = [{ id: 'html-firepad-container', mode: 'xml' }, { id: 'css-firepad-container', mode: 'css'}, { id: 'js-firepad-container', mode: 'javascript'}, {id: 'server-firepad-container', mode: 'javascript'}, {id: 'db-firepad-container', mode: 'javascript'}];

	let fires = firepads.map(firepad => {
		return CodeMirror(document.getElementById(firepad.id), {
			lineWrapping: true,
			lineNumbers: true,
			mode: firepad.mode,
			matchBrackets: true,
			autoCloseBrackets: true,
			// matchTags: true,
			autoCloseTags: true,
			toggleComment: true,
			foldCode: true,
			hint: true,
		});
	});

	if (fires) {
		fires.forEach(fire => {
			if (fire.firepad.ready) fire.refresh();
		});
	}

	const htmlFirepad = Firepad.fromCodeMirror(htmlFirepadRef, fires[0], {
		richTextShortcuts: false,
		richTextToolbar: false,
		defaultText: 'HTML HERE!'
	});

	const cssFirepad = Firepad.fromCodeMirror(cssFirepadRef, fires[1], {
		richTextShortcuts: false,
		richTextToolbar: false,
		defaultText: 'CSS here!'
	});

	const jsFirepad = Firepad.fromCodeMirror(jsFirepadRef, fires[2], {
		richTextShortcuts: false,
		richTextToolbar: false,
		defaultText: 'JS HERE!'
	});

	// added boilerplate for userroutes and usermodels
	const serverFirepad = Firepad.fromCodeMirror(serverFirepadRef, fires[3], {
		richTextShortcuts: false,
		richTextToolbar: false,
		defaultText: `/* We would have to have this already provided for them on their blank text editor */
			const express = require('express');
			const models = require('./userModels');
			const router = express.Router();

			/*
			And then they would write out their models below:
			**Note: the following is just a hardcoded test I made for us to use**
			 */
			router.get('/', (req, res) => {
			    models.Sandcastle.create({
			            name: 'jems'
			        })
			        .then(() => {
			            res.write('Made the first post to your database!')
			            res.end();
			        })
			        .catch(console.error);
			});

			router.get('/test', (req, res) => {
			    models.Sandcastle.create({
			            name: 'test of second route'
			        })
			        .then((test) => {
			            res.json(test);
			        })
			        .catch(console.error);
			});

			router.post('/test2', (req, res) => {
			    models.Sandcastle.create({
			            name: req.body.name
			        })
			        .then((test) => {
			            res.json(test);
			        })
			        .catch(console.error);
			});

			/* And we would provide this for them to make sure they are exporting their router correctly */
			module.exports = router;
			`
	});

	const databaseFirepad = Firepad.fromCodeMirror(databaseFirepadRef, fires[4], {
		richTextShortcuts: false,
		richTextToolbar: false,
		defaultText: `/* We would need to provide the below for them  at the start of their empty file */
			const Sequelize = require('sequelize');
			const db = new Sequelize(process.env.DATABASE_URL);

			/* they would right out their models within our online text editor like below (again, below is just a hard-coded test) */
			const Sandcastle = db.define('Sandcastle', {
			    name: Sequelize.STRING
			})

			/* and then we would have to provide the module.exports for them too I think */
			module.exports = {
			    db: db, // we would provide this for them
			    Sandcastle: Sandcastle // but they would have to add in all the tables they defined
			}`
	});

	let allFirepads = [htmlFirepad, cssFirepad, jsFirepad, serverFirepad, databaseFirepad];

	return allFirepads;
}



