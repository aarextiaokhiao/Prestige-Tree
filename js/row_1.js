addLayer("p", {
	startData() { return {
		unl: false,
		points: new Decimal(0),
	}},

	color: () => "#00bfbf",
	resource: "prestige points",
	row: 0,

	baseResource: "points",
	baseAmount() {return player.points},

	requires: () => new Decimal(10),

	type: "normal",
	exponent: 0.5,

	gainMult() {
		let gain = new Decimal(1)
		if (hasUpg("p", 21)) gain = gain.times(2)
		if (hasUpg("p", 23)) gain = gain.times(upgEffect("c", 23))
		return gain
	},
	gainExp() {
		return new Decimal(1)
	},

	layerShown() {return true},

	hotkeys: [{
		key: "p",
		desc: "P: Gain Prestige Points.",
		onPress() { if (player[this.layer].unl) doReset(this.layer)},
	}],

	upgrades: {
		rows: 2,
		cols: 3,
		11: {
			title: () => "Begin the game.",
			desc: () => "Produce 1 point per second.",
			cost: () => new Decimal(1),
			unl: () => true,
		},
		12: {
			desc: () => "You produce points faster based on your unspent Prestige Points.",
			cost: () => new Decimal(1),
			unl: () => player.p.upgrades.includes(11),
			effect: () => player.p.points.add(1).sqrt(),
			effectDisplay: (x) => format(x) + "x"
		},
		13: {
			desc: () => "Points speed up its production.",
			cost: () => new Decimal(5),
			unl: () => player.p.upgrades.includes(12),
			effect: () => player.points.add(1).log10().pow(0.75).add(1),
			effectDisplay: (x) => format(x) + "x"
		},
		21: {
			desc: () => "You gain 2x more Prestige Points.",
			cost: () => new Decimal(20),
			unl: () => player.p.upgrades.includes(11),
		},
		22: {
			desc: () => "You produce points faster based on your Prestige Upgrades bought.",
			cost: () => new Decimal(75),
			unl: () => player.p.upgrades.includes(12),
			effect: () => Decimal.pow(1.4, player.p.upgrades.length),
			effectDisplay: (x) => format(x) + "x"
		},
		23: {
			desc: () => "You gain more Prestige Points based on your Points.",
			cost: () => new Decimal(5e3),
			unl: () => player.p.upgrades.includes(13),
			effect: () => player.points.add(1).log10().cbrt().add(1),
			effectDisplay: (x) => format(x) + "x"
		},
	}
})