addLayer("b", {
	startData() { return {
		unl: false,
		order: 0,
		points: new Decimal(0),
		best: new Decimal(0)
	}},

	color: () => "#415a9e",
	resource: "boosters",
	row: 1,

	baseResource: "points",
	baseAmount() {return player.points},

	requires() {
		let req = new Decimal(200)
		if (player.b.order > 0 && !player.b.unl) req = req.times(5000)
		return req
	},
	incr_order: true,

	type: "static",
	base: 5,
	exponent: 1.25,

	gainMult() {
		let div = new Decimal(1)
		if (hasUpg("b", 23)) div = div.div(upgEffect("b", 23))
		return div
	},
	gainExp: () => new Decimal(1),

	canBuyMax: () => player.b.best.gte(15),

	layerShown: () => player.p.unl || player.b.unl || player.g.unl,
	branches: [["p", 1]],

	hotkeys: [{
		key: "b",
		desc: "B: Gain Boosters.",
		onPress() { if (player.b.unl) doReset(this.layer)},
	}],

	effect() {
		let base = new Decimal(2)
		let boosters = player.b.points

		if (hasUpg("b", 12)) base = base.add(upgEffect("b", 12))
		if (hasUpg("b", 13)) base = base.add(upgEffect("b", 13))

		return Decimal.pow(base, boosters)
	},
	effectDescription() {
		return "which give you " + format(this.effect()) + "x faster Point production"
	},

	milestones: {
		0: {
			done: () => player.b.points.gte(8),
			requirementDesc: () => "8 boosters",
			effectDesc: () => "You keep Prestige Upgrades on this reset.",
		},
		1: {
			done: () => player.b.points.gte(15),
			requirementDesc: () => "15 boosters",
			effectDesc: () => "You can max out boosters.",
		},
	},

	upgrades: {
		rows: 2,
		cols: 3,
		11: {
			desc: () => "Boosters boost Prestige Point gain.",
			cost: () => new Decimal(3),
			unl: () => true,
			effect: () => player.b.points.sqrt().add(1).max(1.5),
			effectDisplay(x) { return format(x)+"x" },
		},
		12: {
			desc: () => "Generators add to the Booster effect.",
			cost: () => new Decimal(7),
			unl: () => player.g.unl,
			effect: () => player.g.points.add(1).log10().sqrt().div(3),
			effectDisplay(x) { return "+"+format(x)+" to base" },
		},
		13: {
			desc: () => "Prestige Points add to the Booster effect.",
			cost: () => new Decimal(8),
			unl: () => player.b.best.gte(5),
			effect: () => player.p.points.add(1).log10().add(1).log10().div(3),
			effectDisplay(x) { return "+"+format(x)+" to base" },
		},
		21: {
			desc: () => "Square the Generator Power effect.",
			cost: () => new Decimal(10),
			unl: () => hasUpg("b", 11) && hasUpg("b", 12)
		},
		22: {
			desc: () => "The Generator Power effect is raised to the power of 1.2.",
			cost: () => new Decimal(15),
			unl: () => hasUpg("b", 12) && hasUpg("b", 13)
		},
		23: {
			desc: () => "Boosters are cheaper based on your points.",
			cost: () => new Decimal(18),
			unl: () => hasUpg("b", 21) || hasUpg("b", 22),
			effect: () => player.points.add(1).log10().add(1).pow(3.2),
			effectDisplay: (x) => format(x) + "x",
		},
	}
})

addLayer("g", {
	startData() { return {
		unl: false,
		order: 0,
		points: new Decimal(0),
		best: new Decimal(0),
		power: new Decimal(0)
	}},
	convertToDecimal() {
		player.g.power = new Decimal(player.g.power)
	},

	color: () => "#409c6e",
	resource: "generators",
	row: 1,

	baseResource: "points",
	baseAmount() {return player.points},

	requires() {
		let req = new Decimal(200)
		if (player.g.order > 0 && !player.g.unl) req = req.times(5000)
		return req
	},
	incr_order: true,

	type: "static",
	base: 5,
	exponent: 1.25,

	gainMult() {
		let div = new Decimal(1)

		if (hasUpg("g", 22)) div = div.div(upgEffect("g", 22))

		return div
	},
	gainExp: () => new Decimal(1),

	onReset() {
		player.g.power = new Decimal(0)
	},

	canBuyMax: () => player.g.best.gte(15),

	layerShown: () => player.p.unl || player.b.unl || player.g.unl,
	branches: [["p", 1]],

	hotkeys: [{
		key: "g",
		desc: "G: Gain Generators.",
		onPress() { if (player.g.unl) doReset(this.layer)},
	}],

	update(diff) {
		if (player.g.unl) player.g.power = player.g.power.add(tmp.layerEffs.g.times(diff))
	},
	updateTemp() {
		tmp.g = {}
		if (!player.g.unl) return
	},

	effect() {
		return Decimal.pow(this.effBase(), this.effExp()).times(this.effMult())
	},
	effBase() {
		let x = new Decimal(2)

		if (hasUpg("g", 12)) x = x.add(upgEffect("g", 12))
		if (hasUpg("g", 13)) x = x.add(upgEffect("g", 13))
		if (hasUpg("g", 33)) x = x.add(upgEffect("g", 33))

		return x
	},
	effExp() {
		let x = player.g.points
		return x
	},
	effMult() {
		let x = new Decimal(1)

		if (hasUpg("g", 21)) x = x.add(upgEffect("g", 21))
		if (hasUpg("g", 25)) x = x.add(upgEffect("g", 25))

		return x
	},
	effectDescription() {
		return "which are generating " + format(this.effect()) + " Generator Power per second."
	},

	milestones: {
		0: {
			done: () => player.g.points.gte(8),
			requirementDesc: () => "8 generators",
			effectDesc: () => "You keep Prestige Upgrades on this reset.",
		},
		1: {
			done: () => player.g.points.gte(10),
			requirementDesc: () => "10 generators",
			effectDesc: () => "You passive produce 100% of Prestige Point gain per second.",
		},
		2: {
			done: () => player.g.points.gte(15),
			requirementDesc: () => "15 generators",
			effectDesc: () => "You can max out generators.",
		},
	},

	upgrades: {
		rows: 2,
		cols: 5,
		11: {
			desc: () => "Generators boost Prestige Point gain.",
			cost: () => new Decimal(3),
			unl: () => player.g.unl,
			effect: () => player.g.points.sqrt().add(1).max(1.5),
			effectDisplay: (x) => format(x) + "x",
		},
		12: {
			desc: () => "Boosters boost Generator Power gain.",
			cost: () => new Decimal(7),
			unl: () => player.b.unl,
			effect: () => player.b.points.add(1).log10().sqrt().div(3),
			effectDisplay: (x) => "+" + format(x) + " to base",
		},
		13: {
			desc: () => "Prestige Points boost Generator Power gain.",
			cost: () => new Decimal(8),
			unl: () => player.g.best.gte(8),
			effect: () => player.p.points.add(1).log10().add(1).log10().div(3),
			effectDisplay: (x) => "+" + format(x) + " to base",
		},
		14: {
			desc: () => "Prestige Upgrade 2 uses a better formula.",
			cost: () => new Decimal(13),
			unl: () => player.g.best.gte(10),
		},
		15: {
			desc: () => "Prestige Upgrade 3 is stronger based on your Generators.",
			cost: () => new Decimal(15),
			unl: () => hasUpg("g", 13),
			effect() {
				let ret = player.g.points.sqrt().add(1) 
				if (ret.gte(400)) ret = ret.cbrt().times(Math.pow(400, 2/3))
				return ret;
			},
			effectDisplay: (x) => "^" + format(x),
		},
		21: {
			desc: () => "Generator Power generates faster based on its amount.",
			cost: () => new Decimal(18),
			unl: () => hasUpg("g", 15),
			effect: () => player.g.power.add(1).log10().add(1),
			effectDisplay: (x) => format(x) + "x",
		},
		22: {
			desc: () => "Generators are cheaper based on your Prestige Points.",
			cost: () => new Decimal(19),
			unl: () => hasUpg("g", 15),
			effect: () => player.p.points.add(1).pow(0.25).pow(hasUpg("g", 32) ? 2.5 : 1),
			effectDisplay: (x) => "/" + format(x),
		},
		23: {
			desc: () => "Prestige Upgrade 6 is stronger based on your Boosters.",
			cost: () => new Decimal(20),
			unl: () => player.b.unl && hasUpg("g", 15),
			effect: () => player.b.points.pow(0.75).add(1),
			effectDisplay: (x) => "^" + format(x),
		},
		24: {
			desc: () => "Prestige Upgrade 2 uses an even better formula.",
			cost: () => new Decimal(22),
			unl: () => hasUpg("g", 14) && (hasUpg("g", 21)||hasUpg("g", 22)),
		},
		25: {
			desc: () => "Prestige Points boost Generator Power gain.",
			cost: () => new Decimal(28),
			unl: () => hasUpg("g", 23) && hasUpg("g", 24),
			effect: () => player.p.points.add(1).log10().sqrt().add(1).pow(hasUpg("g", 31) ? upgEffect("g", 31) : 1),
			effectDisplay: (x) => format(x) + "x",
		}
	},

	powEff() {
		let exp = new Decimal(1/3)

		if (hasUpg("b", 21)) exp = exp.times(2)
		if (hasUpg("b", 22)) exp = exp.times(1.2)

		return player.g.power.add(1).pow(exp)
	},

	tabFormat: [
		"main-display",
		["display-text", function() {
			return "You have " + format(player.g.power) + " Generator Power, which gives you " + format(layers.g.powEff()) + "x faster Point production."
		}],
		"blank",
		"prestige-button",
		"blank",
		"stats",
		"milestones",
		"blank",
		"upgrades"
	]
})