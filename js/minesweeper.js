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

	init: function()
	{
		this.$e = document.id('minesweeper');

		this.newGame(20, 20, 100);

		this.$e.addListener('click', this.blockClickHandler.bind(this));
	},

	newGame: function(width, height, mines)
	{
		this.width = width;
		this.height	= height;
		this.mines = mines;
		this.limit = this.width * this.height;
		this.grid = [];

		// Build mines.
		for (var m = 0; m < this.mines; m++)
		{
			var index = Math.floor(Math.random() * this.limit);
			var x = index % this.width;
			var y = Math.floor(index / this.width)

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

		this.$e.empty();
		this.$e.setStyles(
		{
			width:	(this.width * 20) + 'px', 
			height:	(this.height * 20) + 'px'
		});		
	},

	blockClickHandler: function(e)
	{
		// Ignore bubbled clicks.
		if (e.target != this.$e)
		{
			return;
		}

		var x = Math.floor(e.layerX / 20);
		var y = Math.floor(e.layerY / 20);

		this.pokeBlock(x, y);
	},

	renderBlock: function(x, y, value)
	{
		$block = new Element('div', { 'class': 'square' });

		if (value & 0x10) // Mine
		{
			$block.addClass('mine');
		}
		else if (value & 0xf) // Adjacent
		{
			$block.set('text', value & 0xf);
		}

		$block.setStyles(
		{
			left:	(x * 20 - 1) + 'px',
			top:	(y * 20 - 1) + 'px'
		});

		this.$e.adopt($block);
	},

	pokeBlock: function(x, y, index)
	{
		if (!this.isValidBlock(x, y))
		{
			return;
		}

		index = (y * this.width) + x;
		if (this.grid[index] & 0x20)
		{
			return;
		}
		this.grid[index] = this.grid[index] | 0x20;

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
	}

};
