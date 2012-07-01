/*
 *
 */
minesweeper =
{
	width:		0,
	height:		0, 
	mines:		0,
	limit:		0,
	grid:		null,
	isRunning:	false,
	timer:		null,
	$e:			null,
	$grid:		null,
	$score: 	null,

	init: function()
	{
		this.$newGame = new Element('a',
		{
			'class': 'button',
			text: 'New Game',
			href: '#',
			events:
			{
				click: this.newGame.bind(this, 20, 20, 100)
			}
		});

		this.$score = new Element('div');

		this.$sidebar = new Element('div',
		{
			id:		 'minesweeper-sidebar',
			'class': 'column'
		});
		this.$sidebar.adopt(this.$score, this.$newGame);

		this.$grid	= new Element('div',
		{
			id:		 'minesweeper-grid',
			'class': 'column'
		});


		this.$e = document.id('minesweeper');
		this.$e.adopt(this.$grid, this.$sidebar);


		this.newGame(20, 20, 100);

		this.$grid.addListener('click', this.blockClickHandler.bind(this));
	},

	newGame: function(width, height, mines)
	{
		var fx = new Fx.Tween(this.$grid,
		{
    		property: 'opacity',
    		onComplete: function()
			{
				this.startGame(width, height, mines);
				this.$grid.fade('in');
			}
			.bind(this)
    	});
    	fx.start(0);
	},

	startGame: function(width, height, mines)
	{
		this.width	= width;
		this.height	= height;
		this.mines	= mines;
		this.limit = this.width * this.height;
		this.grid = [];

		// Build mines.
		for (var m = 0; m < this.mines; m++)
		{
			var index = Math.floor(Math.random() * this.limit);
			var x = index % this.width;
			var y = Math.floor(index / this.width);

			// Don't put mines ontop of mines.
			if (this.grid[index] & 0x10)
			{
				m--;
				continue;
			}

			if (this.grid[index] == undefined)
			{
				this.grid[index] = 0;
			}
			this.grid[index] = this.grid[index] | 0x10;


			for (var dY = -1; dY <= 1; dY++)
			{
				for (var dX = -1; dX <= 1; dX++)
				{
					if (this.isValidBlock(x + dX, y + dY))
					{
						var i = (y + dY) * this.width + x + dX;
						this.grid[i] = (this.grid[i] || 0) + 1;
					}
				}
			}			
		}

		// Set up the grid.
		this.$grid.empty();
		this.$grid.setStyles(
		{
			width:	(this.width * 20) + 'px', 
			height:	(this.height * 20) + 'px'
		});

		// Select an opening area.
		this.revealed = 0;
		this.isRunning = true;

		while (true)
		{
			var index = Math.floor(Math.random() * this.limit);
			if (!this.grid[index])
			{
				var x = index % this.width;
				var y = Math.floor(index / this.width);

				this.pokeBlock(x, y);
				this.updateScore();
				break;
			}
		}
	},

	blockClickHandler: function(e)
	{
		if (!this.isRunning)
		{
			return;
		}

		// Ignore bubbled clicks.
		if (e.target != this.$grid)
		{
			return;
		}

		var x = Math.floor(e.layerX / 20);
		var y = Math.floor(e.layerY / 20);

		this.pokeBlock(x, y);
		this.updateScore();
	},

	renderBlock: function(x, y, value)
	{
		$block = new Element('div', { 'class': 'square' });

		if (value & 0x10) // Mine
		{
			$block.addClass('mine');
		}
		else if (value & 0xf) // Adjacent to a mine
		{
			$block.set('text', value & 0xf);
		}

		$block.setStyles(
		{
			left:	(x * 20 - 1) + 'px',
			top:	(y * 20 - 1) + 'px'
		});

		this.$grid.adopt($block);
	},

	pokeBlock: function(x, y, index)
	{
		if (!this.isValidBlock(x, y))
		{
			return; // Don't poke invalid blocks.
		}

		index = (y * this.width) + x;
		if (this.grid[index] & 0x20)
		{
			return; // Don't poke blocks that are already shown.
		}

		// Found a mine?
		if (this.grid[index] & 0x10)
		{
			this.endGame(false);
		}

		// Mark the block as revealed.
		this.grid[index] = this.grid[index] | 0x20;
		this.revealed++;

		// No adjacent mines? Empty block, expand everything around it.
		var value = this.grid[index] & 0xf;
		if (!value)
		{
			for (var dY = -1; dY <= 1; dY++)
			{
				for (var dX = -1; dX <= 1; dX++)
				{
					this.pokeBlock(x + dX, y + dY);
				}
			}
		}
		this.renderBlock(x, y, this.grid[index]);
	},

	isValidBlock: function(x, y)
	{
		return (x >= 0) && (x < this.width) && (y >= 0) && (y < this.height);
	},

	/*
	 * Updates the score panel.
	 */
	updateScore: function()
	{
		this.$score.set('html',
			'<div class="statistic"><span class="figure">' + 0 + '</span>/<label>' + this.mines + '<br>mines</label></div>' +
			'<div class="statistic"><span class="figure">' + this.revealed + '</span>/</span><label>' + this.limit + '<br>blocks</label></div>'
		);
	},

	endGame: function(win)
	{
		this.isRunning = false;
	}

};
