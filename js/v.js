var app;

function loadVue() {
	app = new Vue({
	  el: "#app",
	  data: {
		  player,
		  tmp,
		  offTime,
		  format,
		  formatWhole,
		  formatTime,
		  fixValue,
		  layerUnl,
		  getLayerEffDesc,
		  doReset,
		  buyUpg,
		  getEnhancerCost,
		  getExtCapsuleCost,
		  getSpace,
		  getSpaceBuildingsUnl,
		  getSpaceBuildingCost,
		  getSpaceBuildingEffDesc,
		  buyBuilding,
		  getQuirkLayerCost,
		  buyQuirkLayer,
		  startHindrance,
		  HCActive,
		  milestoneShown,
		  destroyBuilding,
		  hyperUpgradeBuilding,
		  canHyperUpgradeBuilding,
		  getHyperUpgradeCostForHyperspace,
		  getHyperUpgradeCostForSuperBoosters,
		  getSubspaceBoostToHyperUpgrades,
		  getNextLifeBoostLevelAt,
		  getLifeBoostEffDesc,
		  LAYERS,
		  LAYER_RES,
		  LAYER_TYPE,
		  LAYER_UPGS,
		  LAYER_EFFS,
		  LAYER_AMT_NAMES,
		  LAYER_RES_CEIL,
		  MAX_BUILDINGS,
		  H_CHALLS
	  },
	})
}