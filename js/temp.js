function updateTemp() {
	if (!tmp.hcActive) tmp.hcActive = {}
	for (let row=1;row<=H_CHALLS.rows;row++) {
		for (let col=1;col<=H_CHALLS.cols;col++) {
			let id = row*10+col
			tmp.hcActive[id] = HCActive(id)
		}
	}
	
	if (!tmp.layerEffs) tmp.layerEffs = {}
	for (let name in LAYER_EFFS) tmp.layerEffs[name] = LAYER_EFFS[name]()
	
	if (!tmp.layerReqs) tmp.layerReqs = {}
	for (let name in LAYER_REQS) tmp.layerReqs[name] = getLayerReq(name)
		
	if (!tmp.gainMults) tmp.gainMults = {}
	if (!tmp.resetGain) tmp.resetGain = {}
	if (!tmp.nextAt) tmp.nextAt = {}
	if (!tmp.layerAmt) tmp.layerAmt = {}
	for (let i in LAYERS) {
		tmp.layerAmt[LAYERS[i]] = getLayerAmt(LAYERS[i])
		tmp.gainMults[LAYERS[i]] = getLayerGainMult(LAYERS[i])
		tmp.resetGain[LAYERS[i]] = getResetGain(LAYERS[i])
		tmp.nextAt[LAYERS[i]] = getNextAt(LAYERS[i])
	}

	tmp.pointGen = getPointGen()

	tmp.atbb = addToBoosterBase()
	tmp.atgb = addToGenBase()

	tmp.genPowEff = getGenPowerEff()

	tmp.enhPow = getEnhancerPow()
	tmp.enhEff = getEnhancerEff()
	tmp.enhEff2 = getEnhancerEff2()
	tmp.subbedEnh = new Decimal(0)
	if (tmp.hcActive ? tmp.hcActive[52] : true) {
		tmp.subbedEnh = tmp.subbedEnh.plus(new Decimal(player.h.time).times(40).plus(1).log10().pow(10).max(10)).round()
	}

	tmp.freeExtCap = getFreeExtCapsules()
	tmp.timeEff = getTimeEnergyEff()

	tmp.sbUnl = getSpaceBuildingsUnl()
	tmp.trueSbUnl = tmp.sbUnl.min(MAX_BUILDINGS).toNumber()
	if (!tmp.sbLvls) tmp.sbLvls = {}
	for (let i=1;i<=MAX_BUILDINGS;i++) tmp.sbLvls[i] = fixValue(player.s.buildings[i])
	if (!tmp.spaceBuildEff) tmp.spaceBuildEff = {}
	for (let i=1;i<=MAX_BUILDINGS;i++) tmp.spaceBuildEff[i] = getSpaceBuildingEff(i)

	tmp.totalQuirkLayers = getTotalQuirkLayers()
	tmp.quirkEff = getQuirkEnergyEff()

	tmp.ssEff1 = getSubspaceEff1()
	tmp.ssEff2 = getSubspaceEff2()
	tmp.ssEff3 = getSubspaceEff3()

	if (player.hs.unl || layerUnl("hs")) {
		if (tmp.huLvls === undefined) tmp.huLvls = {}
		for (var i = 1; i <= MAX_BUILDINGS; i++) tmp.huLvls[i] = fixValue(player.hs.hyper_upgrades[i])
		tmp.huEff = getHyperUpgradeEff()
	}
	if (player.hs.unl) {
		tmp.totalHsBoosts = getTotalHyperspaceBoost()

		if (tmp.huPower === undefined) tmp.huPower = {}
		if (tmp.huBoost === undefined) {
			tmp.huBoost = {}
			for (var i = 1; i <= MAX_BUILDINGS; i++) tmp.huBoost[i] = new Decimal(1)
		}
	}

	if (player.l.unl || layerUnl("l")) {
		tmp.lpEff = getLifePowerEff()
		tmp.lbUnl = getLifeBoostUnl()
		if (tmp.lbLvls == undefined) {
			tmp.lbLvls = {}
			tmp.lbEff = {}
		}
		for (var i = 1; i <= 5; i++) {
			tmp.lbLvls[i] = fixValue(player.l.boosts[i])
			tmp.lbEff[i] = getLifeBoostEff(i)
		}
	}
	if (player.l.unl) {
		if (!tmp.lbEff) tmp.lbEff = {}
		for (var i = 1; i <= 3; i++) tmp.lbEff[i] = getLifeBoostEff(i)
	}
}