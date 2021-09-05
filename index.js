const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
//const Cast = require('../../util/cast');
//const log = require('../../util/log');
//const nets = require('nets');
const formatMessage = require('format-message');

/**
 * Icon svg to be displayed in the blocks category menu, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const menuIconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAJPSURBVFhHzZa/rzFBFIY3olIQBZUoJRKdwiWRKFBRUBCJQqJTiIhoROFHoqNRb0UkNKLiL/j+LF/mJitnxnvmzl53ky2e5n3OzHlXsdb6+mf7Ghj6CRj6CRh6yWw2e1qW9UQOAUOvEMUoaEYFhl7hu4KbzUYq0el0pIImJWH4FzgFUqmUVMLJHahDwPBTdCXq9brkSqWStiQMPyUYDEolGo3Gr39FGLoll8u9LdGV0DkVGJqSTqfZJU6O/PF4lFyz2WRLwtAEusBBNyMehnMC6igwNOWnJTqvcxQYmtJut6UlhULBuEQ4HGYdBYaU/X7/tG2bv4AsURdVKhXWLZdL1lFgKKCHHQKBwNtF6gx19/tdcrvdTvLUrVYrWPIt+A7JQQSd7Xa7rBNQV61W2YK1Ws2bgur8drtlS8RiMdapf4mvGTXIZDKvQxzj8Zhd1O/3WSfgXDweNysYiUSkCxGtVotd1Ov1flUwGo2aFRwMBtKFiMfjwS4SX8ycC4VCrEsmk2YFv0NyEEFn1+s16wTUZbNZtmCxWDQveD6fXwdV1Fk3fjKZsAWHw6F5QQd6AXoHqjMC6kajEesOh4Pkrter+4Im0CUCU5fP51lHgaEpdAFaovM6R4GhCfP5XFqAlui8zlFgaMJisdAuSCQSkr9cLmxB7iUtgKEbnCVcjrwoxDkVGH7KdDqVCqgldE4Fhp+iK3C73SSnehUYfoqugM4hYPhXoAJOMQfVq8DQK9Ryp9PJPwXVL28BmlOBoZe4KSeAodeUy2V/F3QDDP2Dbf0HKEtjNoGx6rMAAAAASUVORK5CYII=';

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAJPSURBVFhHzZa/rzFBFIY3olIQBZUoJRKdwiWRKFBRUBCJQqJTiIhoROFHoqNRb0UkNKLiL/j+LF/mJitnxnvmzl53ky2e5n3OzHlXsdb6+mf7Ghj6CRj6CRh6yWw2e1qW9UQOAUOvEMUoaEYFhl7hu4KbzUYq0el0pIImJWH4FzgFUqmUVMLJHahDwPBTdCXq9brkSqWStiQMPyUYDEolGo3Gr39FGLoll8u9LdGV0DkVGJqSTqfZJU6O/PF4lFyz2WRLwtAEusBBNyMehnMC6igwNOWnJTqvcxQYmtJut6UlhULBuEQ4HGYdBYaU/X7/tG2bv4AsURdVKhXWLZdL1lFgKKCHHQKBwNtF6gx19/tdcrvdTvLUrVYrWPIt+A7JQQSd7Xa7rBNQV61W2YK1Ws2bgur8drtlS8RiMdapf4mvGTXIZDKvQxzj8Zhd1O/3WSfgXDweNysYiUSkCxGtVotd1Ov1flUwGo2aFRwMBtKFiMfjwS4SX8ycC4VCrEsmk2YFv0NyEEFn1+s16wTUZbNZtmCxWDQveD6fXwdV1Fk3fjKZsAWHw6F5QQd6AXoHqjMC6kajEesOh4Pkrter+4Im0CUCU5fP51lHgaEpdAFaovM6R4GhCfP5XFqAlui8zlFgaMJisdAuSCQSkr9cLmxB7iUtgKEbnCVcjrwoxDkVGH7KdDqVCqgldE4Fhp+iK3C73SSnehUYfoqugM4hYPhXoAJOMQfVq8DQK9Ryp9PJPwXVL28BmlOBoZe4KSeAodeUy2V/F3QDDP2Dbf0HKEtjNoGx6rMAAAAASUVORK5CYII=';

/**
 * Class for the Radio block in Scratch 3.0.
 * @constructor
 */
class Scratch3RadioBlocks {
	constructor () {
		let a = window.location;
		let ws = (a.protocol.indexOf("https") >=0)? "wss" : "ws";
		let port = "8888"; //a.port;
		if(port == null || port == "") port = 80;
		this._url = ws + "://" + a.hostname + ":" + port;
		this._ws = new WebSocket(this._url);
		this._ws.onopen = this._onopen.bind(this);
		this._ws.onclose = this._onclose.bind(this);
		this._ws.onerror = this._onerror.bind(this);
		this._ws.onmessage = this._onmessage.bind(this);
		this._band = 0;
		this._error = "";
		this._group = 0;
		this._name = "";
		this._buffer = [];
	}

	_onopen() {
		this._error = "";
		// NONE
	}
	_onclose() {
		this._error = "";
		this._name = "";
	}
	_onerror(error) {
		this._error = error;
	}
	_onmessage(msg) {
		this._error = "";
		let data = msg.data;
		if(data.indexOf("title ") == 0) {
			this._title(data.substr(6).trim());
			return;
		}
		if(data.length < 2
		|| data.charAt(1) != ':') {
			// todo any
			return;
		}
		this._buffer.push(data);
	}

	_title(data) {
		let p = data.indexOf(" ");
		this._name = data.substr(0, p);
	}

	_send(type, value) {
		this._error = "";
		if(value.length > 19) value = value.substr(0, 19);
		this._ws.send(type + ":" + value);
	}
	_send2(type, name, value) {
		this._error = "";
		if(name.length > 8) name = name.substr(0, 8);
		if(value.length > 19) value = value.substr(0, 19);
		this._ws.send(type + ":" + name + "=" + value);
	}

	getInfo () {
		this.setupTranslations();
		return {
			id: 'radio',
			name: formatMessage({
				id: 'radio.categoryName',
				default: 'Radio',
				description: 'Name of extension that adds radio blocks'
			}),
			//color1: '#0FBD8C',
			color1:   '#DF8D5C',
			//color2: '#0DA57A',
			color2:   '#DD754A',
			//color3: '#0B8E69',
			color3:   '#DB5E39',
			blockIconURI: blockIconURI,
			menuIconURI: menuIconURI,
			blocks: [
				{
					opcode: 'sendString',
					text: formatMessage({
						id: 'radio.sendString',
						default: 'Send String [VALUE]',
						description: 'send string'
					}),
					blockType: BlockType.COMMAND,
					arguments: {
						VALUE: {
							type: ArgumentType.STRING,
							defaultValue: " "
						}
					}
				},
				{
					opcode: 'sendNumber',
					text: formatMessage({
						id: 'radio.sendNumber',
						default: 'Send Number [VALUE]',
						description: 'send number'
					}),
					blockType: BlockType.COMMAND,
					arguments: {
						VALUE: {
							type: ArgumentType.NUMBER,
							defaultValue: 0
						}
					}
				},
				{
					opcode: 'sendValue',
					text: formatMessage({
						id: 'radio.sendValue',
						default: 'Send Data [NAME]=[VALUE]',
						description: 'send value'
					}),
					blockType: BlockType.COMMAND,
					arguments: {
						NAME: {
							type: ArgumentType.STRING,
							defaultValue: 0
						},
						VALUE: {
							type: ArgumentType.NUMBER,
							defaultValue: 0
						}
					}
				},
				//sendValue(NAME, VALUE)
				//setTransmitPower(7)
				//setTransmitSerialNumber(true)
				//receivedPacket(RadioPacketProperty.SignalStrength)
				{
					opcode: 'isReceived',
					text: formatMessage({
						id: 'radio.isReceived',
						default: 'Is received',
						description: 'is received'
					}),
					blockType: BlockType.BOOLEAN
				},
				{
					opcode: 'receivedType',
					text: formatMessage({
						id: 'radio.receivedType',
						default: 'Received type',
						description: 'received type'
					}),
					blockType: BlockType.REPORTER
				},
				{
					opcode: 'receivedNumber',
					text: formatMessage({
						id: 'radio.receivedNumber',
						default: 'Received number',
						description: 'received number'
					}),
					blockType: BlockType.REPORTER
				},
				{
					opcode: 'receivedString',
					text: formatMessage({
						id: 'radio.receivedString',
						default: 'Received string',
						description: 'received string'
					}),
					blockType: BlockType.REPORTER
				},
				{
					opcode: 'receivedValue',
					text: formatMessage({
						id: 'radio.receivedValue',
						default: 'Received value',
						description: 'received value'
					}),
					blockType: BlockType.REPORTER
				},
				{
					opcode: 'namePart',
					text: formatMessage({
						id: 'radio.namePart',
						default: 'Name part of [DATA]',
						description: 'name part'
					}),
					blockType: BlockType.REPORTER,
					arguments: {
						DATA: {
							type: ArgumentType.STRING,
							defaultValue: 0
						}
					}
				},
				{
					opcode: 'valuePart',
					text: formatMessage({
						id: 'radio.valuePart',
						default: 'Value part of [DATA]',
						description: 'value part'
					}),
					blockType: BlockType.REPORTER,
					arguments: {
						DATA: {
							type: ArgumentType.STRING,
							defaultValue: 0
						}
					}
				},
				{
					opcode: 'indexPart',
					text: formatMessage({
						id: 'radio.indexPart',
						default: '[INDEX] part of [DATA]',
						description: 'index part'
					}),
					blockType: BlockType.REPORTER,
					arguments: {
						DATA: {
							type: ArgumentType.STRING,
							defaultValue: 0
						}
					}
				},
				{
					opcode: 'setGroup',
					text: formatMessage({
						id: 'radio.setGroup',
						default: 'Set [GROUP] to group',
						description: 'set group'
					}),
					blockType: BlockType.COMMAND,
					arguments: {
						GROUP: {
							type: ArgumentType.NUMBER,
							defaultValue: 0
						}
					}
				},
				{
					opcode: 'setFrequencyBand',
					text: formatMessage({
						id: 'radio.setFrequencyBand',
						default: 'Set [BAND] to frequency band',
						description: 'set frequency band'
					}),
					blockType: BlockType.COMMAND,
					arguments: {
						BAND: {
							type: ArgumentType.NUMBER,
							defaultValue: 0
						}
					}
				},
				{
					opcode: 'deviceName',
					text: formatMessage({
						id: 'radio.deviceName',
						default: 'Device name',
						description: 'device name'
					}),
					blockType: BlockType.REPORTER
				},
				{
					opcode: 'deviceSerialNumber',
					text: formatMessage({
						id: 'radio.deviceSerialNumber',
						default: 'Device serial number',
						description: 'device serial number'
					}),
					blockType: BlockType.REPORTER
				}
			]
//			,
//			menus: {
//				part: {
//					acceptReporters: true,
//					items: this.PART_MENU
//				}
//			}
		};
	}

	setFrequencyBand(args) {
		this._band = args.BAND % 84; // 0 - 83
		this._ws.send("band " + this._band);
	}
	setGroup(args) {
		this._group = args.GROUP % 256; // 0 - 255
		this._ws.send("group " + this._band);
	}

	sendString(args) {
		this._send("S", args.VALUE);
	}
	sendNumber(args) {
		this._send("N", "" + args.VALUE);
	}
	sendValue(args) {
		this._send2("V", args.NAME, "" + args.VALUE);
	}

	isReceived() {
		if(this._buffer.length > 0) return true;
		return false;
	}

	receivedNumber() {
		if(this._buffer.length <= 0) return -1;
		let data = this._buffer[0];
		this._buffer.shift();
		if(data.charAt(0) != "N") return -1;
		data = data.substr(2);
		try {
			return parseFloat(data);
		} catch(e) {
			// NONE
		}
		return -1;
	}
	receivedString() {
		if(this._buffer.length <= 0) return "";
		let data = this._buffer[0];
		this._buffer.shift();
		if(data.charAt(0) != "S") return "";
		data = data.substr(2);
		return data;
	}
	receivedValue() {
		if(this._buffer.length <= 0) return "";
		let data = this._buffer[0];
		this._buffer.shift();
		if(data.charAt(0) != "V") return "";
		data = data.substr(2);
		return data;
	}
	receivedType() {
		if(this._buffer.length <= 0) return "";
		let data = this._buffer[0];
		return data.charAt(0);
	}
	namePart(args) {
		let data = args.DATA;
		let p = data.indexOf("=");
		if(p < 0) return "";
		data = data.substr(0, p);
		return data;
	}
	valuePart(args) {
		let data = args.DATA;
		let p = data.indexOf("=");
		if(p < 0) return -1;
		data = data.substr(p+1);
		try {
			return parseFloat(data);
		} catch(e) {
			// NONE
		}
		return -1;
	}
	indexPart(args) {
		let data = args.DATA.split(" ");
		let idx = args.INDEX;
		idx--;
		while(data.length > 0) {
			if(idx == 0) break;
			if(data[0].length == 0) {
				data.shift();
				continue;
			}
			idx--;
			data.shift();
		}
		if(data.length > 0) {
			return data[0];
		}
		return "";
	}

	deviceName() {
		return this._name;
	}
	deviceSerialNumber() {
		let p = this._name.indexOf(":");
		try {
			let d = this._name.substr(0,p).split(".");
			let n = 0;
			for(let i=0; i<d.length; i++) {
				if(d[i] == "") continue;
				n <<= 8;
				n += parseInt(d[i]);
			}
			n = "0000000" + n.toString(16);
			n = n.substr(n.length - 8);
			let q = "000" + parseInt(this._name.substr(p+1)).toString(16);
			q = q.substr(q.length - 4);
			return n + q;
		} catch(e) {
			// NONE
		}
		return "";
	}

	setupTranslations () {
		const localeSetup = formatMessage.setup();
		const extTranslations = {
			'ja': {
				'radio.setFrequencyBand': 'バンドを[BAND]にする',
				'radio.setGroup': 'グループを[GROUP]にする',
				'radio.sendNumber': '数値[VALUE]を送信する',
				'radio.sendString': '文字列[VALUE]を送信する',
				'radio.sendValue': 'データ[NAME]=[VALUE]を送信する',
				'radio.isReceived': '受信したとき',
				'radio.receivedType': '受信した形式',
				'radio.receivedNumber': '受信した数値',
				'radio.receivedString': '受信した文字列',
				'radio.receivedValue': '受信したデータ',
				'radio.namePart': 'データ[DATA]の名前部',
				'radio.valuePart': 'データ[DATA]の値部',
				'radio.indexPart': 'データ[DATA]の[INDEX]番目',
				'radio.deviceName': '固有名',
				'radio.deviceSerialNumber': 'シリアル番号',
				'radio.categoryName': '無線'
			}
		};
		for (const locale in extTranslations) {
			if (!localeSetup.translations[locale]) {
				localeSetup.translations[locale] = {};
			}
			Object.assign(localeSetup.translations[locale], extTranslations[locale]);
		}
	}
}
module.exports = Scratch3RadioBlocks;
