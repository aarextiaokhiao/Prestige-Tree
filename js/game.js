var player;
var tmp = {};
var offTime = {
	remain: 0,
	speed: 1,
};
var needCanvasUpdate = true;
var NaNalert = false;

function getStartPlayer() {
	return {
		tab: "tree",
		time: Date.now(),
		autosave: true,
		msDisplay: "always",
		versionType: "draft",
		version: 1.1,
		timePlayed: 0,
		hasNaN: false,
		points: new Decimal(10),
		p: {
			unl: false,
			points: new Decimal(0),
			best: new Decimal(0),
			upgrades: [],
		},
		b: {
			unl: false,
			points: new Decimal(0),
			best: new Decimal(0),
			upgrades: [],
			auto: false,
		},
		g: {
			unl: false,
			points: new Decimal(0),
			power: new Decimal(0),
			best: new Decimal(0),
			upgrades: [],
			auto: false,
		},
		e: {
			unl: false,
			auto: false,
			order: 0,
			points: new Decimal(0),
			best: new Decimal(0),
			enhancers: new Decimal(0),
			upgrades: [],
		},
		t: {
			unl: false,
			auto: false,
			autoCap: false,
			order: 0,
			points: new Decimal(0),
			best: new Decimal(0),
			energy: new Decimal(0),
			extCapsules: new Decimal(0),
			upgrades: [],
		},
		s: {
			unl: false,
			auto: false,
			autoBuild: false,
			order: 0,
			points: new Decimal(0),
			best: new Decimal(0),
			spent: new Decimal(0),
			buildings: {
				1: new Decimal(0),
				2: new Decimal(0),
				3: new Decimal(0),
				4: new Decimal(0),
				5: new Decimal(0)
			},
			upgrades: [],
		},
		sb: {
			unl: false, 
			order: 0,
			auto: false,
			points: new Decimal(0),
			best: new Decimal(0),
			upgrades: [],
		},
		h: {
			unl: false,
			time: 0,
			points: new Decimal(0),
			best: new Decimal(0),
			active: 0,
			challs: [],
			upgrades: [],
		},
		q: {
			unl: false,
			points: new Decimal(0),
			best: new Decimal(0),
			layers: new Decimal(0),
			energy: new Decimal(0),
			time: new Decimal(0),
			upgrades: [],
		},
		hb: {
			unl: false,
			order: 0,
			points: new Decimal(0),
			best: new Decimal(0),
			upgrades: [],
		},
		ss: {
			unl: false,
			order: 0,
			points: new Decimal(0),
			best: new Decimal(0),
			subspace: new Decimal(0),
			upgrades: [],
		},
		l: {
			unl: false, 
			order: 0,
			points: new Decimal(0),
			best: new Decimal(0),
			upgrades: [],
			power: new Decimal(0),
			boosts: {}
		},
		hs: {
			unl: false, 
			order: 0,
			points: new Decimal(0),
			total: new Decimal(0),
			upgrades: [],
			hyper_upgrades: {
				1: new Decimal(0),
				2: new Decimal(0),
				3: new Decimal(0),
				4: new Decimal(0),
				5: new Decimal(0)
			},
		},
		c: {
			unl: false,
			points: new Decimal(0),
			best: new Decimal(0),
			upgrades: [],
		},
		i: {
			unl: false,
			points: new Decimal(0),
			best: new Decimal(0),
			being_built: false,
			progress: new Decimal(0),
			extra_buildings: new Decimal(0),
			upgrades: [],
		}
	}
}

const LAYERS = ["p", "b", "g", "e", "t", "s", "sb", "h", "q", "hb", "ss", "l", "hs", "c", "i"]

const LAYER_REQS = {
	p: new Decimal(10),
	b: new Decimal(200),
	g: new Decimal(200),
	e: new Decimal(1e120),
	t: new Decimal(1e120),
	s: new Decimal(1e120),
	sb: new Decimal(180),
	h: new Decimal(1e220),
	q: new Decimal("1e512"),
	hb: new Decimal(12),
	ss: new Decimal(36),
	l: new Decimal(1e75),
	hs: new Decimal(5),
	c: new Decimal(1e60),
	i: new Decimal(1e25)
}

const LAYER_RES = {
	p: "prestige points",
	b: "boosters",
	g: "generators",
	e: "enhance points",
	t: "time capsules",
	s: "space energy",
	sb: "super-boosters",
	h: "hindrance spirit",
	q: "quirks",
	hb: "hyper-boosters",
	ss: "subspace energy",
	l: "life essence",
	hs: "hyperspace",
	c: "chromosomes",
	i: "imperium bricks",
}

const LAYER_RES_CEIL = ["sb", "hb", "ss"]

const LAYER_TYPE = {
	p: "normal",
	b: "static",
	g: "static",
	e: "normal",
	t: "static",
	s: "static",
	sb: "static",
	h: "normal",
	q: "normal",
	hb: "static", 
	ss: "static",
	l: "normal", 
	hs: "normal",
	c: "static",
	i: "static"
}

const LAYER_EXP = {
	p: new Decimal(0.5),
	b: new Decimal(1.25),
	g: new Decimal(1.25),
	e: new Decimal(0.02),
	t: new Decimal(1.85),
	s: new Decimal(1.85),
	sb: new Decimal(1.25),
	h: new Decimal(0.015),
	q: new Decimal(0.0075),
	hb: new Decimal(2.5),
	ss: new Decimal(1.1),
	l: new Decimal(0.02),
	hs: new Decimal(5),
	c: new Decimal(1),
	i: new Decimal(1.5)
}

const LAYER_BASE = {
	b: new Decimal(5),
	g: new Decimal(5),
	t: new Decimal(1e15),
	s: new Decimal(1e15),
	sb: new Decimal(1.05),
	hb: new Decimal(1.05),
	ss: new Decimal(1.15),
	hs: new Decimal(1),
	c: new Decimal(1e15),
	i: new Decimal(1e5)
}

const LAYER_ROW = {
	p: 0,
	b: 1,
	g: 1,
	e: 2,
	t: 2,
	s: 2,
	sb: 2,
	h: 3,
	q: 3,
	hb: 3,
	ss: 3,
	l: 4,
	hs: 4,
	c: 4,
	future_layer: 5,
}

const ROW_LAYERS = [
	["p"],
	["b","g"],
	["e","t","s","sb"],
	["h","q","hb","ss"],
	["l","hs","c"],
	["future_layer"],
]

const ORDER_UP = [
	[],
	[],
	["e","t","s","sb"],
	["hb","ss"],
	["l","hs"],
	[],
]

const LAYER_EFFS = {
	b: function() { 
		if (tmp.hcActive ? tmp.hcActive[11] : true) return new Decimal(1);
		return Decimal.pow(Decimal.add(2, tmp.atbb).max(0), player.b.points.plus(getFreeBoosters())).max(0)
	},
	g: function() { return Decimal.pow(Decimal.add(2, tmp.atgb).max(0), player.g.points.times(getGenPow())).sub(1).times(getGenPowerGainMult()).max(0) },
	t: function() { return {
		gain: Decimal.pow(3, player.t.points.plus(player.t.extCapsules.plus(tmp.freeExtCap).times(getFreeExtPow())).times(getCapPow())).sub(1).times(getTimeEnergyGainMult()),
		limit: Decimal.pow(2, player.t.points.plus(player.t.extCapsules.plus(tmp.freeExtCap).times(getFreeExtPow())).times(getCapPow())).sub(1).times(100).times(getTimeEnergyLimitMult()),
	}},
	sb: function() {
		let exp = player.sb.points.times(getSuperBoosterPow())
		if (tmp.hcActive[13]) exp = exp.sqrt()
		return Decimal.pow(Decimal.add(1.5, addToSBBase()), exp)
	},
	h: function() { 
		if (tmp.hcActive[23]) return new Decimal(0)
		let ret = player.h.points.plus(1).times(player.points.times(player.h.points).plus(1).log10().plus(1).log10().plus(1)).log10().times(5).root(player.q.upgrades.includes(12)?1.25:2);
		if (ret.gte(100)) ret = ret.log10().times(50).min(ret);
		return ret;
	},
	hb: function() { return Decimal.pow(1.6, player.hb.points.pow(getHyperBoosterExp()).times(getHyperBoosterPow())) },
	ss: function() { return player.ss.points.pow(2.5).times(getSubspaceGainMult()) },
	c: function() { return {
		exp: player.c.points.add(1),
		speed: player.c.points.div(4).add(1) 
	}}
}

const LAYER_UPGS = {
	p: {
		rows: 3,
		cols: 3,
		11: {
			desc: "Gain 1 Point every second.",
			cost: new Decimal(1),
			unl: function() { return player.p.unl },
		},
		12: {
			desc: "Point generation is faster based on your unspent Prestige Points.",
			cost: new Decimal(1),
			unl: function() { return player.p.upgrades.includes(11) },
			currently: function() {
				if (tmp.hcActive ? tmp.hcActive[32] : true) return new Decimal(1)
				return player.p.points.plus(1).pow(player.g.upgrades.includes(24)?1.1:(player.g.upgrades.includes(14)?0.75:0.5)) 
			},
			effDisp: function(x) { return format(x)+"x" },
		},
		13: {
			desc: "Point generation is faster based on your Point amount.",
			cost: new Decimal(5),
			unl: function() { return player.p.upgrades.includes(12) },
			currently: function() { 
				let ret = player.points.plus(1).log10().pow(0.75).plus(1)
				if (player.g.upgrades.includes(15)) ret = ret.pow(LAYER_UPGS.g[15].currently())
				return ret;
			},
			effDisp: function(x) { return format(x)+"x" },
		},
		21: {
			desc: "Prestige Point gain is doubled.",
			cost: new Decimal(20),
			unl: function() { return (player.b.unl||player.g.unl)&&player.p.upgrades.includes(11) },
		},
		22: {
			desc: "Point generation is faster based on your Prestige Upgrades bought.",
			cost: new Decimal(75),
			unl: function() { return (player.b.unl||player.g.unl)&&player.p.upgrades.includes(12) },
			currently: function() { return Decimal.pow(1.4, player.p.upgrades.length) },
			effDisp: function(x) { return format(x)+"x" },
		},
		23: {
			desc: "Prestige Point gain is boosted by your Point amount.",
			cost: new Decimal(5e3),
			unl: function() { return (player.b.unl||player.g.unl)&&player.p.upgrades.includes(13) },
			currently: function() { 
				let ret = player.points.plus(1).log10().cbrt().plus(1) 
				if (player.g.upgrades.includes(23)) ret = ret.pow(LAYER_UPGS.g[23].currently())
				if (player.p.upgrades.includes(33)) ret = ret.pow(1.25)
				return ret;
			},
			effDisp: function(x) { return format(x)+"x" },
		},
		31: {
			desc: "Prestige Point gain is boosted by your Prestige Point amount.",
			cost: new Decimal("1e4450"),
			unl: function() { return player.e.upgrades.includes(33) },
			currently: function() { 
				let ret = player.p.points.plus(1).log10().plus(1).pow(player.p.points.plus(1).log10().div(200).plus(1)).pow(player.p.upgrades.includes(32) ? LAYER_UPGS.p[32].currently() : 1) 
				if (ret.gte("1e1000")) ret = ret.log10().times("1e997")
				return ret;
			},
			effDisp: function(x) { return format(x)+"x" },
		},
		32: {
			desc: "The upgrade to the left is stronger based on your Points.",
			cost: new Decimal("1e5140"),
			unl: function() { return player.e.upgrades.includes(33) },
			currently: function() { return player.points.plus(1).log10().plus(1).root(16) },
			effDisp: function(x) { return format(x.sub(1).times(100))+"% stronger" },
		},
		33: {
			desc: "The above upgrade is 25% stronger.",
			cost: new Decimal("1e5500"),
			unl: function() { return player.e.upgrades.includes(33) },
		},
	},
	b: {
		rows: 3,
		cols: 3,
		11: {
			desc: "Boosters boost Prestige Point gain.",
			cost: new Decimal(3),
			unl: function() { return player.b.unl },
			currently: function() { return player.b.points.sqrt().plus(1).max(1.5) },
			effDisp: function(x) { return format(x)+"x" },
		},
		12: {
			desc: "Generators add to the Booster effect.",
			cost: new Decimal(7),
			unl: function() { return player.g.unl },
			currently: function() { return player.g.points.plus(1).log10().sqrt().div(3).times((player.t.upgrades.includes(14)&&!(tmp.hcActive?tmp.hcActive[12]:true))?8.5:1) },
			effDisp: function(x) { return "+"+format(x)+" to base" },
		},
		13: {
			desc: "Prestige Points add to the Booster effect.",
			cost: new Decimal(8),
			unl: function() { return player.b.best.gte(8) },
			currently: function() { return player.p.points.plus(1).log10().plus(1).log10().div(3) },
			effDisp: function(x) { return "+"+format(x)+" to base" },
		},
		21: {
			desc: "Square the Generator Power effect.",
			cost: new Decimal(10),
			unl: function() { return player.b.upgrades.includes(11) && player.b.upgrades.includes(12) },
		},
		22: {
			desc: "The Generator Power effect is raised to the power of 1.2.",
			cost: new Decimal(15),
			unl: function() { return player.b.upgrades.includes(12) && player.b.upgrades.includes(13) },
		},
		23: {
			desc: "Boosters are cheaper based on your points.",
			cost: new Decimal(18),
			unl: function() { return player.b.upgrades.includes(21) || player.b.upgrades.includes(22) },
			currently: function() { return player.points.plus(1).log10().plus(1).pow(3.2).pow(tmp.spaceBuildEff?tmp.spaceBuildEff[4]:1) },
			effDisp: function(x) { return "/"+format(x) },
		},
		31: {
			desc: "Hyper-Boosters multiply the Booster base.",
			cost: new Decimal(1250),
			unl: function() { return player.hb.upgrades.includes(14) },
			currently: function() { return Decimal.pow(4, player.hb.points.pow(2)) },
			effDisp: function(x) { return format(x)+"x" },
		},
		32: {
			desc: "Add free Boosters based on your Generator Power.",
			cost: new Decimal(1263),
			unl: function() { return player.hb.upgrades.includes(14) },
			currently: function() { return player.g.power.plus(1).log10().sqrt().floor() },
			effDisp: function(x) { return "+"+formatWhole(x) },
		},
		33: {
			desc: "Add 100 free Boosters.",
			cost: new Decimal(1270),
			unl: function() { return player.hb.upgrades.includes(14) },
		},
	},
	g: {
		rows: 3,
		cols: 5,
		11: {
			desc: "Generators boost Prestige Point gain.",
			cost: new Decimal(3),
			unl: function() { return player.g.unl },
			currently: function() { return player.g.points.sqrt().plus(1).max(1.5) },
			effDisp: function(x) { return format(x)+"x" },
		},
		12: {
			desc: "Boosters boost Generator Power gain.",
			cost: new Decimal(7),
			unl: function() { return player.b.unl },
			currently: function() { return player.b.points.plus(1).log10().sqrt().div(3).times((player.t.upgrades.includes(14)&&!(tmp.hcActive?tmp.hcActive[12]:true))?3.75:1) },
			effDisp: function(x) { return "+"+format(x)+" to base" },
		},
		13: {
			desc: "Prestige Points boost Generator Power gain.",
			cost: new Decimal(8),
			unl: function() { return player.g.best.gte(8) },
			currently: function() { return player.p.points.plus(1).log10().plus(1).log10().div(3) },
			effDisp: function(x) { return "+"+format(x)+" to base" },
		},
		14: {
			desc: "Prestige Upgrade 2 uses a better formula.",
			cost: new Decimal(13),
			unl: function() { return player.g.best.gte(10) },
		},
		15: {
			desc: "Prestige Upgrade 3 is stronger based on your Generators.",
			cost: new Decimal(15),
			unl: function() { return player.g.upgrades.includes(13) },
			currently: function() { return player.g.points.sqrt().plus(1).times((player.e.upgrades.includes(32)&&!(tmp.hcActive?tmp.hcActive[12]:true)) ? LAYER_UPGS.e[32].currently() : 1) },
			effDisp: function(x) { return "^"+format(x) },
		},
		21: {
			desc: "Generator Power generates faster based on its amount.",
			cost: new Decimal(18),
			unl: function() { return player.g.upgrades.includes(15) },
			currently: function() { return player.g.power.plus(1).log10().plus(1) },
			effDisp: function(x) { return format(x)+"x" },
		},
		22: {
			desc: "Generators are cheaper based on your Prestige Points.",
			cost: new Decimal(19),
			unl: function() { return player.g.upgrades.includes(15) },
			currently: function() { return player.p.points.plus(1).pow(0.25).pow(player.g.upgrades.includes(32)?2.5:1) },
			effDisp: function(x) { return "/"+format(x) },
		},
		23: {
			desc: "Prestige Upgrade 6 is stronger based on your Boosters.",
			cost: new Decimal(20),
			unl: function() { return player.b.unl && player.g.upgrades.includes(15) },
			currently: function() { return player.b.points.pow(0.75).plus(1) },
			effDisp: function(x) { return "^"+format(x) },
		},
		24: {
			desc: "Prestige Upgrade 2 uses an even better formula.",
			cost: new Decimal(22),
			unl: function() { return player.g.upgrades.includes(14) && (player.g.upgrades.includes(21)||player.g.upgrades.includes(22)) },
		},
		25: {
			desc: "Prestige Points boost Generator Power gain.",
			cost: new Decimal(28),
			unl: function() { return player.g.upgrades.includes(23) && player.g.upgrades.includes(24) },
			currently: function() { return player.p.points.plus(1).log10().sqrt().plus(1).pow((player.t.upgrades.includes(14)&&!(tmp.hcActive?tmp.hcActive[12]:true))?2.75:1).pow(player.g.upgrades.includes(31) ? LAYER_UPGS.g[31].currently() : 1) },
			effDisp: function(x) { return format(x)+"x" },
		},
		31: {
			desc: "Generator Upgrade 10 is stronger based on your Generators.",
			cost: new Decimal(950),
			unl: function() { return player.ss.upgrades.includes(21) },
			currently: function() { return player.g.points.plus(1).log10().pow(3.6).plus(1) },
			effDisp: function(x) { return format(x.sub(1).times(100))+"% stronger" },
		},
		32: {
			desc: "Generator Upgrade 7 is 150% stronger.",
			cost: new Decimal(960),
			unl: function() { return player.ss.upgrades.includes(21) },
		},
		33: {
			desc: "Generator Power adds to the Generator base.",
			cost: new Decimal(1025),
			unl: function() { return player.ss.upgrades.includes(21) },
			currently: function() { return player.g.power.plus(1).log10().div(15).plus(1) },
			effDisp: function(x) { return "+"+format(x) },
		},
		34: {
			desc: "Generators are stronger based on their amount.",
			cost: new Decimal(1070),
			unl: function() { return player.ss.upgrades.includes(21) },
			currently: function() { return player.g.points.plus(1).log10().plus(1).log10().plus(1).sqrt() },
			effDisp: function(x) { return format(x.sub(1).times(100))+"% stronger" },
		},
		35: {
			desc: "Subspace boosts Generator Power gain.",
			cost: new Decimal(1130),
			unl: function() { return player.ss.upgrades.includes(21) },
			currently: function() { return player.ss.subspace.plus(1).pow(40) },
			effDisp: function(x) { return format(x)+"x" },
		},
	},
	e: {
		rows: 3,
		cols: 5,
		11: {
			desc: "Boosters & Generators boost each other.",
			cost: new Decimal(40),
			unl: function() { return player.e.unl },
			currently: function() { 
				let exp = 1
				if (player.e.upgrades.includes(14)&&!(tmp.hcActive?tmp.hcActive[12]:true)) exp = 1.5
				return {g: player.b.points.plus(1).log10().pow(exp), b: player.g.points.plus(1).log10().pow(exp)} 
			},
			effDisp: function(x) { return "+"+format(x.g)+" to Generator base, +"+format(x.b)+" to Booster base" },
		},
		12: {
			desc: "Unspent Enhance Points boost Prestige Point gain.",
			cost: new Decimal(150),
			unl: function() { return player.e.unl&&player.e.best.gte(40) },
			currently: function() { 
				let ret = player.e.points.plus(1).pow((player.e.upgrades.includes(15)&&!(tmp.hcActive?tmp.hcActive[12]:true))?3.25:1.5) 
				if (ret.gte("1e1500")) ret = ret.sqrt().times("1e750")
				return ret
			},
			effDisp: function(x) { return format(x)+"x" },
		},
		13: {
			desc: "You gain 1e10x as many Prestige Points.",
			cost: new Decimal(1000),
			unl: function() { return player.e.upgrades.includes(11)||player.e.upgrades.includes(12) },
		},
		14: {
			desc: "Enhance Upgrade 1 uses a better formula.",
			cost: new Decimal(5e7),
			unl: function() { return player.e.upgrades.includes(13)&&(player.t.unl||player.s.unl) },
		},
		15: {
			desc: "Enhance Upgrade 2 uses a better formula.",
			cost: new Decimal(2e10),
			unl: function() { return player.e.upgrades.includes(14)&&(player.t.unl||player.s.unl)&&player.e.best.gte(1e9) },
		},
		21: {
			desc: "The Generator Power effect is raised to the power of 1.15.",
			cost: new Decimal(1e15),
			unl: function() { return player.t.unl&&(player.t.order==1||player.s.unl)&&player.e.upgrades.includes(14) },
		},
		22: {
			desc: "This layer behaves as if you chose it first (base req is now 1e120 points)",
			cost: new Decimal(1e22),
			unl: function() { return (player.t.unl&&player.s.unl&&player.e.order==2)||player.e.upgrades.includes(22)||player.e.upgrades.includes(23) },
		},
		23: {
			desc: "This layer behaves as if you chose it first (base req is now 1e120 points)",
			cost: new Decimal(1e40),
			unl: function() { return (player.t.unl&&player.s.unl)||player.e.upgrades.includes(22)||player.e.upgrades.includes(23) },
		},
		24: {
			desc: "Prestige Points boost Enhance Point gain.",
			cost: new Decimal(1e65),
			unl: function() { return player.t.unl&&player.s.unl&&player.e.best.gte(1e50) },
			currently: function() { return player.p.points.plus(1).pow(0.002) },
			effDisp: function(x) { return format(x)+"x" },
		},
		25: {
			desc: "Enhancers are stronger based on your Space Energy & Time Capsules.",
			cost: new Decimal(7.777e77),
			unl: function() { return player.t.unl&&player.s.unl&&player.e.best.gte(1e60) },
			currently: function() { 
				let ret = player.s.points.plus(player.t.points).div(32).plus(1);
				if (ret.gte(2)) ret = ret.log(2).plus(1).times(2).sqrt();
				return ret;
			},
			effDisp: function(x) { return format(x.sub(1).times(100))+"% stronger" },
		},
		31: {
			desc: "Enhancers are stronger based on your Super-Boosters.",
			cost: new Decimal(1e90),
			unl: function() { return player.e.upgrades.includes(25)&&player.sb.unl },
			currently: function() { return player.sb.points.pow(0.75).div(4).plus(1) },
			effDisp: function(x) { return format(x.sub(1).times(100))+"% stronger" },
		},
		32: {
			desc: "Generator Upgrade 5 is stronger based on your Enhance Points.",
			cost: new Decimal(7.5e108),
			unl: function() { return player.e.upgrades.includes(25)&&player.sb.unl },
			currently: function() { 
				let ret = Decimal.pow(10, player.e.points.plus(1).log10().pow(0.085)).div(10).max(1).min(10);
				return ret;
			},
			effDisp: function(x) { return format(x)+"x" },
		},
		33: {
			desc: "Unlock 3 new Prestige Upgrades.",
			cost: new Decimal(2.5e139),
			unl: function() { return player.e.upgrades.includes(31)||player.e.upgrades.includes(32) },
		},
		34: {
			desc: "You gain 1e40x as many Prestige Points.",
			cost: new Decimal(1e152),
			unl: function() { return player.e.upgrades.includes(31)&&player.e.upgrades.includes(32) },
		},
		35: {
			desc: "Points boost Generator Power gain.",
			cost: new Decimal(2e189),
			unl: function() { return player.e.upgrades.includes(33)||player.e.upgrades.includes(34) },
			currently: function() { return player.points.plus(1).pow(0.004) },
			effDisp: function(x) { return format(x)+"x" },
		},
	},
	t: {
		rows: 3,
		cols: 4,
		11: {
			desc: "Non-extra Time Capsules boost the Booster effect.",
			cost: new Decimal(2),
			unl: function() { return player.t.unl },
			currently: function() { return player.t.points.pow(0.9).plus(0.5).plus((player.t.upgrades.includes(13)&&!(tmp.hcActive?tmp.hcActive[12]:true))?LAYER_UPGS.t[13].currently():0) },
			effDisp: function(x) { return "+"+format(x)+" to base" },
		},
		12: {
			desc: "The Time Energy cap starts later based on your Boosters, and you get a free Extra Time Capsule.",
			cost: new Decimal(3),
			unl: function() { return player.t.best.gte(2)&&player.t.unl },
			currently: function() { return player.b.points.pow(0.95).plus(1).pow(player.q.upgrades.includes(43)?16:1) },
			effDisp: function(x) { return format(x)+"x" },
		},
		13: {
			desc: "Extra Time Capsules are added to the first Time Upgrade's effect formula, but at a reduced amount.",
			cost: new Decimal(3),
			unl: function() { return player.t.upgrades.includes(11) },
			currently: function() { return player.t.extCapsules.plus(tmp.freeExtCap).pow(0.95) },
			effDisp: function(x) { return "+"+format(x) },
		},
		14: {
			desc: "Generator Upgrades 2 & 10 are 275% stronger, and Booster Upgrade 2 is 750% stronger.",
			cost: new Decimal(4),
			unl: function() { return player.t.upgrades.includes(12)||player.t.upgrades.includes(13) },
		},
		21: {
			desc: "Time Energy boosts its own production & limit, and the Time Energy effect uses a better formula.",
			cost: new Decimal(4),
			unl: function() { return player.t.upgrades.includes(14) },
			currently: function() { return player.t.energy.plus(1).log10().pow(1.1).plus(1) },
			effDisp: function(x) { return format(x)+"x" },
		},
		22: {
			desc: "Time Energy production & limit are boosted by your Enhance Points.",
			cost: new Decimal(5),
			unl: function() { return player.t.upgrades.includes(14)&&player.e.unl },
			currently: function() { 
				let ret = player.e.points.plus(1).pow(0.8/(1+player.t.order))
				if (ret.gte("1e400")) ret = ret.log10().times(Decimal.div("1e400", 400)).min(ret)
				return ret;
			},
			effDisp: function(x) { return format(x)+"x" },
		},
		23: {
			desc: "Time Energy production & limit are boosted by your Space Energy.",
			cost: new Decimal(5),
			unl: function() { return player.t.upgrades.includes(14)&&player.s.unl },
			currently: function() { return Decimal.pow(3, player.s.points.pow(0.9)) },
			effDisp: function(x) { return format(x)+"x" },
		},
		24: {
			desc: "Get 18 free boosters added to their effect.",
			cost: new Decimal(7),
			unl: function() { return player.t.upgrades.includes(21)&&player.t.best.gte(5) },
		},
		31: {
			desc: "Add 25 to the booster effect base.",
			cost: new Decimal(8),
			unl: function() { return (player.t.upgrades.includes(22)&&(player.e.order==1||player.s.unl))||(player.t.upgrades.includes(23)&&(player.s.order==1||player.e.unl)) },
		},
		32: {
			desc: "This layer behaves as if you chose it first (base req is now 1e120 points)",
			cost: new Decimal(12),
			unl: function() { return (player.s.unl&&player.e.unl)||player.t.upgrades.includes(32) },
		},
		33: {
			desc: "Add 40 to the booster effect base.",
			cost: new Decimal(16),
			unl: function() { return player.s.unl&&player.e.unl&&player.t.upgrades.includes(32) },
		},
		34: {
			desc: "Time Energy caps later and generates faster based on your non-free Time Capsules.",
			cost: new Decimal(18),
			unl: function() { return player.t.upgrades.includes(33)&&player.sb.unl },
			currently: function() { return Decimal.pow(10, player.t.points.pow(1.2)) },
			effDisp: function(x) { return format(x)+"x" },
		},
	},
	s: {
		rows: 3,
		cols: 4,
		11: {
			desc: "Add a free level to all Space Buildings.",
			cost: new Decimal(2),
			unl: function() { return player.s.unl },
		},
		12: {
			desc: "Generator Power boosts its own generation.",
			cost: new Decimal(3),
			unl: function() { return player.s.best.gte(2)&&player.s.unl },
			currently: function() { return player.g.power.plus(1).log10().plus(1) },
			effDisp: function(x) { return format(x)+"x" },
		},
		13: {
			desc: "Space Building Levels boost Generator Power gain, and get 2 extra Space.",
			cost: new Decimal(3),
			unl: function() { return player.s.upgrades.includes(11) },
			currently: function() { return Decimal.pow(20, Object.values(player.s.buildings).reduce((a,b) => Decimal.add(a,b))) },
			effDisp: function(x) { return format(x)+"x" },
		},
		14: {
			desc: "Unlock a 4th Space Building, and add a free level to all Space Buildings.",
			cost: new Decimal(4),
			unl: function() { return player.s.upgrades.includes(12)&&player.s.upgrades.includes(13) },
		},
		21: {
			desc: "All Space Buildings are stronger based on your Generators.",
			cost: new Decimal(4),
			unl: function() { return player.s.upgrades.includes(14) },
			currently: function() { return player.g.points.plus(1).log10().div(1.5).plus(1) },
			effDisp: function(x) { return format(x.sub(1).times(100))+"% stronger" },
		},
		22: {
			desc: "Space Buildings are stronger based on your Time Energy.",
			cost: new Decimal(6),
			unl: function() { return player.s.upgrades.includes(14)&&player.t.unl },
			currently: function() { return player.t.energy.plus(1).log10().plus(1).log10().div(5).plus(1) },
			effDisp: function(x) { return format(x.sub(1).times(100))+"% stronger" },
		},
		23: {
			desc: "Space Buildings are stronger based on your Enhancers.",
			cost: new Decimal(5),
			unl: function() { return player.s.upgrades.includes(14)&&player.e.unl },
			currently: function() { return player.e.enhancers.sqrt().div((player.s.order==0)?5:7).plus(1) },
			effDisp: function(x) { return format(x.sub(1).times(100))+"% stronger" },
		},
		24: {
			desc: "Space Building costs scale half as fast, and you have 3 more Space.",
			cost: new Decimal(7),
			unl: function() { return player.s.upgrades.includes(21)&&(player.t.unl||player.e.unl) },
		},
		31: {
			desc: "Space Building 1 uses a better formula.",
			cost: new Decimal(7),
			unl: function() { return (player.s.upgrades.includes(22)&&(player.t.order==0||player.e.unl))||(player.s.upgrades.includes(23)&&(player.e.order==0||player.t.unl)) },
		},
		32: {
			desc: "Unlock a 5th Space Building.",
			cost: new Decimal(8),
			unl: function() { return (player.s.upgrades.includes(22)&&(player.t.order==1||player.e.unl))||(player.s.upgrades.includes(23)&&(player.e.order==1||player.t.unl)) },
		},
		33: {
			desc: "This layer behaves as if you chose it first (base req is now 1e120 points)",
			cost: new Decimal(12),
			unl: function() { return (player.t.unl&&player.e.unl)||player.s.upgrades.includes(33) },
		},
		34: {
			desc: "Space Buildings boost the Generator Power effect (before all other boosts).",
			cost: new Decimal(15),
			unl: function() { return player.t.unl&&player.e.unl&&player.t.order==0&&player.e.order==0&&player.s.order==0 },
			currently: function() { return Decimal.pow(Object.values(player.s.buildings).reduce((a,b) => Decimal.add(a,b)), 0.2).div(17.5) },
			effDisp: function(x) { return "Add "+format(x)+" to exponent" },
		},
	},
	sb: {
		rows: 2,
		cols: 2,
		11: {
			desc: "Super-Boosters are stronger based on your Prestige Points.",
			cost: new Decimal(2),
			unl: function() { return player.sb.unl },
			currently: function() { 
				let ret = Decimal.pow(10, player.p.points.plus(1).log10().div(1e5).sqrt());
				if (ret.gte(2.5)) ret = ret.log(2.5).plus(1.5).min(ret);
				return ret.max(1);
			},
			effDisp: function(x) { return format(x)+"x" },
		},
		12: {
			desc: "Super-Boosters are stronger based on your Generators.",
			cost: new Decimal(4),
			unl: function() { return player.sb.upgrades.includes(11) },
			currently: function() { return player.g.points.div(10).pow(0.04).max(1) },
			effDisp: function(x) { return format(x)+"x" },
		},
		21: {
			desc: "Super-Boosters add to the Booster base.",
			cost: new Decimal(8),
			unl: function() { return player.h.challs.includes(32) },
			currently: function() { return player.sb.points.pow(2.15) },
			effDisp: function(x) { return "+"+format(x) },
		},
		22: {
			desc: "Super-Boosters add to the Super-Booster base.",
			cost: new Decimal(12),
			unl: function() { return player.h.challs.includes(32) },
			currently: function() { return player.sb.points.plus(1).log10().div(3) },
			effDisp: function(x) { return "+"+format(x) },
		},
	},
	h: {
		rows: 0,
		cols: 0,
	},
	q: {
		rows: 4,
		cols: 4,
		11: {
			desc: "Quirks & Hindrance Spirit boost Point, Prestige Point, and Enhance Point gain.",
			cost: new Decimal(1),
			unl: function() { return player.q.unl&&player.q.layers.gt(0) },
			currently: function() { return player.q.points.plus(1).times(player.h.points.plus(1)).pow(0.75) },
			effDisp: function(x) { return format(x)+"x" },
		},
		12: {
			desc: "The Quirk Energy and Hindrance Spirit effects use better formulas.",
			cost: new Decimal(5),
			unl: function() { return player.q.upgrades.includes(11)&&player.h.best.gte(3) },
		},
		13: {
			desc: "Quirk Layers are twice as fast.",
			cost: new Decimal(50),
			unl: function() { return player.q.upgrades.includes(11)&&player.h.challs.includes(11) },
		},
		14: {
			desc: "Quirk Layers are thrice as fast.",
			cost: new Decimal(2e10),
			unl: function() { return player.h.challs.includes(32) },
		},
		21: {
			desc: "Quirk Layers are faster based on your Quirks.",
			cost: new Decimal(160),
			unl: function() { return (player.q.upgrades.includes(12)||player.q.upgrades.includes(13))&&player.h.challs.includes(12) },
			currently: function() { return player.q.points.plus(1).log10().plus(1) },
			effDisp: function(x) { return format(x)+"x" },
		},
		22: {
			desc: "Quirk & Hindrance Spirit gain boost each other.",
			cost: new Decimal(400),
			unl: function() { return player.q.upgrades.includes(12)&&player.q.upgrades.includes(13)&&player.h.challs.includes(12) },
			currently: function() { return {
				q: player.h.points.div(10).plus(1).sqrt(),
				h: player.q.points.div(10).plus(1).sqrt(),
			}},
			effDisp: function(x) { return format(x.q)+"x to Quirk gain, "+format(x.h)+"x to Hindrance Spirit gain" },
		},
		23: {
			desc: "The Time Energy limit is 1e10x higher.",
			cost: new Decimal(5000),
			unl: function() { return player.q.upgrades.includes(21)||player.q.upgrades.includes(22) },
		},
		24: {
			desc: "The Time Energy limit is higher based on your Quirk Energy.",
			cost: new Decimal(5e10),
			unl: function() { return player.h.challs.includes(32) },
			currently: function() { return player.q.energy.div(1e6).plus(1).pow(0.9) },
			effDisp: function(x) { return format(x)+"x" },
		},
		31: {
			desc: "Get 1 of each Space Building for free.",
			cost: new Decimal(150000),
			unl: function() { return player.q.upgrades.includes(21)&&player.q.upgrades.includes(22) },
		},
		32: {
			desc: "The Quirk Energy effect is squared.",
			cost: new Decimal(500000),
			unl: function() { return player.q.upgrades.includes(23)||player.q.upgrades.includes(31) },
		},
		33: {
			desc: "Time Capsules are stronger based on their amount.",
			cost: new Decimal(2e9),
			unl: function() { return player.q.upgrades.includes(23)&&player.q.upgrades.includes(31) },
			currently: function() { return player.t.points.plus(player.t.extCapsules.plus(tmp.freeExtCap)).plus(1).log10().plus(1) },
			effDisp: function(x) { return format(x.sub(1).times(100))+"% stronger" },
		},
		34: {
			desc: "Enhance Points boost Hindrance Spirit & Quirk gain.",
			cost: new Decimal(1e11),
			unl: function() { return player.h.challs.includes(32) },
			currently: function() { return player.e.points.plus(1).log10().cbrt().plus(1) },
			effDisp: function(x) { return format(x)+"x" },
		},
		41: {
			desc: "Space Buildings are 40% stronger.",
			cost: new Decimal(2.5e13),
			unl: function() { return player.h.challs.includes(32) },
		},
		42: {
			desc: "Enhancers are 40% stronger.",
			cost: new Decimal(2e14),
			unl: function() { return player.h.challs.includes(32) },
		},
		43: {
			desc: "Time Upgrade 2 is 1,500% stronger.",
			cost: new Decimal(1e16),
			unl: function() { return player.h.challs.includes(32) },
		},
		44: {
			desc: "You gain more Hindrance Spirit based on your Quirk Energy.",
			cost: new Decimal(4e16),
			unl: function() { return player.h.challs.includes(32) },
			currently: function() { return player.q.energy.plus(1).log10().plus(1) },
			effDisp: function(x) { return format(x)+"x" },
		},
	},
	hb: {
		rows: 1,
		cols: 4,
		11: {
			desc: "Super-Boosters are stronger based on your Hyper-Boosters.",
			cost: new Decimal(2),
			unl: function() { return player.hb.unl },
			currently: function() { return player.hb.points.sqrt().div(4).plus(1) },
			effDisp: function(x) { return format(x.sub(1).times(100))+"% stronger" },
		},
		12: {
			desc: "Hyper-Boosters are stronger based on your Super-Boosters.",
			cost: new Decimal(2),
			unl: function() { return player.hb.unl },
			currently: function() { return player.sb.points.div(10).plus(1).log10().plus(1) },
			effDisp: function(x) { return format(x.sub(1).times(100))+"% stronger" },
		},
		13: {
			desc: "This layer behaves as if you chose it first.",
			cost: new Decimal(2),
			unl: function() { return player.hb.order>0||(player.ss.upgrades.includes(15))||player.hb.upgrades.includes(13) },
		},
		14: {
			desc: "Unlock 3 new Booster Upgrades.",
			cost: new Decimal(3),
			unl: function() { return (player.hb.upgrades.includes(13) && player.ss.upgrades.includes(15)) || (player.hb.order == player.ss.order) },
		},
	},
	ss: {
		rows: 2,
		cols: 5,
		11: {
			desc: "You get more Space based on your Subspace Energy.",
			cost: new Decimal(1),
			unl: function() { return player.ss.unl },
			currently: function() { return player.ss.points.sqrt().times(150).floor() },
			effDisp: function(x) { return formatWhole(x)+" more Space" },
		},
		12: {
			desc: "You generate Subspace faster based on your Points.",
			cost: new Decimal(2),
			unl: function() { return player.ss.unl },
			currently: function() { return player.points.plus(1).log10().div(1e4).plus(1) },
			effDisp: function(x) { return format(x)+"x" },
		},
		13: {
			desc: "Subspace's third effect is 50% stronger.",
			cost: new Decimal(2),
			unl: function() { return player.ss.unl },
		},
		14: {
			desc: "Super-Boosters are 8.25% cheaper.",
			cost: new Decimal(2),
			unl: function() { return player.hb.unl },
		},
		15: {
			desc: "This layer behaves as if you chose it first.",
			cost: new Decimal(3),
			unl: function() { return player.ss.order>0||(player.hb.upgrades.includes(13))||player.ss.upgrades.includes(15) },
		},
		21: {
			desc: "Unlock 5 new Generator Upgrades.",
			cost: new Decimal(4),
			unl: function() { return (player.hb.upgrades.includes(13) && player.ss.upgrades.includes(15)) || (player.hb.order == player.ss.order) },
		},
		22: {
			desc: "You generate Subspace faster based on its amount.",
			cost: new Decimal(5),
			unl: function() { return player.ss.upgrades.includes(21)&&(player.h.challs.includes(51)||player.h.challs.includes(52)) },
			currently: function() { return player.ss.subspace.plus(1).root(2.25) },
			effDisp: function(x) { return format(x)+"x" },
		},
		23: {
			desc: "???",
			cost: new Decimal(1/0),
			unl: function() { return false },
		},
		24: {
			desc: "???",
			cost: new Decimal(1/0),
			unl: function() { return false },
		},
		25: {
			desc: "???",
			cost: new Decimal(1/0),
			unl: function() { return false },
		},
	},
	l: {
		rows: 1,
		cols: 1,
		11: {
			desc: "This layer behaves as if you chose it first.",
			cost: new Decimal(1/0),
			unl: function() { return player.l.order>0||player.l.upgrades.includes(11) },
		},
	},
	hs: {
		rows: 1,
		cols: 1,
		11: {
			desc: "This layer behaves as if you chose it first.",
			cost: new Decimal(1/0),
			unl: function() { return player.hs.order>0||player.hs.upgrades.includes(11) },
		},
	},
	c: {
		rows: 3,
		cols: 3,
		11: {
			desc: "Life Essence boosts the Time Energy limit.",
			cost: new Decimal(2),
			unl: function() { return player.hs.unl&&player.c.unl },
			currently: function() { return player.l.points.times(5).add(1).sqr() },
			effDisp: function(x) { return format(x)+"x" },
		},
		12: {
			desc: "Quirk Energy and Chromosomes boost the Life Essence gain.",
			cost: new Decimal(1/0),
			unl: function() { return player.c.upgrades.includes(11) },
			currently: function() { return Decimal.pow(2, player.q.energy.add(1).log10().times(player.c.points.div(3).add(1)).sqrt()) },
			effDisp: function(x) { return format(x)+"x" },
		},
		13: {
			desc: "Hindrance Spirit reduces the Chromosome requirement.",
			cost: new Decimal(1/0),
			unl: function() { return player.c.upgrades.includes(12) },
			currently: function() { return Decimal.pow(10, player.h.points.add(1).log10().pow(0.75)) },
			effDisp: function(x) { return format(x)+"x" },
		},
		21: {
			desc: "Enhancers boost the Time Energy production.",
			cost: new Decimal(1/0),
			unl: function() { return player.h.challs.includes(43) },
			currently: function() { return Decimal.pow(2, player.e.enhancers.pow(1.5)) },
			effDisp: function(x) { return format(x)+"x" },
		},
		22: {
			desc: "Subspace boosts the Life Essence gain.",
			cost: new Decimal(1/0),
			unl: function() { return player.c.upgrades.includes(21) },
			currently: function() {
				let exp = player.ss.subspace.add(1).log10().pow(player.ss.subspace.add(1).log10().add(1).log10().add(1))
				if (exp.gte(1e9)) exp = Decimal.pow(1e3, exp.log10().sqrt())
				return Decimal.pow(1.01, exp)
			},
			effDisp: function(x) { return format(x)+"x" },
		},
		23: {
			desc: "Unlock 1 new Hindrance Challenge.",
			cost: new Decimal(1/0),
			unl: function() { return player.c.upgrades.includes(22) },
		},
		31: {
			desc: "???",
			cost: new Decimal(1/0),
			unl: function() { return player.i.unl },
		},
		32: {
			desc: "???",
			cost: new Decimal(1/0),
			unl: function() { return player.c.upgrades.includes(31) },
		},
		33: {
			desc: "???",
			cost: new Decimal(1/0),
			unl: function() { return player.c.upgrades.includes(32) }
		}
	},
	i: {
		rows: 0,
		cols: 0
	}
}

const TAB_REQS = {
	tree: function() { return true },
	options: function() { return true },
	info: function() { return true },
	changelog: function() { return true },
	credits: function() { return true },
	p: function() { return (player.p.unl||player.points.gte(tmp.layerReqs.p))&&layerUnl('p') },
	b: function() { return (player.b.unl||player.points.gte(tmp.layerReqs.b))&&layerUnl('b') },
	g: function() { return (player.g.unl||player.points.gte(tmp.layerReqs.g))&&layerUnl('g') },
	e: function() { return (player.e.unl||player.points.gte(tmp.layerReqs.e))&&layerUnl('e') },
	t: function() { return (player.t.unl||player.points.gte(tmp.layerReqs.t))&&layerUnl('t') },
	s: function() { return (player.s.unl||player.points.gte(tmp.layerReqs.s))&&layerUnl('s') },
	sb: function() { return (player.sb.unl||player.b.points.gte(tmp.layerReqs.sb))&&layerUnl('sb') },
	h: function() { return (player.h.unl||player.t.energy.gte(tmp.layerReqs.h))&&layerUnl('h') },
	q: function() { return (player.q.unl||player.g.power.gte(tmp.layerReqs.q))&&layerUnl('q') },
	hb: function() { return (player.hb.unl||player.sb.points.gte(tmp.layerReqs.hb))&&layerUnl('hb') },
	ss: function() { return (player.ss.unl||player.s.points.gte(tmp.layerReqs.ss))&&layerUnl('ss') },
	l: function() { return (player.l.unl||player.h.points.gte(tmp.layerReqs.l))&&layerUnl('l') },
	hs: function() { return (player.hs.unl||player.ss.points.gte(tmp.layerReqs.hs))&&layerUnl('hs') },
	c: function() { return (player.c.unl||player.q.points.gte(tmp.layerReqs.c))&&layerUnl('c') },
	i: function() { return (player.i.unl||player.ss.subspace.gte(tmp.layerReqs.i))&&layerUnl('i') }
}

const LAYER_AMT_NAMES = {
	p: "points",
	b: "points",
	g: "points",
	t: "points",
	e: "points",
	s: "points",
	sb: "boosters",
	h: "time energy",
	q: "generator power",
	hb: "super-boosters",
	ss: "space energy",
	l: "hindrance spirit",
	hs: "subspace energy",
	c: "quirks",
	i: "subspace"
}

function getLayerAmt(layer) {
	let amt = player.points
	switch(layer) {
		case "sb": 
			return player.b.points;
			break;
		case "h": 
			return player.t.energy;
			break;
		case "q": 
			return player.g.power;
			break;
		case "hb": 
			return player.sb.points;
			break;
		case "ss":
			return player.s.points;
			break;
		case "l":
			return player.h.points;
			break;
		case "hs":
			return player.ss.points;
			break;
		case "c":
			return player.q.points;
			break;
		case "i":
			return player.ss.subspace;
			break;
	}
	return amt
}

function getLayerEffDesc(layer) {
	if (!Object.keys(LAYER_EFFS).includes(layer)) return "???"
	let eff = tmp.layerEffs[layer]
	switch(layer) {
		case "b":
			return "translated to a "+format(eff)+"x multiplier to point gain"
			break;
		case "g":
			return "which are generating "+format(eff)+" Generator Power/sec"
			break;
		case "t":
			return "which are generating "+format(eff.gain)+" Time Energy/sec, but with a limit of "+format(eff.limit)+" Time Energy"
			break;
		case "sb": 
			return "which are multiplying the Booster effect base by "+format(eff)
			break;
		case "h": 
			return "which are providing "+format(eff)+" free extra Time Capsules (boosted by your points)"
			break; 
		case "hb": 
			return "which are multiplying the Super-Booster effect base by "+format(eff)
			break;
		case "ss": 
			return "which are generating "+format(eff)+" Subspace/sec"
			break;
		case "c":
			return "which are raising Life Power to the power of "+format(eff.exp)+" and speeding up the life power buildup by "+format(eff.speed)+"x"
			break;
	}
}

function save() {
	localStorage.setItem("prestige-tree", btoa(JSON.stringify(player)))
}

function load() {
	let get = localStorage.getItem("prestige-tree");
	if (get===null||get===undefined) player = getStartPlayer()
	else player = JSON.parse(atob(get))
	player.tab = "tree"
	offTime.remain = (Date.now()-player.time)/1000
	player.time = Date.now()
	checkForVars();
	convertToDecimal();
	versionCheck();
	updateTemp();
	updateTemp();
	loadVue();
}

function exportSave() {
	let str = btoa(JSON.stringify(player))
	
	const el = document.createElement("textarea");
	el.value = str;
	document.body.appendChild(el);
	el.select();
    el.setSelectionRange(0, 99999);
	document.execCommand("copy");
	document.body.removeChild(el);
}

function importSave(imported=undefined) {
	if (imported===undefined) imported = prompt("Paste your save here")
	try {
		player = JSON.parse(atob(imported))
		save()
		window.location.reload()
	} catch(e) {
		return;
	}
}

function versionCheck() {
	let setVersion = true
	
	if (player.versionType===undefined||player.version===undefined) {
		player.versionType = "alpha"
		player.version = 0
	}
	if (player.versionType=="alpha") {
		if (player.version<10&&player.sb.unl) {
			if (confirm("Since the last time you played, several changes to Super-Booster effects have been made. Would you like to roll back your save to that point in the progression, in order for you to experience the new features properly?")) importSave(SAVES.PRE_SUPER_BOOSTERS)
			setVersion = false;
		}
		player.versionType="beta"
		player.version=1
	}
	if (player.versionType=="beta") {
		if (player.version<=1.1) if (!(player.hb.unl||player.ss.unl)) {
			player.hb.order = 0
			player.ss.order = 0
		}
	}
	
	if (setVersion) {
		player.versionType = getStartPlayer().versionType
		player.version = getStartPlayer().version
	}
}

function checkForVars() {
	var start = getStartPlayer()
	if (player.autosave===undefined) player.autosave = true;
	if (player.b===undefined) player.b = start.b
	if (player.g===undefined) player.g = start.g
	if (player.p.best===undefined) player.p.best = player.p.points
	if (player.b.best===undefined) player.b.best = player.b.points
	if (player.b.auto===undefined) player.b.auto = false
	if (player.g.best===undefined) player.g.best = player.g.points
	if (player.g.auto===undefined) player.g.auto = false
	if (player.e === undefined) player.e = start.e
	if (player.e.order === undefined) player.e.order = 0
	if (player.e.auto===undefined) player.e.auto = false
	if (player.t === undefined) player.t = start.t
	if (player.t.auto===undefined) player.t.auto = false
	if (player.t.autoCap===undefined) player.t.autoCap = false
	if (player.s === undefined) player.s = start.s
	if (player.s.buildings[4] === undefined) player.s.buildings[4] = new Decimal(0);
	if (player.s.buildings[5] === undefined) player.s.buildings[5] = new Decimal(0);
	if (player.s.auto === undefined) player.s.auto = false
	if (player.s.autoBuild === undefined) player.s.autoBuild = false
	if (player.sb === undefined) player.sb = start.sb
	if (player.sb.auto === undefined) player.sb.auto = false
	if (player.timePlayed === undefined) player.timePlayed = 0
	if (player.hasNaN === undefined) player.hasNaN = false
	if (player.h === undefined) player.h = start.h
	if (player.h.active === undefined) player.h.active = 0
	if (player.h.time === undefined) player.h.time = 0
	if (player.q === undefined) player.q = start.q
	if (player.msDisplay === undefined) player.msDisplay = "always"
	if (player.hb === undefined) player.hb = start.hb
	if (player.ss === undefined) player.ss = start.ss
	if (player.l === undefined) player.l = start.l
	if (player.hs === undefined) player.hs = start.hs
	if (player.c === undefined) player.c = start.c
	if (player.i === undefined) player.i = start.i
}

function convertToDecimal() {
	player.points = new Decimal(player.points)
	player.p.points = new Decimal(player.p.points)
	player.p.best = new Decimal(player.p.best)
	player.b.points = new Decimal(player.b.points)
	player.b.best = new Decimal(player.b.best)
	player.g.points = new Decimal(player.g.points)
	player.g.best = new Decimal(player.g.best)
	player.g.power = new Decimal(player.g.power)
	player.e.points = new Decimal(player.e.points)
	player.e.best = new Decimal(player.e.best)
	player.e.enhancers = new Decimal(player.e.enhancers)
	player.t.points = new Decimal(player.t.points)
	player.t.best = new Decimal(player.t.best)
	player.t.energy = new Decimal(player.t.energy)
	player.t.extCapsules = new Decimal(player.t.extCapsules)
	player.s.points = new Decimal(player.s.points)
	player.s.best = new Decimal(player.s.best)
	player.s.spent = new Decimal(player.s.spent)
	for (let i=1;i<=MAX_BUILDINGS;i++) if (player.s.buildings[i] !== undefined) player.s.buildings[i] = new Decimal(player.s.buildings[i])
	player.sb.points = new Decimal(player.sb.points)
	player.sb.best = new Decimal(player.sb.best)
	player.h.points = new Decimal(player.h.points)
	player.h.best = new Decimal(player.h.best)
	player.q.points = new Decimal(player.q.points)
	player.q.best = new Decimal(player.q.best)
	player.q.layers = new Decimal(player.q.layers)
	player.q.energy = new Decimal(player.q.energy)
	player.q.time = new Decimal(player.q.time)
	player.hb.points = new Decimal(player.hb.points)
	player.hb.best = new Decimal(player.hb.best)
	player.ss.points = new Decimal(player.ss.points)
	player.ss.best = new Decimal(player.ss.best)
	player.ss.subspace = new Decimal(player.ss.subspace)
	player.l.points = new Decimal(player.l.points)
	player.l.best = new Decimal(player.l.best)
	player.l.power = new Decimal(player.l.power)
	for (let i=1;i<=5;i++) if (player.l.boosts[i] !== undefined) player.l.boosts[i] = new Decimal(player.l.boosts[i])
	player.hs.points = new Decimal(player.hs.points)
	player.hs.total = new Decimal(player.hs.total)
	for (let i=1;i<=MAX_BUILDINGS;i++) if (player.hs.hyper_upgrades[i] !== undefined) player.hs.hyper_upgrades[i] = new Decimal(player.hs.hyper_upgrades[i])
	player.c.points = new Decimal(player.c.points)
	player.c.best = new Decimal(player.c.best)
	player.i.points = new Decimal(player.i.points)
	player.i.best = new Decimal(player.i.best)
	player.i.progress = new Decimal(player.i.progress)
	player.i.extra_buildings = new Decimal(player.i.extra_buildings)
}

function toggleOpt(name) {
	player[name] = !player[name]
}

function exponentialFormat(num, precision) {
	let e = num.log10().floor()
	let m = num.div(Decimal.pow(10, e))
	return m.toStringWithDecimalPlaces(3)+"e"+e.toStringWithDecimalPlaces(0)
}

function commaFormat(num, precision) {
	if (num === null || num === undefined) return "NaN"
	return num.toStringWithDecimalPlaces(precision).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

function format(decimal, precision=3) {
	decimal = new Decimal(decimal)
	if (isNaN(decimal.sign)||isNaN(decimal.layer)||isNaN(decimal.mag)) {
		player.hasNaN = true;
		return "NaN"
	}
	if (decimal.eq(1/0)) return "Infinity"
	if (decimal.gte("eee1000")) return exponentialFormat(decimal, precision)
	else if (decimal.gte("ee1000")) return "ee"+format(decimal.log10().log10())
	else if (decimal.gte("1e1000")) return decimal.div(Decimal.pow(10, decimal.log10().floor())).toStringWithDecimalPlaces(3)+"e"+format(decimal.log10().floor())
	else if (decimal.gte(1e9)) return exponentialFormat(decimal, precision)
	else if (decimal.gte(1e3)) return commaFormat(decimal, 0)
	else return commaFormat(decimal, precision)
}

function formatWhole(decimal) {
	return format(decimal, 0)
}

function formatTime(s) {
	if (s<60) return format(s)+"s"
	else if (s<3600) return formatWhole(Math.floor(s/60))+"m "+format(s%60)+"s"
	else return formatWhole(Math.floor(s/3600))+"h "+formatWhole(Math.floor(s/60)%60)+"m "+format(s%60)+"s"
}

function fixValue(x) {
	return x || new Decimal(0)
}

function showTab(name) {
	if (!TAB_REQS[name]()) return
	player.tab = name
	if (name=="tree") needCanvasUpdate = true;
}

function canBuyMax(layer) {
	switch(layer) {
		case "b": 
			return player.b.best.gte(15)
			break;
		case "g":
			return player.g.best.gte(15)
			break;
		case "t":
			return player.q.best.gte(2)
			break;
		case "s": 
			return player.q.best.gte(2)
			break;
		case "sb":
			return player.hb.best.gte(1)
			break;
		case "ss":
			return player.i.best.gte(1)
			break;
		case "hb":
			return player.i.best.gte(1)
			break;
		case "c":
			return player.i.best.gte(1)
			break;
	}
	return false;
}

function getLayerReq(layer) {
	let req = LAYER_REQS[layer]
	switch(layer) {
		case "b":
			if (player.g.unl && !player.b.unl) req = req.times(5000)
			break;
		case "g":
			if (player.b.unl && !player.g.unl) req = req.times(5000)
			break;
		case "e": 
			req = req.times(Decimal.pow("1e200", Decimal.pow(player.e.order, 2)))
			break;
		case "t": 
			req = req.times(Decimal.pow("1e200", Decimal.pow(player.t.order, 2)))
			break;
		case "s": 
			req = req.times(Decimal.pow("1e200", Decimal.pow(player.s.order, 2)))
			break;
		case "hb":
			if (player.hb.order>0) req = new Decimal(15)
			break;
		case "ss":
			if (player.ss.order>0) req = new Decimal(45)
			break;
		case "l":
			if (player.l.order>0) req = new Decimal("1e90")
			break;
		case "hs":
			if (player.hs.order>0) req = new Decimal(6)
			break;
	}
	return req
}

function getLayerGainMult(layer) {
	let mult = new Decimal(1)
	switch(layer) {
		case "p":
			if (player.p.upgrades.includes(21)) mult = mult.times(2)
			if (player.p.upgrades.includes(23)) mult = mult.times(LAYER_UPGS.p[23].currently())
			if (player.p.upgrades.includes(31)) mult = mult.times(LAYER_UPGS.p[31].currently())
			if (player.b.upgrades.includes(11)) mult = mult.times(LAYER_UPGS.b[11].currently())
			if (player.g.upgrades.includes(11)) mult = mult.times(LAYER_UPGS.g[11].currently())
			if (player.e.unl) mult = mult.times(tmp.enhEff)
			if (player.e.upgrades.includes(12)&&!(tmp.hcActive?tmp.hcActive[12]:true)) mult = mult.times(LAYER_UPGS.e[12].currently())
			if (player.e.upgrades.includes(13)&&!(tmp.hcActive?tmp.hcActive[12]:true)) mult = mult.times(1e10)
			if (player.e.upgrades.includes(34)&&!(tmp.hcActive?tmp.hcActive[12]:true)) mult = mult.times(1e40)
			if (player.t.unl) mult = mult.times(tmp.timeEff)
			if (player.s.unl && tmp.spaceBuildEff) mult = mult.times(tmp.spaceBuildEff[1])
			if (player.q.upgrades.includes(11)) mult = mult.times(LAYER_UPGS.q[11].currently())
			break;
		case "b": 
			if (player.b.upgrades.includes(23)) mult = mult.div(LAYER_UPGS.b[23].currently())
			if (player.s.unl && tmp.spaceBuildEff) mult = mult.div(tmp.spaceBuildEff[3])
			break;
		case "g":
			if (player.g.upgrades.includes(22)) mult = mult.div(LAYER_UPGS.g[22].currently())
			if (player.s.unl && tmp.spaceBuildEff) mult = mult.div(tmp.spaceBuildEff[3])
			break;
		case "e": 
			if (player.e.upgrades.includes(24)&&!(tmp.hcActive?tmp.hcActive[12]:true)) mult = mult.times(LAYER_UPGS.e[24].currently())
			if (player.h.best.gte(1)) mult = mult.times(100)
			if (player.q.best.gte(1)) mult = mult.times(100)
			if (player.q.upgrades.includes(11)) mult = mult.times(LAYER_UPGS.q[11].currently())
			break;
		case "t":
			if (player.h.challs.includes(21)) mult = mult.div(H_CHALLS[21].currently())
			break;
		case "s":
			if (player.h.challs.includes(21)) mult = mult.div(H_CHALLS[21].currently())
			break;
		case "sb":
			if (player.ss.upgrades.includes(14)) mult = mult.div(1.0825)
			break;
		case "h": 
			if (player.q.upgrades.includes(22)) mult = mult.times(LAYER_UPGS.q[22].currently().h)
			if (player.q.upgrades.includes(34)) mult = mult.times(LAYER_UPGS.q[34].currently())
			if (player.q.upgrades.includes(44)) mult = mult.times(LAYER_UPGS.q[44].currently())
			if (tmp.lbEff) mult = mult.times(tmp.lbEff[2])
			break;
		case "q": 
			if (player.h.challs.includes(12)) mult = mult.times(H_CHALLS[12].currently())
			if (player.q.upgrades.includes(22)) mult = mult.times(LAYER_UPGS.q[22].currently().q)
			if (player.q.upgrades.includes(34)) mult = mult.times(LAYER_UPGS.q[34].currently())
			if (tmp.lbEff) mult = mult.times(tmp.lbEff[2])
			break;
		case "ss":
			if (player.h.challs.includes(13)) mult = mult.div(H_CHALLS[13].currently())
			break;
		case "l":
			if (player.c.upgrades.includes(12)) mult = mult.times(LAYER_UPGS.c[12].currently())
			if (player.c.upgrades.includes(22)) mult = mult.times(LAYER_UPGS.c[22].currently())
			break;
		case "c":
			if (tmp.lbEff) mult = mult.div(tmp.lbEff[3])
			if (player.c.upgrades.includes(13)) mult = mult.div(LAYER_UPGS.c[13].currently())
			break;
		case "hs":
			if (tmp.lbEff && tmp.lbUnl >= 4) mult = mult.times(tmp.lbEff[4])
			break;
	}
	return mult
}

function getGainExp(layer) {
	let exp = new Decimal(1);
	switch(layer) {
		case "p": 
			if (tmp.hcActive ? tmp.hcActive[21] : true) exp = exp.div(100)
			break;
	}
	return exp;
}

function getResetGain(layer) {
	if (LAYER_TYPE[layer]=="static") {
		if ((!canBuyMax(layer)) || tmp.layerAmt[layer].lt(tmp.layerReqs[layer].times(tmp.gainMults[layer]))) return new Decimal(1)
		let gain = tmp.layerAmt[layer].div(tmp.layerReqs[layer]).div(tmp.gainMults[layer]).max(1).log(LAYER_BASE[layer]).pow(Decimal.pow(LAYER_EXP[layer], -1))
		if (gain.gte(12)) gain = gain.times(12).sqrt()
		if (gain.gte(1225)) gain = gain.times(Decimal.pow(1225, 9)).pow(0.1)
		return gain.floor().sub(player[layer].points).plus(1).max(1);
	}
	if (tmp.layerAmt[layer].lt(tmp.layerReqs[layer])) return new Decimal(0)
	let gain = tmp.layerAmt[layer].div(tmp.layerReqs[layer]).pow(LAYER_EXP[layer]).times(tmp.gainMults[layer]).pow(getGainExp(layer))
	return gain.floor().max(0);
}

function getNextAt(layer) {
	if (LAYER_TYPE[layer]=="static") {
		let amt = player[layer].points
		if (amt.gte(1225)) amt = amt.pow(10).div(Decimal.pow(1225, 9))
		if (amt.gte(12)) amt = amt.pow(2).div(12)
		let extraCost = Decimal.pow(LAYER_BASE[layer], amt.pow(LAYER_EXP[layer])).times(tmp.gainMults[layer])
		let cost = tmp.layerReqs[layer].times(extraCost.max(1))
		if (LAYER_RES_CEIL.includes(layer)) cost = cost.ceil()
		return cost;
	} else {
		let next = tmp.resetGain[layer].plus(1).root(getGainExp(layer)).div(tmp.gainMults[layer]).root(LAYER_EXP[layer]).times(tmp.layerReqs[layer]).max(tmp.layerReqs[layer])
		if (LAYER_RES_CEIL.includes(layer)) next = next.ceil()
		return next;
	}
}

function layerUnl(layer) {
	switch(layer) {
		case "p":
			return true;
			break;
		case "b":
			return player.p.unl;
			break;
		case "g":
			return player.p.unl;
			break;
		case "e":
			return player.b.unl&&player.g.unl;
			break;
		case "t":
			return player.b.unl;
			break;
		case "s":
			return player.g.unl;
			break;
		case "sb":
			return player.e.unl&&player.t.unl&&player.s.unl;
			break;
		case "h": 
			return player.t.unl&&player.sb.unl
			break;
		case "q": 
			return player.e.unl&&player.sb.unl
			break;
		case "hb": 
			return player.sb.unl&&player.h.unl&&player.q.unl
			break;
		case "ss": 
			return player.s.unl&&player.h.unl&&player.q.unl
			break;
		case "l": 
			return player.hb.unl&&player.ss.unl
			break;
		case "hs": 
			return player.hb.unl&&player.ss.unl
			break;
		case "c": 
			return player.l.unl
			break;
		case "i": 
			return player.h.challs.includes(53)
			break;
	}
}

function rowReset(row, layer) {
	let prev = JSON.parse(JSON.stringify(player)) // Deep Copy
	let start = getStartPlayer()
	let keepUpgrades = player.l.best.max(player.hs.total).gte(1) && LAYER_ROW[layer] < 5
	let resetSpace = tmp.hcActive[13] || tmp.hcActive[33]
	switch(row) {
		case 0: 
			player.points = new Decimal(0);
			break;
		case 1: 
			player.points = new Decimal(10);
			player.p.points = new Decimal(0);
			if ((LAYER_ROW[layer]>=3 && player.h.best.gte(10)) || keepUpgrades) player.p.upgrades = prev.p.upgrades;
			else if ((player.h.best.lt(1)&&player.q.best.lt(1))||LAYER_ROW[layer]>=3) {
				if (layer=="b"||layer=="g") {
					if (player[layer].best.lt(8)) player.p.upgrades = [];
				} else if (layer=="t"||layer=="s"||layer=="sb") {
					if (player[layer].best.lt(3)) player.p.upgrades = [];
				} else if (layer=="e") {
					if (player[layer].best.lt(10)) player.p.upgrades = [];
				} else player.p.upgrades = [];
			}
			player.g.power = new Decimal(0);
			break;
		case 2: 
			player.b.points = new Decimal(0);
			if (!player.l.best.max(player.hs.total).gte(1)) player.b.best = new Decimal(0);
			if (!player.t.best.gte(4) && !keepUpgrades) player.b.upgrades = [];
			player.g.points = new Decimal(0);
			player.g.power = new Decimal(0);
			if (!player.l.best.max(player.hs.total).gte(1)) player.g.best = new Decimal(0);
			if (!player.s.best.gte(4) && !keepUpgrades) player.g.upgrades = [];
			player.t.energy = new Decimal(0);
			if (layer=="t"||layer=="e"||layer=="s") {
				if (player[layer].best.gte(2)) {
					player.b.best = new Decimal(prev.b.best)
					player.g.best = new Decimal(prev.g.best)
				}
			} else if (player.sb.best.gte(4)&&layer=="sb") {
				player.b.best = new Decimal(prev.b.best)
				player.g.best = new Decimal(prev.g.best)
			}
			break;
		case 3: 
			player.t.points = new Decimal(0);
			player.t.order = 0
			if (player.h.best.lt(2)) player.t.best = new Decimal(0);
			if (player.h.best.lt(4) && !keepUpgrades) player.t.upgrades = [];
			player.t.extCapsules = new Decimal(0);
			player.e.order = 0
			player.e.points = new Decimal(0);
			if (player.h.best.lt(2)) player.e.best = new Decimal(0);
			player.e.enhancers = new Decimal(0);
			if (player.h.best.lt(4) && !keepUpgrades) player.e.upgrades = [];
			player.s = {
				unl: player.s.unl,
				order: 0,
				points: new Decimal(0),
				best: player.h.best.gte(2) && !resetSpace ? player.s.best : new Decimal(0),
				spent: player.q.best.gte(4) && !resetSpace ? player.s.spent : new Decimal(0),
				buildings: player.q.best.gte(4) && !resetSpace ? tmp.sbLvls : ({
					1: new Decimal(0),
					2: new Decimal(0),
					3: new Decimal(0),
					4: new Decimal(0),
					5: new Decimal(0)
				}),
				upgrades: (player.h.best.gte(4) || keepUpgrades) && !resetSpace ? player.s.upgrades : [],
				auto: player.s.auto,
				autoBuild: player.s.autoBuild,
			}
			player.sb = {
				unl: player.sb.unl,
				auto: player.sb.auto,
				order: 0,
				points: new Decimal(0),
				best: player.h.best.gte(2) ? player.sb.best : new Decimal(0),
				upgrades: player.h.best.gte(10) || keepUpgrades ? player.sb.upgrades : [],
			}
			player.h.time = 0
			player.q.time = new Decimal(0);
			player.q.energy = new Decimal(0);
			break;
		case 4: 
			player.h = start.h
			player.q = start.q
			player.hb = start.hb
			player.ss = start.ss

			player.h.unl = prev.h.unl
			player.q.unl = prev.q.unl
			player.hb.unl = prev.hb.unl
			player.ss.unl = prev.ss.unl

			player.q.auto = prev.q.auto
			player.hb.auto = prev.hb.auto
			player.ss.auto = prev.ss.auto

			if (player.l.best.max(player.hs.total).gte(2)) {
				player.h.best = new Decimal(prev.h.best)
				player.q.best = new Decimal(prev.q.best)
				player.hb.best = new Decimal(prev.hb.best)
				player.ss.best = new Decimal(prev.ss.best)
			}
			if (player.l.best.max(player.hs.total).gte(3)) player.h.challs = prev.h.challs
			if (player.l.best.gte(10) || player.hs.total.gte(13)) {
				player.h.upgrades = prev.h.upgrades
				player.q.upgrades = prev.q.upgrades
				player.hb.upgrades = prev.hb.upgrades
				player.ss.upgrades = prev.ss.upgrades
			}

			player.l.power = new Decimal(0)
			break;
		case 5: 
			player.l = start.l
			player.hs = start.hs
			player.c = start.c
			player.i = start.i
			break;
	}
	delete prev
	delete start
}

function doReset(layer, force=false) {
	if (!force) {
		if (tmp.layerAmt[layer].lt(tmp.layerReqs[layer])) return;
		var layer_data = player[layer]
		let gain = tmp.resetGain[layer]
		if (LAYER_TYPE[layer]=="static") {
			if (tmp.layerAmt[layer].lt(tmp.nextAt[layer])) return;
			layer_data.points = layer_data.points.plus(canBuyMax(layer)?gain:1)
		} else layer_data.points = layer_data.points.plus(gain)
		if (layer_data.best !== undefined) layer_data.best = layer_data.best.max(layer_data.points)
		if (layer_data.total !== undefined) layer_data.total = layer_data.total.add(gain)
	
		if (!layer_data.unl) {
			layer_data.unl = true;
			needCanvasUpdate = true;
			
			let layers = ROW_LAYERS[LAYER_ROW[layer]]
			for (let i in layers) if (!player[layers[i]].unl && player[layers[i]]!==undefined) player[layers[i]].order += ORDER_UP[LAYER_ROW[layer]].includes(layer)?1:0
		}
		
		tmp.layerAmt[layer] = new Decimal(0) // quick fix
	}

	if ((layer=="b"&&player.t.best.gte(12))||(layer=="g"&&player.s.best.gte(12))) return;
	if ((layer=="t"&&player.h.best.gte(25))||(layer=="s"&&player.q.best.gte(25)&&!tmp.hcActive[33])||(layer=="sb"&&player.h.best.gte(2500))) return;
	let row = LAYER_ROW[layer]
	if (!force&&row==3&&player.hs.total.gte(89)) return
	if (row==0) rowReset(0, layer)
	else for (let x=row;x>=1;x--) rowReset(x, layer)

	updateTemp()
	delete layer_data
}

function buyUpg(layer, id) {
	if (!player[layer].unl) return
	if (!LAYER_UPGS[layer][id].unl()) return
	if (player[layer].upgrades.includes(id)) return
	if (player[layer].points.lt(LAYER_UPGS[layer][id].cost)) return
	player[layer].points = player[layer].points.sub(LAYER_UPGS[layer][id].cost)
	player[layer].upgrades.push(id);
	if (layer=="t"&&id==32) player.t.order = 0;
	if (layer=="e"&&(id==22||id==23)) {
		player.e.order = 0;
		if (!player.e.upgrades.includes(22)) player.e.upgrades.push(22)
		if (!player.e.upgrades.includes(23)) player.e.upgrades.push(23)
	}
	if (layer=="s"&&id==33) player.s.order = 0;
	if (layer=="hb"&&id==13) player.hb.order = 0;
	if (layer=="ss"&&id==15) player.ss.order = 0;
	if (layer=="l"&&id==11) player.l.order = 0;
	if (layer=="hs"&&id==11) player.hs.order = 0;
}

function getPointGen() {
	let gain = new Decimal(1)
	if (player.p.upgrades.includes(12)) gain = gain.times(LAYER_UPGS.p[12].currently())
	if (player.p.upgrades.includes(13)) gain = gain.times(LAYER_UPGS.p[13].currently())
	if (player.p.upgrades.includes(22)) gain = gain.times(LAYER_UPGS.p[22].currently())
	if (player.b.unl) gain = gain.times(tmp.layerEffs.b)
	if (player.g.unl) gain = gain.times(tmp.genPowEff)
	if (player.t.unl) gain = gain.times(tmp.timeEff)
	if (player.s.unl && tmp.spaceBuildEff) gain = gain.times(tmp.spaceBuildEff[1])
	if (player.q.unl && tmp.quirkEff) gain = gain.times(tmp.quirkEff)
	if (player.q.upgrades.includes(11)) gain = gain.times(LAYER_UPGS.q[11].currently())
	
	if (tmp.hcActive && tmp.hcActive[33]) gain = gain.root(player.s.points.div(10).add(1))
	else if (tmp.hcActive && tmp.hcActive[31]) gain = gain.tetrate(0.1)
	return gain
}

function addToBoosterBase() {
	let toAdd = new Decimal(0)
	if (player.b.upgrades.includes(12)) toAdd = toAdd.plus(LAYER_UPGS.b[12].currently())
	if (player.b.upgrades.includes(13)) toAdd = toAdd.plus(LAYER_UPGS.b[13].currently())
	if (player.t.upgrades.includes(11)&&!(tmp.hcActive?tmp.hcActive[12]:true)) toAdd = toAdd.plus(LAYER_UPGS.t[11].currently())
	if (player.t.upgrades.includes(31)&&!(tmp.hcActive?tmp.hcActive[12]:true)) toAdd = toAdd.plus(25)
	if (player.t.upgrades.includes(33)&&!(tmp.hcActive?tmp.hcActive[12]:true)) toAdd = toAdd.plus(40)
	if (player.e.unl) toAdd = toAdd.plus(tmp.enhEff2)
	if (player.e.upgrades.includes(11)&&!(tmp.hcActive?tmp.hcActive[12]:true)) toAdd = toAdd.plus(LAYER_UPGS.e[11].currently().b)
	if (player.s.unl && tmp.spaceBuildEff) toAdd = toAdd.plus(tmp.spaceBuildEff[2])
	if (player.sb.upgrades.includes(21)) toAdd = toAdd.plus(LAYER_UPGS.sb[21].currently())
	
	if (player.b.upgrades.includes(31)) toAdd = toAdd.times(LAYER_UPGS.b[31].currently())
	if (player.sb.unl) toAdd = toAdd.times(tmp.layerEffs.sb)
	return toAdd
}

function getFreeBoosters() {
	let free = new Decimal(0)
	if (player.t.upgrades.includes(24)&&!(tmp.hcActive?tmp.hcActive[12]:true)) free = free.plus(18)
	if (player.b.upgrades.includes(32)) free = free.plus(LAYER_UPGS.b[32].currently())
	if (player.b.upgrades.includes(33)) free = free.plus(100)
	return free
}

function addToGenBase() {
	let toAdd = new Decimal(0)
	if (player.g.upgrades.includes(12)) toAdd = toAdd.plus(LAYER_UPGS.g[12].currently())
	if (player.g.upgrades.includes(13)) toAdd = toAdd.plus(LAYER_UPGS.g[13].currently())
	if (player.g.upgrades.includes(33)) toAdd = toAdd.plus(LAYER_UPGS.g[33].currently())
	if (player.e.unl) toAdd = toAdd.plus(tmp.enhEff2)
	if (player.e.upgrades.includes(11)&&!(tmp.hcActive?tmp.hcActive[12]:true)) toAdd = toAdd.plus(LAYER_UPGS.e[11].currently().g)
	if (player.s.unl && tmp.spaceBuildEff) toAdd = toAdd.plus(tmp.spaceBuildEff[2])
	if (player.h.challs.includes(51)) toAdd = toAdd.times(H_CHALLS[51].currently())
	if (tmp.totalHsBoosts !== undefined) toAdd = toAdd.times(tmp.totalHsBoosts.gen)
	return toAdd
}

function getGenPow() {
	let pow = new Decimal(1)
	if (player.g.upgrades.includes(34)) pow = pow.times(LAYER_UPGS.g[34].currently())
	return pow
}

function getGenPowerGainMult() {
	let mult = new Decimal(1)
	if (player.g.upgrades.includes(21)) mult = mult.times(LAYER_UPGS.g[21].currently())
	if (player.g.upgrades.includes(25)) mult = mult.times(LAYER_UPGS.g[25].currently())
	if (player.e.upgrades.includes(35)&&!(tmp.hcActive?tmp.hcActive[12]:true)) mult = mult.times(LAYER_UPGS.e[35].currently())
	if (player.s.upgrades.includes(12)&&!(tmp.hcActive?tmp.hcActive[12]:true)) mult = mult.times(LAYER_UPGS.s[12].currently())
	if (player.s.upgrades.includes(13)&&!(tmp.hcActive?tmp.hcActive[12]:true)) mult = mult.times(LAYER_UPGS.s[13].currently())
	if (player.q.unl && tmp.quirkEff) mult = mult.times(tmp.quirkEff)
	if (player.g.upgrades.includes(35)) mult = mult.times(LAYER_UPGS.g[35].currently())
	return mult
}

function getGenPowerEffExp() {
	let exp = new Decimal(1/3)
	if (player.s.upgrades.includes(34)&&!(tmp.hcActive?tmp.hcActive[12]:true)) exp = exp.plus(LAYER_UPGS.s[34].currently())
	if (player.b.upgrades.includes(21)) exp = exp.times(2)
	if (player.b.upgrades.includes(22)) exp = exp.times(1.2)
	if (player.e.upgrades.includes(21)&&!(tmp.hcActive?tmp.hcActive[12]:true)) exp = exp.times(1.15)
	if (player.h.challs.includes(11)) exp = exp.times(1.25)
	if (player.h.challs.includes(42)) exp = exp.times(3)
	return exp;
}

function getGenPowerEff() {
	if (tmp.hcActive ? tmp.hcActive[11] : true) return new Decimal(1)
	let eff = player.g.power.plus(1).pow(getGenPowerEffExp());
	return eff
}

function resetRow(row) {
	if (prompt('Are you sure you want to reset this row? It is highly recommended that you wait until the end of your current run before doing this! Type "I WANT TO RESET THIS" to confirm')!="I WANT TO RESET THIS") return
	let pre_layers = ROW_LAYERS[row-1]
	let layers = ROW_LAYERS[row]
	let post_layers = ROW_LAYERS[row+1]
	rowReset(row+1, post_layers[0])
	doReset(pre_layers[0], true)
	for (let layer in layers) {
		player[layers[layer]].unl = false
		if (player[layers[layer]].order) player[layers[layer]].order = 0
	}
	updateTemp();
	resizeCanvas();
}

function getEnhancerPow() {
	if (tmp.hcActive ? tmp.hcActive[22] : true) return new Decimal(0);
	if (tmp.hcActive ? tmp.hcActive[41] : true) return new Decimal(0);
	let pow = new Decimal(1)
	if (player.e.upgrades.includes(25)&&!(tmp.hcActive?tmp.hcActive[12]:true)) pow = pow.times(LAYER_UPGS.e[25].currently())
	if (player.e.upgrades.includes(31)&&!(tmp.hcActive?tmp.hcActive[12]:true)) pow = pow.times(LAYER_UPGS.e[31].currently())
	if (player.h.challs.includes(31)) pow = pow.times(2)
	if (player.q.upgrades.includes(42)) pow = pow.times(1.4)
	return pow
}

function getEnhancerEff() {
	if (!player.e.unl) return new Decimal(1)
	let e = player.e.enhancers.sub(tmp.subbedEnh).times(tmp.enhPow)
	let eff;
	if (e.gte(0)) eff = Decimal.pow(25, e.pow(1.1))
	else eff = Decimal.pow(1/25, e.times(-1).pow(1.1))
	return eff
}

function getEnhancerEff2() {
	if (!player.e.unl) return new Decimal(0)
	let e = player.e.enhancers.sub(tmp.subbedEnh).times(tmp.enhPow)
	let eff;
	if (e.gte(0)) eff = e.pow(0.8)
	else eff = e.times(-1).pow(0.8).times(-1)
	return eff;
}

function getEnhancerCost() {
	let e = player.e.enhancers
	if (e.gte(25)) e = e.pow(2).div(25)
	let cost = Decimal.pow(2, e.pow(1.5))
	return cost.floor()
}

function buyEnhancer() {
	let cost = getEnhancerCost()
	if (player.e.points.lt(cost)) return
	player.e.points = player.e.points.sub(cost)
	player.e.enhancers = player.e.enhancers.plus(1)
}

function maxEnhancers() {
	let target = player.e.points.max(1).log(2).root(1.5)
	if (target.gte(25)) target = target.times(25).sqrt()
	target = target.plus(1).floor()
	if (target.lte(player.e.enhancers)) return
	player.e.enhancers = player.e.enhancers.max(target)
}

function getFreeExtCapsules() {
	let amt = new Decimal(0)
	if (player.t.upgrades.includes(12)&&!(tmp.hcActive?tmp.hcActive[12]:true)) amt = amt.plus(1)
	if (player.h.unl) amt = amt.plus(tmp.layerEffs.h)
	return amt
}

function getCapPow() {
	if (tmp.hcActive ? tmp.hcActive[41] : true) return new Decimal(0)
	let pow = new Decimal(1)
	if (player.q.upgrades.includes(33)) pow = pow.times(LAYER_UPGS.q[33].currently())
	return pow
}

function getFreeExtPow() {
	if (tmp.hcActive ? tmp.hcActive[22] : true) return new Decimal(0)
	let pow = new Decimal(1)
	return pow
}

function getTimeEnergyEff() {
	if (!player.t.unl) return new Decimal(1)
	let exp = 1.2
	if (player.t.upgrades.includes(21)&&!(tmp.hcActive?tmp.hcActive[12]:true)) exp = 1.75
	let eff = player.t.energy.plus(1).pow(exp)
	return eff;
}

function getTimeEnergyGainMult() {
	if (!player.t.unl) return new Decimal(1)
	let mult = new Decimal(1);
	if (!(tmp.hcActive?tmp.hcActive[12]:true)) {
		if (player.t.upgrades.includes(21)) mult = mult.times(LAYER_UPGS.t[21].currently())
		if (player.t.upgrades.includes(22)) mult = mult.times(LAYER_UPGS.t[22].currently())
		if (player.t.upgrades.includes(23)) mult = mult.times(LAYER_UPGS.t[23].currently())
		if (player.t.upgrades.includes(34)) mult = mult.times(LAYER_UPGS.t[34].currently())
		if (player.c.upgrades.includes(21)) mult = mult.times(LAYER_UPGS.c[21].currently())
	}
	return mult;
}

function getTimeEnergyLimitMult() {
	if (!player.t.unl) return new Decimal(1)
	let mult = new Decimal(1);
	if (player.t.upgrades.includes(12)&&!(tmp.hcActive?tmp.hcActive[12]:true)) mult = mult.times(LAYER_UPGS.t[12].currently())
	if (player.t.upgrades.includes(21)&&!(tmp.hcActive?tmp.hcActive[12]:true)) mult = mult.times(LAYER_UPGS.t[21].currently())
	if (player.t.upgrades.includes(22)&&!(tmp.hcActive?tmp.hcActive[12]:true)) mult = mult.times(LAYER_UPGS.t[22].currently())
	if (player.t.upgrades.includes(23)&&!(tmp.hcActive?tmp.hcActive[12]:true)) mult = mult.times(LAYER_UPGS.t[23].currently())
	if (player.t.upgrades.includes(34)&&!(tmp.hcActive?tmp.hcActive[12]:true)) mult = mult.times(LAYER_UPGS.t[34].currently())
	if (player.q.upgrades.includes(23)) mult = mult.times(1e10)
	if (player.q.upgrades.includes(24)) mult = mult.times(LAYER_UPGS.q[24].currently())
	if (player.c.upgrades.includes(11)) mult = mult.times(LAYER_UPGS.c[11].currently())
	return mult;
}

function getExtCapsuleCost() {
	let amt = player.t.extCapsules
	if (amt.gte(25)) amt = amt.pow(2).div(25)
	let cost = amt.times(0.4).pow(1.2).plus(1).times(10)
	return cost.floor()
}

function buyExtCapsule() {
	if (!player.t.unl) return
	let cost = getExtCapsuleCost()
	if (player.b.points.lt(cost)) return
	player.b.points = player.b.points.sub(cost)
	player.t.extCapsules = player.t.extCapsules.plus(1)
}

function maxExtTimeCapsules() {
	let target = player.b.points.plus(1).div(10).sub(1).root(1.2).div(0.4)
	if (target.gte(25)) target = target.times(25).sqrt()
	target = target.plus(1).floor().max(0)
	player.t.extCapsules = player.t.extCapsules.max(target)
}

let MAX_BUILDINGS = 10

function getSpace() {
	let baseSpace = player.s.best.pow(1.1).times(3).floor()
	if (player.s.upgrades.includes(13)&&!(tmp.hcActive?tmp.hcActive[12]:true)) baseSpace = baseSpace.plus(2);
	if (player.s.upgrades.includes(24)&&!(tmp.hcActive?tmp.hcActive[12]:true)) baseSpace = baseSpace.plus(3);
	if (player.ss.unl) baseSpace = baseSpace.plus(tmp.ssEff1)
	if (player.ss.upgrades.includes(11)) baseSpace = baseSpace.plus(LAYER_UPGS.ss[11].currently())
	if (tmp.totalHsBoosts !== undefined) baseSpace = baseSpace.add(tmp.totalHsBoosts.free)
	return baseSpace.sub(player.s.spent).max(0)
}

function getSpaceBuildingCostMod() {
	let mod = new Decimal(1)
	if (player.s.upgrades.includes(24)&&!(tmp.hcActive?tmp.hcActive[12]:true)) mod = new Decimal(0.5)
	return mod;
}

function getSpaceBuildingCostMult() {
	let mult = new Decimal(1)
	if (player.ss.unl) mult = mult.div(tmp.ssEff2)
	return mult
}

function getSpaceBuildingCost(x) {
	let inputVal = new Decimal([1e3,1e10,1e25,1e48,1e100][x-1])
	let bought = fixValue(tmp.sbLvls[x])
	if (bought.gte(100)) bought = bought.pow(2).div(100)
	let cost = Decimal.pow(inputVal, bought.times(getSpaceBuildingCostMod()).pow(1.35)).times(inputVal).times((bought.gt(0)||x>1)?1:0).times(getSpaceBuildingCostMult())
	return cost
}

function getSpaceBuildingTarg(x) {
	let inputVal = new Decimal([1e3,1e10,1e25,1e48,1e100][x-1])
	let target = player.g.power.div(getSpaceBuildingCostMult()).div(inputVal).max(1).log(inputVal).pow(1/1.35).div(getSpaceBuildingCostMod())
	if (target.gte(100)) target = target.times(100).sqrt()
	return target.plus(1).floor()
}

function getSpaceBuildingPow(x) {
	if (!player.s.unl) return new Decimal(0)
	if (tmp.hcActive ? tmp.hcActive[22] : true) return new Decimal(0)
	if (tmp.hcActive ? tmp.hcActive[41] : true) return new Decimal(0)
	let pow = new Decimal(1)
	if (player.s.upgrades.includes(21)&&!(tmp.hcActive?tmp.hcActive[12]:true)) pow = pow.times(LAYER_UPGS.s[21].currently())
	if (player.s.upgrades.includes(22)&&!(tmp.hcActive?tmp.hcActive[12]:true)) pow = pow.times(LAYER_UPGS.s[22].currently())
	if (player.s.upgrades.includes(23)&&!(tmp.hcActive?tmp.hcActive[12]:true)) pow = pow.times(LAYER_UPGS.s[23].currently())
	if (player.q.upgrades.includes(41)) pow = pow.times(1.4)
	if (player.ss.unl) pow = pow.times(tmp.ssEff3)
	return pow
}

function getExtraBuildingLevels(x) {
	let lvl = new Decimal(0)
	if (player.s.upgrades.includes(11)&&!(tmp.hcActive?tmp.hcActive[12]:true)) lvl = lvl.plus(1);
	if (player.s.upgrades.includes(14)&&!(tmp.hcActive?tmp.hcActive[12]:true)) lvl = lvl.plus(1);
	if (player.q.upgrades.includes(31)) lvl = lvl.plus(1);
	if (x<5) lvl = lvl.plus(tmp.spaceBuildEff[5])
	return lvl
}

function getSpaceBuildingEff(x) {
	let bought = tmp.sbLvls[x].add(getExtraBuildingLevels(x))
	if (!player.s.unl) bought = new Decimal(0);
	if (tmp.trueSbUnl<x) bought = new Decimal(0);
	let power = getSpaceBuildingPow(x)
	bought = bought.times(power)

	if (tmp.hcActive[13] && x < 5) bought = bought.pow(0.75)
	if (player.i.unl) bought = bought.times(getSpaceBuildingCondensedPow(x))
	if (player.hs.unl && tmp.huBoost) {
		var hu_power = getHyperUpgradePower(x)
		var hu_boost = HYPER_UPGRADE_EFFS[x] ? HYPER_UPGRADE_EFFS[x](bought, hu_power) : new Decimal(1)

		bought = bought.times(hu_boost)
		tmp.huPower[x] = hu_power
		tmp.huBoost[x] = hu_boost
	}

	switch(x) {
		case 1: 
			return Decimal.pow(Decimal.add(1, bought.pow((player.s.upgrades.includes(31)&&!(tmp.hcActive?tmp.hcActive[12]:true))?2.75:1)), player.s.points.sqrt()).times(Decimal.mul(4, bought.pow((player.s.upgrades.includes(31)&&!(tmp.hcActive?tmp.hcActive[12]:true))?2.75:1))).max(1)
			break;
		case 2: 
			return bought.sqrt()
			break;
		case 3: 
			return Decimal.pow(1e18, bought.pow(0.9))
			break;
		case 4: 
			return bought.plus(1).pow(1.25)
			break;
		case 5: 
			return bought.sqrt().times(2)
			break;
		case 6: 
			return bought.sqrt()
			break;
	}
	return bought
}

function getSpaceBuildingEffDesc(x) {
	let eff = tmp.spaceBuildEff[x]
	switch(x) {
		case 1: 
			return "Space Energy boosts Point gain & Prestige Point gain ("+format(eff)+"x)"
			break;
		case 2: 
			return "Adds to base of Booster/Generator effects by "+format(eff)
			break;
		case 3: 
			return "Makes Boosters/Generators cheaper by "+format(eff)+"x"
			break;
		case 4: 
			return "Booster Upgrade 6's effect is raised to the power of "+format(eff)
			break;
		case 5: 
			return "Add "+format(eff)+" free levels to all previous Space Buildings."
			break;
		case 6: 
			return "Reduce the cost scaling of Quirk Layers by " + format(eff) + "x"
			break;
		case 7: 
			return "???"
			break;
		case 8: 
			return "???"
			break;
		case 9: 
			return "???"
			break;
		case 10: 
			return "???"
			break;
	}
}

function buyBuilding(x) {
	if (!player.s.unl) return
	if (tmp.trueSbUnl<x) return
	if (getSpace().lt(1)) return
	let cost = getSpaceBuildingCost(x)
	if (player.g.power.lt(cost)) return
	player.g.power = player.g.power.sub(cost)
	player.s.spent = player.s.spent.plus(1)
	player.s.buildings[x] = tmp.sbLvls[x].plus(1)
}

function maxSpaceBuilding(x) {
	if (!player.s.unl) return
	if (tmp.trueSbUnl<x) return
	let space = getSpace()
	if (space.lt(1)) return
	let target = getSpaceBuildingTarg(x)
	let bulk = target.sub(tmp.sbLvls[x]).min(space)
	if (bulk.lt(1)) return
	player.s.spent = player.s.spent.plus(bulk)
	player.s.buildings[x] = tmp.sbLvls[x].plus(bulk)
}

function destroyBuilding(x, all=false) {
	if (!player.s.unl) return
	if (tmp.trueSbUnl<x) return
	let lvl = tmp.sbLvls[x]
	if (lvl.lt(1)) return
	if (player.q.best.lt(2500)) return
	player.s.spent = player.s.spent.sub(all?lvl:1)
	player.s.buildings[x] = all?new Decimal(0):lvl.sub(1)
	if (player.s.buildings[x].eq(0) && x > 5) delete player.s.buildings[x]
}

function respecSpaceBuildings() {
	if (!player.s.unl) return;
	if (!confirm("Are you sure you want to reset your Space Buildings? This will force you to do a Space reset as well!")) return
	for (let i=1;i<=5;i++) player.s.buildings[i] = new Decimal(0)
	for (let i=6;i<=MAX_BUILDINGS;i++) delete player.s.buildings[i]
	player.s.spent = new Decimal(0)
	doReset("s", true)
}

function getSpaceBuildingsUnl() {
	let x = 3
	if (player.s.upgrades.includes(14)&&!(tmp.hcActive?tmp.hcActive[12]:true)) x++;
	if (player.s.upgrades.includes(32)&&!(tmp.hcActive?tmp.hcActive[12]:true)) x++;
	if (player.h.challs.includes(23)) x = 6
	if (player.i.unl) x = player.i.extra_buildings.add(x)
	return new Decimal(x)
}

function getSpaceBuildingCondensedPow(x) {
	return Decimal.sub(tmp.sbUnl || 0, x - 1).div(MAX_BUILDINGS).ceil().max(1)
}

function toggleAuto(layer, end="") {
	player[layer]["auto"+end] = !player[layer]["auto"+end]
}

function getSuperBoosterPow() {
	if (tmp.hcActive ? tmp.hcActive[41] : true) return new Decimal(0)
	let pow = new Decimal(1)
	if (player.sb.upgrades.includes(11)&&!(tmp.hcActive?tmp.hcActive[12]:true)) pow = pow.times(LAYER_UPGS.sb[11].currently())
	if (player.sb.upgrades.includes(12)&&!(tmp.hcActive?tmp.hcActive[12]:true)) pow = pow.times(LAYER_UPGS.sb[12].currently())
	if (player.hb.upgrades.includes(11)) pow = pow.times(LAYER_UPGS.hb[11].currently())
	return pow;
}

function addToSBBase() {
	let toAdd = new Decimal(0)
	if (player.h.challs.includes(22)) toAdd = toAdd.plus(0.25)
	if (player.h.challs.includes(41)) toAdd = toAdd.plus(0.25)
	if (player.sb.upgrades.includes(22)) toAdd = toAdd.plus(LAYER_UPGS.sb[22].currently())
	if (player.hb.unl) toAdd = toAdd.times(tmp.layerEffs.hb)
	return toAdd
}

function getQuirkLayerCost() {
	let speed = new Decimal(1)
	if (tmp.spaceBuildEff && tmp.trueSbUnl >= 6) speed = tmp.spaceBuildEff[6].pow(-1)

	let cost = Decimal.pow(2, Decimal.pow(2, player.q.layers.times(speed))).sub(1)
	return cost.max(1);
}

function getQuirkLayerMult() {
	if (tmp.hcActive[23]) return new Decimal(0)
	let mult = new Decimal(1)
	if (player.q.upgrades.includes(13)) mult = mult.times(2)
	if (player.q.upgrades.includes(14)) mult = mult.times(3)
	if (player.q.upgrades.includes(21)) mult = mult.times(LAYER_UPGS.q[21].currently())
	if (player.h.challs.includes(52)) mult = mult.times(H_CHALLS[52].currently())
	return mult
}

function getQuirkEnergyGainExp() {
	let ret = tmp.totalQuirkLayers.sub(1)
	return ret
}

function getQuirkEnergyEff() {
	let eff = player.q.energy.plus(1).pow(2)
	if (player.q.upgrades.includes(12)) {
		let mod = player.q.energy.plus(1).log10().plus(1).log10().plus(1)
		if (mod.gte(2)) {
			eff = eff.times(mod.div(2).pow(10))
			mod = new Decimal(2)
		}
		eff = eff.pow(mod)
	}
	if (player.q.upgrades.includes(32)) eff = eff.pow(2)
	return eff;
}

function buyQuirkLayer() {
	if (!player.q.unl) return
	let cost = getQuirkLayerCost()
	if (player.q.points.lt(cost)) return
	player.q.points = player.q.points.sub(cost)
	player.q.layers = player.q.layers.plus(1)
}

function maxQuirkLayers() {
	let speed = new Decimal(1)
	if (tmp.spaceBuildEff && tmp.trueSbUnl >= 5) speed = tmp.spaceBuildEff[6].pow(-1)

	let target = player.q.points.add(1).log(2).log(2).add(1).div(speed).floor()
	if (target.lte(player.q.layers)) return
	player.q.layers = player.q.layers.max(target)
}

function getTotalQuirkLayers() {
	let ret = player.q.layers
	if (tmp.lbEff) ret = ret.add(tmp.lbEff[1])
	return ret
}

const H_CHALLS = {
	rows: 5,
	cols: 3,
	11: {
		name: "Skip the Second",
		desc: "Boosters and Generator Power do nothing",
		unl: function() { return player.h.best.gt(0) },
		goal: new Decimal("1e2400"),
		reward: "The generator power effect is raised to the power of 1.25",
	},
	12: {
		name: "Anti-Upgrades",
		desc: "Row 3 Upgrades do nothing",
		unl: function() { return player.h.challs.includes(11) },
		goal: new Decimal("1e840"),
		reward: "Quirk gain is boosted by your Quirk Layers",
		currently: function() { return Decimal.pow(1.5, tmp.totalQuirkLayers) },
		effDisp: function(x) { return format(x)+"x" },
	},
	21: {
		name: "Prestigeless",
		desc: "Prestige Point gain is raised to the power of 0.01",
		unl: function() { return player.h.challs.includes(12) },
		goal: new Decimal("1e1200"),
		reward: "Hindrance Spirit & Quirks make Time Capsules & Space Energy cheaper.",
		currently: function() { return player.h.points.plus(player.q.points).div(2).plus(1).pow(1000) },
		effDisp: function(x) { return format(x)+"x cheaper" },
	},
	22: {
		name: "Impaired Nodes",
		desc: "Enhancers, Extra Time Capsules, and Space Buildings do nothing.",
		unl: function() { return player.h.challs.includes(12) },
		goal: new Decimal("1e4600"),
		reward: "Add 0.25 to the Super-Booster base.",
	},
	31: {
		name: "Flattened Curve",
		desc: "Point generation is tetrated by 0.1",
		unl: function() { return player.h.challs.includes(21)||player.h.challs.includes(22) },
		goal: new Decimal(1e208),
		reward: "Enhancers are twice as strong.",
	},
	32: {
		name: "Surprise Junction",
		desc: "Prestige Upgrade 2 does nothing",
		unl: function() { return player.h.challs.includes(21)&&player.h.challs.includes(22) },
		goal: new Decimal("1e2580"),
		reward: "Unlock 2 new Super-Booster Upgrades and 7 new Quirk Upgrades.",
	},
	41: {
		name: "Skip the Third",
		desc: "Enhancers, Time Capsules, Space Buildings, and Super-Boosters do nothing.",
		unl: function() { return player.h.challs.includes(31)||player.h.challs.includes(32) },
		goal: new Decimal("4.444e4444"),
		reward: "Add 0.25 to the Super-Booster base.",
	},
	42: {
		name: "Slowed to a Halt",
		desc: "Time slows down over time, halting to a stop after 10 seconds.",
		unl: function() { return player.h.challs.includes(31)&&player.h.challs.includes(32) },
		goal: new Decimal("1e16500"),
		reward: "Cube the Generator Power effect.",
	},
	51: {
		name: "It's all Gone",
		desc: '"Skip the Second" and "Skip the Third" are both applied at once.',
		unl: function() { return true },
		unl: function() { return player.h.challs.includes(41)&&player.h.challs.includes(42) },
		goal: new Decimal("1e2840"),
		reward: "Super-Boosters multiply the Generator base.",
		currently: function() { return player.sb.points.plus(1).sqrt() },
		effDisp: function(x) { return format(x)+"x" },
	},
	52: {
		name: "Anti-Enhancers",
		desc: "You lose Enhancers over time, which can make your Enhancer amount get below 0.",
		unl: function() { return player.h.challs.includes(41)&&player.h.challs.includes(42)&&player.h.challs.includes(51) },
		goal: new Decimal("1e440000"),
		reward: "Quirk Layers are faster based on your Hindrance Spirit & Quirks.",
		currently: function() { 
			let h = player.h.points.times(player.q.points).sqrt();
			if (h.gte(1e150)) h = h.log10().pow(50).times(1e150/Math.pow(150, 50)).min(h)
			if (h.gte(1e100)) h = h.times(1e100).sqrt()
			let ret = h.plus(1).pow(0.04);
			return ret;
		},
		effDisp: function(x) { return format(x)+"x" },
	},
	13: {
		name: "Weakened Trio",
		desc: "Super-Boosters, Space Buildings, and Subspace are weaker and reset Space layer.",
		unl: function() { return player.hs.unl && player.hs.order == 0 && player.h.challs.includes(52) },
		goal: new Decimal("1e150000"),
		reward: "Total Hyperspace reduces Subspace requirement.",
		currently: function() { return player.hs.total.add(1).log10().div(3).add(1) },
		effDisp: function(x) { return format(x)+"x" },
	},
	23: {
		name: "Unlifeful Dimension",
		desc: "Hindrance Spirits, Quirk Energy, Hyper-Boosters, and Subspace do nothing.",
		unl: function() { return player.l.unl && player.h.challs.includes(13) },
		goal: new Decimal(1/0),
		reward: "Unlock the fourth Life Booster."
	},
	33: {
		name: "Faithless Space",
		desc: "Space Energy resets anything and reduces Point generation.",
		unl: function() { return player.l.unl && player.l.order == 0 && player.h.challs.includes(52) },
		goal: new Decimal(1/0),
		reward: "Subspace Energy gets an exponential boost.",
		currently: function() { return Decimal.pow(1.5, player.sb.points) },
		effDisp: function(x) { return format(x)+"x" },
	},
	43: {
		name: "Gone to the Void",
		desc: '"Skip the Third" and "Unlifeful Dimension" are both applied at once.',
		unl: function() { return player.h.challs.includes(23) && player.h.challs.includes(33) },
		goal: new Decimal(1/0),
		reward: "Unlock the sixth Space Building."
	},
	53: {
		name: "Too Sadistic",
		desc: 'All challenges of this column are applied at once.',
		unl: function() { return player.c.upgrades.includes(23) && player.h.challs.includes(43) },
		goal: new Decimal(1/0),
		reward: "Unlock the fifth Life Booster."
	}
}

function HCActive(x) {
	if (x==11) if (HCActive(51)) return true
	if (x==41) if (HCActive(51)||HCActive(43)) return true
	if (x==23) if (HCActive(43)) return true
	if (x%10==3&&x!=53) if (HCActive(53)) return true
	return player.h.active==x;
}

function startHindrance(x) {
	if (!player.h.unl) return
	if (player.h.active==x) {
		if (player.points.gte(H_CHALLS[x].goal) && !player.h.challs.includes(x)) player.h.challs.push(x); 
		player.h.active = 0
	} else {
		player.h.active = x
	}
	doReset("h", true)
}

function adjustMSDisp() {
	let displays = ["always", "automation", "incomplete", "never"];
	player.msDisplay = displays[(displays.indexOf(player.msDisplay)+1)%4]
}

function milestoneShown(complete, auto=false) {
	switch(player.msDisplay) {
		case "always": 
			return true;
			break;
		case "automation": 
			return auto||!complete
			break;
		case "incomplete":
			return !complete
			break;
		case "never": 
			return false;
			break;
	}
	return false;
}

function getSubspaceEff1() {
	if (!player.ss.unl || tmp.hcActive[13] || tmp.hcActive[23]) return new Decimal(0)
	let eff = player.ss.subspace.times(player.ss.points).plus(1).log10().times(100)
	if (tmp.totalHsBoosts !== undefined) eff = eff.times(tmp.totalHsBoosts.strength)
	return eff.floor();
}

function getSubspaceEff2() {
	if (!player.ss.unl || tmp.hcActive[23]) return new Decimal(1)

	let exp = new Decimal(750)
	if (tmp.totalHsBoosts !== undefined) exp = exp.times(tmp.totalHsBoosts.strength)
	if (tmp.hcActive[13]) exp = exp.pow(0.85)

	return player.ss.subspace.plus(1).pow(exp)
}

function getSubspaceEff3() {
	if (!player.ss.unl || tmp.hcActive[13] || tmp.hcActive[23]) return new Decimal(1)
	let eff = player.ss.subspace.plus(1).log10().plus(1).log10().div(2.5).plus(1)
	if (player.ss.upgrades.includes(13)) eff = eff.times(1.5)
	if (tmp.totalHsBoosts !== undefined) eff = eff.times(tmp.totalHsBoosts.strength)
	if (eff.gte(2)) eff = eff.log2().plus(1)
	return eff;
}

function getSubspaceGainMult() {
	let mult = new Decimal(1)
	if (player.ss.upgrades.includes(12)) mult = mult.times(LAYER_UPGS.ss[12].currently())
	if (player.ss.upgrades.includes(22)) mult = mult.times(LAYER_UPGS.ss[22].currently())
	if (player.h.challs.includes(33)) mult = mult.times(H_CHALLS[33].currently())
	return mult
}

function getHyperBoosterExp() {
	let exp = new Decimal(1)
	if (player.hb.order>0) exp = new Decimal(0.5)
	return exp
}

function getHyperBoosterPow() {
	if (tmp.hcActive[23]) return new Decimal(0)
	let pow = new Decimal(1)
	if (player.hb.upgrades.includes(12)) pow = pow.times(LAYER_UPGS.hb[12].currently())
	if (tmp.totalHsBoosts !== undefined) pow = pow.times(tmp.totalHsBoosts.strength)
	return pow;
}

function getTotalHyperspaceBoost() {
	let ret = player.hs.total.add(1).log10()
	return {
		gen: ret.times(2).add(1).pow(2),
		free: ret.times(5).ceil(),
		strength: ret.add(1).log10().add(1)
	}
}

function canHyperUpgradeBuilding(i) {
	var cost1 = getHyperUpgradeCostForHyperspace()
	var cost2 = getHyperUpgradeCostForSuperBoosters(i)
	return player.hs.points.gte(cost1) && player.sb.points.gte(cost2)
}

function hyperUpgradeBuilding(i) {
	if (!canHyperUpgradeBuilding(i)) return

	var cost1 = getHyperUpgradeCostForHyperspace()
	var cost2 = getHyperUpgradeCostForSuperBoosters(i)
	player.hs.points = player.hs.points.sub(cost1)
	player.sb.points = player.sb.points.sub(cost2)
	player.hs.hyper_upgrades[i] = tmp.huLvls[i].add(1)
}

function getHyperUpgradeCostForHyperspace() {
	var x = 0
	for (var i = 1; i <= tmp.trueSbUnl; i++) x = tmp.huLvls[i].add(x)
	return Decimal.pow(2, Decimal.pow(2, x.div(2).add(1))).div(2).ceil()
}

function getHyperUpgradeCostForSuperBoosters(id) {
	return tmp.huLvls[id].pow(1.25).add(16).floor()
}

function respecHyperUpgrades() {
	if (!confirm("You will be forced to do a Hyperspace reset. Are you sure?")) return
	player.hs.points = player.hs.total
	player.hs.hyper_upgrades = {}
	doReset("hs", true)
}

function getHyperUpgradePower(i) {
	var pow = tmp.huLvls[i]
	pow = pow.times(tmp.huEff)
	if (player.i.unl) pow = pow.times(getSpaceBuildingCondensedPow(i).sqrt())
	return pow.add(1).pow(0.75)
}

function getHyperUpgradeEff() {
	var eff = getSubspaceBoostToHyperUpgrades()
	return eff
}

function getSubspaceBoostToHyperUpgrades() {
	return player.ss.subspace.log10().sub(14).max(0).div(10).add(1).sqrt()
}

let HYPER_UPGRADE_EFFS = {
	1: function(eff, power) {
		return eff.max(1).pow(power.sub(1))
	},
	2: function(eff, power) {
		return Decimal.pow(2, power.pow(1.5)).sub(1)
	},
	3: function(eff, power) {
		return power
	},
	4: function(eff, power) {
		return power.add(2).div(3).pow(0.75)
	},
	5: function(eff, power) {
		return power.pow(1.5)
	},
	6: function(eff, power) {
		return power.pow(1.5)
	}
}

function getLifeBoostUnl() {
	let x = 3
	if (player.h.challs.includes(43)) x = 4
	if (player.h.challs.includes(53)) x = 5
	return x
}

function getNextLifeBoostLevelAt(x) {
	var base = [null, 0, 1, 2, 1, 1/0]
	return tmp.lbLvls[x].times(5).add(base[x])
}

function getLifePowerEff() {
	return player.l.power.add(1).log10().add(1)
}

function getLifeBoostEff(x) {
	var ret = tmp.lpEff.times(tmp.lbLvls[x])
	if (x > tmp.lbUnl) ret = new Decimal(0)
	switch(x) {
		case 1:
			return ret
		case 2:
			return Decimal.pow(2, ret)
		case 3:
			return Decimal.pow(5, ret)
		case 4:
			return Decimal.pow(3, ret)
		case 5:
			return ret
	}
}

function getLifeBoostEffDesc(x) {
	var eff = tmp.lbEff[x]
	switch(x) {
		case 1:
			return "Gain " + format(eff) + " free extra Quirk Layers"
		case 2:
			return "Multiply the Hindrance Spirit and Quirk gains by " + format(eff) + "x"
		case 3:
			return "Divide the Chromosome requirement by " + format(eff) + "x"
		case 4:
			return "Multiply the Hyperspace gain by " + format(eff) + "x"
		case 5:
			return "???"
	}
}

function gameLoop(diff) {
	diff = new Decimal(diff)
	if (isNaN(diff.toNumber())) diff = new Decimal(0);
	player.h.time += diff.toNumber()
	if (tmp.hcActive ? tmp.hcActive[42] : true) {
		if (player.h.time>=10) diff = new Decimal(0)
		else diff = diff.div(Decimal.div(10, Decimal.sub(10, player.h.time+1)).pow(1000))
	}
	player.timePlayed += diff.toNumber()
	if (player.p.upgrades.includes(11)) player.points = player.points.plus(tmp.pointGen.times(diff)).max(0)
	if (player.g.unl) player.g.power = player.g.power.plus(tmp.layerEffs.g.times(diff)).max(0)
	if (player.g.best.gte(10)) player.p.points = player.p.points.plus(tmp.resetGain.p.times(diff)).max(0)
	if (player.t.unl) {
		var data = tmp.layerEffs.t
		player.t.energy = player.t.energy.plus(data.gain.times(diff)).min(data.limit).max(0)
	}
	if (player.q.unl) {
		var mult = getQuirkLayerMult()
		player.q.time = player.q.time.plus(mult.times(diff)).max(0)
		var exp = getQuirkEnergyGainExp()
		if (exp.gte(0)) player.q.energy = player.q.energy.plus(player.q.time.pow(exp).times(mult).times(diff)).max(0)
	}
	if (player.q.best.gte(15)) {
		player.e.points = player.e.points.plus(tmp.resetGain.e.times(diff)).max(0)
		player.e.best = player.e.points.max(player.e.best)
	}
	if (player.ss.unl) player.ss.subspace = player.ss.subspace.plus(tmp.layerEffs.ss.times(diff)).max(0)
	if (player.l.best.gte(6)) player.q.points = player.q.points.plus(tmp.resetGain.q.times(diff)).max(0)
	if (player.l.best.gte(8)) player.h.points = player.h.points.plus(tmp.resetGain.h.times(diff)).max(0)
	if (player.l.points.gt(0)) {
		var mult = tmp.layerEffs.c.speed
		var exp = tmp.layerEffs.c.exp
		var power = player.l.power
		var dimStart = player.l.points.log10().times(2).add(1).times(10)

		power = power.pow(exp.pow(-1))
		if (power.gt(dimStart)) power = power.div(dimStart).cube().times(dimStart)
		power = power.add(diff.times(mult).div(10))
		if (power.gt(dimStart)) power = power.div(dimStart).cbrt().times(dimStart)
		power = power.pow(exp)

		player.l.power = power

		for (var i = 1; i <= 5; i++) {
			var next = getNextLifeBoostLevelAt(i)
			if (player.c.points.gte(next)) player.l.boosts[i] = tmp.lbLvls[i].add(player.c.points.sub(next).div(5).add(1).floor())
		}
	}

	if (player.b.auto&&player.t.best.gte(5)) doReset("b")
	if (player.g.auto&&player.s.best.gte(5)) doReset("g")
	if (player.e.auto&&player.q.best.gte(5)) maxEnhancers()
	if (player.t.autoCap&&player.h.best.gte(5)) maxExtTimeCapsules()
	if (player.t.auto&&player.q.best.gte(10)) doReset("t")
	if (player.s.auto&&player.q.best.gte(10)) doReset("s")
	if (player.s.autoBuild&&player.ss.best.gte(1)) for (let i=tmp.trueSbUnl;i>=1;i--) maxSpaceBuilding(i)
	if (player.sb.auto&&player.h.best.gte(15)) doReset("sb")
	if (player.q.auto&&player.l.best.gte(4)) maxQuirkLayers()
	if (player.ss.auto&&player.hs.total.gte(5)) doReset("ss")
	if (player.hb.auto&&player.hs.total.gte(8)) doReset("hb")

	if (player.hasNaN&&!NaNalert) {
		alert("We have detected a corruption in your save. Please visit https://discord.gg/wwQfgPa for help.")
		clearInterval(interval);
		player.autosave = false;
		NaNalert = true;
	}
}

function hardReset() {
	if (!confirm("Are you sure you want to do this? You will lose all your progress!")) return
	player = getStartPlayer()
	save();
	window.location.reload();
}

var saveInterval = setInterval(function() {
	if (player===undefined) return;
	if (player.autosave) save();
}, 5000)

var interval = setInterval(function() {
	if (player===undefined||tmp===undefined) return;
	let diff = (Date.now()-player.time)/1000
	if (offTime.remain>0) {
		offTime.speed = offTime.remain/5+1
		diff += offTime.speed/50
		offTime.remain = Math.max(offTime.remain-offTime.speed/50, 0)
	}
	player.time = Date.now()
	if (needCanvasUpdate) resizeCanvas();
	updateTemp();
	gameLoop(new Decimal(diff))
}, 50)

document.onkeydown = function(e) {
	if (player===undefined) return;
	let shiftDown = e.shiftKey
	let ctrlDown = e.ctrlKey
	let key = e.key
	if ((!LAYERS.includes(key))||ctrlDown||shiftDown) {
		switch(key) {
			case "b": 
				if (ctrlDown && player.hb.unl) doReset("hb")
				break;
			case "s": 
				if (ctrlDown && player.hs.unl) doReset("hs")
				break;
			case "B": 
				if (player.sb.unl) doReset("sb")
				break;
			case "S": 
				if (player.ss.unl) doReset("ss")
				break;
		}
	} else if (player[key].unl) doReset(key)
}