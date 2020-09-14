const chai = require("chai");
const chaiHttp = require("chai-http");
const sinon = require("sinon");
const assert = chai.assert;
const isNotNull = assert.isNotNull;
const isNotNaN = assert.isNotNaN;
const isDefined = assert.isDefined;
const equal = assert.equal;
const notEqual = assert.notEqual;
const { Game, gamestate } = require("../engine/Game.js");
const GameWord = require("../engine/GameWord.js");
const MatchManager = require("../admin/MatchManagement.js");
const WordStates = require("../engine/WordStates.js");
const proxyquire = require("proxyquire");
chai.use(chaiHttp);

describe('MatchManagement', () => {
	
	beforeEach(function() {

	});
	
	afterEach(function() {
		MatchManager.onGoingMatchesByID.clear();
		MatchManager.publicMatches.clear();
		MatchManager.privateMatches.clear();
	});
	
	it("Need to be able to get every game type (onGoing, private, public)", () => {
		MatchManager.onGoingMatchesByID.set("onGoing", "anOnGoingMatch");
		MatchManager.publicMatches.set("public", "aPublicMatch");
		MatchManager.privateMatches.set("private", "aPrivateMatch");
		
		equal(MatchManager.getGame("onGoing"), "anOnGoingMatch");
		equal(MatchManager.getGame("public"), "aPublicMatch");
		equal(MatchManager.getGame("private"), "aPrivateMatch");
	});
	
	it("Need to group private and public games into separate maps.", () => {
		const instanceStub = { instance: sinon.stub() };
		const aStub = sinon.stub().returns(instanceStub);
		const matchManagementStub = proxyquire('../admin/MatchManagement', {
		    '../engine/Game': aStub
		});
		const publicMatch = matchManagementStub.createMatch("aHost1", true);
		const privateMatch = matchManagementStub.createMatch("aHost2", false);

		notEqual(publicMatch, undefined);notEqual(publicMatch, null);
		notEqual(privateMatch, undefined);notEqual(privateMatch, null);
		notEqual(publicMatch.matchID, undefined);
		notEqual(privateMatch.matchID, undefined);
		notEqual(publicMatch.matchID, null);
		notEqual(privateMatch.matchID, null);
	});
	
	it("Spy's need to get Spy info and field agents need to get field agent info", () => {
		const getBoardInfoStub = sinon.stub();
		getBoardInfoStub.withArgs(true).returns({boardInfo: "spyInfo"});
		getBoardInfoStub.withArgs(false).returns({boardInfo: "agentInfo"});
		
		const getRedSpyStub = sinon.stub().returns({id: "red spy"});
		const getBlueSpyStub = sinon.stub().returns({id: "blue spy"});
		const getRedFieldStub = sinon.stub().returns({id: "red field"});
		const getBlueFieldStub = sinon.stub().returns({id: "blue field"});
		const getHostStub = sinon.stub().returns("host");
		const getNumGuessStub = sinon.stub().returns("numGuess");
		const getChatHistoryStub = sinon.stub().returns("chat");
		const getStateStub = sinon.stub().returns("state");
		
		const stubbedGame = {
				getBoardInfo:  getBoardInfoStub,
				getRedSpy: getRedSpyStub,
				getBlueSpy: getBlueSpyStub,
				getRedField: getRedFieldStub,
				getBlueField: getBlueFieldStub,
				getHost: getHostStub,
				getNumGuess: getNumGuessStub,
				getChatHistory: getChatHistoryStub,
				getState: getStateStub
		}
		
		function checkInfo(info) {
			equal(info.RS.id, "red spy");
			equal(info.RF.id, "red field");
			equal(info.BS.id, "blue spy");
			equal(info.BF.id, "blue field");
			equal(info.Host, "host");
			equal(info.numGuess, "numGuess");
			equal(info.chatHistory, "chat");
			equal(info.state, "state");
		}
		
		function checkSpyInfo(info) {
			equal(info.info.boardInfo, "spyInfo");
			checkInfo(info);
		}
		
		function checkFieldInfo(info) {
			equal(info.info.boardInfo, "agentInfo");
			checkInfo(info);
		}
		
		MatchManager.publicMatches.set("testPublicMatch", stubbedGame);
		let info = MatchManager.getMatchInfo("testPublicMatch", "red spy");
		checkSpyInfo(info);
		
		info = MatchManager.getMatchInfo("testPublicMatch", "blue spy");
		checkSpyInfo(info);
		
		info = MatchManager.getMatchInfo("testPublicMatch", "red field");
		checkFieldInfo(info);
		
		info = MatchManager.getMatchInfo("testPublicMatch", "blue field");
		checkFieldInfo(info);
	});
	
	it("Random public match", () => {
		let randomMatch = MatchManager.randomPublicMatch();
		equal(randomMatch == undefined || randomMatch.matchID == undefined, true );
		
		MatchManager.publicMatches.set("aMatch", "something");
		randomMatch = MatchManager.randomPublicMatch();
		equal(randomMatch.matchID, "aMatch");
		
		MatchManager.publicMatches.set("anotherThing", "anotherSomething");
		randomMatch = MatchManager.randomPublicMatch();
		equal(randomMatch.matchID == "aMatch" || randomMatch.matchID == "anotherThing", true);
	});
	
	it("Players need to join the match", () => {
		let getRedSpyStub = sinon.stub().returns({});
		let getBlueSpyStub = sinon.stub().returns({});
		let getRedFieldStub = sinon.stub().returns({});
		let getBlueFieldStub = sinon.stub().returns({});
		const setRedSpyStub = sinon.stub().returns({});
		const setBlueSpyStub = sinon.stub().returns({});
		const setRedFieldStub = sinon.stub().returns({});
		const setBlueFieldStub = sinon.stub().returns({});
		const startTimeStub = sinon.stub().returns({});
		const getMatchInfoStub = sinon.stub(MatchManager, "getMatchInfo");
		getMatchInfoStub.returns("MatchInfo");
		
		const stubbedGame = {
			getMatchInfo:  getMatchInfoStub,
			getRedSpy: getRedSpyStub,
			getBlueSpy: getBlueSpyStub,
			getRedField: getRedFieldStub,
			getBlueField: getBlueFieldStub,
			setRedSpy: setRedSpyStub,
			setBlueSpy: setBlueSpyStub,
			setRedField: setRedFieldStub,
			setBlueField: setBlueFieldStub,
			startTime: startTimeStub
		}
		
		const setRSSpy = sinon.spy(setRedSpyStub)
		const setRFSpy = sinon.spy(setRedFieldStub)
		const setBSSpy = sinon.spy(setBlueSpyStub)
		const setBFSpy = sinon.spy(setBlueFieldStub)
		const startTimeSpy = sinon.spy(startTimeStub);
		
		MatchManager.publicMatches.set("match", stubbedGame);
		
		function checkSetCalls(isSet) {
			if (isSet["RS"]==true) { setRSSpy.calledOnce}
			else setRSSpy.notCalled;
		
			if (isSet["RF"]==true) { setRFSpy.calledOnce}
			else setRFSpy.notCalled;
			
			if (isSet["BS"]==true) { setBSSpy.calledOnce}
			else setBSSpy.notCalled;
			
			if (isSet["BF"]==true) { setBFSpy.calledOnce}
			else setBFSpy.notCalled;
		}
		
		let res = MatchManager.joinMatch("match", "red spy", "RS", "name1", "socket1");
		getRedSpyStub = sinon.stub().returns({id: "red spy", name: "name1" });
		stubbedGame["getRedSpy"] = getRedSpyStub;
		checkSetCalls({RS: true, RF: false, BS: false, BF: false});
		
		res = MatchManager.joinMatch("match", "red spy", "RS", "name1", "socket1");
		checkSetCalls({RS: true, RF: false, BS: false, BF: false});
		
		res = MatchManager.joinMatch("match", "red field", "RF", "name2", "socket2");
		getRedFieldStub = sinon.stub().returns({id: "red field", name: "name2" });
		stubbedGame["getRedField"] = getRedFieldStub;
		checkSetCalls({RS: true, RF: true, BS: false, BF: false});
		
		res = MatchManager.joinMatch("match", "red field", "RF", "name2", "socket2");
		checkSetCalls({RS: true, RF: true, BS: false, BF: false});
		
		res = MatchManager.joinMatch("match", "blue spy", "BS", "name3", "socket3");
		getBlueSpyStub = sinon.stub().returns({id: "blue spy", name: "name3" });
		stubbedGame["getBlueSpy"] = getBlueSpyStub;
		checkSetCalls({RS: true, RF: true, BS: true, BF: false});
		
		res = MatchManager.joinMatch("match", "blue spy", "BS", "name3", "socket3");
		checkSetCalls({RS: true, RF: true, BS: true, BF: false});
		
		res = MatchManager.joinMatch("match", "intruder", "RS", "name1", "socket1");
		checkSetCalls({RS: true, RF: true, BS: true, BF: false});
		
		res = MatchManager.joinMatch("match", "intruder", "RF", "name2", "socket2");
		checkSetCalls({RS: true, RF: true, BS: true, BF: false});
		equal(res.gamestart, false);
		
		res = MatchManager.joinMatch("match", "intruder", "BS", "name3", "socket3");
		checkSetCalls({RS: true, RF: true, BS: true, BF: false});
		
		res = MatchManager.joinMatch("match", "blue field", "BF", "name4", "socket4");
		getBlueFieldStub = sinon.stub().returns({id: "blue field", name: "name4" });
		stubbedGame["getBlueField"] = getBlueFieldStub;
		checkSetCalls({RS: true, RF: true, BS: true, BF: true});
		
		res = MatchManager.joinMatch("match", "blue field", "BF", "name4", "socket4");
		checkSetCalls({RS: true, RF: true, BS: true, BF: true});
		
		res = MatchManager.joinMatch("match", "intruder", "BF", "name4", "socket4");
		checkSetCalls({RS: true, RF: true, BS: true, BF: true});
	});
});