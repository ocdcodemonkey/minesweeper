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

			me.renderSquare((y * me.width) + x);
		});
	},

	renderSquare: function(index)
	{
		$block = $('<div class="square"></div>');

		if (this.grid[index] > 8) // Mine
		{
			$block.addClass('mine');
		}
		else if (this.grid[index] > 0) // Adjacent
		{
			$block.text(this.grid[index]);
		}

		var y = Math.floor(index / this.width);
		var x = index - (y * this.width);

		$block.css('left', (x * 20) + 'px');
		$block.css('top', (y * 20) + 'px');

		this.$e.append($block);
	}


};
minesweeper.init();