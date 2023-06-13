import { readFileSync, writeFileSync } from 'fs'
import { namesToDeviceIds } from './entities.js'
import { automations } from './automations.js'

const getDeviceIdFromName = ( name ) => {
	// console.log( 'getDeviceIdFromName name', name )
	let deviceId = namesToDeviceIds[ name ]
	// if( !deviceId ) {
	// 	// console.log( 'LANCE trying _sensor_state_any for', name )
	// 	name = `${name}_sensor_state_any`
	// 	deviceId = namesToDeviceIds[ `${name}` ]
	// }
	if( !deviceId ) {
		console.log( 'ERROR getDeviceIdFromName failed for', name )
	}
	return deviceId
}

// TODO: fix this
const entityIdFromName = ( name ) => name.toLowerCase().replace( /\s/g, '_' )

function getOffCondition( sw ) {
	const offCondition = `
  - condition: template
    value_template: '{{ states.${sw}.state == "off" }}'`
	return offCondition
}

function getAllOffCondition( a ) {
	const allOffCondition = a.switches.map( getOffCondition ).join( '' )
	return allOffCondition
}

function getOnString( a, beforeSunrise, afterSunrise ) {
	const nightSceneIdPrefix = beforeSunrise ? 'night_' : ''
	const nightSceneNamePrefix = beforeSunrise ? 'Night ' : ''
	const id = `id_on ${nightSceneIdPrefix}${a.name}`
	const alias = `Turn on ${nightSceneNamePrefix}${a.name}`
	const description = `Turn on ${nightSceneNamePrefix}${a.name}`
	const scene = `scene_${a.name}`
	const trigger = a.sensors.map( s => {
		const deviceId = getDeviceIdFromName( s )
		const ts = `
  - type: turned_on
    platform: device
    device_id: ${deviceId}
    entity_id: ${s}
    domain: binary_sensor`
		return ts
	}).join('')
	const notAllDayCondition = !a.allDay ? `
  - condition: state
    entity_id: sun.sun
    state: below_horizon` : ''
	const beforeSunriseCondition = beforeSunrise ? `
  - condition: or
    conditions:
    - condition: time
      after: '22:00:00'
    - condition: sun
      before: sunrise` : ''
	const afterSunriseCondition = afterSunrise ? `
  - condition: sun
    after: sunrise` : ''
	const allOffCondition = getAllOffCondition( a )
  const conditions = `${notAllDayCondition}${beforeSunriseCondition}${afterSunriseCondition}${allOffCondition}` || '[]'
	// const action = a.switches.map( s => {
	// 	const deviceId = getDeviceIdFromName( s )
	// 	const as = `
  // - type: turn_on
  //   device_id: ${deviceId}
  //   entity_id: ${s}
  //   domain: ${s.split('.')[0]}`
	// 	return as
	// }).join('')
	const action = `
  - service: scene.turn_on
    target: 
      entity_id: scene.${nightSceneIdPrefix}${entityIdFromName(scene)}
    metadata: {}`
	const s = `
- id: '${id}'
  alias: ${alias}
  description: '${description}'
  trigger: ${trigger}
  condition: ${conditions}
  action: ${action}
  mode: single
`
	return s
}

// function getSceneLight( lightString ) {
// 	const ls = `
//     ${light}:
//       supported_color_models:
//       - brightness
//       friendly_name: ${light.split('.')[1]}
//       supported_features: 32
//       color_mode: brightness
//       brightness: 255
//       state: 'on'`
// 	return ls
// }

function getSimpleSceneLight( lightString, night ) {
	const lightName = lightString.split( ':' )[ 0 ]
	const brightnessDay = +lightString.split( ':' )[ 1 ] 
	// const domain = lightName.split( '.' )[ 0 ]
	const friendlyName = `friendly_name: ${lightName.split( '.' )[ 1 ]}`
	const brightnessValue = lightString.split( ':' )[ 1 ]
	const brightness = ( night && brightnessValue ) ? `brightness: ${brightnessValue}` : ''
	let onWithBrightness
	if( brightnessDay || night ) {
		const brightnessNumerator = ( brightnessDay > 0 && brightnessDay <= 255 ) ? brightnessDay : 255
		let brightness
		if( night ) {
			const nightDivisor = ( night > 0 && night <= 100 ) ? night / 100 : 0.2
			brightness = Math.round( brightnessNumerator * nightDivisor )
		} else {
			brightness = brightnessNumerator
		}
		onWithBrightness = `brightness: ${brightness}
      state: 'on'`
	} else {
		onWithBrightness = `state: 'on'`
	}
	const ls = `
    ${lightName}:
      ${friendlyName}
      ${onWithBrightness}`
	return ls
}

function getSceneSwitch( sw ) {
	const ls = `
    ${sw}:
      friendly_name: ${sw.split('.')[1]}
      state: 'on'`
	return ls
}

function getSceneString( a, night ) {
	const id = entityIdFromName( `${night ? 'night ' : ''}scene ${a.name}` )
	const name = `${night ? 'Night ' : ''}Scene ${a.name}`
	const entities = a.switches.map( s => s.split('.')[0] === 'light' ? getSimpleSceneLight( s, night ) : getSceneSwitch( s ) ).join( '' )
	const s = `
- id: '${id}'
  name: ${name}
  entities: ${entities}
  metadata: {}
`
	return s
}

// function getNightSceneString( a ) {
// 	const id = entityIdFromName( `scene ${a.name}` )
// 	const name = `Scene ${a.name}`
// 	const entities = a.switches.map( s => s.split('.')[0] === 'light' ? getSimpleSceneLight( s ) : getSceneSwitch( s ) )
// 	const s = `
// - id: '${id}'
//   name: ${name}
//   entities: ${entities}
//   metadata: {}
// `
// 	return s
// }

function getOffSwitchString( a, swString ) {
	const sw = swString.split( ':' )[ 0 ]
	const deviceId = getDeviceIdFromName( sw )
	const conditions = []
	const time = a.time || 3600
	const switchUpdatedCondition = `
  - condition: template
    value_template: '{{ as_timestamp(now()) - as_timestamp(states.${sw}.last_updated) > ${time} }}'`
  conditions.push( switchUpdatedCondition )
	const switchOnCondition = `
  - condition: template
    value_template: '{{ states.${sw}.state == "on" }}'`
  conditions.push( switchOnCondition )
	const sensorOffConditions = a.sensors.map( ss => {
		const deviceId = getDeviceIdFromName( ss )
		const sensorOffCondition = `
  - condition: template
    value_template: '{{ as_timestamp(now()) - as_timestamp(states.${ss}.last_updated) > ${time} }}'`
	  conditions.push( sensorOffCondition )
	})
	return conditions.join( '' )
}

function getSwitchesObject( a, switchesObject ) {
	return a.switches.reduce( ( acum, sw ) => {
		const offAutomationSwitchString = getOffSwitchString( a, sw )
		return {
			...switchesObject,
			// todo: dedupe
			[ sw ]: switchesObject[ sw ] = switchesObject[ sw ] ? ( switchesObject[ sw ] + offAutomationSwitchString ) : offAutomationSwitchString
		}
	}, switchesObject )
}

function getOff( swString ) {
	const swName = swString.split( ':' )[ 0 ]
	const friendlyName = swName.split( '.' )[ 1 ]
	const s = `
    ${swName}:
      friendly_name: ${friendlyName}
      state: 'off'`
	return s
}

function getAllOff( switchesObject ) {
	const id = 'All Off'

	const entities = Object.keys( switchesObject ).map( ( sw ) => {
		return getOff( sw )
	}).join( '' )

	const s = `
- id: '${id}'
  name: '${id}'
  entities: ${entities}
  metadata: {}
`
	return s
}

function getOn( swString ) {
	const swName = swString.split( ':' )[ 0 ]
	const friendlyName = swName.split( '.' )[ 1 ]
	const s = `
    ${swName}:
      friendly_name: ${friendlyName}
      state: 'on'`
	return s
}

function getAllOn( switchesObject ) {
	const id = 'All On'

	const entities = Object.keys( switchesObject ).map( ( sw ) => {
		return getOn( sw )
	}).join( '' )

	const s = `
- id: '${id}'
  name: '${id}'
  entities: ${entities}
  metadata: {}
`
	return s
}

function getOffString( swString, conditions ) {
	const sw = swString.split( ':' )[ 0 ]
	const id = `id_off ${sw}`
	const alias = `Turn off ${sw}`
	const description = `Turn off ${sw}`
	const deviceId = getDeviceIdFromName( sw )
	const trigger = `
  - platform: event
    event_type: timer.finished
    event_data:
      entity_id: timer.minute`
  const action = `
  - type: turn_off
    device_id: ${deviceId}
    entity_id: ${sw}
    domain: ${sw.split('.')[0]}`
	const s = `
- id: '${id}'
  alias: ${alias}
  description: '${description}'
  trigger: ${trigger}
  condition: ${conditions}
  action: ${action}
  mode: single
`
	return s
}

function getAutomationString( automations ) {
	let configurationOutputString = ''
	let sceneOutputString = ''
	let switchesObject = {}
	automations.forEach( a => {
		if( a.night ) {
			configurationOutputString += getOnString( a, true, false )
			configurationOutputString += getOnString( a, false, true )
		} else {
			configurationOutputString += getOnString( a, false, false )
		}
		switchesObject = getSwitchesObject( a, switchesObject )
		sceneOutputString += getSceneString( a )
		if( a.night ) {
			sceneOutputString += getSceneString( a, a.night )
		}
	})
	configurationOutputString += Object.keys( switchesObject ).map( sw => {
		const switchesObjectSw = switchesObject[ sw ]
		return getOffString( sw, switchesObjectSw )
	}).join( '' )

	sceneOutputString += getAllOff( switchesObject )
	sceneOutputString += getAllOn( switchesObject )

  writeFileSync( 'automations.yaml', configurationOutputString, {
    flag: 'w',
  });

  writeFileSync( 'scenes.yaml', sceneOutputString, {
    flag: 'w',
  });

}

getAutomationString( automations )


