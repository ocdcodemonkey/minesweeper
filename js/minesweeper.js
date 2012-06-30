/*
 *
 */
minesweeper =
{
	width:		20,
	height:		20, 
	mines:		10,

	limit:		0,
	grid:		null,

	init: function()
	{
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
		return this;

	}

};
minesweeper.init();