const express = require('express');
const menuItemsRouter = express.Router({mergeParams: true});

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

menuItemsRouter.param('menuItemId', (req, res, next, menuItemId) => {
	const sql = 'SELECT * FROM MenuItem WHERE MenuItem.id = $menuItemId';
	const values = {$menuItemId: menuItemId};

	db.get(sql, values, (error, menuItems) => {
		if(error) {
			next(error);
		} else if(menuItems) {
			next();
		} else {
			res.sendStatus(404);
		}
	});
});

menuItemsRouter.get('/', (req, res, next) => {
	const sql = 'SELECT * FROM MenuItem WHERE MenuItem.menu_id = $menuItemId';
	const values = {$menuItemId: req.params.menuItemId};

	db.all(sql, values, (error, menuItems) => {
		if(error) {
			next(error);
		} else {
			res.status(200).json({menuItems: menuItems});
		}
	});
});

menuItemsRouter.post('/', (req, res, next) => {
	const name = req.body.menuItem.name,
		  description = req.body.menuItem.description,
		  inventory = req.body.menuItem.inventory,
		  price = req.body.menuItem.price,
		  menuId = req.body.menuItem.menuId;
	const menuSql = 'SELECT * FROM Menu WHERE Menu.id = $menuId';
	const menuValues = {$menuId: menuId};
	db.get(menuSql, menuValues, (error, menu) => {
		if(error) {
			next(error);
		} else {
			if(!name || !description || !inventory || !price || !menu) {
				return res.sendStatus(400);
			}
		    
			const sql = 'INSERT INTO MenuItem (name, description, inventory, price, menuId) VALUES ' +
					    '($name, $description, $inventory, $price, $menuId)';
			const values = {
				$name: name,
				$description: description,
				$inventory: inventory,
				$price: price, 
				$menuId: menuId
			};

			db.get(`SELECT * FROM MenuItem WHERE MenuItem.id = ${this.lastId}`,
				(error, menuItem) => {
					res.status(201).json({menuItem: menuItem});
				});
		}
	});
});

menuItemsRouter.put('/:menuItemId', (req, res, next) => {
	const name = req.body.menuItem.name,
		  description = req.body.menuItem.description,
		  inventory = req.body.menuItem.inventory,
		  price = req.body.menuItem.price,
		  menuId = req.body.menuItem.menuId;
	const menuSql ='SELECT * FROM Menu WHERE Menu.id = $menuId';
	const menuValues = {$menuId: menuId};
	db.get(menuSql, menuValues, (error, menu) => {
		if(error) {
			next(error);
		} else {
			db.get(`SELECT * FROM MenuItem WHERE MenuItem.id = ${req.params.menuId}`,
				(error, menuItem) => {
					res.status(200).json({menuItem: menuItem});
				});
		}
	});
});

menuItemsRouter.delete('/:menuItemId', (req, res, next) => {
	const sql = 'DELETE FROM MenuItem WHERE MenuItem.id = $menuItemId';
	const values = {$menuItemId: req.params.menuItemId};

	db.run(sql, values, (error) => {
		if(error) {
			next(error);
		} else {
			res.sendStatus(204);
		}
	});
});

module.exports = menuItemsRouter;
