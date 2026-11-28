// What `npm run models:export` writes, and from which Nebula Dash assets.
// Each output .glb holds one node per mesh, named by `name`, at the origin; the viewer places them.
//
// Materials list one entry per submesh, in the game's slot order. Colours are the 0..1 sRGB values
// from the game's code; `emission` may exceed 1 (HDR), as it does in Unity.
// Sources: ShipCatalog.cs + ShipForge.Design + NebulaDashSetup.BuildForgeShip (ship),
// Ring.cs "next" state (ring), CoinForge.Paints (coin), DebrisForge.RockPaints (rocks).

const scale = (c, k) => c.map((v) => v * k);

const aurum = {
  body: [1, 0.8, 0.4],
  accent: [1, 0.95, 0.85],
  glow: [1, 0.85, 0.5],
};
const ringNext = [0.3, 1, 1];
const rock = [
  { name: "rock", color: [0.4, 0.37, 0.345], metal: 0.05, smooth: 0.15 },
  { name: "rock-dust", color: [0.56, 0.51, 0.46], metal: 0, smooth: 0.1 },
  { name: "rock-dark", color: [0.12, 0.112, 0.108], metal: 0.05, smooth: 0.2 },
];

const models = {
  "public/models/aurum.glb": [
    {
      name: "aurum",
      asset: "Art/Ships/Ship_aurum.asset",
      materials: [
        { name: "body", color: aurum.body, metal: 0.55, smooth: 0.75 },
        {
          name: "accent",
          color: aurum.accent,
          metal: 0.3,
          smooth: 0.7,
          emission: scale(aurum.accent, 0.85),
        },
        { name: "trim", color: [0.15, 0.12, 0.08], metal: 0.6, smooth: 0.4 },
        {
          name: "glass",
          color: [0.08, 0.06, 0.04],
          metal: 0.9,
          smooth: 0.95,
          emission: scale([0.08, 0.06, 0.04], 0.25),
        },
        {
          name: "glow",
          color: [0, 0, 0],
          metal: 0,
          smooth: 0.5,
          emission: scale(aurum.glow, 1.5),
        },
      ],
    },
  ],
  "public/models/ion-storm-props.glb": [
    {
      // Torus in the XY plane, major radius 1, tube 0.1.
      name: "ring",
      asset: "Art/Torus.asset",
      materials: [
        {
          name: "ring-next",
          color: scale(ringNext, 0.6),
          metal: 0.5,
          smooth: 0.8,
          emission: scale(ringNext, 2.2),
        },
      ],
    },
    {
      // Faces along Z; the game spins it about Y. Radius 0.65.
      name: "coin",
      asset: "Art/Coin.asset",
      materials: [
        {
          name: "coin-polished",
          color: [1, 0.78, 0.28],
          metal: 1,
          smooth: 0.88,
          emission: [0.38, 0.24, 0.03],
        },
        {
          name: "coin-satin",
          color: [0.86, 0.6, 0.17],
          metal: 1,
          smooth: 0.5,
          emission: [0.24, 0.14, 0.02],
        },
      ],
    },
    { name: "bennu", asset: "Art/Debris/Rock_Bennu.asset", materials: rock },
    { name: "eros", asset: "Art/Debris/Rock_Eros.asset", materials: rock },
  ],
};

export default models;
