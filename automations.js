// allDay - removes sundown condition
// nighttime - adds second automation with after midnight (and before sunrise?) condition with brightness to use
// brightness - brightness level for all lights involved

export const automations = [
	{
		name: 'Office Lights',
		sensors: [ 'binary_sensor.office_ecolink_r12' ],
		switches: [ 'light.office_lights' ],
		// time: 3600,
		// sun: false,
		allDay: true,
	},
	{
		name: 'MBR',
		sensors: [ 'binary_sensor.mbr_ecolink_r8_sensor_state_any' ],
		switches: [ 'light.bedroom_lights', 'light.bedroom_spotlight', 'light.deco_lamp' ],
	},
	{
		name: 'MBA',
		night: 20,
		sensors: [ 'binary_sensor.mba_ecolink_n3_motion_detection' ],
		switches: [ 'light.nicolas_mirror_lights:50', 'light.lances_mirror_lights:100', 'light.deco_lamp' ],
	},
	{
		name: 'DBR',
		sensors: [],
		switches: [ 'light.dbr_lamp' ],
		allDay: true,
	},
	{
		name: 'QBR',
		sensors: [ 'binary_sensor.qbr_ecolink_r3_sensor_state_any' ],
		switches: [ 'light.qbr_lamp', 'light.qbr_light' ],
		allDay: true,
	},
	{
		name: 'Blue room light',
		sensors: [ 'binary_sensor.blue_room_ecolink_n1_motion_detection' ],
		switches: [ 'light.blue_room_lamp', 'light.blue_room_light' ],
		allDay: true,
	},
	{
		name: 'Dining Room',
		night: 20,
		sensors: [ 'binary_sensor.dining_room_ecolink_b_r11_sensor_state_any' ],
		switches: [ 'light.dining_room_lights', 'light.chandelier', 'light.living_room_lights', 'light.kitchen_lights', 'light.fridge_top_light', 'switch.entryway_christmas_lights' ],
	},
	{
		name: 'Dining Room Stereo',
		sensors: [ 'binary_sensor.dining_room_ecolink_b_r11_sensor_state_any' ],
		switches: [ 'switch.stereo' ],
		allDay: true,
	},
	{
		name: 'Living Room',
		sensors: [ 'binary_sensor.living_room_ecolink_r5_sensor_state_any' ],
		switches: [ 'light.living_room_lights', 'light.dining_room_lights', 'light.kitchen_lights', 'light.fridge_top_light', 'switch.entryway_christmas_lights' ],
	},
	{
		name: 'Kitchen',
		sensors: [ 'binary_sensor.kitchen_ecolink_r2_sensor_state_any' ],
		switches: [ 'light.kitchen_lights', 'light.fridge_top_light' ],
	},
	{
		name: 'Garage Breezeway',
		sensors: [ 'binary_sensor.garage_ecolink_r6_sensor_state_any' ],
		switches: [ 'switch.garage_lights', 'switch.garage_stereo', 'switch.garage_eve', 'switch.breezeway_lights' ],
		allDay: true,
	},
	{
		name: 'Garage Far',
		sensors: [ 'binary_sensor.garage_ecolink_two_r21_sensor_state_any' ],
		switches: [ 'switch.garage_lights', 'switch.garage_stereo', 'switch.garage_eve', 'light.garage_back_door_light' ],
		allDay: true,
	},
	{
		name: 'Breezeway Garage',
		sensors: [ 'binary_sensor.breezeway_ecolink_two_r22_sensor_state_any' ],
		switches: [ 'switch.breezeway_lights', 'switch.garage_lights' ],
	},
	{
		name: 'Breezeway Near',
		sensors: [ 'binary_sensor.breezeway_ecolink_r7_sensor_state_any' ],
		switches: [ 'switch.breezeway_lights', 'light.dog_room_lights' ],
	},
	{
		name: 'Dog Room',
		sensors: [ 'binary_sensor.dog_room_ecolink_dr1_motion_detection' ],
		switches: [ 'light.dog_room_lights', 'light.dining_room_lights', 'switch.stereo' ],
	},
	{
		name: 'Nook',
		sensors: [ 'binary_sensor.nook_ecolink_r10_sensor_state_any' ],
		switches: [ 'light.nook_lights' ],
	},
	{
		name: 'Stairwell',
		sensors: [ 'binary_sensor.stairwell_ecolink_r9_sensor_state_any' ],
		switches: [ 'light.stairtop_lights', 'light.stairwell_light', 'switch.tv_lamps' ],
	},
	{
		name: 'Game nook',
		sensors: [ 'binary_sensor.game_nook_ecolink_r4_sensor_state_any' ],
		switches: [ 'light.stairtop_lights', 'light.stairwell_light', 'switch.tv_lamps', 'switch.bar_lights' ],
		allDay: true,
	},
	{
		name: 'Bar lights with lava lamp',
		sensors: [ 'binary_sensor.bar_ecolink_n2_motion_detection' ],
		switches: [ 'light.stairwell_light', 'switch.tv_lamps', 'switch.bar_lights', 'light.blue_room_light', 'light.blue_room_lamp', 'light.qbr_lamp', 'light.qbr_light' ],
		allDay: true,
	},
	{
		name: 'Foyer',
		sensors: [ 'binary_sensor.foyer_ecolink_rn1_sensor_state_any' ],
		switches: [ 'light.foyer' ],
	},
	{
		name: 'Frontyard and Folly',
		sensors: [ 'binary_sensor.porch_ecolink_motion_detection' ],
		switches: [ 'light.porch', 'light.foyer', 'switch.bedroom_eve', 'switch.garage_eve', 'switch.folly' ],
	},
	{
		name: 'Sideyard',
		sensors: [],
		switches: [ 'light.side_yard_flood_light' ],
	},
	{
		name: 'Driveway',
		sensors: [],
		switches: [ 'switch.driveway_light' ],
	},
	{
		name: 'Back Deck',
		sensors: [ 'binary_sensor.back_deck_ecolink_bd1_motion_detection' ],
		switches: [ 'switch.deck_lanterns', 'switch.deck_eve_lights', 'light.backyard_floodlight' ],
	},
	{
		name: 'Off Heat Dish',
		sensors: [],
		time: 900,
		switches: [ 'switch.heat_dish' ]
	},
	{
		name: 'Offs',
		sensors: [],
		// don't include switch.heat_dish as it's above with shorter time 
		// shower, bathtub, bathroom, bedside, skylight, ?? (already got sideyard, driveway, and dbr)
		// do include gba, gbr, but remove on bedtime
		// garage back door has trigger
		switches: [ 
			'light.gba_mirror_light',
			'switch.gba_light',
			'light.gbr_lights',
			'light.shower_light',
			'light.bathtub_light',
			'switch.bathroom_lights',
			'light.bedside_light',
			'light.skylight',
			'light.dbr_lamp',
			'light.side_yard_flood_light',	// ?
			'light.log_lights',
			'light.living_room_spotlight',
			'light.fridge_top_light',
			'switch.door_2',
			'switch.garage_stereo',
			'switch.hot_water',
			'switch.driveway_light',
			'switch.fireplace',
			'switch.porch_christmas_lights',
			'switch.entryway_christmas_lights',
			'switch.rv_heat',
			'switch.christmas_tree_lights',
			'switch.christmas_tree_lights',
		],
	},
]

/*
	{
		name: 'Second bar lights and lava lamp',
		sensors: [ 'binary_sensor.game_nook_ecolink_r4_sensor_state_any', 'binary_sensor.bar_ecolink_n2_motion_detection' ],
		switches: [ 'switch.bar', 'light.other' ],
		time: 3600,
	},

m1 -> s1 100
m2 -> s1 100
m2 -> s2 200
m3 -> s1 300

off -> s1 if m1,m2,s1.lu > 100
off -> s1 if m3,s1.lu > 300
*/