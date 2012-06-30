/*
 *
 */
minesweeper =
{
	width:		20,
	height:		20, 
	mines:		100,

	limit:		0,
	grid:		null,

	init: function()
	{
		this.$e = $('#minesweeper');
		this.limit = this.width * this.height;
		this.grid = [];

		// Build mines.
		for (var m = 0; m < this.mines; m++)
		{
			var index = Math.floor(Math.random() * this.limit);
			this.grid[index] = 9;

			for (var y = -1; y <= 1; y++)
			{
				for (var x = -1; x <= 1; x++)
				{
					var i		 = index + (y * this.width) + x;
					this.grid[i] = (this.grid[i] || 0) + 1;
				}
			}
		}

		this.$e.width((this.width * 20) + 'px');
		this.$e.height((this.height * 20) + 'px');

		var me = this;
		this.$e.click(function(event)
		{
			var pos = me.$e.position();
			var x = Math.floor((event.clientX - pos.left) / 20);
			var y = Math.floor((event.clientY - pos.top) / 20);

			console.log('Poking block at ' + x + ', ' + y);

			me.pokeBlock(x, y);
		});
	},

	renderBlock: function(x, y, value)
	{
		$block = $('<div class="square"></div>');

		if (value > 8) // Mine
		{
			$block.addClass('mine');
		}
		else if (value > 0) // Adjacent
		{
			$block.text(value);
		}

		$block.css('left', (x * 20 - 1) + 'px');
		$block.css('top', (y * 20 - 1) + 'px');

		this.$e.append($block);
	},

	pokeBlock: function(x, y)
	{
		var i = (y * this.width) + x;
		if (i < 0 || i >= this.limit)
		{
			return;
		}

		var value = this.grid[i];
		if (value == 'x')
		{
			return;
		}
		this.grid[i] = 'x';

		if (!value)
		{
			for (var yi = -1; yi <= 1; yi++)
			{
				for (var xi = -1; xi <= 1; xi++)
				{
					this.pokeBlock(x + xi, y + yi);
				}
			}			
		}
		this.renderBlock(x, y, value);
	}


};
minesweeper.init();