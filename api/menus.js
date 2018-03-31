const express = require('express');
const menusRouter = express.Router();

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

const menuItemsRouter = require('./menuItems.js');

menusRouter.param('menuId', (req, res, next, menuId) => {
	const sql = 'SELECT * FROM Menu WHERE Menu.id = $menuId';
	const values = {$menuId: menuId}; 

	db.get(sql, values, (error, menus) => {
		if(error) {
			next(error);
		} else if (menus) {
			req.menus = menus;
			next();
		} else {
			res.sendStatus(404);
		}
	});
});

menusRouter.use('/:menuId/menu-items', menuItemsRouter);

menusRouter.get('/', (req, res, next) => {
   db.all('SELECT * FROM Menu', (err, menus) => {
	if(err) {
		next(err);
	} else {
		res.status(200).json({menus: menus});
	}
   });
});

menusRouter.get('/:menuId', (req, res, next) => {
	res.status(200).json({menus: req.menus});
});

menusRouter.post('/', (req, res, next) => {
	const title = req.body.menu.title;

	if(!title) {
		return res.sendStatus(400);
	}

	const sql = 'INSERT INTO Menu (title) VALUES ($title)';
	const values = {$title: title};

	db.run(sql, values, function(error) {
		if(error) {
			next(error);
		} else {
			db.get(`SELECT * FROM Menu WHERE Menu.id = ${this.lastId}`, 
				(err, menus) => {
					res.status(201).json({menus: menus});
				});
		}
	});
});

menusRouter.put('/:menuId', (req, res, next) => {
	const title = req.body.menu.title;
	if(!title) {
		return res.sendStatus(400);
	}

	const sql = 'UPDATE Menu SET title  = $title';
	const values = {$title: title}; 

	db.run(sql, values, (error) => {
		if(error) {
			next(error);
		} else {
			db.get(`SELECT * FROM Menu WHERE Menu.id = ${req.params.menuId}`, 
			(error, menus) => { 
				res.status(200).json({menus: menus});
			});
		}
	});
});

menusRouter.delete('/:menuId', (req, res, next) => {
	const menuItemsSql = 'SELECT * FROM MenuItem WHERE MenuItem.id = $menuId';
	const values = {$menuId: req.params.menuId};

	db.get(menuItemsSql, values, (error, menuItems) => {
		if(error) {
			next(error);
		} else if (menusItems) {
			res.sendStatus(400);
		} else {
			const deleteSql = 'DELETE FROM Menu WHERE Menu.id = $menuId';
			const deleteValues = {$menuId: menuId};

			db.run(deleteSql, values, (error) => {
				if(error) {
					next(error);
				} else {
					res.sendStatus(204);
				}
			});
		}
	});
});

module.exports = menusRouter;
